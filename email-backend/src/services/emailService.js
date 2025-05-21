
import { createRedisClient } from './redis.js';
import { pool } from './database.js';

/**
 * Save an email to both Redis (for quick access) and PostgreSQL (for persistence)
 */
export const saveEmail = async (emailData) => {
  try {
    const { from, to, subject, text, html, date, attachments } = emailData;
    
    // Only process emails for our domains
    if (!isValidRecipient(to)) {
      console.log(`Ignoring email to ${to} (not a disposable domain)`);
      return;
    }
    
    // Get Redis client
    const redisClient = createRedisClient();
    
    // Find or create the temporary email record
    const tempEmailQuery = `
      SELECT id FROM temporary_emails 
      WHERE email = $1
    `;
    
    const tempEmailResult = await pool.query(tempEmailQuery, [to]);
    let tempEmailId;
    
    if (tempEmailResult.rows.length === 0) {
      // Email doesn't exist in the database, try to extract domain
      const domain = to.split('@')[1];
      
      const domainQuery = `
        SELECT id FROM domains 
        WHERE domain = $1 AND active = true
      `;
      
      const domainResult = await pool.query(domainQuery, [domain]);
      
      if (domainResult.rows.length === 0) {
        // Unknown domain
        console.log(`Ignoring email to ${to} (unknown or inactive domain)`);
        return;
      }
      
      // Create a new temporary email entry
      const createTempEmailQuery = `
        INSERT INTO temporary_emails (email, domain_id, expires_at)
        VALUES ($1, $2, $3)
        RETURNING id
      `;
      
      // Set expiration to 24 hours from now
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);
      
      const createResult = await pool.query(
        createTempEmailQuery, 
        [to, domainResult.rows[0].id, expiresAt]
      );
      
      tempEmailId = createResult.rows[0].id;
    } else {
      tempEmailId = tempEmailResult.rows[0].id;
    }
    
    // Store email in database
    const emailQuery = `
      INSERT INTO emails (
        temp_email_id, sender, recipient, subject, body, html_body, 
        labels, attachments, received_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id
    `;
    
    const emailResult = await pool.query(
      emailQuery, 
      [
        tempEmailId, 
        from, 
        to, 
        subject, 
        text, 
        html,
        '{}', // Default empty labels array
        JSON.stringify(attachments), 
        date
      ]
    );
    
    const emailId = emailResult.rows[0].id;
    
    // Also store in Redis for quick access (with 24h expiration)
    const emailKey = `email:${emailId}`;
    await redisClient.hSet(emailKey, {
      id: emailId,
      temp_email_id: tempEmailId,
      sender: from,
      recipient: to,
      subject: subject,
      body: text,
      html_body: html,
      read: false,
      received_at: date.toISOString()
    });
    await redisClient.expire(emailKey, 86400); // 24 hours
    
    // Add to the list of emails for this address
    await redisClient.lPush(`emails:${to}`, emailId);
    await redisClient.expire(`emails:${to}`, 86400); // 24 hours
    
    console.log(`Email saved: ${subject} (ID: ${emailId})`);
    
    return emailId;
  } catch (error) {
    console.error('Error saving email:', error);
    throw error;
  }
};

/**
 * Check if the recipient email belongs to one of our disposable domains
 */
const isValidRecipient = async (email) => {
  try {
    const domain = email.split('@')[1];
    if (!domain) return false;
    
    const query = `
      SELECT EXISTS(
        SELECT 1 FROM domains 
        WHERE domain = $1 AND active = true
      ) as is_valid
    `;
    
    const result = await pool.query(query, [domain]);
    return result.rows[0].is_valid;
  } catch (error) {
    console.error('Error checking recipient validity:', error);
    return false;
  }
};

/**
 * Get all emails for a specific address
 */
export const getEmailsForAddress = async (email) => {
  try {
    const query = `
      SELECT e.* 
      FROM emails e
      JOIN temporary_emails te ON e.temp_email_id = te.id
      WHERE te.email = $1
      ORDER BY e.received_at DESC
    `;
    
    const result = await pool.query(query, [email]);
    return result.rows;
  } catch (error) {
    console.error('Error fetching emails for address:', error);
    throw error;
  }
};

/**
 * Mark an email as read
 */
export const markEmailAsRead = async (emailId) => {
  try {
    // Update in database
    const query = `
      UPDATE emails
      SET read = true
      WHERE id = $1
      RETURNING *
    `;
    
    const result = await pool.query(query, [emailId]);
    
    if (result.rows.length === 0) {
      throw new Error('Email not found');
    }
    
    // Update in Redis if available
    const redisClient = createRedisClient();
    const emailKey = `email:${emailId}`;
    
    const exists = await redisClient.exists(emailKey);
    if (exists) {
      await redisClient.hSet(emailKey, 'read', 'true');
    }
    
    return result.rows[0];
  } catch (error) {
    console.error('Error marking email as read:', error);
    throw error;
  }
};

/**
 * Send an email reply
 */
export const sendEmailReply = async (fromAddress, toAddress, subject, text, html) => {
  // In a real implementation, you would use nodemailer here to send via SMTP
  console.log(`Sending reply from ${fromAddress} to ${toAddress}`);
  
  // For this example, we'll just record that a reply was sent
  try {
    // Find the temporary email ID
    const tempEmailQuery = `
      SELECT id FROM temporary_emails 
      WHERE email = $1
    `;
    
    const tempEmailResult = await pool.query(tempEmailQuery, [fromAddress]);
    
    if (tempEmailResult.rows.length === 0) {
      throw new Error('Sender email address not found');
    }
    
    const tempEmailId = tempEmailResult.rows[0].id;
    
    // Record the sent email
    const query = `
      INSERT INTO sent_emails (
        temp_email_id, recipient, subject, body, html_body, status
      ) VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    
    const result = await pool.query(
      query, 
      [tempEmailId, toAddress, subject, text, html, 'sent']
    );
    
    return result.rows[0];
  } catch (error) {
    console.error('Error recording sent email:', error);
    throw error;
  }
};
