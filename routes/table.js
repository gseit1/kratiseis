const express = require('express');
const mongoose = require('mongoose');
const tableRouter = express.Router();
const Table = require('../models/table');

const { addTable, editTable, deleteTable, editSeats, editIsBookingAllowed } = require('../controllers/tableController');
const { handleSeatsUpdate, handleIsBookingAllowedUpdate, handleTableDeletion } = require('../middlewares/editsMiddleware');

//!POST : Δημιουργια τραπεζιου απο καταστηματαρχη
tableRouter.post('/api/table', addTable);

//!PATCH : Για την μερικη ενημερωση τραπεζιου
tableRouter.patch('/api/table/:id', editTable);

//!PATCH : Για την ενημερωση των seats του τραπεζιου με χρήση middleware
tableRouter.patch('/api/table/:id/seats', handleSeatsUpdate, editSeats);

//!PATCH : Για την ενημερωση του isBookingAllowed του τραπεζιου με χρήση middleware
tableRouter.patch('/api/table/:id/isBookingAllowed', handleIsBookingAllowedUpdate, editIsBookingAllowed);

//! DELETE για τη διαγραφή ενός τραπεζιού με χρήση middleware
tableRouter.delete('/api/table/:id', handleTableDeletion, deleteTable);

module.exports = tableRouter;