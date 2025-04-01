const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  firebaseUid: {
    type: String,
    required: true,
    unique: true,
  },

  name:{
    type:String,
    required:true,
  },
  
  surname:{
    type:String,
    required:true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ['user', 'shopOwner','admin'],
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
    default:[],
  }],
});

const User = mongoose.model('User', userSchema);
module.exports = User;