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
    maxlength: [500, 'Description must be at most 500 characters'],
  },
});

const Application = mongoose.model('Application', applicationSchema);
module.exports = Application;