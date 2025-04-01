const mongoose = require('mongoose');
const { validatePhoneNumber } = require('../validators/shopValidators');

// Schema για το κατάστημα
const shopSchema = mongoose.Schema({
  shopName: {
    type: String,
    trim: true,
    required: [true, 'Shop name is required'],
    minlength: [2, 'Shop name must be at least 2 characters'],
    maxlength: [25, 'Shop name must be at most 25 characters'],
    unique: true,
  },
  shopDescription: {
    type: String,
    required: [true, 'Description is required'],
    minlength: [1, 'Description must be at least 10 characters'],
    maxlength: [500, 'Description must be at most 300 characters'],
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },


  images: [{
    type: String,
    default: []
  }],



  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'City',
    required: [true, 'City is required'],
  },

  region:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Region',
    required: [true, 'Region is required'],
  },

  location: {
    type: { type: String, enum: ['Point'], required: true },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    validate: [validatePhoneNumber, 'Please enter a valid phone number (either mobile or landline)'],
  },
  musicCategory: {
    type: String,
    default: "",
  },
  priceRange: {
    type: String,
    default: "",
  },
  openingHours: {
    monday: {
      isOpen: { type: Boolean, default: false, required: true },
      open: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      close: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingStart: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingEnd: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
    },
    tuesday: {
      isOpen: { type: Boolean, default: false, required: true },
      open: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      close: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingStart: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingEnd: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
    },
    wednesday: {
      isOpen: { type: Boolean, default: false, required: true },
      open: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      close: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingStart: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingEnd: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
    },
    thursday: {
      isOpen: { type: Boolean, default: false, required: true },
      open: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      close: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingStart: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingEnd: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
    },
    friday: {
      isOpen: { type: Boolean, default: false, required: true },
      open: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      close: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingStart: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingEnd: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
    },
    saturday: {
      isOpen: { type: Boolean, default: false, required: true },
      open: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      close: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingStart: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingEnd: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
    },
    sunday: {
      isOpen: { type: Boolean, default: false, required: true },
      open: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      close: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingStart: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
      bookingEnd: { type: Number, min: 0, max: 24, required: function() { return this.isOpen; }, default: 0 },
    },
  },
  timeSlotSplit: {
    type: Number,
    required: [false, 'Time slot split is required'],
  },
  tables: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Table',
    default: [],
  }],
  reservationList: {
    type: Object,
    default: {}
  },
  
  
  undefinedReservationList: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reservation',
    default: [],
  }],
  

reviewList:[{
  type:mongoose.Schema.Types.ObjectId,
  ref:"Review",
  default:[],

}],

reviewRatingAverage:{
  type:Number,
  default:-1, // -1 means no rating/reviews for the shop
}

});

// Middleware για επικυρώσεις πριν την αποθήκευση
shopSchema.pre('save', function(next) {
  const openingHours = this.openingHours;

  for (const day in openingHours) {
    if (openingHours[day].isOpen) {
      if (openingHours[day].open >= openingHours[day].close) {
        return next(new Error(`Open time must be before close time for ${day}`));
      }
      if (openingHours[day].bookingStart >= openingHours[day].bookingEnd) {
        return next(new Error(`Booking start time must be before booking end time for ${day}`));
      }
      if (openingHours[day].bookingStart < openingHours[day].open || openingHours[day].bookingEnd > openingHours[day].close) {
        return next(new Error(`Booking hours must be within open hours for ${day}`));
      }
    } else {
      openingHours[day].open = 0;
      openingHours[day].close = 0;
      openingHours[day].bookingStart = 0;
      openingHours[day].bookingEnd = 0;
    }
  }

  next();
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;