// Import mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;


const cartSchema = new Schema({
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
    quantity: {
        type: Number,
        default: 1,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


// Create the model
const Cart = mongoose.model('Cart', cartSchema);

// Export the model
module.exports = Cart;
