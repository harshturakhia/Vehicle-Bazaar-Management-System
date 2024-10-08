const mongoose = require('mongoose');
const { Schema } = mongoose;


const orderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },

    cartId: {
        type: Schema.Types.ObjectId,
        ref: 'Cart',
        required: true,
    },

    totalAmount: {
        type: Number,
        required: true,
    },

    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    initialTime: {
        type: String,
        null: true,
    },

    endTime: {
        type: String,
        null: true,
    },

    rentTime: {
        type: String,
        null: true,
    },

    choice: {
        type: String,
        enum: ['sell', 'rent'],
    },

});


const Order = mongoose.model('Order', orderSchema);


module.exports = Order;
