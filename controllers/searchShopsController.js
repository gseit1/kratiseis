const {
  
  searchShopsByCityService,
  searchShopsByCityAndRegionService,
  searchShopsByCityAndCategoryService,
  searchShopsByCityRegionAndCategoryService,
} = require('../services/searchShopsServices');



// Αναζήτηση καταστημάτων με βάση την πόλη
const searchShopsByCity = async (req, res) => {
  const { cityId } = req.params;

  try {
    const shops = await searchShopsByCityService(cityId);
    if (shops.length === 0) {
      return res.status(404).json({ message: 'No shops found for this city' });
    }
    res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Αναζήτηση καταστημάτων με βάση την πόλη και την περιοχή
const searchShopsByCityAndRegion = async (req, res) => {
  const { cityId, regionId } = req.params;

  try {
    const shops = await searchShopsByCityAndRegionService(cityId, regionId);
    if (shops.length === 0) {
      return res.status(404).json({ message: 'No shops found for this city and region' });
    }
    res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Αναζήτηση καταστημάτων με βάση την πόλη και την κατηγορία
const searchShopsByCityAndCategory = async (req, res) => {
  const { cityId, categoryId } = req.params;

  try {
    const shops = await searchShopsByCityAndCategoryService(cityId, categoryId);
    if (shops.length === 0) {
      return res.status(404).json({ message: 'No shops found for this city and category' });
    }
    res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Αναζήτηση καταστημάτων με βάση την πόλη, την περιοχή και την κατηγορία
const searchShopsByCityRegionAndCategory = async (req, res) => {
  const { cityId, regionId, categoryId } = req.params;

  try {
    const shops = await searchShopsByCityRegionAndCategoryService(cityId, regionId, categoryId);
    if (shops.length === 0) {
      return res.status(404).json({ message: 'No shops found for this city, region, and category' });
    }
    res.status(200).json(shops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  
  searchShopsByCity,
  searchShopsByCityAndRegion,
  searchShopsByCityAndCategory,
  searchShopsByCityRegionAndCategory,
};