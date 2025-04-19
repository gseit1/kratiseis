const admin = require('../firebase_auth/firebaseAdmin');
const User = require('../models/user');

// ... υπόλοιπος κώδικας ...

const verifyToken = async (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    console.error('No token found in cookies');
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Make both user record and Firebase claims available to the request
    req.user = user;
    req.firebaseClaims = decodedToken;
    next();
  } catch (error) {
    console.error('Invalid Firebase token:', error.message);
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

const isUser = (req, res, next) => {
  if (req.user.role !== 'user') {
    return res.status(403).json({ message: 'Forbidden: Access is allowed only for users' });
  }
  next();
};

const isShopOwner = (req, res, next) => {
  // Check role from MongoDB user record
  if (req.user.role !== 'shopOwner') {
    return res.status(403).json({ message: 'Forbidden: Access is allowed only for shop owners' });
  }

  // Check if user has a shopId
  if (!req.user.shopId) {
    return res.status(400).json({ message: 'User does not have a shop assigned' });
  }
  
  // If we reach here, user is a shop owner with a valid shopId
  next();
};

module.exports = {
  verifyToken,
  isUser,
  isShopOwner,
};