const Table = require('../models/table');
const Reservation = require('../models/reservation');
const { addReservationService, editReservationService, deleteReservationService } = require('../services/reservationServices');
const { addToReservationList, deleteToReservationList } = require('../services/shopServices');
const { findBestAvailableTable, updateTableAvailability, updateWhenReservationDelete } = require('../services/tableServices');
const { addReservationToUserHistory, removeReservationFromUserHistory } = require('../services/userServices');
const User = require('../models/user'); // Import User model

// Δημιουργία νέας κράτησης
const addManualReservation = async (reservationData) => {
  console.log("🔹 Manual reservation by shopOwner");

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

  return newReservation;
};

const addUserReservation = async (reservationData) => {
  console.log("🔹 User reservation");

  // Ελέγχουμε αν έχουν δοθεί όλα τα απαραίτητα δεδομένα
  if (!reservationData.shopId || !reservationData.userId || !reservationData.reservationDate || !reservationData.reservationTime || !reservationData.seats) {
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

  return newReservation;
};

const addReservation = async (req, res) => {
  try {
    console.log("🔹 Received reservation request:", req.body);
    const reservationData = req.body;

    // Ελέγχουμε αν είναι manual κράτηση ή κανονική
    const isManual = !reservationData.userId;

    let newReservation;
    if (isManual) {
      newReservation = await addManualReservation(reservationData);
    } else {
      newReservation = await addUserReservation(reservationData);
    }

    res.status(201).json({ success: true, message: "Reservation added successfully", reservation: newReservation });
  } catch (error) {
    console.error("❌ Error in addReservation:", error);
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



module.exports = {
  addReservation,
  editReservation,
  deleteReservation,
  getTotalReservations,
  getReservationById,
};
