const shopService = require('../services/shopServices');
const tableService = require('../services/tableServices');
const reservationService = require('../services/reservationServices');
const Reservation = require('../models/reservation');
const mongoose = require('mongoose');

//! Function για προσθηκη μαγαζιου
const addShop = async (req, res) => {
    try {
        const newShop = await shopService.addShopService(req.body);
        res.status(201).json({ message: "Shop created successfully!", shop: newShop });
    } catch (error) {
        res.status(400).json({ message: "Error creating shop", error });
    }
};

//! Function για patch booking hours για συγκεκριμένη ημέρα
const patchBookingHoursForDay = async (req, res) => {
    const { shopId } = req.params;
    const { day, newBookingStart, newBookingEnd } = req.body;
  
    try {
      // Βρίσκουμε το κατάστημα
      const shop = await shopService.getShopByIdService(shopId);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
  
      // Ενημερώνουμε τις νέες τιμές για την ημέρα
      shop.openingHours[day].bookingStart = newBookingStart;
      shop.openingHours[day].bookingEnd = newBookingEnd;
      await shop.save();
  
      res.status(200).json({ message: 'Booking hours updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

//! function για επιστροφη ολων των καταστηματων
const getAllShops = async (req, res) => {
    try {
        const shops = await shopService.getAllShopsService();
        if (shops.length === 0) {
            return res.status(404).json({ message: 'No shops found' });
        }
        res.status(200).json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//! Function για επιστροφη συγκεκριμενου καταστηματος
const getShopById = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const shop = await shopService.getShopByIdService(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//! Function για edit shop
const editShop = async (req, res) => {
    try {
        const shopId = req.params.id;
        const updatedData = req.body;
        const updatedShop = await shopService.editShop(shopId, updatedData);
        res.status(200).json(updatedShop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getShopReservationList = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Χρήση της υπηρεσίας για την επιστροφή της λίστας κρατήσεων
        const reservationList = await shopService.getShopReservationList(shopId);

        res.status(200).json({ reservationList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//! Function για επιστροφή των τραπεζιών ενός καταστήματος
const getShopTables = async (req, res) => {
  const { shopId } = req.params;

  try {
    const tables = await tableService.getTablesByShopId(shopId);
    res.status(200).json(tables);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


//! Function για επιστροφή των κριτικών ενός καταστήματος

const getReviewsForShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const reviews = await shopService.getShopReviews(shopId);
    res.status(200).json(reviews); // Επιστροφή των reviews στον πελάτη
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




module.exports = { 
    addShop,
    getAllShops,
    getShopById,
    editShop,
    getShopReservationList,
    patchBookingHoursForDay,
    getShopTables,
    getReviewsForShop,
};