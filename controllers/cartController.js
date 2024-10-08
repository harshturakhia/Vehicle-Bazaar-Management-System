// Service files import
const cartService = require('../services/cartService');

const getCartItems = async (req, res) => {

    const userId = req.user.id;

    const result = await cartService.getCartItems(userId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message, cart: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}

const addToCart = async (req, res) => {

    const userId = req.user.id;
    const vehicleId = req.params.id;

    const result = await cartService.addToCartService(userId, vehicleId);

    if (result.status === 201) {
        res.status(200).json({ message: result.message, cart: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }

}

const deleteCart = async (req, res) => {

    const userId = req.user.id;

    const result = await cartService.deleteCart(userId);

    if (result.status === 200) {
        res.status(200).json({ message: result.message, cart: result.data });
    }
    else {
        res.status(result.status).json({ message: result.message });
    }
}



module.exports = { addToCart, deleteCart, getCartItems }