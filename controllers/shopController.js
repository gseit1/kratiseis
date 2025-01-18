const Shop  = require('../models/shop');
const shopService = require('../services/shopServices');
const tableService = require('../services/tableServices'); // Προσθήκη της εισαγωγής της tableService
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
  
      // Βρίσκουμε τα τραπέζια του καταστήματος
      const tables = await tableService.getTablesByShopId(shopId);
  
      // Βρίσκουμε τις κρατήσεις που δεν υποστηρίζονται από την αλλαγή
      for (const table of tables) {
        const reservationsResult = await reservationService.getReservationsForTable(table._id);
        if (reservationsResult.success && reservationsResult.reservations.length > 0) {
          const invalidReservations = reservationService.checkInvalidReservationsWhenBookingHoursChange(reservationsResult.reservations, newBookingStart, newBookingEnd);
          if (invalidReservations.length > 0) {
            await reservationService.setTableIdForReservations(invalidReservations.map(reservation => reservation._id));
            for (const reservation of invalidReservations) {
              await shopService.addReservationToUndefinedList(reservation.shopId, reservation._id);
            }
          }
        }
  
        // Ενημερώνουμε τη διαθεσιμότητα των τραπεζιών
        await tableService.updateAvailabilityForBookingHoursEdit(table._id, day, newBookingStart, newBookingEnd);
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

module.exports = { 
    addShop,
    getAllShops,
    getShopById,
    editShop,
    getShopReservationList,
    patchBookingHoursForDay, // Προσθήκη της νέας συνάρτησης στο export
    getShopTables, // Προσθήκη της νέας συνάρτησης στο export
};
