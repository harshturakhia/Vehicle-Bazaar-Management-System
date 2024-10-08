
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/generateToken')
const { checkUserRole } = require('../middleware/generateToken')
const upload = require('../multerConfig')

// File Imports
const vehicleController = require('../controllers/vehicleController');


/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicle:
 *       type: object
 *       required:
 *         - name
 *         - brand
 *         - yearOfRegistration
 *         - registrationDetails
 *         - choice
 *         - fuelType
 *         - transmission
 *         - kmDriven
 *         - ownerNo
 *         - insurance
 *         - isVerified
 *         - image
 *       properties:
 *         name:
 *           type: string
 *           example: GT650
 *         brand:
 *           type: string
 *           example: Royal Enfield
 *         yearOfRegistration:
 *           type: string
 *           example: 2024
 *         registrationDetails:
 *           type: string
 *           example: 2024
 *         choice:
 *           type: string
 *           example: sell
 *         fuelType:
 *           type: string
 *           example: petrol
 *         transmission:
 *           type: integer
 *           example: petrol
 *         kmDriven:
 *           type: string
 *           example: 007
 *         ownerNo:
 *           type: string
 *           example: 1
 *         insurance:
 *           type: string
 *           example: yes
 *         availableLocation:
 *           type: number
 *           example: Junagadh
 *         description:
 *           type: string
 *           example: description
 *         vehicleType:
 *           type: string
 *           example: bike             
 */

/**
 * @swagger
 * /registerVehicle:
 *   post:
 *     summary: Register a new vehicle
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle registered successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user does not have vendor role
 */
router.post('/registerVehicle', verifyToken, checkUserRole('vendor'), vehicleController.registerVehicle)


/**
 * @swagger
 * /isVerified:
 *   post:
 *     summary: Verify a vehicle
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicleId:
 *                 type: string
 *             required:
 *               - vehicleId
 *     responses:
 *       200:
 *         description: Vehicle verified successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user does not have admin role
 */
router.post('/isVerified', verifyToken, checkUserRole('admin'), vehicleController.verifyVehicle)


/**
 * @swagger
 * /updateVehicle/{id}:
 *   put:
 *     summary: Update vehicle details
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
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
 *             $ref: '#/components/schemas/Vehicle'
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user does not have vendor role
 *       404:
 *         description: Vehicle not found
 */
router.put('/updateVehicle/:id', verifyToken, checkUserRole('vendor'), vehicleController.updateVehicle)


// Public route for user homepage for all vehicles
/**
 * @swagger
 * /getAllVehicles:
 *   get:
 *     summary: Get all vehicles
 *     tags: [Vehicle]
 *     responses:
 *       200:
 *         description: Successfully retrieved all vehicles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 */
router.get('/getAllVehicles', vehicleController.getAllVehicles)

// Public route for user homepage for specific vehicle
/**
 * @swagger
 * /getVehicleDetails/{id}:
 *   get:
 *     summary: Get details of a vehicle by ID
 *     tags: [Vehicle]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved vehicle details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Vehicle'
 *       404:
 *         description: Vehicle not found
 */
router.get('/getVehicleDetails/:id', vehicleController.getVehicleDetails)

// Get vehicle list by vendor id, sorting filtering applied
/**
 * @swagger
 * /getProductsById:
 *   get:
 *     summary: Get vehicles by vendor ID
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved vehicles by vendor ID
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicle'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user does not have vendor role
 */
router.get('/getProductsById', verifyToken, checkUserRole('vendor'), vehicleController.getProductsById)


/**
 * @swagger
 * /updateImage/{id}:
 *   post:
 *     summary: Update vehicle image
 *     tags: [Vendor]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Vehicle image updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden, user does not have vendor role
 *       404:
 *         description: Vehicle not found
 */
router.post('/updateImage/:id', verifyToken, checkUserRole('vendor'), upload.single('image'), vehicleController.updateImage)


// DELETE VEHICLE

/**
 * @swagger
 * /deleteVehicle/{id}:
 *   post:
 *     summary: Send delete request for a vehicle (vendor only)
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         description: The ID of the vehicle to delete
 *     responses:
 *       200:
 *         description: Vehicle delete request sent successfully to admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle delete request sent successfully to admin!
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
 *         description: Vehicle or Vendor not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle not found!
 *       500:
 *         description: Delete Vehicle Request Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Delete Vehicle Request Error!
 */
router.post('/deleteVehicle/:id', verifyToken, checkUserRole('vendor'), vehicleController.deleteVehicle)


/**
 * @swagger
 * /deleteListOfVehicle:
 *   get:
 *     summary: Get list of vehicles with delete requests (admin only)
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vehicle delete requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: List of vehicle delete request!
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
 *                       deleteReq:
 *                         type: boolean
 *                         example: true
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
 *         description: No vehicles found with delete requests
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: No Vehicles found with Delete Request!
 *       500:
 *         description: Fetch Delete Vehicle Request Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Fetch Delete Vehicle Request Error!
 */
router.get('/deleteListOfVehicle', verifyToken, checkUserRole('admin'), vehicleController.deleteListOfVehicle)


/**
 * @swagger
 * /deleteVehicleByAdmin/{id}:
 *   delete:
 *     summary: Delete a vehicle by ID (admin only)
 *     tags: [Vehicle]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "60d0fe4f5311236168a109ca"
 *         description: The ID of the vehicle to delete
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle deleted successfully!
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
 *         description: Vehicle or Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vehicle not found!
 *       500:
 *         description: Error in Delete Vehicle by Admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Error in Delete Vehicle by Admin!
 */
router.delete('/deleteVehicleByAdmin/:id', verifyToken, checkUserRole('admin'), vehicleController.deleteVehicleByAdmin)

module.exports = router;        