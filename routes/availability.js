const express = require('express');

const availabilityRouter = express.Router();

const {setAvailabilityForDate,checkAvailability}=require('../controllers/availabilityController');

availabilityRouter.get('/api/availability', checkAvailability);


module.exports= availabilityRouter;