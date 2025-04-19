const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware to check if token exists and is valid
const authGuard = async (req, res, next) => {
  try {
    // Check if token exists in cookies
    const token = req.cookies?.jwt || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Authentication required. Please log in.' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists in database
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'User no longer exists.' });
    }
    
    // Add user info to request
    req.user = user;
    req.userId = user._id;
    req.userRole = user.role;
    
    next();
  } catch (error) {
    console.error('Auth guard error:', error);
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid or expired token. Please log in again.' });
    }
    res.status(500).json({ message: 'Internal server error during authentication.' });
  }
};

// Middleware to check if user owns a shop
const shopOwnerGuard = async (req, res, next) => {
  try {
    const shopId = req.params.shopId || req.params.id || req.body.shopId;
    
    if (!shopId) {
      return res.status(400).json({ message: 'Shop ID is required' });
    }
    
    // Check if user is the owner of this shop
    if (req.user.shopId && req.user.shopId.toString() === shopId.toString()) {
      return next();
    }
    
    // If user is an admin, also allow access
    if (req.userRole === 'admin') {
      return next();
    }
    
    res.status(403).json({ message: 'You are not authorized to manage this shop' });
  } catch (error) {
    console.error('Shop owner guard error:', error);
    res.status(500).json({ message: 'Internal server error during authorization check.' });
  }
};

module.exports = { authGuard, shopOwnerGuard };
