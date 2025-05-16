const Shop = require('../models/shop');


// Αναζήτηση καταστημάτων με βάση την πόλη
const searchShopsByCityService = async (cityId) => {
  try {
    const shops = await Shop.find({ city: cityId }).select('_id shopName reviewRatingAverage images address location category');
    return shops.map(shop => ({
      id: shop._id,
      shopName: shop.shopName,
      reviewRatingAverage: shop.reviewRatingAverage,
      image: shop.images[0] || null,
      images: shop.images,
      address: shop.address,
      location: shop.location,
      category: shop.category,
    }));
  } catch (error) {
    throw new Error('Error fetching shops by city: ' + error.message);
  }
};

//* Αναζήτηση καταστημάτων με βάση την πόλη και την περιοχή
const searchShopsByCityAndRegionService = async (cityId, regionId) => {
  try {
    const shops = await Shop.find({ city: cityId, region: regionId }).select('_id shopName reviewRatingAverage images');
    return shops.map(shop => ({
      id: shop._id,
      shopName: shop.shopName,
      location:shop.location,
      address:shop.address,
      category:shop.category,
      reviewRatingAverage: shop.reviewRatingAverage,
      image: shop.images[0] || null,
    }));
  } catch (error) {
    throw new Error('Error fetching shops by city and region: ' + error.message);
  }
};

// Αναζήτηση καταστημάτων με βάση την πόλη και την κατηγορία
const searchShopsByCityAndCategoryService = async (cityId, categoryId) => {
  try {
    const shops = await Shop.find({ city: cityId, category: categoryId }).select('_id shopName reviewRatingAverage images address location category');
    return shops.map(shop => ({
      id: shop._id,
      shopName: shop.shopName,
      reviewRatingAverage: shop.reviewRatingAverage,
      image: shop.images[0] || null,
      images: shop.images,
      address: shop.address,
      location: shop.location,
      category: shop.category,
    }));
  } catch (error) {
    throw new Error('Error fetching shops by city and category: ' + error.message);
  }
};

// Αναζήτηση καταστημάτων με βάση την πόλη, την περιοχή και την κατηγορία
const searchShopsByCityRegionAndCategoryService = async (cityId, regionId, categoryId) => {
  try {
    const shops = await Shop.find({ city: cityId, region: regionId, category: categoryId }).select('_id shopName reviewRatingAverage images');
    return shops.map(shop => ({
      id: shop._id,
      shopName: shop.shopName,
      reviewRatingAverage: shop.reviewRatingAverage,
      image: shop.images[0] || null,
    }));
  } catch (error) {
    throw new Error('Error fetching shops by city, region, and category: ' + error.message);
  }
};

module.exports = {
 
  searchShopsByCityService,
  searchShopsByCityAndRegionService,
  searchShopsByCityAndCategoryService,
  searchShopsByCityRegionAndCategoryService,
};