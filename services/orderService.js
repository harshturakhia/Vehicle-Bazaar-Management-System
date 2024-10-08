const Order = require("../models/Order")
const Cart = require('../models/Cart')
const Product = require('../models/Vehicle')
const orderQueue = require("../queues/orderQueue");
// const orderQueue = require("../queues/orderMQ");

// Error function
const handleError = (error, message = 'Server error') => {
    console.error(message, error);
    return { status: 500, message };
};

// Simple Logic
// const postOrder = async (userId, productId, orderData) => {

//     try {

//         if (!userId || !productId) {
//             return { status: 404, message: 'User or Product do not exist!' };
//         }

//         // Fetch the product details using the productId
//         const product = await Product.findById(productId);
//         if (!product) {
//             return { status: 404, message: 'Product not found!' };
//         }

//         // Check if the product exists in the user's cart
//         const cartItem = await Cart.findOne({ userId, productId });
//         if (!cartItem) {
//             return { status: 404, message: 'Product not found in user cart!' };
//         }

//         // Check if the product has already been ordered by the user
//         const existingOrder = await Order.findOne({ userId, productId });
//         if (existingOrder) {
//             return { status: 409, message: 'Product has already been ordered!' };
//         }

//         let initialDateTime = new Date(orderData.initialTime);
//         let initialTime = Math.ceil(initialDateTime.getHours() + initialDateTime.getMinutes() / 60);

//         let endDateTime = new Date(orderData.endTime);
//         let endTime = Math.ceil(endDateTime.getHours() + endDateTime.getMinutes() / 60);

//         let differenceHours = endTime - initialTime;
//         let totalAmount = differenceHours * product.amount;

//         await orderQueue.add({});

//         const newOrder = new Order({
//             userId: cartItem.userId,
//             productId: cartItem.productId,
//             cartId: cartItem._id,
//             intialTime: initialTime,
//             endTime: endTime,
//             totalAmount: totalAmount,
//             status: orderData.status,
//             rentTime: differenceHours,
//         });
//         newOrder.initialTime = initialTime;

//         await newOrder.save();

//         return { status: 201, message: 'Order created successfully!', data: newOrder };
//     }
//     catch (error) {
//         return handleError(error, 'Create Order Error');
//     }

// }

// Logic with queue and transaction
// const postOrder = async (userId, productId, orderData) => {
//     try {
//         if (!userId || !productId) {
//             return { status: 404, message: 'User or Product do not exist!' };
//         }

//         // await orderQueue.add({ userId, productId, orderData });
//         const result = await orderQueue.add({ userId, productId, orderData });

//         // return { status: 202, message: 'Order processing started!' };
//         // return { status: result.status, message: result.message, data: result.data };
//         const job = await result.finished();
//         console.log(job);
//         return job;
//     }
//     catch (error) {
//         console.log('Server error : \n', error);
//         return { status: 500, message: 'Server error', data: error };
//     }
// };

// Logic with BullMQ 
// const postOrder = async (userId, productId, orderData) => {
//     try {
//         if (!userId || !productId) {
//             return { status: 404, message: 'User or Product do not exist!' };
//         }

//         // Add job to the BullMQ queue
//         await orderQueue.add('processOrder', { userId, productId, orderData });

//         return { status: 202, message: 'Order processing started!' };
//     } catch (error) {
//         console.error('Server error:', error);
//         return { status: 500, message: 'Server error', data: error };
//     }
// };

// Just logic and status update in queue
const postOrder = async (userId, productId, orderData) => {

    try {
        if (!userId || !productId) {
            return { status: 404, message: 'User or Product do not exist!' };
        }

        // Fetch the product details using the productId
        const product = await Product.findById(productId);
        if (!product) {
            return { status: 404, message: 'Product not found!' };
        }

        // Check if the product exists in the user's cart
        const cartItem = await Cart.findOne({ userId, productId });
        if (!cartItem) {
            return { status: 404, message: 'Product not found in user cart!' };
        }

        // Check if the product has already been ordered by the user
        const existingOrder = await Order.findOne({ userId, productId });
        if (existingOrder) {
            return { status: 409, message: 'Product has already been ordered!' };
        }


        let totalAmount, initialDateTime, initialTime, endDateTime, endTime, differenceHours;
        if (product.choice === 'rent') {
            initialDateTime = new Date(orderData.initialTime);
            initialTime = Math.ceil(initialDateTime.getHours() + initialDateTime.getMinutes() / 60);

            endDateTime = new Date(orderData.endTime);
            endTime = Math.ceil(endDateTime.getHours() + endDateTime.getMinutes() / 60);

            if (initialTime >= endTime) {
                return { status: 400, message: 'Initial time must be before end time!' };
            }

            let differenceHours = endTime - initialTime
            totalAmount = differenceHours * product.amount;

        }
        else {
            totalAmount = product.amount;
        }

        const newOrder = new Order({
            userId: cartItem.userId,
            productId: cartItem.productId,
            cartId: cartItem._id,
            intialTime: initialTime,
            endTime: endTime,
            choice: product.choice,
            totalAmount: totalAmount,
            status: orderData.status || "Pending",
            rentTime: differenceHours,
        });
        newOrder.initialTime = initialTime;
        await newOrder.save();

        await orderQueue.add(newOrder._id);

        return { status: 201, message: 'Order created successfully!', data: newOrder };
    }
    catch (error) {
        return handleError(error, 'Create Order Error');
    }

}


const getOrders = async (userId) => {

    try {

        if (!userId) {
            return { status: 404, message: 'User do not exist!' };
        }

        const orders = await Order.find({ userId });

        if (!orders || orders.length == 0) {
            return { status: 404, message: 'No order exist in this account!' };
        }


        return { status: 200, message: 'List of Orders!', data: orders };

    }
    catch (error) {
        return handleError(error, 'Get Order Error');
    }

}

const cancelOrder = async (userId) => {

    try {
        if (!userId) {
            return { status: 404, message: 'User do not exist!' };
        }

        const existingOrder = await Order.findOne({ userId });
        if (!existingOrder) {
            return { status: 409, message: 'No orders exist on this account!' };
        }

        await Order.deleteOne({ userId });

        return { status: 200, message: 'Order cancelled successfully!' };
    }
    catch (error) {
        return handleError(error, 'Cancel Order Error');
    }

}

module.exports = { postOrder, getOrders, cancelOrder }