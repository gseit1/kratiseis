const { addReservationService, editReservationService, deleteReservationService } = require('../services/reservationServices');
const { addToReservationList, deleteToReservationList } = require('../services/shopServices');
const { findBestAvailableTable, updateTableAvailability, updateWhenReservationDelete } = require('../services/tableServices');

// Δημιουργία νέας κράτησης
const addReservation = async (req, res) => {
  try {
    const reservationData = req.body;

    // Βρίσκουμε το καταλληλότερο διαθέσιμο τραπέζι
    const bestTable = await findBestAvailableTable(
      reservationData.shopId,
      reservationData.reservationDate,
      reservationData.reservationTime,
      reservationData.seats
    );

    if (!bestTable) {
      return res.status(404).json({ message: 'No available table found' });
    }

    reservationData.tableId = bestTable._id;

    // Δημιουργία της κράτησης
    const newReservation = await addReservationService(reservationData);

    // Ενημέρωση της λίστας κρατήσεων στο κατάστημα με το ID της νέας κράτησης
    await addToReservationList(
      reservationData.shopId,
      reservationData.reservationDate,
      newReservation._id.toString() // Στέλνουμε μόνο το ID
    );

    // Προσθήκη log πριν την κλήση της updateTableAvailability
    console.log('Calling updateTableAvailability with:', {
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

    res.status(201).json({ success: true, message: 'Reservation added successfully', reservation: newReservation });
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
