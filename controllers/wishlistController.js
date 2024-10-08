const wishlistService = require('../services/wishlistService')


const getWishlist = async (req, res) => {

    const userId = req.user.id;
    const result = await wishlistService.getWishlist(userId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message, data: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message, });
    }

}

const toggleWishlist = async (req, res) => {

    const userId = req.user.id;
    const productId = req.params.id;
    const result = await wishlistService.toggleWishlist(userId, productId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}


module.exports = { getWishlist, toggleWishlist }