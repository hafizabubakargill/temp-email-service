
import dotenv from 'dotenv';
import { pool, connectDatabase } from '../src/services/database.js';

// Load environment variables
dotenv.config();

const domains = [
  'disposmail.com',
  'tempbox.io',
  'quickmail.xyz',
  'tempmail.org',
  'disposable.email',
  'throwmail.net'
];

const seedDomains = async () => {
  try {
    // Connect to database
    await connectDatabase();
    
    // Create domains table if it doesn't exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS domains (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        domain VARCHAR NOT NULL UNIQUE,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );
    `);
    
    // Insert domains
    for (const domain of domains) {
      await pool.query(
        `INSERT INTO domains (domain, active) 
         VALUES ($1, true) 
         ON CONFLICT (domain) 
         DO UPDATE SET active = true, updated_at = now()`,
        [domain]
      );
      console.log(`Domain added or updated: ${domain}`);
    }
    
    console.log('Domains seeded successfully!');
  } catch (error) {
    console.error('Error seeding domains:', error);
  } finally {
    await pool.end();
  }
};

seedDomains();
