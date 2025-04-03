const express = require('express');
const { addReservation, editReservation, deleteReservation ,getTotalReservations,getReservationById} = require('../controllers/reservationController');
const { verifyToken, isShopOwner } = require('../middlewares/authMiddleware');

const reservationRouter = express.Router();

// Route για προσθήκη κράτησης (ανοικτό ή μπορείτε να το προστατέψετε ανάλογα με τις ανάγκες)
reservationRouter.post('/api/reservation', addReservation);

// Route για επεξεργασία κράτησης
reservationRouter.put('/api/reservation/:id', editReservation);

// Route για διαγραφή κράτησης (προστατευμένο για shop owners)
reservationRouter.delete('/api/reservation/:id', verifyToken, isShopOwner, deleteReservation);
//
reservationRouter.get('/api/reservations/count', getTotalReservations);
//
reservationRouter.get('/api/reservations/:id', getReservationById);

module.exports = reservationRouter;