const { createClient } = require('redis');
const logger = require('../utils/logger');

const redisClient = createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: process.env.REDIS_PORT || 6379
    }
});

redisClient.on('error', (err) => {
    logger.error('Redis Client Error:', err);
});

redisClient.on('connect', () => {
    logger.info('Redis Client Connected');
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        logger.info('Redis connection established successfully');
    } catch (error) {
        logger.error('Failed to connect to Redis:', error);
    }
};

module.exports = { redisClient, connectRedis };