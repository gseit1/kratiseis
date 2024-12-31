const mongoose = require('mongoose');
const Category = require('./category');

const shopSchema = mongoose.Schema({
    shopName:{
        type:String,
        trim:true,
        required:true,
    },

    shopDescription:{
        type:String,
        required:true,
    },

    category:{
        type:String,
        default: "",
    },

    images:[{
        type:String,
        required:true,
    }],

    location:{
        type:String,
        required:true,
    },

    address:{
        type:String,
        required:true,
    },

    phone:{
        type:String,
        required:true,
    },


    openingHours: {
        monday: {
          isOpen: { type: Boolean, default: false },
          open: { type: String, required: false },
          close: { type: String, required: false },
        },
        tuesday: {
          isOpen: { type: Boolean, default: false },
          open: { type: String, required: false },
          close: { type: String, required: false },
        },
        wednesday: {
          isOpen: { type: Boolean, default: false },
          open: { type: String, required: false },
          close: { type: String, required: false },
        },
        thursday: {
          isOpen: { type: Boolean, default: false },
          open: { type: String, required: false },
          close: { type: String, required: false },
        },
        friday: {
          isOpen: { type: Boolean, default: false },
          open: { type: String, required: false },
          close: { type: String, required: false },
        },
        saturday: {
          isOpen: { type: Boolean, default: false },
          open: { type: String, required: false },
          close: { type: String, required: false },
        },
        sunday: {
          isOpen: { type: Boolean, default: false },
          open: { type: String, required: false },
          close: { type: String, required: false },
        },
      },
      

    tables:[{
        tableNumber:{
            type:Number,
            required:false,
        },
        seats:{
            type:Number,
            required:false,
        },

        estimatedReservationTime:{
            type:String,
            required:false,
        },

        bookingHours: {
            monday: {
                isBookingAllowed: { type: Boolean, default: false }, // Αν επιτρέπονται οι κρατήσεις τη Δευτέρα
                start: { type: String, required: false }, // Ώρα έναρξης κρατήσεων τη Δευτέρα
                end: { type: String, required: false }, // Ώρα λήξης κρατήσεων τη Δευτέρα
            },
            tuesday: {
                isBookingAllowed: { type: Boolean, default: false }, // Αν επιτρέπονται οι κρατήσεις την Τρίτη
                start: { type: String, required: false }, // Ώρα έναρξης κρατήσεων την Τρίτη
                end: { type: String, required: false }, // Ώρα λήξης κρατήσεων την Τρίτη
            },
            wednesday: {
                isBookingAllowed: { type: Boolean, default: false }, // Αν επιτρέπονται οι κρατήσεις την Τετάρτη
                start: { type: String, required: false }, // Ώρα έναρξης κρατήσεων την Τετάρτη
                end: { type: String, required: false }, // Ώρα λήξης κρατήσεων την Τετάρτη
            },
            thursday: {
                isBookingAllowed: { type: Boolean, default: false }, // Αν επιτρέπονται οι κρατήσεις την Πέμπτη
                start: { type: String, required: false }, // Ώρα έναρξης κρατήσεων την Πέμπτη
                end: { type: String, required: false }, // Ώρα λήξης κρατήσεων την Πέμπτη
            },
            friday: {
                isBookingAllowed: { type: Boolean, default: false }, // Αν επιτρέπονται οι κρατήσεις την Παρασκευή
                start: { type: String, required: false }, // Ώρα έναρξης κρατήσεων την Παρασκευή
                end: { type: String, required: false }, // Ώρα λήξης κρατήσεων την Παρασκευή
            },
            saturday: {
                isBookingAllowed: { type: Boolean, default: false }, // Αν επιτρέπονται οι κρατήσεις το Σάββατο
                start: { type: String, required: false }, // Ώρα έναρξης κρατήσεων το Σάββατο
                end: { type: String, required: false }, // Ώρα λήξης κρατήσεων το Σάββατο
            },
            sunday: {
                isBookingAllowed: { type: Boolean, default: false }, // Αν επιτρέπονται οι κρατήσεις την Κυριακή
                start: { type: String, required: false }, // Ώρα έναρξης κρατήσεων την Κυριακή
                end: { type: String, required: false }, // Ώρα λήξης κρατήσεων την Κυριακή
            }
        }
        
    }],


    

});

const Shop = mongoose.model('Shop',shopSchema);
module.exports = Shop;