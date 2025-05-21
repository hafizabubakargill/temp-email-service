
import pg from 'pg';
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  database: process.env.POSTGRES_DB || 'postgres',
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD || 'postgres'
});

export const connectDatabase = async () => {
  try {
    // Test the connection
    const client = await pool.connect();
    client.release();
    return pool;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  if (pool) {
    await pool.end();
  }
};

process.on('SIGTERM', async () => {
  await disconnectDatabase();
});
