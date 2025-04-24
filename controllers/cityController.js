const { addCityService, deleteCityService, getAllCitiesService , editCityService } = require('../services/cityServices');
const City = require('../models/city');

// Προσθήκη νέας πόλης
const addCity = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);

    const { name, latitude, longitude } = req.body;
    const image = req.file ? `/uploads/cities/${req.file.filename}` : null;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Image is required' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ success: false, message: 'Latitude and longitude are required' });
    }

    const newCity = await addCityService({
      name,
      image,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      }
    });
    res.status(201).json({ success: true, message: 'City added successfully', city: newCity });
  } catch (error) {
    console.error('Error adding city:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
// Διαγραφή πόλης
const deleteCity = async (req, res) => {
  try {
    const { id } = req.params;

    // Διαγραφή της πόλης και των σχετικών regions
    const deletedCity = await deleteCityService(id);

    if (!deletedCity) {
      return res.status(404).json({ message: 'City not found' });
    }

    res.status(200).json({ message: 'City deleted successfully' });
  } catch (error) {
    console.error('Error deleting city:', error.message);
    res.status(500).json({ message: 'Error deleting city' });
  }
};



const editCity = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, latitude, longitude } = req.body;
    const image = req.file ? `/uploads/cities/${req.file.filename}` : null;

    const updatedData = { name, image };
    if (latitude && longitude) {
      updatedData.location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };
    }

    const updatedCity = await editCityService(id, updatedData);
    res.status(200).json({ success: true, message: 'City updated successfully', city: updatedCity });
  } catch (error) {
    console.error('Error editing city:', error.message);
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

const getCityById = async (req, res) => {
  try {
    const { id } = req.params;
    const city = await City.findById(id).populate('regions');
    if (!city) {
      return res.status(404).json({ success: false, message: 'City not found' });
    }
    res.status(200).json({ success: true, city });
  } catch (error) {
    console.error('Error fetching city by ID:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addCity,
  deleteCity,
  getAllCities,
  editCity,
  getCityById,
};