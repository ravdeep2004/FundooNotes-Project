const amqp = require('rabbitmq-client');
const logger = require('../utils/logger');

const rabbit = new amqp.Connection({
    url: process.env.RABBITMQ_URL || 'amqp://guest:guest@localhost:5672',
    retryLow: 1000,
    retryHigh: 30000
});

rabbit.on('error', (err) => {
    logger.error('RabbitMQ Connection Error:', err);
});

rabbit.on('connection', () => {
    logger.info('RabbitMQ Connection Established');
});

const publisher = rabbit.createPublisher({
    confirm: true,
    maxAttempts: 2
});

const sendToQueue = async (queue, message) => {
    try {
        await publisher.send({ queue }, message);
        logger.info(`Message sent to queue: ${queue}`);
    } catch (error) {
        logger.error('Failed to send message to queue:', error);
        throw error;
    }
};

const createConsumer = (queue, handler) => {
    const consumer = rabbit.createConsumer({
        queue,
        queueOptions: { durable: true }
    }, handler);

    return consumer;
};

module.exports = { rabbit, sendToQueue, createConsumer };