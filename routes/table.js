const express = require('express');
const mongoose = require('mongoose');
const tableRouter = express.Router();
const Table = require('../models/table');

const { addTable, editTable, deleteTable, editSeats, editIsBookingAllowed } = require('../controllers/tableController');

//!POST : Δημιουργια τραπεζιου απο καταστηματαρχη
tableRouter.post('/api/table', addTable);

//!PATCH : Για την μερικη ενημερωση τραπεζιου
tableRouter.patch('/api/table/:id', editTable);

//!PATCH : Για την ενημερωση των seats του τραπεζιου
tableRouter.patch('/api/table/:id/seats', editSeats);

//!PATCH : Για την ενημερωση του isBookingAllowed του τραπεζιου
tableRouter.patch('/api/table/:id/isBookingAllowed', editIsBookingAllowed);

//! DELETE για τη διαγραφή ενός τραπεζιού
tableRouter.delete('/api/table/:id', deleteTable);

module.exports = tableRouter;