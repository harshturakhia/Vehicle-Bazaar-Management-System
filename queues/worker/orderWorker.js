// orderWorker.js

const mongoose = require('mongoose');
const Product = require('../../models/Vehicle'); // Ensure you have these models
const Cart = require('../../models/Cart'); // Ensure you have these models
const Order = require('../../models/Order'); // Ensure you have these models

const processOrder = async (job) => {
    const { userId, productId, orderData } = job.data;
    const session = await mongoose.startSession();
    job.progress(10);

    try {
        session.startTransaction({
            readConcern: { level: 'majority' },
            writeConcern: { w: 'majority' },
        });
        job.progress(20);

        // Fetch the product details using the productId
        const product = await Product.findById(productId).session(session);
        if (!product) {
            await session.abortTransaction();
            session.endSession();
            throw new Error('Product not found');
        }

        // Check if the product exists in the user's cart
        const cartItem = await Cart.findOne({ userId, productId }).session(session);
        if (!cartItem) {
            await session.abortTransaction();
            session.endSession();
            throw new Error('Product not found in user cart');
        }

        // Check if the product has already been ordered by the user
        const existingOrder = await Order.findOne({ userId, productId }).session(session);
        if (existingOrder) {
            await session.abortTransaction();
            session.endSession();
            throw new Error('Product has already been ordered');
        }
        job.progress(40);

        let initialDateTime = new Date(orderData.initialTime);
        let initialTime = Math.ceil(initialDateTime.getHours() + initialDateTime.getMinutes() / 60);

        let endDateTime = new Date(orderData.endTime);
        let endTime = Math.ceil(endDateTime.getHours() + endDateTime.getMinutes() / 60);

        let differenceHours = endTime - initialTime;
        let totalAmount = differenceHours * product.amount;
        job.progress(50);

        const newOrder = new Order({
            userId: cartItem.userId,
            productId: cartItem.productId,
            cartId: cartItem._id,
            initialTime: initialTime,
            endTime: endTime,
            totalAmount: totalAmount,
            status: orderData.status,
            rentTime: differenceHours,
        });
        job.progress(75);

        await newOrder.save({ session });
        job.progress(90);

        await session.commitTransaction();
        session.endSession();
        job.progress(100);

        return { status: 201, message: 'Order created successfully!', data: newOrder };
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error('Transaction error:', error);
        throw new Error('Transaction failed: ' + error.message);
    }
};

module.exports = processOrder;

