const express = require('express');
const upload = require('../middlewares/multerMiddleware');
const { addCity, editCity, deleteCity, getAllCities } = require('../controllers/cityController');

const cityRouter = express.Router();

cityRouter.post('/city', upload.single('image'), addCity); // Προσθήκη πόλης με εικόνα
cityRouter.patch('/city/:id', upload.single('image'), editCity); // Επεξεργασία πόλης με εικόνα
cityRouter.delete('/city/:id', deleteCity);
cityRouter.get('/city', getAllCities);

module.exports = cityRouter;