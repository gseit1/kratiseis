const express = require('express');
const Shop = require('../models/shop');
const router = express.Router();

// 1) GET όλα τα recommended shops
router.get('/recommended', async (req, res) => {
  try {
    const shops = await Shop.find({ recommended: true });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2) GET recommended shops με βάση την πόλη
router.get('/recommended/city/:cityId', async (req, res) => {
  try {
    const shops = await Shop.find({ recommended: true, city: req.params.cityId });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3) GET recommended shops με βάση πόλη και κατηγορία
router.get('/recommended/city/:cityId/category/:categoryId', async (req, res) => {
  try {
    const shops = await Shop.find({
      recommended: true,
      city: req.params.cityId,
      category: req.params.categoryId
    });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;