const mongoose = require('mongoose');
const Shop = require('./shop'); // Προσθήκη της εισαγωγής του Shop

const tableSchema = mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, 'Shop ID is required'],
  },
  tableNumber: {
    type: Number,
    required: true,
    min: [1, 'table number must be at least 1'],
  },
  seats: {
    type: Number,
    required: true,
    min: [1, 'number of seats must be at least 1'],
  },
  minimumSeats: {
    type: Number,
    required: true,
    min: [1, 'minimum seats must be at least 1'],
  },
  estimatedReservationTime: {
    type: Number, // Διάρκεια σε λεπτά (π.χ. 120 για 2 ώρες)
    required: true, // Default reservation time
    min: 30,
    max: 600,
  },
  bookingHours: {
    monday: {
      isBookingAllowed: { type: Boolean, default: false },
    },
    tuesday: {
      isBookingAllowed: { type: Boolean, default: false },
    },
    wednesday: {
      isBookingAllowed: { type: Boolean, default: false },
    },
    thursday: {
      isBookingAllowed: { type: Boolean, default: false },
    },
    friday: {
      isBookingAllowed: { type: Boolean, default: false },
    },
    saturday: {
      isBookingAllowed: { type: Boolean, default: false },
    },
    sunday: {
      isBookingAllowed: { type: Boolean, default: false },
    },
  },
  availability: {
    type: Object, // Changed from Map to Object
    default: {}   // Default as an empty object
  },
});

tableSchema.index({ 'availability.date': 1 });


tableSchema.index({ shopId: 1, availability: 1 });

// Middleware για επικύρωση πριν την αποθήκευση ή ενημέρωση
tableSchema.pre('save', async function (next) {
  const table = this;
  const shop = await Shop.findById(table.shopId);

  if (!shop) {
    return next(new Error('Shop not found'));
  }

  const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  // Επικύρωση ότι το isBookingAllowed δεν είναι true όταν το isOpen του shop είναι false για την ίδια ημέρα
  for (const day of daysOfWeek) {
    if (table.bookingHours[day].isBookingAllowed && (!shop.openingHours[day] || !shop.openingHours[day].isOpen)) {
      return next(new Error(`Booking is not allowed on ${day} because the shop is closed`));
    }
  }

  // Επικύρωση μοναδικότητας του tableNumber για κάθε κατάστημα
  const existingTable = await mongoose.model('Table').findOne({ shopId: table.shopId, tableNumber: table.tableNumber });
  if (existingTable && existingTable._id.toString() !== table._id.toString()) {
    return next(new Error('Table number must be unique for each shop'));
  }

 
  next();
});

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;