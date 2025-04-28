// File: routes/reviewRoutes.js
const express = require('express');
const {
  addReview,
  editReview,
  deleteReview,
  getAllReviews,
} = require('../controllers/reviewController');
const { verifyToken } = require('../middlewares/authMiddleware');
const { canPostReview } = require('../middlewares/reviewMiddleware');

const reviewRouter = express.Router();

// Routes
reviewRouter.post('/review', verifyToken, canPostReview, addReview); // Προστασία με middleware
reviewRouter.patch('/review/:id', editReview);
reviewRouter.delete('/review/:id', deleteReview);
reviewRouter.post('/reviews', getAllReviews);

module.exports = reviewRouter;
