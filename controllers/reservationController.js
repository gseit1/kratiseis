const Table = require('../models/table');
const Reservation = require('../models/reservation');
const { addReservationService, editReservationService, deleteReservationService } = require('../services/reservationServices');
const { addToReservationList, deleteToReservationList } = require('../services/shopServices');
const { findBestAvailableTable, updateTableAvailability, updateWhenReservationDelete } = require('../services/tableServices');
const { addReservationToUserHistory, removeReservationFromUserHistory } = require('../services/userServices');

// Δημιουργία νέας κράτησης
const addReservation = async (req, res) => {
  try {
    console.log("🔹 Received reservation request:", req.body);
    const reservationData = req.body;

    // Ελέγχουμε αν είναι manual κράτηση (δεν υπάρχει userId)
    const isManual = !reservationData.userId;

    if (isManual) {
      console.log("🔹 Manual reservation by shopOwner");

      // Ελέγχουμε αν έχουν δοθεί όλα τα απαραίτητα δεδομένα
      if (!reservationData.shopId || !reservationData.reservationDate || !reservationData.reservationTime || !reservationData.seats) {
        return res.status(400).json({ message: "Missing required fields for manual reservation" });
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
        return res.status(404).json({ message: "No available table found" });
      }

      console.log("✅ Best table found for manual reservation:", bestTable);

      // Προσθέτουμε το tableId στο reservationData
      reservationData.tableId = bestTable._id;

      // Δημιουργούμε την κράτηση
      const newReservation = await addReservationService(reservationData);
      console.log("✅ Manual reservation created:", newReservation);


//ReservationList update
console.log("🔹 Updating reservation list for shop:", reservationData.shopId);
    await addToReservationList(
      reservationData.shopId,
      reservationData.reservationDate,
      newReservation._id.toString() // Στέλνουμε μόνο το ID
    );
    console.log("✅ Reservation list updated successfully");


      // Ενημερώνουμε τη διαθεσιμότητα του τραπεζιού
      await updateTableAvailability(
        reservationData.tableId,
        reservationData.reservationDate,
        reservationData.reservationTime
      );

      console.log("✅ Table availability updated successfully for manual reservation");

      return res.status(201).json({ success: true, message: "Manual reservation added successfully", reservation: newReservation });
    }

    // Λογική για κρατήσεις από χρήστες
    console.log("🔹 Searching for best available table with:", {
      shopId: reservationData.shopId,
      reservationDate: reservationData.reservationDate,
      reservationTime: reservationData.reservationTime,
      seats: reservationData.seats,
    });

    // Βρίσκουμε το καταλληλότερο διαθέσιμο τραπέζι
    const bestTable = await findBestAvailableTable(
      reservationData.shopId,
      reservationData.reservationDate,
      reservationData.reservationTime,
      reservationData.seats
    );

    if (!bestTable) {
      console.warn("⚠️ No available table found");
      return res.status(404).json({ message: "No available table found" });
    }
    console.log("✅ Best table found:", bestTable);

    reservationData.tableId = bestTable._id;

    // Αυτόματη εύρεση name και surname από το προφίλ του χρήστη
    const user = await User.findById(reservationData.userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    reservationData.name = user.name;
    reservationData.surname = user.surname;

    console.log("🔹 Creating reservation with data:", reservationData);

    // Δημιουργία της κράτησης
    const newReservation = await addReservationService(reservationData);
    console.log("✅ Reservation created:", newReservation);

    // Ενημέρωση της λίστας κρατήσεων στο κατάστημα με το ID της νέας κράτησης
    console.log("🔹 Updating reservation list for shop:", reservationData.shopId);
    await addToReservationList(
      reservationData.shopId,
      reservationData.reservationDate,
      newReservation._id.toString() // Στέλνουμε μόνο το ID
    );
    console.log("✅ Reservation list updated successfully");

    // Ενημέρωση του ιστορικού κρατήσεων του χρήστη
    console.log("🔹 Updating user's reservation history for user:", reservationData.userId);
    await addReservationToUserHistory(reservationData.userId, newReservation._id);
    console.log("✅ User reservation history updated successfully");

    // Ανανεώνουμε τη διαθεσιμότητα του τραπεζιού
    console.log("🔹 Calling updateTableAvailability with:", {
      tableId: reservationData.tableId,
      reservationDate: reservationData.reservationDate,
      reservationTime: reservationData.reservationTime,
    });
    await updateTableAvailability(
      reservationData.tableId,
      reservationData.reservationDate,
      reservationData.reservationTime
    );
    console.log("✅ Table availability updated successfully");

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

    // Αντιστρέφουμε την αλλαγή διαθεσιμότητας μετά τη διαγραφή
    await updateWhenReservationDelete(reservation.tableId, reservation.reservationDate, reservation.reservationTime);

    // Αφαιρούμε την κράτηση από το ιστορικό κρατήσεων του χρήστη
    await removeReservationFromUserHistory(reservation.userId, reservation._id);

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
