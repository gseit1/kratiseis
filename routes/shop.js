const express = require('express');
const mongoose = require('mongoose');
const shopRouter = express.Router();
const Shop = require('../models/shop'); 

const { addShop,getAllShops,getShopById,editShop ,getShopReservationList} = require('../controllers/shopController');

//! POST: Δημιουργία νέου καταστήματος με τα απαραιτητα πεδια
shopRouter.post('/api/shop',addShop);
//!GET για επιστροφη ολων των καταστηματων
shopRouter.get('/api/shop',getAllShops);
//! GET: Ανάκτηση ενός συγκεκριμένου καταστήματος με βάση το ID
shopRouter.get('/api/shop/:shopId', getShopById);
//! PATCH για edit επιλεγμενων πεδιων
shopRouter.patch('/api/shop/:id', editShop);

//
shopRouter.get('/api/shop/reservationList/:shopId',getShopReservationList);


module.exports = shopRouter;
