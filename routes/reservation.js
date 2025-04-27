const express = require('express');
const { 
  addManualReservation, 
  addUserReservation, 
  addGuestReservation,
  editReservation, 
  deleteReservation, 
  getTotalReservations, 
  changeReservationState,
  getReservationById,
  filterReservationsByState
} = require('../controllers/reservationController');
const { verifyToken, isShopOwner ,isUser} = require('../middlewares/authMiddleware');

const reservationRouter = express.Router();

// Route for manual reservation (protected for shop owners)
reservationRouter.post('/api/reservation/manual', verifyToken, isShopOwner, addManualReservation);

// Route for user reservation
reservationRouter.post('/api/reservation/user', verifyToken, addUserReservation);

// Route for guest reservation
reservationRouter.post('/api/reservation/guest', addGuestReservation);

// Route for editing a reservation
reservationRouter.put('/api/reservation/:id', editReservation);

// Route for deleting a reservation
reservationRouter.delete('/api/reservation/:id', verifyToken, isShopOwner, deleteReservation);

// Route for getting total reservations count
reservationRouter.get('/api/reservations/count', getTotalReservations);

// Route for getting a reservation by ID
reservationRouter.get('/api/reservations/:id', getReservationById);
//
reservationRouter.patch('/api/reservation/:id/state', verifyToken, isShopOwner, changeReservationState);

reservationRouter.post('/api/reservations/filter', filterReservationsByState);

module.exports = reservationRouter;