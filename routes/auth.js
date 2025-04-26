const express = require('express');
const { verifyToken } = require('../middlewares/authMiddleware');
const { check, validationResult } = require('express-validator');
const { signUp, login, changeUserRole, deleteUser ,getUserRole,getUserDetails,getAllUsers,setUserShopId,filterByRole} = require('../controllers/authController');
const authRouter = express.Router();

// Route για εγγραφή χρήστη
authRouter.post('/api/signup', [
  check('name').isLength({ min: 1 }).trim().escape(),
  check('surname').isLength({ min: 1 }).trim().escape(),
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }).trim().escape()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, signUp);

// Route για σύνδεση χρήστη
authRouter.post('/api/login', [
  check('email').isEmail().normalizeEmail(),
  check('password').isLength({ min: 6 }).trim().escape()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}, login);

// New route to check if user is authenticated
authRouter.get('/api/check-auth', verifyToken, (req, res) => {
  try {
    res.status(200).json({ 
      isAuthenticated: true,
      user: {
        id: req.user._id,
        role: req.user.role  // Χρειάζεται για τα βασικά permissions
      }
    });
  } catch (error) {
    res.status(401).json({
      isAuthenticated: false,
      user: null
    });
  }
});

// Route για αλλαγή ρόλου χρήστη από admin
authRouter.patch('/api/change-role', changeUserRole);

// Route για διαγραφή χρήστη
authRouter.delete('/api/delete-user', deleteUser);

// Route για επιστροφή του ρόλου του χρήστη
authRouter.get('/api/get-role',  getUserRole);

// Route για επιστροφή των δεδομένων του χρήστη
authRouter.get('/api/users/details', verifyToken, getUserDetails);
// Route για ενημέρωση του shopId του χρήστη
authRouter.patch('/api/user/shopId',verifyToken,  setUserShopId);
//
//authRouter.get('/api/users', getAllUsers); // Επιστροφή όλων των χρηστών
//
authRouter.get('/api/users/filter', filterByRole);

module.exports = authRouter;