const express = require('express');
const logoutRouter = express.Router();

// Logout route to clear the JWT cookie
logoutRouter.post('/api/logout', (req, res) => {
  try {
    // Clear the JWT cookie
    res.clearCookie('jwt', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Error during logout' });
  }
});

module.exports = logoutRouter;
