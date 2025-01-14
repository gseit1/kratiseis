const mongoose = require('mongoose');

const tableSchema = mongoose.Schema({
    shopId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Shop',
        required: true,
    },
    tableNumber: {
        type: Number,
        required: true,
    },
    seats: {
        type: Number,
        required: true,
    },
    estimatedReservationTime: {
        type: Number, // Διάρκεια σε λεπτά (π.χ. 120 για 2 ώρες)
        required: true, // Default reservation time
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
        type: Map,
        of: [Number], // Πίνακας με αριθμούς που αντιπροσωπεύουν ώρες (π.χ. 12.5 για 12:30)
        default: {}, // Default empty map
    },
});

tableSchema.index({ shopId: 1, availability: 1 });

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
