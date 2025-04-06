const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema(
    {
        reservationDate: {
            type: Date, // Η ημερομηνία της κράτησης
            required: true,
        },
        reservationTime: {
            type: Number, // Ώρα έναρξης (π.χ., 18.5 για 18:30)
            min: 0,
            max: 24,
            required: true,
        },
        shopName: {
            type: String, // Όνομα καταστήματος
            required: true,
        },
        name: {
            type: String, // Όνομα χρήστη
            required: true,
        },

        surname:{
            type:String,
            required:true,
        },

        shopId: {
            type: mongoose.Schema.Types.ObjectId, // Αναφορά στο κατάστημα
            ref: 'Shop',
            required: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, // Αναφορά στον χρήστη
            ref: 'User',
            required: false,
            default: null,
        },
        tableId: {
            type: mongoose.Schema.Types.ObjectId, // Αναφορά στο τραπέζι
            ref: 'Table',
            required: false,
            default: null,
        },
        commentFromUser: {
            type: String,
            default: '',
            maxlength: 200, // Μέγιστο μήκος σχολίου
        },

        seats: {
            type:Number,
            required:true,
        },
    },


);

// Προσθήκη index για βελτίωση αναζητήσεων
//reservationSchema.index({ shopId: 1, reservationDate: 1, tableId: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
