const express = require('express');
const shopRouter = express.Router();
const Shop = require('../models/shop'); // Ας υποθέσουμε ότι έχεις ένα μοντέλο Shop

// POST: Δημιουργία νέου καταστήματος
shopRouter.post('/api/shop', async (req, res) => {
  const { shopName, shopDescription, category, images, location, address, phone, openingHours, tables } = req.body;

  const newShop = new Shop({
    shopName,
    shopDescription,
    category,
    images,
    location,
    address,
    phone,
    openingHours,
    tables
  });

  try {
    const savedShop = await newShop.save();
    res.status(201).json(savedShop); // Αποστολή του νέου καταστήματος ως απάντηση
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// PUT: Ενημέρωση υπάρχοντος καταστήματος με βάση το ID
shopRouter.put('/api/shop/:shopId', async (req, res) => {
  const { shopId } = req.params; // Παίρνουμε το ID από το URL
  const { shopName, shopDescription, category, images, location, address, phone, openingHours, tables } = req.body;

  try {
    // Ενημέρωση του καταστήματος με το συγκεκριμένο ID
    const updatedShop = await Shop.findByIdAndUpdate(
      shopId,
      { shopName, shopDescription, category, images, location, address, phone, openingHours, tables },
      { new: true } // Επιστροφή του ενημερωμένου καταστήματος
    );

    if (!updatedShop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    res.status(200).json(updatedShop); // Αποστολή του ενημερωμένου καταστήματος
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = shopRouter;
