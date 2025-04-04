const shopService = require('../services/shopServices');
const tableService = require('../services/tableServices');
const reservationService = require('../services/reservationServices');
const Reservation = require('../models/reservation');
const mongoose = require('mongoose');
const Shop = require('../models/shop');

//! Function για προσθηκη μαγαζιου
const addShop = async (req, res) => {
    console.log('addShop called');
    console.log('Request body:', req.body);

    try {
        const shop = new Shop(req.body);
        await shop.save();
        console.log('Shop created successfully:', shop);
        res.status(201).json({ message: 'Shop created successfully', shop });
    } catch (error) {
        console.error('Error creating shop:', error.message);
        res.status(500).json({ message: 'Error creating shop', error: error.message });
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

//!
async function getGeneralDetails() {
    try {
      const response = await fetch(`/api/shop/${shopId}`);
      if (!response.ok) throw new Error("Failed to fetch shop details");
      const shop = await response.json();
  
      // Update the fields with the populated data
      document.getElementById("shopName").value = shop.shopName || 'N/A';
      document.getElementById("shopDescription").value = shop.shopDescription || 'N/A';
      document.getElementById("shopPhone").value = shop.phone || 'N/A';
      document.getElementById("shopCity").value = shop.city?.name || 'N/A'; // Use the populated city name
      document.getElementById("shopRegion").value = shop.region?.name || 'N/A'; // Use the populated region name
      document.getElementById("shopCategory").value = shop.category?.name || 'N/A'; // Use the populated category name
  
      // Display opening hours
      const openingHoursDiv = document.getElementById("shopOpeningHours");
      openingHoursDiv.innerHTML = Object.entries(shop.openingHours || {})
        .map(([day, hours]) => `
          <p>
            <strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> 
            ${hours.isOpen ? `${hours.open}:00 - ${hours.close}:00` : 'Closed'}
          </p>
        `)
        .join('');
    } catch (error) {
      console.error("Error fetching general shop details:", error);
    }
  }


  const getPhotos = async (req, res) => {
    try {
      const { shopId } = req.params;
      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: 'Shop not found' });
      res.status(200).json(shop.images || []); // Use `images` instead of `photos`
    } catch (error) {
      console.error('Error fetching images:', error.message);
      res.status(500).json({ message: 'Error fetching images' });
    }
  };
  
  const addPhoto = async (req, res) => {
    try {
      const { shopId } = req.params;
      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: 'Shop not found' });
  
      const photoPath = `/uploads/shops/${req.file.filename}`;
      shop.images = shop.images || []; // Use `images` instead of `photos`
      shop.images.push(photoPath);
      await shop.save();
  
      res.status(201).json({ message: 'Image added successfully', url: photoPath });
    } catch (error) {
      console.error('Error adding image:', error.message);
      res.status(500).json({ message: 'Error adding image' });
    }
  };
  
  const deletePhoto = async (req, res) => {
    try {
      const { shopId } = req.params;
      const { photo } = req.body;
      const shop = await Shop.findById(shopId);
      if (!shop) return res.status(404).json({ message: 'Shop not found' });
  
      shop.images = shop.images.filter((p) => p !== photo); // Use `images` instead of `photos`
      await shop.save();
  
      res.status(200).json({ message: 'Image deleted successfully' });
    } catch (error) {
      console.error('Error deleting image:', error.message);
      res.status(500).json({ message: 'Error deleting image' });
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
    getGeneralDetails,
    getPhotos,
    addPhoto,
    deletePhoto,
 
};