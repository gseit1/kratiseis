const express = require('express');
const mongoose = require('mongoose');

const Shop = require('../models/shop');
const Table = require('../models/table');
const reservationRouter = express.Router();
const Reservation = require('../models/reservation');


const { addReservation } = require('../controllers/reservationController');

//! POST για δημιουργια κρατησης και ενημερωσης λιστων καταστηματος
reservationRouter.post('/api/reservation', addReservation);


module.exports = reservationRouter;
