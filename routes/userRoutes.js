
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/generateToken')
const { checkUserRole } = require('../middleware/generateToken')


// File Imports
const userController = require('../controllers/userController');


/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterUserSchema:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           example: Test#
 *         email:
 *           type: string
 *           example: test@gmail.com
 *         password:
 *           type: string
 *           writeOnly: true
 *           example: 123456
 *         role:
 *           type: string
 *           example: user
 *         address:
 *           type: string
 *           example: Junagadh
 *         contact:
 *           type: string
 *           example: 1234567890
 *         gender:
 *           type: string
 *           example: male
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: User signup
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUserSchema'
 *     responses:
 *       200:
 *         description: User successfully signed up
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterUserSchema'
 *       400:
 *         description: Bad request, missing required fields
 */
router.post('/register', userController.signupUser)


/**
 * @swagger
 * components:
 *   schemas:
 *     LoginuserSchema:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: admin@gmail.com
 *         password:
 *           type: string
 *           writeOnly: true
 *           example: 123456
 *         token:
 *           type: string
 *           readOnly: true
 */

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginuserSchema'
 *     responses:
 *       200:
 *         description: Successful login, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid email or password
 */
router.post('/login', userController.signinUser)


/**
 * @swagger
 * /getAlluser:
 *   get:
 *     summary: Retrieve all users
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful retrieval of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/getAlluser', verifyToken, checkUserRole('admin'), userController.getAlluser)


/**
 * @swagger
 * /getSingleUser/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags:
 *       - User
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID (GUID)
 *     responses:
 *       200:
 *         description: Successful retrieval of the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/getSingleUser/:id', verifyToken, userController.getUserById)


/**
 * @swagger
 * /verifyVendor/{id}:
 *   post:
 *     summary: Verify user as vendor
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               verificationData:
 *                 type: string
 *             required:
 *               - verificationData
 *     responses:
 *       200:
 *         description: User verified as vendor successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/verifyVendor/:id', verifyToken, checkUserRole('admin'), userController.verifyUser)

/**
 * @swagger
 * /resetPassword/{id}:
 *   post:
 *     summary: Reset user password
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *               email:
 *                  type: email
 *               oldPassword:
 *                  type: string
 *             required:
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password reset successful
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/resetPassword/:id', verifyToken, userController.resetPassword)


/**
 * @swagger
 * /signout/{id}:
 *   get:
 *     summary: User sign out
 *     tags: [Auth]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User successfully signed out
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/signout/:id', verifyToken, userController.signoutUser)


/**
 * @swagger
 * /updateUser/{id}:
 *   post:
 *     summary: Update user details
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: User details updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.post('/updateUser/:id', verifyToken, userController.updateUser)


// DELETE USER
/**
 * @swagger
 * /deleteUser:
 *   post:
 *     summary: Delete user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User delete request sent to admin successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User delete request sent to admin successfully!
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
 *         description: User not found or already deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
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
router.post('/deleteUser', verifyToken, userController.deleteUser)


/**
 * @swagger
 * /deleteListOfUser:
 *   get:
 *     summary: Get list of users who requested deletion (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list with delete request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User list with delete request!
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         example: "1234567890abcdef12345678"
 *                       email:
 *                         type: string
 *                         example: "user@example.com"
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden! You do not have the required role
 *       404:
 *         description: No users found with delete request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No users found with delete request!
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
router.get('/deleteListOfUser', verifyToken, checkUserRole('admin'), userController.deleteListOfUser)


/**
 * @swagger
 * /deleteUserByAdmin/{id}:
 *   delete:
 *     summary: Delete user by ID (admin only)
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         description: The ID of the user to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User deleted successfully!
 *                 data:
 *                   type: boolean
 *                   example: true
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
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden! You do not have the required role
 *       404:
 *         description: User or Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User not found!
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
router.delete('/deleteUserByAdmin/:id', verifyToken, checkUserRole('admin'), userController.deleteUserByAdmin)



router.post('/sendMail', userController.sendMail);



module.exports = router;    