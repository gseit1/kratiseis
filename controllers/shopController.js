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

//! Function για επιστροφη ολων των καταστηματων
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
      // Try to get shopId from user claims first
      let shopId = req.user?.shopId;
      
      // If not found in user claims, try from params (for public access)
      if (!shopId) {
          shopId = req.params.shopId;
      }
      
      if (!shopId) {
          return res.status(400).json({ message: 'Shop ID not provided' });
      }
      
      try {
          const shop = await shopService.getShopByIdService(shopId);
          if (!shop) {
              return res.status(404).json({ message: 'Shop not found' });
          }
          res.status(200).json(shop);
      } catch (error) {
          console.error(`Shop with ID ${shopId} not found:`, error.message);
          return res.status(404).json({ message: 'Shop not found', details: error.message });
      }
  } catch (error) {
      console.error('Error in getShopById:', error);
      res.status(500).json({ message: 'Server error' });
  }
};

//! Function για edit shop
const editShop = async (req, res) => {
    try {
        // Try to get shopId from user claims first
        let shopId = req.user?.shopId;
        
        // If not found in user claims, try from params
        if (!shopId) {
            shopId = req.params.id;
        }
        
        if (!shopId) {
            return res.status(400).json({ message: 'Shop ID not provided' });
        }
        
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
      // Get shopId from user claims instead of params
      const shopId = req.user.shopId;

      if (!shopId) {
          return res.status(400).json({ 
              message: 'Shop ID not found in user profile',
              action: 'Please create a shop first'
          });
      }

      try {
          // Χρήση της υπηρεσίας για την επιστροφή της λίστας κρατήσεων
          const reservationList = await shopService.getShopReservationList(shopId);
          res.status(200).json({ reservationList });
      } catch (error) {
          if (error.message === 'Shop not found') {
              return res.status(404).json({ 
                  message: 'Your shop was not found in the system',
                  shopId: shopId,
                  action: 'You may need to create a shop first' 
              });
          }
          throw error; // Re-throw other errors
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};



//!Undefined reservationList get

const getUndefinedReservationList = async (req, res) => {
  try {
      // Get shopId from user claims
      const shopId = req.user.shopId;

      if (!shopId) {
          return res.status(400).json({ message: 'Shop ID not found in user profile' });
      }

      // Χρήση της υπηρεσίας για την επιστροφή της undefinedReservationList
      const undefinedReservations = await shopService.getUndefinedReservationList(shopId);

      res.status(200).json({ success: true, undefinedReservations });
  } catch (error) {
      console.error('Error fetching undefined reservations:', error.message);
      res.status(500).json({ success: false, message: 'Error fetching undefined reservations', error: error.message });
  }
};



//! Function για επιστροφή των τραπεζιών ενός καταστήματος
const getShopTables = async (req, res) => {
  // Get shopId from user claims
  const shopId = req.user.shopId;

  if (!shopId) {
    return res.status(400).json({ message: 'Shop ID not found in user profile' });
  }

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
  let shopId;
  
  // If user is authenticated and has shopId in profile, use that
  if (req.user && req.user.shopId) {
    shopId = req.user.shopId;
  } else {
    // Otherwise, still allow using the parameter for public access
    shopId = req.params.shopId;
  }
  
  if (!shopId) {
    return res.status(400).json({ message: 'Shop ID not provided' });
  }

  try {
    const reviews = await shopService.getShopReviews(shopId);
    res.status(200).json(reviews); // Επιστροφή των reviews στον πελάτη
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//! Function to fetch general details for a shop
//! Function to fetch general details for a shop
const getGeneralDetails = async (req, res) => {
  try {
    // Get shopId from user claims
    const shopId = req.user.shopId;
    
    if (!shopId) {
      return res.status(400).json({ 
        message: 'Shop ID not found in user profile',
        action: 'Please create a shop or contact support' 
      });
    }
    
    try {
      const shop = await shopService.getShopByIdService(shopId);
      res.status(200).json(shop);
    } catch (error) {
      // Special handling for shop not found
      if (error.message === 'Shop not found') {
        return res.status(404).json({ 
          message: 'Your shop was not found in the system',
          shopId: shopId,
          action: 'You may need to create a shop first' 
        });
      }
      throw error; // Re-throw other errors
    }
  } catch (error) {
    console.error("Error fetching general shop details:", error);
    res.status(500).json({ message: 'Error fetching shop details', error: error.message });
  }
};

const getPhotos = async (req, res) => {
  try {
    // Get shopId from user claims
    const shopId = req.user.shopId;
    
    if (!shopId) {
      return res.status(400).json({ message: 'Shop ID not found in user profile' });
    }
    
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
    // Get shopId from user claims
    const shopId = req.user.shopId;
    
    if (!shopId) {
      return res.status(400).json({ message: 'Shop ID not found in user profile' });
    }
    
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
    // Get shopId from user claims
    const shopId = req.user.shopId;
    
    if (!shopId) {
      return res.status(400).json({ message: 'Shop ID not found in user profile' });
    }
    
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

//! Function for updating booking hours for a day
const patchBookingHoursForDay = async (req, res) => {
  const { day, bookingStart: newBookingStart, bookingEnd: newBookingEnd } = req.body;
  
  // Get shopId from user claims
  const shopId = req.user.shopId;
  
  if (!shopId) {
    return res.status(400).json({ message: 'Shop ID not found in user profile' });
  }
  
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

module.exports = { 
    addShop,
    getAllShops,
    getShopById,
    editShop,
    getShopReservationList,
    getUndefinedReservationList,
    patchBookingHoursForDay,
    getShopTables,
    getReviewsForShop,
    getGeneralDetails,
    getPhotos,
    addPhoto,
    deletePhoto,
};