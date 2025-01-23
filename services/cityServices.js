const City = require('../models/city');

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
  await City.findByIdAndDelete(cityId);
  return city;
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
};