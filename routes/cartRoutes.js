const express = require('express')
const router = express.Router();

// File Imports
const { checkUserRole } = require('../middleware/generateToken')
const { verifyToken } = require('../middleware/generateToken')
const cartController = require('../controllers/cartController');

/**
 * @swagger
 * /getCartItems:
 *   get:
 *     summary: Get cart items for the logged-in user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart fetched successfully!
 *                 cart:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     items:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           productId:
 *                             type: string
 *                           quantity:
 *                             type: number
 *                             example: 2
 *       400:
 *         description: Invalid userId or No user/cart found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid userId
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.get('/getCartItems', verifyToken, checkUserRole('user'), cartController.getCartItems)

/**
 * @swagger
 * /addToCart/{id}:
 *   post:
 *     summary: Add a vehicle to the user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         description: The ID of the vehicle to add to the cart
 *     responses:
 *       201:
 *         description: Cart created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart created successfully!
 *                 cart:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109ca"
 *                     productId:
 *                       type: string
 *                       example: "60d0fe4f5311236168a109cb"
 *       400:
 *         description: Invalid userId or vehicleId, No user found, or Cart already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid userId or vehicleId
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.post('/addToCart/:id', verifyToken, checkUserRole('user'), cartController.addToCart)

/**
 * @swagger
 * /deleteCart:
 *   delete:
 *     summary: Delete the cart for the logged-in user
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cart deleted successfully!
 *       400:
 *         description: Invalid userId or No user/cart found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid userId
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
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Server error
 */
router.delete('/deleteCart', verifyToken, checkUserRole('user'), cartController.deleteCart)


module.exports = router;