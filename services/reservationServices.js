const Reservation = require('../models/reservation');

// Δημιουργία νέας κράτησης
const addReservationService = async (reservationData) => {
  const { shopId, userId, tableId, reservationDate, reservationTime, estimatedReservationTime, commentFromUser, userName, shopName } = reservationData;

  // Ensure that required fields userName and shopName are present
  if (!userName || !shopName) {
    throw new Error("userName and shopName are required fields.");
  }

  // Δημιουργία της νέας κράτησης
  const newReservation = new Reservation({
    shopId,
    userId,
    tableId,
    reservationDate,
    reservationTime,
    estimatedReservationTime,
    commentFromUser,
    userName,  // Add userName
    shopName,  // Add shopName
  });

  // Αποθήκευση της κράτησης στη βάση δεδομένων
  await newReservation.save();

  return newReservation;
};


// Επεξεργασία (edit) κράτησης
const editReservationService = async (reservationId, updatedReservationData) => {
  // Εύρεση της κράτησης με το ID
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Ενημέρωση της κράτησης με τα νέα δεδομένα
  Object.assign(reservation, updatedReservationData);

  // Αποθήκευση της ενημερωμένης κράτησης
  await reservation.save();

  return reservation;
};

// Διαγραφή κράτησης
const deleteReservationSerive = async (reservationId) => {
  // Εύρεση της κράτησης με το ID
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  // Διαγραφή της κράτησης
  await Reservation.findByIdAndDelete(reservationId);

  return { message: 'Reservation deleted successfully' };
};

module.exports = {
  addReservationService,
  editReservationService,
  deleteReservationSerive,
};
