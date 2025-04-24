const express = require('express');
const upload = require('../middlewares/multerMiddleware');
const { addCity, editCity, deleteCity, getAllCities, getCityById } = require('../controllers/cityController');
const City = require('../models/city');

const cityRouter = express.Router();

cityRouter.post('/city', upload.single('image'), addCity); // Accepts latitude and longitude in the body
cityRouter.patch('/city/:id', upload.single('image'), editCity); // Accepts latitude and longitude in the body
cityRouter.delete('/city/:id', deleteCity);
cityRouter.get('/city', getAllCities);
cityRouter.get('/city/:id', getCityById); // Fetch a city by its ID

module.exports = cityRouter;