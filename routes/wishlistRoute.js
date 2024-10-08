const express = require('express')
const router = express.Router();

// File Imports
const { checkUserRole } = require('../middleware/generateToken')
const { verifyToken } = require('../middleware/generateToken')

const wishlistController = require('../controllers/wishlistController');


router.get('/getWishlist', verifyToken, checkUserRole('user'), wishlistController.getWishlist)

router.post('/toggleWishlist/:id', verifyToken, checkUserRole('user'), wishlistController.toggleWishlist)



module.exports = router;