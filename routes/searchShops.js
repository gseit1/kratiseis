const express = require('express');
const Shop = require('../models/shop');


const {
  searchShopsByCity,
  searchShopsByCityAndRegion,
  searchShopsByCityAndCategory,
  searchShopsByCityRegionAndCategory,
} = require('../controllers/searchShopsController');

const searchShopsRouter = express.Router();


// Route για αναζήτηση καταστημάτων με βάση την πόλη
searchShopsRouter.get('/search/city/:cityId', searchShopsByCity);

// Route για αναζήτηση καταστημάτων με βάση την πόλη και την περιοχή
searchShopsRouter.get('/search/city/:cityId/region/:regionId', searchShopsByCityAndRegion);

// Route για αναζήτηση καταστημάτων με βάση την πόλη και την κατηγορία
searchShopsRouter.get('/search/city/:cityId/category/:categoryId', searchShopsByCityAndCategory);

// Route για αναζήτηση καταστημάτων με βάση την πόλη, την περιοχή και την κατηγορία
searchShopsRouter.get('/search/city/:cityId/region/:regionId/category/:categoryId', searchShopsByCityRegionAndCategory);

// Route για αναζήτηση καταστημάτων για χρήση χάρτη
searchShopsRouter.get('/search/city/:cityId/mapUse', async (req, res) => {
    const { cityId } = req.params;

    try {
        const shops = await Shop.find({ city: cityId }).select('_id shopName shopDescription images location');
        res.status(200).json(shops);
    } catch (error) {
        console.error('Error fetching shops for map:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = searchShopsRouter;