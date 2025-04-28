const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  surname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'shopOwner', 'admin'],
    default: 'user',
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    default: null,
  },
  reservationHistory: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: [],
  }],
  favouriteShops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    default: [],
  }],
  applied: {
    type: Boolean,
    default: false, // Αρχικοποιείται ως false
  },
  reviews: [{ // Νέος πίνακας για τις κριτικές του χρήστη
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review',
    default: [],
  }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;