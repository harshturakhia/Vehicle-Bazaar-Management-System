// Import mongoose
const mongoose = require('mongoose');
const { Schema } = mongoose;


const wishlistSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    list: [
        {
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

});


// Create the model
const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// Export the model
module.exports = Wishlist;
