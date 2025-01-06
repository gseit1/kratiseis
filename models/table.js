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
        default: 120, // Default reservation time
    },

  

    bookingHours: {
        monday: {
            isBookingAllowed: { type: Boolean, default: false },
            start: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
            end: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
        },
        tuesday: {
            isBookingAllowed: { type: Boolean, default: false },
            start: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
            end: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
        },
        wednesday: {
            isBookingAllowed: { type: Boolean, default: false },
            start: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
            end: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
        },
        thursday: {
            isBookingAllowed: { type: Boolean, default: false },
            start: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
            end: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
        },
        friday: {
            isBookingAllowed: { type: Boolean, default: false },
            start: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
            end: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
        },
        sunday: {
            isBookingAllowed: { type: Boolean, default: false },
            start: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
            end: { 
                type: Number, 
                min: 0, 
                max: 24, 
                default: null 
            },
        },
    },
    availability: {
        type: Map,
        of: [Number], // Πίνακας με αριθμούς που αντιπροσωπεύουν ώρες (π.χ. 12.5 για 12:30)
        default: {}, // Default empty map
    },
});

const Table = mongoose.model('Table', tableSchema);
module.exports = Table;
