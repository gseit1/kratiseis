const {
  
  searchShopsByCityService,
  searchShopsByCityAndRegionService,
  searchShopsByCityAndCategoryService,
  searchShopsByCityRegionAndCategoryService,
  searchShopsWithAvailabilityService,
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

// Νέα: Αναζήτηση καταστημάτων με φίλτρο διαθεσιμότητας
const searchShopsWithAvailability = async (req, res) => {
  try {
    const { cityId, regionId, categoryId, date, time, partySize } = req.query;

    if (!cityId || !date || !time || !partySize) {
      return res.status(400).json({ 
        message: 'City, date, time, and party size are required for availability search' 
      });
    }

    // Μετατροπή ώρας από μορφή HH:mm σε δεκαδικό
    const [hours, minutes] = time.split(':');
    const reservationTime = parseInt(hours) + (parseInt(minutes) / 60);

    const shops = await searchShopsWithAvailabilityService({
      cityId,
      regionId: regionId || null,
      categoryId: categoryId || null,
      date,
      time: reservationTime,
      partySize: parseInt(partySize)
    });

    if (shops.length === 0) {
      return res.status(200).json({ 
        message: 'No shops with available tables found for your criteria',
        shops: []
      });
    }

    res.status(200).json({ shops });
  } catch (error) {
    console.error('Error in searchShopsWithAvailability:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  
  searchShopsByCity,
  searchShopsByCityAndRegion,
  searchShopsByCityAndCategory,
  searchShopsByCityRegionAndCategory,
  searchShopsWithAvailability,
};