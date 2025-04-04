const express = require('express');
const mongoose = require('mongoose');
const shopRouter = express.Router();
const Shop = require('../models/shop'); 

const { addShop, getAllShops, getShopById, editShop, getShopReservationList, patchBookingHoursForDay, getShopTables, getReviewsForShop ,getGeneralDetails , addPhoto,deletePhoto,getPhotos } = require('../controllers/shopController');
const { handleBookingHoursUpdate } = require('../middlewares/editsMiddleware');
const upload = require('../middlewares/multerMiddleware');


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

shopRouter.get('/api/shop/:shopId/generalDetails', getGeneralDetails);


shopRouter.get('/api/shop/:shopId/photos', getPhotos); // Fetch photos
shopRouter.post('/api/shop/:shopId/photos', upload.single('photo'), addPhoto); // Add photo
shopRouter.delete('/api/shop/:shopId/photos', deletePhoto); // Delete photo


module.exports = shopRouter;