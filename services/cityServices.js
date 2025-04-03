const City = require('../models/city');
const Region =require('../models/region');

// Προσθήκη νέας πόλης
const addCityService = async (cityData) => {
  const newCity = new City(cityData);
  await newCity.save();
  return newCity;
};

// Διαγραφή πόλης

const deleteCityService = async (cityId) => {
  const city = await City.findById(cityId);
  if (!city) {
    throw new Error('City not found');
  }

  // Διαγραφή όλων των regions που σχετίζονται με την πόλη
  await Region.deleteMany({ city: cityId });

  // Διαγραφή της πόλης
  await City.findByIdAndDelete(cityId);
  return city;
};


const editCityService = async (cityId, cityData) => {
  const updatedCity = await City.findByIdAndUpdate(cityId, cityData, { new: true });
  if (!updatedCity) {
    throw new Error('City not found');
  }
  return updatedCity;
};



// Επιστροφή όλων των πόλεων με τα regions populated
const getAllCitiesService = async () => {
  const cities = await City.find().populate('regions');
  return cities;
};

module.exports = {
  addCityService,
  deleteCityService,
  getAllCitiesService,
  editCityService,
};  