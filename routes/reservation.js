const express = require('express');
const { addReservation, editReservation, deleteReservation } = require('../controllers/reservationController');

const reservationRouter = express.Router();

// Route για προσθήκη κράτησης
reservationRouter.post('/api/reservation', addReservation);

// Route για επεξεργασία κράτησης
reservationRouter.put('/api/reservation/:id', editReservation);

// Route για διαγραφή κράτησης
reservationRouter.delete('/api/reservation/:id', deleteReservation);

module.exports = reservationRouter;
