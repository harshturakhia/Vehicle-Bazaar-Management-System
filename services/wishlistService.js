const Wishlist = require('../models/Wishlist')
const User = require('../models/User')
const Product = require('../models/Vehicle')


// Error function
const handleError = (error, message = 'Server error') => {
    console.error(message, error);
    return { status: 500, message };
};


const getWishlist = async (userId) => {

    try {
        if (!userId) {
            return { status: 404, message: 'UserId not found!' };
        }

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return { status: 404, message: 'User not found!' };
        }

        const wishlist = await Wishlist.find({ userId: userId });

        if (wishlist.length == 0) {
            return { status: 404, message: 'No items in Wishlist!' };
        }

        return { status: 200, message: 'Wishlist fetched successfully!', data: wishlist };
    }
    catch (error) {
        return handleError(error, 'Wishlist fetch error');
    }

}

const toggleWishlist = async (userId, productId) => {

    try {
        // Check if userId is provided
        if (!userId) {
            return { status: 404, message: 'UserId not found!' };
        }

        // Check if user exists
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return { status: 404, message: 'User not found!' };
        }

        // Check if productId is provided
        if (!productId) {
            return { status: 404, message: 'ProductId not found!' };
        }

        // Check if product exists
        const product = await Product.findOne({ _id: productId });
        if (!product) {
            return { status: 404, message: 'Product not found!' };
        }

        // Find or create wishlist for the user
        let wishlist = await Wishlist.findOne({ userId: userId });
        if (!wishlist) {
            wishlist = new Wishlist({
                userId: userId,
                list: [],
            });
        }

        // Check if the product is already in the wishlist
        const index = wishlist.list.findIndex(item => item.productId.equals(productId));

        if (index === -1) {
            // Product is not in the wishlist, so add it
            wishlist.list.push({ productId: productId });
            await wishlist.save();
            return { status: 200, message: 'Product added to wishlist!' };
        } else {
            // Product is already in the wishlist, so remove it
            wishlist.list.splice(index, 1);
            await wishlist.save();
            return { status: 200, message: 'Product removed from wishlist!' };
        }
    } catch (error) {
        return handleError(error, 'Toggle Wishlist Product error!');
    }
}



module.exports = { getWishlist, toggleWishlist }