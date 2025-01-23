const express = require('express');
const { addRegion, deleteRegion } = require('../controllers/regionController');

const regionRouter = express.Router();

// Route για προσθήκη περιοχής
regionRouter.post('/region', addRegion);

// Route για διαγραφή περιοχής
regionRouter.delete('/region/:id', deleteRegion);

module.exports = regionRouter;