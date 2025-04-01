const admin = require('../firebase_auth/firebaseAdmin');
const User = require('../models/user');

// ... υπόλοιπος κώδικας ...
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    // Εύρεση του χρήστη στη MongoDB
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    req.user.role = user.role;
    req.user.shopId=user.shopId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized', error: error.message });
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