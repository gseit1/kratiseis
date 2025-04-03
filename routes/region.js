const express = require('express');
const { addRegion, deleteRegion,getAllRegions ,editRegion} = require('../controllers/regionController');

const regionRouter = express.Router();

// Route για προσθήκη περιοχής
regionRouter.post('/region', addRegion);

// Route για διαγραφή περιοχής
regionRouter.delete('/region/:id', deleteRegion);
//
regionRouter.get('/region', getAllRegions);
//
regionRouter.patch('/region/:id', editRegion);

module.exports = regionRouter;