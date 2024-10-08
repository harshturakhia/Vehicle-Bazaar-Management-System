const express = require('express')
const router = express.Router();
const { verifyToken } = require('../middleware/generateToken')


const orderController = require('../controllers/orderController');

/**
 * @swagger
 * /order/{id}:
 *   post:
 *     summary: Create an order for a product
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         description: The ID of the product to order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               initialTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-07-07T14:00:00Z"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-07-07T16:00:00Z"
 *               status:
 *                 type: string
 *                 example: "Pending"
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order created successfully!
 *                 order:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     userId:
 *                       type: string
 *                     productId:
 *                       type: string
 *                     totalAmount:
 *                       type: number
 *                       example: 100
 *                     status:
 *                       type: string
 *                       example: "Pending"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized! No token provided
 *       404:
 *         description: User or Product not found, or Product not found in user cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User or Product not found!
 *       409:
 *         description: Product has already been ordered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Product has already been ordered!
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unexpected server error
 */
router.post('/order/:id', verifyToken, orderController.postOrder)

/**
 * @swagger
 * /order:
 *   get:
 *     summary: Get list of orders for the logged-in user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of Orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List of Orders!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109ca"
 *                       userId:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109cb"
 *                       productId:
 *                         type: string
 *                         example: "60d0fe4f5311236168a109cc"
 *                       totalAmount:
 *                         type: number
 *                         example: 100
 *                       status:
 *                         type: string
 *                         example: "Pending"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized! No token provided
 *       404:
 *         description: User does not exist or No orders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User do not exist!
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unexpected server error
 */
router.get('/order', verifyToken, orderController.getOrders)

/**
 * @swagger
 * /cancelOrder:
 *   delete:
 *     summary: Cancel the order for the logged-in user
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Order cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order cancelled successfully!
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized! No token provided
 *       404:
 *         description: User does not exist or No orders found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User do not exist!
 *       409:
 *         description: No orders exist on this account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No orders exist on this account!
 *       500:
 *         description: Unexpected server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unexpected server error
 */
router.delete('/cancelOrder', verifyToken, orderController.cancelOrder)


module.exports = router;