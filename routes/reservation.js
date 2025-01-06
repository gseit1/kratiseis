const express = require('express');
const mongoose = require('mongoose');

const Shop = require('../models/shop');
const Table = require('../models/table');
const reservationRouter = express.Router();
const Reservation = require('../models/reservation');


const { addReservation,editReservation } = require('../controllers/reservationController');

//! POST για δημιουργια κρατησης και ενημερωσης λιστων καταστηματος
reservationRouter.post('/api/reservation', addReservation);
reservationRouter.patch('/api/reservation/:reservationId',editReservation);

module.exports = reservationRouter;
