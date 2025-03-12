const express = require('express');
const mongoose = require('mongoose');
const shopRouter = express.Router();
const Shop = require('../models/shop'); 

const { addShop, getAllShops, getShopById, editShop, getShopReservationList, patchBookingHoursForDay, getShopTables, getReviewsForShop } = require('../controllers/shopController');
const { handleBookingHoursUpdate } = require('../middlewares/editsMiddleware');

//! POST: Δημιουργία νέου καταστήματος με τα απαραιτητα πεδια
shopRouter.post('/api/shop', addShop);

//! GET για επιστροφη ολων των καταστηματων
shopRouter.get('/api/shop', getAllShops);

//! GET: Ανάκτηση ενός συγκεκριμένου καταστήματος με βάση το ID
shopRouter.get('/api/shop/:shopId', getShopById);

//! PATCH για edit επιλεγμενων πεδιων
shopRouter.patch('/api/shop/:id', editShop);

//! GET: Επιστροφή λίστας κρατήσεων για συγκεκριμένο κατάστημα
shopRouter.get('/api/shop/reservationList/:shopId', getShopReservationList);

//! PATCH: Ενημέρωση των booking hours για συγκεκριμένη ημέρα με χρήση middleware
shopRouter.patch('/api/shop/:shopId/booking-hours',handleBookingHoursUpdate, patchBookingHoursForDay);

//! GET: Επιστροφή των τραπεζιών ενός καταστήματος
shopRouter.get('/api/shop/:shopId/tables', getShopTables);

//!GET : Επιστροφη κριτικων του καταστηματος
shopRouter.get('/api/shop/:shopId/reviews',getReviewsForShop)

module.exports = shopRouter;