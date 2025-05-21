
import { SMTPServer } from 'smtp-server';
import { simpleParser } from 'mailparser';
import { saveEmail } from '../services/emailService.js';

export const startSmtpServer = () => {
  return new Promise((resolve, reject) => {
    const smtpPort = process.env.SMTP_PORT || 2525;
    const smtpHost = process.env.SMTP_HOST || '0.0.0.0';

    const server = new SMTPServer({
      // Log SMTP activity for debugging
      logger: true,
      
      // Define authentication handler
      onAuth(auth, session, callback) {
        // For development, accept any authentication
        // In production, replace with proper authentication
        if (process.env.SMTP_AUTH_USER && process.env.SMTP_AUTH_PASS) {
          if (auth.username !== process.env.SMTP_AUTH_USER || 
              auth.password !== process.env.SMTP_AUTH_PASS) {
            return callback(new Error('Invalid username or password'));
          }
        }
        return callback(null, { user: auth.username });
      },
      
      // Handle incoming messages
      onData(stream, session, callback) {
        let mailData = '';
        
        stream.on('data', chunk => {
          mailData += chunk;
        });
        
        stream.on('end', async () => {
          try {
            // Parse the email
            const parsed = await simpleParser(mailData);
            
            // Extract recipient from the session
            const recipient = session.envelope.rcptTo[0].address;
            
            // Process and save the email
            await saveEmail({
              from: parsed.from?.text || '',
              to: recipient,
              subject: parsed.subject || '',
              text: parsed.text || '',
              html: parsed.html || '',
              date: parsed.date || new Date(),
              attachments: parsed.attachments || []
            });
            
            // Log successful receipt
            console.log(`📥 Received email for ${recipient} from ${parsed.from?.text}`);
            
            callback();
          } catch (error) {
            console.error('Error processing email:', error);
            callback(error);
          }
        });
        
        stream.on('error', error => {
          console.error('Stream error:', error);
          callback(error);
        });
      }
    });
    
    // Start listening
    server.listen(smtpPort, smtpHost, err => {
      if (err) {
        console.error('Error starting SMTP server:', err);
        reject(err);
      } else {
        console.log(`SMTP server listening on ${smtpHost}:${smtpPort}`);
        resolve(server);
      }
    });
    
    // Handle server errors
    server.on('error', err => {
      console.error('SMTP server error:', err);
    });
  });
};
