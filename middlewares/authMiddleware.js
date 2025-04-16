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
    const user = await User.findOne({ firebaseUid: decodedToken.uid }); // ή decodedToken.sub
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.user = user;
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
  if (req.user.role !== 'shopOwner') {
    return res.status(403).json({ message: 'Forbidden: Access is allowed only for shop owners' });
  }

  // Ελέγχουμε το shopId στο query, params ή body
  const reqShopId = req.query.shopId || req.params.shopId || req.body.shopId;
  if (!reqShopId) {
    return res.status(400).json({ message: 'Missing shopId parameter' }); // Εδώ εμφανίζεται το μήνυμα
  }

  // Ελέγχουμε αν το shopId του χρήστη ταιριάζει
  if (!req.user.shopId || req.user.shopId.toString() !== reqShopId.toString()) {
    console.log("users shopID:",req.user.shopId);
    return res.status(403).json({ message: 'Forbidden: You are not the owner of this shop' });
  }
  next();
};

module.exports = {
  verifyToken,
  isUser,
  isShopOwner,
};