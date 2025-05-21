
import { ImapFlow } from 'imap-flow';
import { simpleParser } from 'mailparser';
import { saveEmail } from '../services/emailService.js';

let imapClient;
let isPolling = false;
const POLL_INTERVAL = 60000; // Check for new emails every minute

export const startImapClient = async () => {
  // Skip if IMAP credentials are not provided
  if (!process.env.IMAP_HOST || !process.env.IMAP_USER || !process.env.IMAP_PASSWORD) {
    console.log('⚠️ IMAP configuration not found, skipping IMAP client');
    return;
  }

  try {
    // Create IMAP client
    imapClient = new ImapFlow({
      host: process.env.IMAP_HOST,
      port: parseInt(process.env.IMAP_PORT || '993'),
      secure: process.env.IMAP_TLS === 'true',
      auth: {
        user: process.env.IMAP_USER,
        pass: process.env.IMAP_PASSWORD
      },
      logger: false
    });

    // Connect to the server
    await imapClient.connect();
    console.log('Connected to IMAP server');

    // Start polling for new emails
    startPolling();
    
    return imapClient;
  } catch (error) {
    console.error('Failed to start IMAP client:', error);
    throw error;
  }
};

const startPolling = () => {
  if (isPolling) return;
  
  isPolling = true;
  console.log(`Starting IMAP polling (every ${POLL_INTERVAL / 1000} seconds)`);
  
  // Initial check
  checkNewEmails();
  
  // Set up interval for checking
  setInterval(checkNewEmails, POLL_INTERVAL);
};

const checkNewEmails = async () => {
  if (!imapClient || !imapClient.usable) {
    console.log('IMAP client not usable, reconnecting...');
    try {
      await imapClient.connect();
    } catch (error) {
      console.error('Failed to reconnect to IMAP server:', error);
      return;
    }
  }

  try {
    // Lock the INBOX folder
    const lock = await imapClient.getMailboxLock('INBOX');
    
    try {
      // Search for unseen messages
      const messages = await imapClient.search({ unseen: true });
      
      if (messages.length > 0) {
        console.log(`Found ${messages.length} new message(s)`);
        
        // Fetch each message
        for (const message of messages) {
          // Get the message content
          const { content, attributes } = await imapClient.fetchOne(message, { source: true });
          
          // Parse the email content
          const parsed = await simpleParser(content);
          
          // Process and save the email
          await saveEmail({
            from: parsed.from?.text || '',
            to: parsed.to?.text || '',
            subject: parsed.subject || '',
            text: parsed.text || '',
            html: parsed.html || '',
            date: parsed.date || new Date(),
            attachments: parsed.attachments || []
          });
          
          // Mark the message as seen
          await imapClient.messageFlagsAdd(message, ['\\Seen']);
          
          console.log(`Processed message: ${parsed.subject}`);
        }
      } else {
        console.log('No new messages found');
      }
    } finally {
      // Release the lock
      lock.release();
    }
  } catch (error) {
    console.error('Error checking for new emails:', error);
  }
};

// Gracefully close the IMAP connection when shutting down
process.on('SIGTERM', async () => {
  if (imapClient && imapClient.usable) {
    console.log('Closing IMAP connection...');
    await imapClient.logout();
  }
});

export const getImapClient = () => imapClient;
