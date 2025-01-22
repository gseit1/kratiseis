// File: routes/reviewRoutes.js
const express = require('express');
const {
    addReview,
    editReview,
    deleteReview,
    getAllReviews,
} = require('../controllers/reviewController');

const reviewRouter = express.Router();

// Routes
reviewRouter.post('/review', addReview);                // Δημιουργία review
reviewRouter.patch('/review/:id', editReview);          // Ενημέρωση review
reviewRouter.delete('/review/:id', deleteReview);       // Διαγραφή review
reviewRouter.post('/reviews', getAllReviews); // Ανάκτηση reviews 

module.exports = reviewRouter;
