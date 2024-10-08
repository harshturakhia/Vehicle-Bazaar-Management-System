
const { Worker } = require('bullmq');
const mongoose = require('mongoose');
const Redis = require('ioredis');

const Cart = require('../../models/Cart');
const Product = require('../../models/Vehicle');
const Order = require('../../models/Order');

const orderQueue = require('../orderQueue');

const redisOptions = {
    host: 'localhost',
    port: 6379,
};


const redisClient = new Redis(redisOptions);

const worker = new Worker('orderQueue', async job => {
    const { userId, productId, orderData } = job.data;
    let session = null;

    try {
        // Start Mongoose session for transaction
        session = await mongoose.startSession();
        session.startTransaction({
            readConcern: { level: 'majority' },
            writeConcern: { w: 'majority' },
        });

        job.updateProgress(10);

        // Fetch the product details using the productId
        const product = await Product.findById(productId).session(session);
        if (!product) {
            throw new Error('Product not found');
        }

        // Check if the product exists in the user's cart
        const cartItem = await Cart.findOne({ userId, productId }).session(session);
        if (!cartItem) {
            throw new Error('Product not found in user cart');
        }

        // Check if the product has already been ordered by the user
        const existingOrder = await Order.findOne({ userId, productId }).session(session);
        if (existingOrder) {
            throw new Error('Product has already been ordered');
        }

        job.updateProgress(40);

        let initialDateTime = new Date(orderData.initialTime);
        let initialTime = Math.ceil(initialDateTime.getHours() + initialDateTime.getMinutes() / 60);

        let endDateTime = new Date(orderData.endTime);
        let endTime = Math.ceil(endDateTime.getHours() + endDateTime.getMinutes() / 60);

        let differenceHours = endTime - initialTime;
        let totalAmount = differenceHours * product.amount;

        job.updateProgress(50);

        const newOrder = new Order({
            userId: cartItem.userId,
            productId: cartItem.productId,
            cartId: cartItem._id,
            initialTime: initialTime,
            endTime: endTime,
            totalAmount: totalAmount,
            status: orderData.status || 'Confirmed', // Assuming a default status
            rentTime: differenceHours,
        });

        job.updateProgress(75);

        await newOrder.save({ session });

        job.updateProgress(90);

        // Commit transaction if all operations succeed
        await session.commitTransaction();
        session.endSession();

        job.updateProgress(100);
        job.log('Transaction Completed!');

        return { status: 201, message: 'Order created successfully!', data: newOrder };
    } catch (error) {
        // Rollback transaction on error
        if (session) {
            await session.abortTransaction();
            session.endSession();
        }
        console.error('Transaction error:', error);
        throw new Error('Transaction failed: ' + error.message);
    }
}, { connection });

// Handle worker errors
worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
});

module.exports = worker;
