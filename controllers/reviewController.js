const {
    addReviewService,
    editReviewService,
    deleteReviewService,
    getAllReviewsService,
} = require('../services/reviewServices');
const { updateReviewList, updateReviewRatingAverage } = require('../services/shopServices');
const User = require('../models/user'); // Εισαγωγή του μοντέλου User

// Δημιουργία νέου review
const addReview = async (req, res) => {
    try {
        const { shopId, ...reviewData } = req.body;
        const userId = req.user.id; // Λήψη του userId από το `req.user` (μέσω του `verifyToken`)

        // Δημιουργία νέου review
        const newReview = await addReviewService({ shopId, ...reviewData });

        // Ενημέρωση του reviewList του καταστήματος
        await updateReviewList(shopId, newReview._id, 'POST');

        // Υπολογισμός του νέου μέσου όρου αξιολόγησης
        await updateReviewRatingAverage(shopId);

        // Προσθήκη του review στον πίνακα reviews του χρήστη
        await User.findByIdAndUpdate(userId, {
            $push: { reviews: newReview._id },
        });

        res.status(201).json({ success: true, message: 'Review added successfully', review: newReview });
    } catch (error) {
        console.error('Error adding review:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Ενημέρωση review
const editReview = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedReview = await editReviewService(id, req.body);
        res.json({ success: true, message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error('Error editing review:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Διαγραφή review
const deleteReview = async (req, res) => {
    try {
        const { id } = req.params;

        // Εύρεση του review πριν τη διαγραφή (για να έχουμε το `shopId`)
        const deletedReview = await deleteReviewService(id);

        // Ενημέρωση του reviewList του καταστήματος
        await updateReviewList(deletedReview.shopId, id, 'DELETE');

        // Υπολογισμός του νέου μέσου όρου αξιολόγησης
        await updateReviewRatingAverage(deletedReview.shopId);

        res.json({ success: true, message: 'Review deleted successfully', review: deletedReview });
    } catch (error) {
        console.error('Error deleting review:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Ανάκτηση reviews μέσω πίνακα με reviewIds
const getAllReviews = async (req, res) => {
    try {
        const reviews = await getAllReviewsService();
        res.json({ success: true, reviews });
    } catch (error) {
        console.error('Error fetching reviewss', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    addReview,
    editReview,
    deleteReview,
    getAllReviews,
};
