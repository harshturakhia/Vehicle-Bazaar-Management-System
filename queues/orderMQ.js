
const { Queue, Worker } = require('bullmq');
const mongoose = require('mongoose');
const Redis = require('ioredis');


const redisOptions  = {
    host: 'localhost',
    port: 6379,
};

// Create a new Redis instance using ioredis
const redisClient = new Redis(redisOptions);


// BullMQ queue setup
const orderQueueMQ = new Queue('orderQueue', { connection: redisClient });

// Export the queue for external use
module.exports = orderQueueMQ;
