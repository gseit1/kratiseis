const { addCityService, deleteCityService, getAllCitiesService } = require('../services/cityServices');

// Προσθήκη νέας πόλης
const addCity = async (req, res) => {
  try {
    const newCity = await addCityService(req.body);
    res.status(201).json({ success: true, message: 'City added successfully', city: newCity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Διαγραφή πόλης
const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCity = await deleteCityService(id);
    res.status(200).json({ success: true, message: 'City deleted successfully', city: deletedCity });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Επιστροφή όλων των πόλεων με τα regions populated
const getAllCities = async (req, res) => {
  try {
    const cities = await getAllCitiesService();
    res.status(200).json(cities);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addCity,
  deleteCity,
  getAllCities,
};