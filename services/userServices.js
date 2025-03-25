const User = require('../models/user');

const addReservationToUserHistory = async (userId, reservationId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // If the reservation is not already in the history, add it.
    if (!user.reservationHistory.some(id => id.toString() === reservationId.toString())) {
      user.reservationHistory.push(reservationId);
      await user.save();
      console.log(`Reservation ${reservationId} added to user ${userId} history`);
    }

    return user;
  } catch (error) {
    console.error("Error adding reservation to user history:", error.message);
    throw error;
  }
};

const removeReservationFromUserHistory = async (userId, reservationId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Remove the reservationId from the history array.
    user.reservationHistory = user.reservationHistory.filter(
      id => id.toString() !== reservationId.toString()
    );
    await user.save();
    console.log(`Reservation ${reservationId} removed from user ${userId} history`);
    return user;
  } catch (error) {
    console.error("Error removing reservation from user history:", error.message);
    throw error;
  }
};

module.exports = {
  addReservationToUserHistory,
  removeReservationFromUserHistory,
};