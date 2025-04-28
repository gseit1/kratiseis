const User = require('../models/user');

const canPostReview = async (req, res, next) => {
  try {
    const userId = req.user.id; // Λήψη του userId από το `req.user` (μέσω του `verifyToken`)
    const { shopId } = req.body; // Το shopId πρέπει να περιλαμβάνεται στο σώμα του αιτήματος

    if (!shopId) {
      return res.status(400).json({ message: 'Shop ID is required to post a review' });
    }

    // Εύρεση του χρήστη και του reservationHistory του
    const user = await User.findById(userId).populate('reservationHistory');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Έλεγχος αν υπάρχει completed κράτηση για το συγκεκριμένο shop
    const hasCompletedReservation = user.reservationHistory.some(
      (reservation) => reservation.shopId.toString() === shopId && reservation.state === 'completed'
    );

    if (!hasCompletedReservation) {
      return res.status(403).json({
        message: 'Για να κάνεις αξιολόγηση πρέπει να έχεις τουλάχιστον 1 ολοκληρωμένη κράτηση για το μαγαζί',
      });
    }

    // Αν ο χρήστης έχει completed κράτηση, προχωράμε στο επόμενο middleware
    next();
  } catch (error) {
    console.error('Error in canPostReview middleware:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { canPostReview };