const shopService = require('../services/shopServices');
const tableService = require('../services/tableServices');
const reservationService = require('../services/reservationServices');
const Reservation = require('../models/reservation');
const Table = require('../models/table');
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
  const { day, bookingStart: newBookingStart, bookingEnd: newBookingEnd, openingStart: newOpeningStart, openingEnd: newOpeningEnd } = req.body;

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

    // Αν δοθούν νέα opening hours, ενημέρωσέ τα
    if (typeof newOpeningStart !== 'undefined' && typeof newOpeningEnd !== 'undefined') {
      shop.openingHours[day].open = newOpeningStart;
      shop.openingHours[day].close = newOpeningEnd;
    }

    // Έλεγχος ότι τα booking hours είναι εντός των opening hours
    const openingStart = typeof newOpeningStart !== 'undefined' ? newOpeningStart : shop.openingHours[day].open;
    const openingEnd = typeof newOpeningEnd !== 'undefined' ? newOpeningEnd : shop.openingHours[day].close;

    if (
      typeof newBookingStart !== 'undefined' &&
      typeof newBookingEnd !== 'undefined'
    ) {
      if (
        Number(newBookingStart) < Number(openingStart) ||
        Number(newBookingEnd) > Number(openingEnd)
      ) {
        return res.status(400).json({
          message: 'Booking hours must be within opening hours',
          openingStart,
          openingEnd,
          bookingStart: newBookingStart,
          bookingEnd: newBookingEnd,
        });
      }
      shop.openingHours[day].bookingStart = newBookingStart;
      shop.openingHours[day].bookingEnd = newBookingEnd;
    }

    await shop.save();

    res.status(200).json({ message: 'Booking and/or opening hours updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//! Function για ενημέρωση της κατάστασης "προτεινόμενο" ενός καταστήματος
const patchShopRecommendedState = async (req, res) => {
    try {
        const { shopId } = req.params;
        const { recommended } = req.body;
        if (typeof recommended !== 'boolean') {
            return res.status(400).json({ message: 'Recommended must be boolean' });
        }
        const shop = await shopService.patchShopRecommendedState(shopId, recommended);
        res.status(200).json(shop);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ΝΕΑ ΣΥΝΑΡΤΗΣΗ: Booking settings για συγκεκριμένη ημερομηνία
const getBookingSettingsForDate = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { date } = req.query; // π.χ. "2024-06-01"
    const shop = await Shop.findById(shopId).lean();
    if (!shop) return res.status(404).json({ message: 'Shop not found' });

    // Αν δεν δοθεί ημερομηνία, επιστρέφει τα default settings
    if (!date) {
      return res.json({
        bookingStart: shop.bookingStart,
        bookingEnd: shop.bookingEnd,
        timeSlotSplit: shop.timeSlotSplit
      });
    }

    // Βρες τύπο ημέρας (π.χ. "monday", "tuesday" κλπ) με native JS
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const daySettings = shop.openingHours && shop.openingHours[dayOfWeek];

    res.json({
      bookingStart: daySettings?.bookingStart ?? shop.bookingStart,
      bookingEnd: daySettings?.bookingEnd ?? shop.bookingEnd,
      timeSlotSplit: shop.timeSlotSplit
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getTableAvailabilityForDateTime = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { date, time } = req.query;

    console.log('--- getTableAvailabilityForDateTime called ---');
    console.log('shopId:', shopId);
    console.log('date:', date, 'time:', time);

    if (!date || !time) {
      console.log('Missing date or time');
      return res.status(400).json({ message: 'Missing date or time' });
    }

    // Βρες όλα τα τραπέζια του shop
    const tables = await Table.find({ shopId: new mongoose.Types.ObjectId(shopId) }).lean();
    console.log('tables found:', tables.length);

    // Βρες όλες τις κρατήσεις για αυτή τη μέρα για το shop
    const reservations = await Reservation.find({
      shopId: new mongoose.Types.ObjectId(shopId),
      reservationDate: new Date(date),
      state: { $ne: "cancelled" }
    }).lean();
    console.log('reservations found:', reservations.length);

    // Μετατροπή ώρας σε λεπτά για εύκολη σύγκριση
    const [targetHour, targetMin] = time.split(':').map(Number);
    const targetMinutes = targetHour * 60 + targetMin;
    console.log('targetMinutes:', targetMinutes);

    // Για κάθε τραπέζι, έλεγξε διαθεσιμότητα και κρατήσεις
    const result = tables.map(table => {
      let status = "unavailable";

      // 1. Έλεγχος availability του τραπεζιού
      const tableAvailability = table.availability?.[date];
      if (tableAvailability && Array.isArray(tableAvailability)) {
        const isAvailable = tableAvailability.some(slot => {
          // Μετατροπή αριθμητικού slot σε λεπτά
          const slotMinutes = Math.round(slot * 60); // π.χ. 10.25 -> 615 λεπτά
          return slotMinutes === targetMinutes;
        });

        if (isAvailable) {
          status = "available";
        }
      }

      // 2. Έλεγχος κρατήσεων
      if (status !== "available") {
        const tableReservations = reservations.filter(r =>
          r.tableId && r.tableId.toString() === table._id.toString()
        );

        for (const r of tableReservations) {
          const [startH, startM] = r.reservationTime.toString().split(':').map(Number);
          const startMin = startH * 60 + startM;
          const endMin = startMin + (table.estimatedReservationTime || 120); // Default 2 ώρες

          if (targetMinutes >= startMin && targetMinutes < endMin) {
            status = "reserved";
            break;
          }
        }
      }

      return {
        tableId: table._id.toString(),
        status
      };
    });

    console.log('result:', result);
    res.json(result);
  } catch (err) {
    console.error('Error in getTableAvailabilityForDateTime:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
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
    patchShopRecommendedState,
    getBookingSettingsForDate,
    getTableAvailabilityForDateTime,
};