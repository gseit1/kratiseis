const express = require('express');
const mongoose = require('mongoose');
const shopRouter = express.Router();
const Shop = require('../models/shop'); 
const { verifyToken, isShopOwner } = require('../middlewares/authMiddleware');

const { addShop, getAllShops, getShopById, editShop, getShopReservationList, patchBookingHoursForDay, getShopTables, getReviewsForShop ,getGeneralDetails , addPhoto,deletePhoto,getPhotos } = require('../controllers/shopController');
const { handleBookingHoursUpdate } = require('../middlewares/editsMiddleware');
const upload = require('../middlewares/multerMiddleware');

//! POST: Δημιουργία νέου καταστήματος με τα απαραιτητα πεδια
shopRouter.post('/api/shop', verifyToken, addShop);

//! GET για επιστροφη ολων των καταστηματων
shopRouter.get('/api/shop', getAllShops);

//! GET: Επιστροφή λίστας κρατήσεων για συγκεκριμένο κατάστημα
shopRouter.get('/api/shop/reservationList', verifyToken, isShopOwner, getShopReservationList);

//!GET : Επιστροφη κριτικων του καταστηματος
shopRouter.get('/api/shop/reviews', verifyToken, isShopOwner, getReviewsForShop);
// For public access to reviews
shopRouter.get('/api/shop/:shopId/reviews', getReviewsForShop);

//! GET: Επιστροφή των τραπεζιών ενός καταστήματος
shopRouter.get('/api/shop/tables', verifyToken, isShopOwner, getShopTables);

//! GET: General shop details
shopRouter.get('/api/shop/generalDetails', verifyToken, isShopOwner, getGeneralDetails);

//! Photo management routes
shopRouter.get('/api/shop/photos', verifyToken, isShopOwner, getPhotos); // Fetch photos
shopRouter.post('/api/shop/photos', verifyToken, isShopOwner, upload.single('photo'), addPhoto); // Add photo
shopRouter.delete('/api/shop/photos', verifyToken, isShopOwner, deletePhoto); // Delete photo

//! PATCH: Ενημέρωση των booking hours για συγκεκριμένη ημέρα με χρήση middleware
shopRouter.patch('/api/shop/booking-hours', verifyToken, isShopOwner, handleBookingHoursUpdate, patchBookingHoursForDay);

//! PATCH για edit επιλεγμενων πεδιων - moved after more specific routes
shopRouter.patch('/api/shop/:id', verifyToken, isShopOwner, editShop);

//! GET: Ανάκτηση ενός συγκεκριμένου καταστήματος με βάση το ID - moved to the end
shopRouter.get('/api/shop/:shopId', getShopById);

module.exports = shopRouter;