const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    reservationDate: {
        type: Date, // Η ημερομηνία της κράτησης
        required: true,
    },

    reservationTime: {
        type: Number, // Ώρα έναρξης
        min:0,
        max:24,
        required: true,
    },

    shopName: {
        type: String, // Όνομα καταστήματος
        required: true,
    },

    userName: {
        type: String, // Όνομα χρήστη
        required: true,
    },

    shopId: {
        type: mongoose.Schema.Types.ObjectId, // shopId ως ObjectId για να συνδεθεί με το κατάστημα
        ref: 'Shop', // Αναφορά στο Shop schema
        required: true,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId, // userId ως ObjectId για να συνδεθεί με το χρήστη
        ref: 'User', // Αναφορά στο User schema
        required: false,
    },

    tableId: {
        type: mongoose.Schema.Types.ObjectId, // Αριθμός τραπεζιού
        ref:'Table',//Αναφορα στο tableSchema
        required: false,
    },

    // Σχολιο κρατησης
    commentFromUser: {
        type: String, // Πεδίο για πρόσθετα αιτήματα από τον πελάτη (π.χ. "θέλω να έχω ένα παράθυρο")
        default: '',
    },

// Ημερομηνία δημιουργίας της κράτησης
    createdAt: {
        type: Date,
        default: Date.now, 
    },



});

const Reservation = mongoose.model('Reservation', reservationSchema);
module.exports = Reservation;
