const express = require('express');
const mongoose = require('mongoose');
const tableRouter = express.Router();
const Table = require('../models/table');

const {addTable,editTable,deleteTable} = require('../controllers/tableController');

//!POST : Δημιουργια τραπεζιου απο καταστηματαρχη
tableRouter.post('/api/table', addTable);

  

//!PATCH : Για την μερικη ενημερωση τραπεζιου
tableRouter.patch('/api/table/:id', editTable);

//! DELETE για τη διαγραφή ενός τραπεζιού
tableRouter.delete('/api/table/:id', deleteTable);

  module.exports = tableRouter
  