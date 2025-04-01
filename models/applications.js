const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Αναφορά στον χρήστη που κάνει την αίτηση
    required: true,
  },
  shopName: {
    type: String,
    required: [true, 'Shop name is required'],
    minlength: [2, 'Shop name must be at least 2 characters'],
    maxlength: [25, 'Shop name must be at most 25 characters'],
  },
  shopDescription: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description must be at most 300 characters'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Αναφορά στην κατηγορία του καταστήματος
    required: true,
  },
  
    
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City', // Αναφορά στην πόλη
    required: [true, 'City is required'],
  },
  region: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region', // Αναφορά στην περιοχή
    required: [true, 'Region is required'],
  },
  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: {
      validator: function (v) {
        return /^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?[\d\s-]{7,10}$/.test(v);
      },
      message: 'Please enter a valid phone number',
    },
  },
  
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'], // Κατάσταση της αίτησης
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;