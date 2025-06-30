const express = require('express');
const { addRegion, deleteRegion,getAllRegions ,editRegion} = require('../controllers/regionController');

const regionRouter = express.Router();

// Route για προσθήκη περιοχής
regionRouter.post('/api/region', addRegion);

// Route για διαγραφή περιοχής
regionRouter.delete('/api/region/:id', deleteRegion);
//
regionRouter.get('/api/region', getAllRegions);
//
regionRouter.patch('/api/region/:id', editRegion);

module.exports = regionRouter;