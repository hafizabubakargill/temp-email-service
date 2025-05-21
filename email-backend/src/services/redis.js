
import { createClient } from 'redis';

let redisClient;

export const connectRedis = async () => {
  const url = process.env.REDIS_URL || 'redis://localhost:6379';
  
  redisClient = createClient({
    url: url
  });
  
  redisClient.on('error', (err) => {
    console.error('Redis error:', err);
  });
  
  await redisClient.connect();
  return redisClient;
};

export const createRedisClient = () => {
  if (!redisClient || !redisClient.isOpen) {
    throw new Error('Redis client not initialized. Call connectRedis() first.');
  }
  return redisClient;
};

export const disconnectRedis = async () => {
  if (redisClient && redisClient.isOpen) {
    await redisClient.quit();
  }
};

process.on('SIGTERM', async () => {
  await disconnectRedis();
});
