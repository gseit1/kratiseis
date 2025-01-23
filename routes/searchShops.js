const express = require('express');
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

module.exports = searchShopsRouter;