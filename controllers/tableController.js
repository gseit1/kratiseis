const { createTable, updateTable, deleteTableService, checkAvailability,getTableByIdSe , unvalidReservationsAfterSeatsEdit, updateWhenReservationDelete, setAvailabilityForDay, invalidReservationForIsBookingAllowedEdit, initializeAvailabilityForDate, clearAvailabilityForDay, getShopReservationsForDate, getTableReservationsForDate } = require('../services/tableServices');
const { getReservationsForTable, setTableIdForReservations } = require('../services/reservationServices');
const { addReservationToUndefinedList } = require('../services/shopServices');
const Table = require('../models/table'); // Προσθήκη της εισαγωγής του Table

//! Function για add table
const addTable = async (req, res) => {
  const { shopId, tableNumber, seats, minimumSeats, estimatedReservationTime, bookingHours, availability } = req.body;

  try {
    const tableData = {
      shopId,
      tableNumber,
      seats,
      minimumSeats, // Προσθήκη του minimumSeats
      estimatedReservationTime,
      bookingHours,
      availability,
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

//! Function για edit seats ή minimumSeats
const editSeats = async (req, res) => {
  const { id } = req.params;
  const { seats, minimumSeats } = req.body; // Δέχεται και τα δύο πεδία

  try {
    // Ελέγχουμε ποιο πεδίο υπάρχει στο request
    const updateData = {};
    if (seats !== undefined) updateData.seats = seats;
    if (minimumSeats !== undefined) updateData.minimumSeats = minimumSeats;

    // Αν δεν υπάρχει κανένα από τα δύο, επιστρέφουμε σφάλμα
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No valid fields provided (seats or minimumSeats)' });
    }

    // Ενημερώνουμε το τραπέζι
    const updatedTable = await updateTable(id, updateData);

    res.status(200).json({
      success: true,
      message: 'Table updated successfully',
      updatedTable,
    });
  } catch (error) {
    console.error("Error updating seats or minimumSeats:", error);
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


const getTable = async (req, res) => {
  const { tableId } = req.params;
  console.log("Fetching table with id:", tableId);
  try {
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }
    res.status(200).json(table);
  } catch (error) {
    console.error("Error fetching table:", error);
    res.status(500).json({ message: error.message });
  }
};


const getTableAvailabilityForDate = async (req, res) => {
  const { tableId } = req.params;
  const { date } = req.query;

  try {
    const table = await Table.findById(tableId);
    if (!table) {
      return res.status(404).json({ message: "Table not found" });
    }

    const availability = table.availability[date] || [];
    res.status(200).json(availability);
  } catch (error) {
    console.error("Error fetching table availability:", error);
    res.status(500).json({ message: "Failed to fetch table availability" });
  }
};



const getReservationsForTableAndDate = async (req, res) => {
  const { tableId } = req.params;
  const { date } = req.query; // format: YYYY-MM-DD

  if (!tableId || !date) {
    return res.status(400).json({ message: 'Missing tableId or date' });
  }

  try {
    const reservations = await getTableReservationsForDate(tableId, date);
    res.json(reservations);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addTable,
  editTable,
  editSeats,
  editIsBookingAllowed,
  deleteTable,
  checkTableAvailability,
  getTable,
  getTableAvailabilityForDate,

  getReservationsForTableAndDate,
};