const Table = require('../models/table');
const { addReservationService, editReservationService, deleteReservationService } = require('../services/reservationServices');
const { addToReservationList, deleteToReservationList } = require('../services/shopServices');
const { findBestAvailableTable, updateTableAvailability, updateWhenReservationDelete } = require('../services/tableServices');

// Δημιουργία νέας κράτησης
const addReservation = async (req, res) => {
  try {
    console.log("🔹 Received reservation request:", req.body);

    const reservationData = req.body;

    console.log("🔹 Searching for best available table with:", {
      shopId: reservationData.shopId,
      reservationDate: reservationData.reservationDate,
      reservationTime: reservationData.reservationTime,
      seats: reservationData.seats
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
      return res.status(404).json({ message: 'No available table found' });
    }

    console.log("✅ Best table found:", bestTable);

    reservationData.tableId = bestTable._id;

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

    // Προσθήκη log πριν την κλήση της updateTableAvailability
    console.log("🔹 Calling updateTableAvailability with:", {
      tableId: reservationData.tableId,
      reservationDate: reservationData.reservationDate,
      reservationTime: reservationData.reservationTime
    });

    // Ανανεώνουμε τη διαθεσιμότητα του τραπεζιού
    await updateTableAvailability(
      reservationData.tableId,
      reservationData.reservationDate,
      reservationData.reservationTime
    ); 

    console.log("✅ Table availability updated successfully");

    res.status(201).json({ success: true, message: 'Reservation added successfully', reservation: newReservation });
  } catch (error) {
    console.error("❌ Error in addReservation:", error);
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

    // Ανανεώνουμε τη διαθεσιμότητα του τραπεζιού μετά τη διαγραφή της κράτησης
    await updateWhenReservationDelete(reservation.tableId, reservation.reservationDate, reservation.reservationTime);

    res.status(200).json({ success: true, message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addReservation,
  editReservation,
  deleteReservation,
};
