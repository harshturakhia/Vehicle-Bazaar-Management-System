const Cart = require('../models/Cart');
const User = require("../models/User");


// Error function
const handleError = (error, message = 'Server error') => {
    console.error(message, error);
    return { status: 500, message };
};


const getCartItems = async (userId) => {

    try {
        if (!userId) {
            return { status: 400, message: 'Invalid userid' };
        }

        const user = await User.findById(userId);
        if (!user) {
            return { status: 400, message: 'No user found!' };
        }

        const existingCart = await Cart.findOne({ userId: userId });
        if (!existingCart) {
            return { status: 400, message: 'No cart exists for this user!' };
        }

        return { status: 200, message: 'Cart fetched successfully!', data: existingCart };

    }
    catch (error) {
        console.error('Get Cart error:', error);
        return { status: 500, message: 'Server error' };
    }
}

const addToCartService = async (userId, vehicleId) => {

    try {
        if (!userId || !vehicleId) {
            return { status: 400, message: 'Invalid userid or vehicleid' };
        }

        const user = await User.findById(userId);
        if (!user) {
            return { status: 400, message: 'No user found!' };
        }

        // Check if a cart already exists for this user and vehicle
        const existingCart = await Cart.findOne({ userId: userId, productId: vehicleId });

        if (existingCart) {
            return { status: 400, message: 'Cart already exists for this user and vehicle' };
        }

        const newCart = new Cart({
            userId: userId,
            productId: vehicleId,
            createdAt: new Date(),
        })

        newCart.save();
        return { status: 201, message: 'Cart created successfully!', data: newCart };
    }
    catch (error) {
        console.error('Add To Cart Error:', error);
        return { status: 500, message: 'Server error' };
    }
}

const deleteCart = async (userId) => {

    try {
        if (!userId) {
            return { status: 400, message: 'Invalid userid' };
        }

        const user = await User.findById(userId);
        if (!user) {
            return { status: 400, message: 'No user found!' };
        }

        const existingCart = await Cart.findOne({ userId: userId });
        if (!existingCart) {
            return { status: 400, message: 'No cart exists for this user!' };
        }

        await Cart.deleteOne({ userId: userId });

        return { status: 200, message: 'Cart deleted successfully!' };
    }
    catch (error) {
        console.error('Delete Cart error:', error);
        return { status: 500, message: 'Server error' };
    }


}

module.exports = { addToCartService, deleteCart, getCartItems }