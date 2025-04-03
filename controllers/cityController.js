const { addCityService, deleteCityService, getAllCitiesService , editCityService } = require('../services/cityServices');

// Προσθήκη νέας πόλης
const addCity = async (req, res) => {
  try {
    const cityData = req.body; // Λαμβάνει τα δεδομένα από το αίτημα
    const newCity = await addCityService(cityData); // Καλεί την υπηρεσία
    res.status(201).json({ success: true, message: 'City added successfully', city: newCity });
  } catch (error) {
    console.error(error);
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
    const updatedCity = await editCityService(id, req.body);
    res.status(200).json({ success: true, message: 'City updated successfully', city: updatedCity });
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
  editCity,
};