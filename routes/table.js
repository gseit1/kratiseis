const express = require('express');
const mongoose = require('mongoose');
const tableRouter = express.Router();
const Table = require('../models/table');

const { addTable, editTable, deleteTable, editSeats, editIsBookingAllowed,getTable , getTableAvailabilityForDate } = require('../controllers/tableController');
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
//!GET: για επιστροφη πληροφωριων τραπεζιου
tableRouter.get('/api/table/:tableId', getTable);

//!GET gia availability
tableRouter.get('/api/table/:tableId/availability',getTableAvailabilityForDate);

module.exports = tableRouter;