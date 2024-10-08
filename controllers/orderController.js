// File Imports
const orderService = require('../services/orderService');
const orderDto = require('../models/dto/OrderDto');

const postOrder = async (req, res) => {

    try {
        const userId = req.user.id;
        const productId = req.params.id;
        const orderData = req.body;

        const result = await orderService.postOrder(userId, productId, orderData);

        res.status(result.status).json({ message: result.message, order: result.data });

    }
    catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Unexpected server error' });
    }

}

const getOrders = async (req, res) => {

    try {
        const userId = req.user.id;

        const result = await orderService.getOrders(userId);

        if (result.status == 200) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(result.status).json({ message: result.message });
        }
    }
    catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Unexpected server error' });
    }
}

const cancelOrder = async (req, res) => {

    try {
        const userId = req.user.id;
        const result = await orderService.cancelOrder(userId);

        if (result.status == 200) {
            res.status(200).json({ message: result.message, data: result.data });
        }
        else {
            res.status(result.status).json({ message: result.message });
        }
    }
    catch (error) {
        console.error('Unexpected error:', error);
        return res.status(500).json({ message: 'Unexpected server error' });
    }
}

module.exports = { postOrder, getOrders, cancelOrder }