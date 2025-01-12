const { addReservationService, editReservationService, deleteReservationService } = require('../services/reservationServices');
const { addToReservationList, deleteToReservationList } = require('../services/shopServices');

// Δημιουργία νέας κράτησης
const addReservation = async (req, res) => {
  try {
    const reservationData = req.body;

    // Δημιουργία της κράτησης
    const newReservation = await addReservationService(reservationData);

    // Ενημέρωση της λίστας κρατήσεων στο κατάστημα με το ID της νέας κράτησης
    await addToReservationList(
      reservationData.shopId,
      reservationData.reservationDate,
      newReservation._id.toString() // Στέλνουμε μόνο το ID
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
    const { shopId, reservationDate } = req.body;

    // Διαγραφή της κράτησης από τη βάση δεδομένων
    await deleteReservationService(id);

    // Ενημέρωση της λίστας κρατήσεων του καταστήματος
    await deleteToReservationList(shopId, reservationDate, id);

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
