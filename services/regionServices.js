const Region = require('../models/region');
const City = require('../models/city');

// Προσθήκη νέας περιοχής
const addRegionService = async (regionData) => {
  const newRegion = new Region(regionData);
  await newRegion.save();

  // Ενημέρωση της πόλης με τη νέα περιοχή
  const city = await City.findById(regionData.city);
  if (!city) {
    throw new Error('City not found');
  }
  city.regions.push(newRegion._id);
  await city.save();

  return newRegion;
};

// Διαγραφή περιοχής
const deleteRegionService = async (regionId) => {
  const region = await Region.findById(regionId);
  if (!region) {
    throw new Error('Region not found');
  }

  // Ενημέρωση της πόλης για τη διαγραφή της περιοχής
  const city = await City.findById(region.city);
  if (!city) {
    throw new Error('City not found');
  }
  city.regions = city.regions.filter(regionIdRef => regionIdRef.toString() !== region._id.toString());
  await city.save();

  await Region.findByIdAndDelete(regionId);
  return region;
};

const editRegionService = async (regionId, regionData) => {
  const updatedRegion = await Region.findByIdAndUpdate(regionId, regionData, { new: true });
  if (!updatedRegion) {
    throw new Error('Region not found');
  }
  return updatedRegion;
};

const getAllRegionsService= async () => {
  const regions = await Region.find().populate('city', 'name');
  return regions;
};

module.exports = {
  addRegionService,
  deleteRegionService,
  getAllRegionsService,
  editRegionService,
};