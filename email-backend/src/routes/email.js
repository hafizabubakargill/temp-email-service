
import express from 'express';
import { getEmailsForAddress, markEmailAsRead, sendEmailReply } from '../services/emailService.js';

export const setupEmailRoutes = (app) => {
  const router = express.Router();

  // Get all emails for a specific address
  router.get('/api/emails/:email', async (req, res) => {
    try {
      const email = req.params.email;
      const emails = await getEmailsForAddress(email);
      
      res.status(200).json({ emails });
    } catch (error) {
      console.error('Error fetching emails:', error);
      res.status(500).json({ error: 'Failed to fetch emails' });
    }
  });

  // Mark an email as read
  router.put('/api/emails/:id/read', async (req, res) => {
    try {
      const id = req.params.id;
      const updatedEmail = await markEmailAsRead(id);
      
      res.status(200).json({ email: updatedEmail });
    } catch (error) {
      console.error('Error marking email as read:', error);
      res.status(500).json({ error: 'Failed to mark email as read' });
    }
  });
  
  // Send a reply email
  router.post('/api/emails/reply', async (req, res) => {
    try {
      const { fromAddress, toAddress, subject, text, html } = req.body;
      
      if (!fromAddress || !toAddress || !subject || (!text && !html)) {
        return res.status(400).json({ 
          error: 'Missing required fields (fromAddress, toAddress, subject, and either text or html)'
        });
      }
      
      const result = await sendEmailReply(fromAddress, toAddress, subject, text, html);
      
      res.status(200).json({ 
        success: true, 
        message: 'Email reply sent successfully',
        id: result.id
      });
    } catch (error) {
      console.error('Error sending reply:', error);
      res.status(500).json({ error: 'Failed to send email reply' });
    }
  });

  // Register the router
  app.use(router);
};
