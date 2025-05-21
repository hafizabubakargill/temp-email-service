
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { startSmtpServer } from './smtp/server.js';
import { startImapClient } from './imap/client.js';
import { setupEmailRoutes } from './routes/email.js';
import { connectRedis } from './services/redis.js';
import { connectDatabase } from './services/database.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Email server is running' });
});

// Setup routes
setupEmailRoutes(app);

// Start the server
const startServer = async () => {
  try {
    // Connect to Redis
    await connectRedis();
    console.log('✅ Connected to Redis');
    
    // Connect to database
    await connectDatabase();
    console.log('✅ Connected to database');
    
    // Start SMTP server
    await startSmtpServer();
    console.log(`✅ SMTP server started on port ${process.env.SMTP_PORT || 2525}`);
    
    // Start IMAP client
    await startImapClient();
    console.log('✅ IMAP client started');
    
    // Start Express server
    app.listen(PORT, () => {
      console.log(`✅ API server running on port ${PORT}`);
      console.log(`📧 Email backend service is fully operational`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
