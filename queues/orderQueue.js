const Bull = require('bull');
const Order = require('../models/Order');
const mongoose = require("mongoose")

const redisOptions = { host: '127.0.0.1', port: 6379 };
const orderQueue = new Bull('orderQueue', { redis: redisOptions });

// Original
// orderQueue.process(async (job) => {
//     const { userId, productId, orderData } = job.data;
//     const session = await mongoose.startSession();
//     job.progress(10);

//     try {
//         session.startTransaction({
//             readConcern: { level: 'majority' },
//             writeConcern: { w: 'majority' },
//         });
//         job.progress(20);

//         // Fetch the product details using the productId
//         const product = await Product.findById(productId).session(session);
//         if (!product) {
//             await session.abortTransaction();
//             session.endSession();
//             throw new Error('Product not found');
//         }

//         // Check if the product exists in the user's cart
//         const cartItem = await Cart.findOne({ userId, productId }).session(session);
//         if (!cartItem) {
//             await session.abortTransaction();
//             session.endSession();
//             throw new Error('Product not found in user cart');
//         }

//         // Check if the product has already been ordered by the user
//         const existingOrder = await Order.findOne({ userId, productId }).session(session);
//         if (existingOrder) {
//             await session.abortTransaction();
//             session.endSession();
//             throw new Error('Product has already been ordered');
//         }
//         job.progress(40);

//         let initialDateTime = new Date(orderData.initialTime);
//         let initialTime = Math.ceil(initialDateTime.getHours() + initialDateTime.getMinutes() / 60);

//         let endDateTime = new Date(orderData.endTime);
//         let endTime = Math.ceil(endDateTime.getHours() + endDateTime.getMinutes() / 60);

//         let differenceHours = endTime - initialTime;
//         let totalAmount = differenceHours * product.amount;
//         job.progress(50);

//         const newOrder = new Order({
//             userId: cartItem.userId,
//             productId: cartItem.productId,
//             cartId: cartItem._id,
//             initialTime: initialTime,
//             endTime: endTime,
//             status: 'Confirmed',
//             totalAmount: totalAmount,
//             status: orderData.status,
//             rentTime: differenceHours,
//         });
//         job.progress(75);

//         await newOrder.save({ session });
//         job.progress(90);

//         await session.commitTransaction();
//         session.endSession();
//         job.progress(100);
//         job.log("Transaction Completed!")

//         return { status: 201, message: 'Order created successfully!', data: newOrder };
//     }
//     catch (error) {
//         job.log("Transaction Error!")
//         await session.abortTransaction();
//         session.endSession();
//         console.error('Transaction error:', error);
//         throw new Error('Transaction failed: ' + error.message);
//     }
// });

// Confirmation

orderQueue.process(async (job) => {

    const orderId = job.data;

    const session = await mongoose.startSession();
    job.progress(10);

    try {
        session.startTransaction({
            readConcern: { level: 'majority' },
            writeConcern: { w: 'majority' },
        });

        if (!orderId) {
            session.endSession();
            return { status: 404, message: 'OrderId not found!' };
        }
        job.progress(25);

        const confirmOrder = await Order.findById(orderId);
        job.progress(50);

        if (!confirmOrder) {
            session.endSession();
            return { status: 404, message: 'Order not found!' };
        }
        job.progress(75);

        confirmOrder.status = 'Confirmed';
        await confirmOrder.save({ session });

        await session.commitTransaction();
        session.endSession();
        job.progress(100);
        job.log("Transaction Completed!");
        console.log("Transaction Completed!");

        return { status: 201, message: 'Order created successfully!', data: confirmOrder };
    }
    catch (error) {
        job.log("Transaction Error!")
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction error:', error);
        // throw new Error('Transaction failed: ' + error.message);
        return { status: 404, message: 'Transaction failed!', data: error.message };
    }
});

module.exports = orderQueue;
