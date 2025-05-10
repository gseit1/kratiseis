const Table = require('../models/table');
const Reservation = require('../models/reservation');
const { addReservationService, editReservationService, deleteReservationService } = require('../services/reservationServices');
const { addToReservationList, deleteToReservationList } = require('../services/shopServices');
const { findBestAvailableTable, updateTableAvailability } = require('../services/tableServices');
const { addReservationToUserHistory, removeReservationFromUserHistory } = require('../services/userServices');
const User = require('../models/user'); // Import User model

// Δημιουργία νέας manual κράτησης
const addManualReservation = async (req, res) => {
  try {
    console.log("🔹 Received manual reservation request:", req.body);
    const reservationData = req.body;

    // Ελέγχουμε αν έχουν δοθεί όλα τα απαραίτητα δεδομένα
    if (!reservationData.shopId || !reservationData.reservationDate || !reservationData.reservationTime || !reservationData.seats) {
      throw new Error("Missing required fields for manual reservation");
    }

    // Βρίσκουμε το καταλληλότερο διαθέσιμο τραπέζι
    const bestTable = await findBestAvailableTable(
      reservationData.shopId,
      reservationData.reservationDate,
      reservationData.reservationTime,
      reservationData.seats
    );

    if (!bestTable) {
      console.warn("⚠️ No available table found for manual reservation");
      throw new Error("No available table found");
    }

    console.log("✅ Best table found for manual reservation:", bestTable);

    // Προσθέτουμε το tableId στο reservationData
    reservationData.tableId = bestTable._id;

    // Ορίζουμε το state ως "accepted"
    reservationData.state = 'accepted';

    // Δημιουργούμε την κράτηση
    const newReservation = await addReservationService(reservationData);
    console.log("✅ Manual reservation created:", newReservation);

    // Ενημέρωση της λίστας κρατήσεων
    console.log("🔹 Updating reservation list for shop:", reservationData.shopId);
    await addToReservationList(
      reservationData.shopId,
      reservationData.reservationDate,
      newReservation._id.toString()
    );

    // Ενημέρωση της διαθεσιμότητας του τραπεζιού
    await updateTableAvailability(
      reservationData.tableId,
      reservationData.reservationDate,
      reservationData.reservationTime
    );

    console.log("✅ Table availability updated successfully for manual reservation");

    res.status(201).json({ success: true, message: "Manual reservation added successfully", reservation: newReservation });
  } catch (error) {
    console.error("❌ Error in addManualReservation:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Δημιουργία νέας user κράτησης
const addUserReservation = async (req, res) => {
  try {
    console.log("🔹 Received user reservation request:", req.body);
    const reservationData = req.body;

    // Fetch userId from the authenticated session
    const userId = req.user.id;
    if (!userId) {
      throw new Error("User not authenticated");
    }
    reservationData.userId = userId;

    // Validate required fields
    if (!reservationData.shopId || !reservationData.reservationDate || !reservationData.reservationTime || !reservationData.seats) {
      throw new Error("Missing required fields for user reservation");
    }

    // Βρίσκουμε το καταλληλότερο διαθέσιμο τραπέζι
    const bestTable = await findBestAvailableTable(
      reservationData.shopId,
      reservationData.reservationDate,
      reservationData.reservationTime,
      reservationData.seats
    );

    if (!bestTable) {
      console.warn("⚠️ No available table found for user reservation");
      throw new Error("No available table found");
    }

    console.log("✅ Best table found for user reservation:", bestTable);

    reservationData.tableId = bestTable._id;

    // Αυτόματη εύρεση name και surname από το προφίλ του χρήστη
    const user = await User.findById(reservationData.userId);
    if (!user) {
      throw new Error("User not found");
    }
    reservationData.name = user.name;
    reservationData.surname = user.surname;

    console.log("🔹 Creating reservation with data:", reservationData);

    // Δημιουργία της κράτησης
    const newReservation = await addReservationService(reservationData);
    console.log("✅ User reservation created:", newReservation);

    // Ενημέρωση της λίστας κρατήσεων
    console.log("🔹 Updating reservation list for shop:", reservationData.shopId);
    await addToReservationList(
      reservationData.shopId,
      reservationData.reservationDate,
      newReservation._id.toString()
    );

    // Ενημέρωση του ιστορικού κρατήσεων του χρήστη
    console.log("🔹 Updating user's reservation history for user:", reservationData.userId);
    await addReservationToUserHistory(reservationData.userId, newReservation._id);

    // Ενημέρωση της διαθεσιμότητας του τραπεζιού
    await updateTableAvailability(
      reservationData.tableId,
      reservationData.reservationDate,
      reservationData.reservationTime
    );

    console.log("✅ Table availability updated successfully for user reservation");

    res.status(201).json({ success: true, message: "User reservation added successfully", reservation: newReservation });
  } catch (error) {
    console.error("❌ Error in addUserReservation:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Δημιουργία νέας guest κράτησης
const addGuestReservation = async (req, res) => {
  try {
    console.log("🔹 Received guest reservation request:", req.body);
    const reservationData = req.body;

    // Validate required fields
    if (!reservationData.shopId || !reservationData.reservationDate || !reservationData.reservationTime || !reservationData.seats || !reservationData.name || !reservationData.surname) {
      throw new Error("Missing required fields for guest reservation");
    }

    // Βρίσκουμε το καταλληλότερο διαθέσιμο τραπέζι
    const bestTable = await findBestAvailableTable(
      reservationData.shopId,
      reservationData.reservationDate,
      reservationData.reservationTime,
      reservationData.seats
    );

    if (!bestTable) {
      console.warn("⚠️ No available table found for guest reservation");
      throw new Error("No available table found");
    }

    console.log("✅ Best table found for guest reservation:", bestTable);

    reservationData.tableId = bestTable._id;

    console.log("🔹 Creating reservation with data:", reservationData);

    // Δημιουργία της κράτησης
    const newReservation = await addReservationService(reservationData);
    console.log("✅ Guest reservation created:", newReservation);

    // Ενημέρωση της λίστας κρατήσεων
    await addToReservationList(
      reservationData.shopId,
      reservationData.reservationDate,
      newReservation._id.toString()
    );

    // Ενημέρωση της διαθεσιμότητας του τραπεζιού
    await updateTableAvailability(
      reservationData.tableId,
      reservationData.reservationDate,
      reservationData.reservationTime
    );

    console.log("✅ Table availability updated successfully for guest reservation");

    res.status(201).json({ success: true, message: "Guest reservation added successfully", reservation: newReservation });
  } catch (error) {
    console.error("❌ Error in addGuestReservation:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// Διαγραφή κράτησης
const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`Deleting reservation with ID: ${id}`);

    // Εύρεση της κράτησης από τη βάση δεδομένων
    const reservation = await deleteReservationService(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Ενημέρωση της λίστας κρατήσεων του καταστήματος
    await deleteToReservationList(reservation.shopId, reservation.reservationDate, id);

    // Αν το tableId δεν είναι null, ενημερώνουμε τη διαθεσιμότητα του τραπεζιού
    if (reservation.tableId) {
      try {
        await updateWhenReservationDelete(reservation.tableId, reservation.reservationDate, reservation.reservationTime);
      } catch (error) {
        console.warn(`Warning: Failed to update table availability: ${error.message}`);
      }
    } else {
      console.log('No tableId provided. Skipping table availability update.');
    }

    // Αν το userId δεν είναι null, αφαιρούμε την κράτηση από το ιστορικό του χρήστη
    if (reservation.userId) {
      try {
        await removeReservationFromUserHistory(reservation.userId, reservation._id);
      } catch (error) {
        console.warn(`Warning: Failed to remove reservation from user history: ${error.message}`);
      }
    } else {
      console.log('No userId provided. Skipping user history update.');
    }

    res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Επεξεργασία κράτησης
const editReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { tableId, reservationTime, commentFromUser } = req.body;

    // Ενημερώνουμε μόνο τα πεδία που επιτρέπεται να αλλάξουν
    const updatedData = { tableId, reservationTime, commentFromUser };

    // Επεξεργασία της κράτησης
    const updatedReservation = await editReservationService(id, updatedData);

    res.json({ success: true, message: 'Reservation updated successfully', reservation: updatedReservation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// filepath: c:\Users\kon21\backend-13\controllers\reservationController.js
const getReservationById = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await Reservation.findById(id).populate('userId shopId');
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.json(reservation);
  } catch (error) {
    console.error('Error fetching reservation by ID:', error);
    res.status(500).json({ message: 'Failed to fetch reservation' });
  }
};


// filepath: c:\Users\kon21\backend-13\controllers\reservationController.js
const getTotalReservations = async (req, res) => {
  try {
    const total = await Reservation.countDocuments();
    res.json({ total });
  } catch (error) {
    console.error('Error fetching total reservations count:', error);
    res.status(500).json({ message: 'Failed to fetch total reservations count' });
  }
};


// Νέα δυνατότητα: Αλλαγή κατάστασης κράτησης
const changeReservationState = async (req, res) => {
  try {
    const { id } = req.params; // ID της κράτησης
    const { state } = req.body; // Το νέο state

    // Ελέγχουμε αν το state είναι έγκυρο
    const validStates = ['accepted', 'notShown', 'completed'];
    if (!validStates.includes(state)) {
      return res.status(400).json({ success: false, message: 'Invalid state value' });
    }

    // Εύρεση της κράτησης
    const reservation = await Reservation.findById(id);
    if (!reservation) {
      return res.status(404).json({ success: false, message: 'Reservation not found' });
    }

    // Ενημέρωση του state
    reservation.state = state;
    await reservation.save();

    res.status(200).json({ success: true, message: 'Reservation state updated successfully', reservation });
  } catch (error) {
    console.error('Error updating reservation state:', error);
    res.status(500).json({ success: false, message: 'Failed to update reservation state' });
  }
};

const filterReservationsByState = async (req, res) => {
  try {
    const { state } = req.query; // Λήψη του state από το query string
    const { reservationList } = req.body; // Λήψη της λίστας κρατήσεων από το body

    if (!reservationList || !Array.isArray(reservationList)) {
      return res.status(400).json({ message: 'Invalid reservation list provided' });
    }

    if (!state || state === 'all') {
      // Αν δεν υπάρχει state ή είναι "all", επιστρέφουμε όλες τις κρατήσεις
      return res.status(200).json({ filteredReservations: reservationList });
    }

    // Φιλτράρισμα κρατήσεων με βάση το state
    const filteredReservations = reservationList.filter(reservation => reservation.state === state);

    res.status(200).json({ filteredReservations });
  } catch (error) {
    console.error('Error filtering reservations:', error.message);
    res.status(500).json({ message: 'Failed to filter reservations' });
  }
};


const findAndAssignTable = async (req, res) => {
  const { reservationId } = req.params;
  const { reservationDate, reservationTime, seats } = req.body;

  console.log("Received request to find table for reservation:", {
    reservationId,
    reservationDate,
    reservationTime,
    seats,
  });

  try {
    const reservation = await Reservation.findById(reservationId);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    const table = await findBestAvailableTable(reservation.shopId, reservationDate, reservationTime, seats);
    if (!table) {
      return res.status(404).json({ message: 'No available table found' });
    }

    reservation.tableId = table._id;
    await reservation.save();

    await updateTableAvailability(table._id, reservationDate, reservationTime);

    res.status(200).json({ success: true, tableNumber: table.tableNumber });
  } catch (error) {
    console.error("Error in findAndAssignTable:", error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

module.exports = {
  addManualReservation,
  addUserReservation,
  addGuestReservation,
  editReservation,
  deleteReservation,
  getTotalReservations,
  getReservationById,
  changeReservationState,
  filterReservationsByState,
  findAndAssignTable,
};
