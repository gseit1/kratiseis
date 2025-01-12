const mongoose = require('mongoose');

const {isOpen} = require('../validators/shopValidator');

// Schema για το κατάστημα
const shopSchema = mongoose.Schema({
    shopName: {
        type: String,
        trim: true,
        required: true,
        minlength: [2, 'Shop name must be at least 3 characters'],
        maxlength: [25, 'Shop name must be at most 100 characters'],
    },

    shopDescription: {
        type: String,
        required: true,
        minlength: [10, 'Description must be at least 10 characters'],
        maxlength: [500, 'Description must be at most 500 characters'],
    },

    category: {
        type: String,
        default: "",
    },

    images: [{
        type: String,
        default: [] // Default empty array for images
    }],

    city: {
        type: String,
        required: true,
    },

    location: {
        type: { type: String, enum: ['Point'], required: true }, // Ο τύπος είναι πάντα Point
        coordinates: {
            type: [Number], // Πρώτο το μήκος (longitude), δεύτερο το πλάτος (latitude)
            required: true
        }
    },

    phone: {
        type: String,
        required: true,
        match: [
            /^(69\d{8}|2\d{2,3}\d{6,7})$/,
            'Please enter a valid phone number (either mobile or landline)'
        ],
    },

    musicCategory: {
        type: String,
        default: "", // Default value if not provided
    },

    priceRange: {
        type: String,
        default: "", // Default value if not provided
    },

    openingHours: {
        monday: {
            isOpen: { type: Boolean, default: false, required: true },
            open: { type: Number, min: 0, max: 24, required: true }, // Αριθμός μεταξύ 0 και 24
            close: { type: Number, min: 0, max: 24, required: true },
            bookingStart: { type: Number, min: 0, max: 24, required: true }, // Ώρα έναρξης κρατήσεων
            bookingEnd: { type: Number, min: 0, max: 24, required: true }, // Ώρα λήξης κρατήσεων
        },
        tuesday: {
            isOpen: { type: Boolean, default: false, required: true },
            open: { type: Number, min: 0, max: 24, required: true },
            close: { type: Number, min: 0, max: 24, required: true },
            bookingStart: { type: Number, min: 0, max: 24, required: true },
            bookingEnd: { type: Number, min: 0, max: 24, required: true },
        },
        wednesday: {
            isOpen: { type: Boolean, default: false, required: true },
            open: { type: Number, min: 0, max: 24, required: true },
            close: { type: Number, min: 0, max: 24, required: true },
            bookingStart: { type: Number, min: 0, max: 24, required: true },
            bookingEnd: { type: Number, min: 0, max: 24, required: true },
        },
        thursday: {
            isOpen: { type: Boolean, default: false, required: true },
            open: { type: Number, min: 0, max: 24, required: true },
            close: { type: Number, min: 0, max: 24, required: true },
            bookingStart: { type: Number, min: 0, max: 24, required: true },
            bookingEnd: { type: Number, min: 0, max: 24, required: true },
        },
        friday: {
            isOpen: { type: Boolean, default: false, required: true },
            open: { type: Number, min: 0, max: 24, required: true },
            close: { type: Number, min: 0, max: 24, required: true },
            bookingStart: { type: Number, min: 0, max: 24, required: true },
            bookingEnd: { type: Number, min: 0, max: 24, required: true },
        },
        saturday: {
            isOpen: { type: Boolean, default: false, required: true },
            open: { type: Number, min: 0, max: 24, required: true },
            close: { type: Number, min: 0, max: 24, required: true },
            bookingStart: { type: Number, min: 0, max: 24, required: true },
            bookingEnd: { type: Number, min: 0, max: 24, required: true },
        },
        sunday: {
            isOpen: { type: Boolean, default: false, required: true },
            open: { type: Number, min: 0, max: 24, required: true },
            close: { type: Number, min: 0, max: 24, required: true },
            bookingStart: { type: Number, min: 0, max: 24, required: true },
            bookingEnd: { type: Number, min: 0, max: 24, required: true },
        },
    },

    timeSlotSplit:{
        type:Number,
        required:true,
    },

    tables: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Table',
        default: [],
    }],

    // Ιστορικό κρατήσεων του καταστήματος
    reservationList: {
        type: Map,
        of: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reservation',
        }],
        default:{},
    },

    // Διαθεσιμότητα του καταστήματος, βασισμένη στα τραπέζια
    availableHours: {
        type: Map, // Ώρες που είναι διαθέσιμες για κάθε ημέρα
        of: [Number], // Λίστα από αριθμούς (π.χ. [12.5, 14.0, 16.0])
        default: {}, // Default empty map
    }
});

const Shop = mongoose.model('Shop', shopSchema);
module.exports = Shop;
