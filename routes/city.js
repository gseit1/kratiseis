const express = require('express');
const { addCity, deleteCity, getAllCities ,editCity} = require('../controllers/cityController');

const cityRouter = express.Router();

// Route για προσθήκη πόλης
cityRouter.post('/city', addCity);

// Route για διαγραφή πόλης
cityRouter.delete('/city/:id', deleteCity);

// Route για επιστροφή όλων των πόλεων με τα regions populated
cityRouter.get('/city', getAllCities);

cityRouter.patch('/city/:id', editCity);

module.exports = cityRouter;