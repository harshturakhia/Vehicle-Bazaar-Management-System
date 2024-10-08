const jwt = require('jsonwebtoken');
require('dotenv').config();


const generateToken = (user) => {

    const payload = { id: user._id, email: user.email, role: user.role };
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn: '60m' };

    return jwt.sign(payload, secret, options);
};

const verifyToken = (req, res, next) => {
    // Get token from cookies or headers
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }
    
    try {
        // Verify token for same loggedin user only
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to request object in cookie (jwt)
        next();
    }
    catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

const clearTokenCookie = (res) => {
    res.clearCookie('token');
};

const checkUserRole = (requiredRole) => (req, res, next) => {
    if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required role' });
    }
    next();
};


module.exports = { generateToken, verifyToken, clearTokenCookie, checkUserRole }