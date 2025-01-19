const { createTable, updateTable, deleteTableService, checkAvailability, unvalidReservationsAfterSeatsEdit, updateWhenReservationDelete, setAvailabilityForDay, invalidReservationForIsBookingAllowedEdit, initializeAvailabilityForDate, clearAvailabilityForDay } = require('../services/tableServices');
const { getReservationsForTable, setTableIdForReservations } = require('../services/reservationServices');
const { addReservationToUndefinedList } = require('../services/shopServices');
const Table = require('../models/table'); // Προσθήκη της εισαγωγής του Table

//! Function για add table
const addTable = async (req, res) => {
  const { shopId, tableNumber, seats, estimatedReservationTime, bookingHours, availability } = req.body;

  try {
    const tableData = {
      shopId,
      tableNumber,
      seats,
      estimatedReservationTime,
      bookingHours,
      availability
    };

    const newTable = await createTable(shopId, tableData);
    res.status(201).json(newTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//! Function για edit table
const editTable = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTable = await updateTable(id, updateData);
    res.json(updatedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//! Function για edit seats
const editSeats = async (req, res) => {
  const { id } = req.params;
  const { seats } = req.body;

  try {
    // Ενημερώνουμε τα seats του τραπεζιού
    const updatedTable = await updateTable(id, { seats });
    res.json(updatedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//! Function για edit isBookingAllowed
const editIsBookingAllowed = async (req, res) => {
  const { id } = req.params;
  const { day, isBookingAllowed } = req.body;

  try {
    // Βρίσκουμε το τραπέζι
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Ενημερώνουμε το isBookingAllowed για την ημέρα
    table.bookingHours[day].isBookingAllowed = isBookingAllowed;
    await table.save();

    res.status(200).json({ message: 'isBookingAllowed updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//! Function για delete table
const deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTableService(id);
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//!Function για ελεγχο διαθεσιμοτητας καταστηματος για συγκεκριμενη μερα
const checkTableAvailability = async (req, res) => {
  const { shopId, dateString, seats } = req.query;

  if (!shopId || !dateString || !seats) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters (shopId, dateString, seats)',
      availability: [],
    });
  }

  try {
    // Κλήση της υπηρεσίας checkAvailability και επιστροφή του αποτελέσματος
    const result = await checkAvailability(req);  // Αφαίρεση του res

    if (result.success) {
      return res.json({ success: true, availability: result.availability });
    }

    return res.status(404).json({ success: false, message: result.message, availability: [] });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message, availability: [] });
  }
};

module.exports = {
  addTable,
  editTable,
  editSeats,
  editIsBookingAllowed,
  deleteTable,
  checkTableAvailability,
};