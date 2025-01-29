const admin = require('../firebaseAdmin');
const User = require('../models/user');

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
  next();
};

module.exports = {
  verifyToken,
  isUser,
  isShopOwner,
};