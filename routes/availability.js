const express = require('express');

const availabilityRouter = express.Router();

const {checkTableAvailability}=require('../controllers/tableController');

availabilityRouter.get('/api/availability', checkTableAvailability);


module.exports= availabilityRouter;