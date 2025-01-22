// File: services/reviewServices.js
const Review = require('../models/review');

// Δημιουργία νέου review
const addReviewService = async (reviewData) => {
    const { text, rating, shopId } = reviewData;
    if (!text || !rating || !shopId) {
        throw new Error('All fields (text, rating, shopId) are required');
    }

    const newReview = new Review({ text, rating, shopId });
    await newReview.save();
    return newReview;
};

// Ενημέρωση review
const editReviewService = async (reviewId, updatedData) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    if (updatedData.text) review.text = updatedData.text;
    if (updatedData.rating) review.rating = updatedData.rating;

    await review.save();
    return review;
};

// Διαγραφή review
const deleteReviewService = async (reviewId) => {
    const review = await Review.findById(reviewId);
    if (!review) {
        throw new Error('Review not found');
    }

    await Review.findByIdAndDelete(reviewId);
    return review;
};


// Επιστροφή όλων των reviews
const getAllReviewsService = async () => {
    const reviews = await Review.find({});
    return reviews;
};

module.exports = {
    addReviewService,
    editReviewService,
    deleteReviewService,
    getAllReviewsService,
};
