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
reviewRouter.post('/api/review', verifyToken, canPostReview, addReview); // Προστασία με middleware
reviewRouter.patch('/api/review/:id', editReview);
reviewRouter.delete('/api/review/:id', deleteReview);
reviewRouter.post('/api/reviews', getAllReviews);

module.exports = reviewRouter;
