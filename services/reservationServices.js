const Reservation = require('../models/reservation');
const { updateTableAvailability, updateWhenReservationDelete } = require('../services/tableServices');

// Δημιουργία νέας κράτησης
const Shop = require('../models/shop'); // Import the Shop model

const addReservationService = async (reservationData) => {
  const { shopId, userId, tableId, reservationDate, reservationTime, estimatedReservationTime, commentFromUser, name, surname, seats } = reservationData;

  // Ensure that required fields are present
  if (!shopId || !name || !surname || !reservationDate || !reservationTime || !seats) {
    throw new Error("Missing required fields for reservation.");
  }

  // Fetch the shopName using shopId
  const shop = await Shop.findById(shopId);
  if (!shop) {
    throw new Error("Shop not found.");
  }
  const shopName = shop.shopName;

  // Create the new reservation
  const newReservation = new Reservation({
    shopId,
    userId,
    tableId,
    reservationDate,
    reservationTime,
    estimatedReservationTime,
    commentFromUser,
    name,
    surname, // Combine name and surname for backward compatibility
    shopName, // Dynamically fetched shopName
    seats,
  });

  // Save the reservation to the database
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
const deleteReservationService = async (reservationId) => {
  // Εύρεση της κράτησης με το ID
  console.log(`Searching for reservation with ID: ${reservationId}`);
  const reservation = await Reservation.findById(reservationId);
  if (!reservation) {
    throw new Error('Reservation not found');
  }

  console.log(`Reservation found: ${JSON.stringify(reservation)}`);

  // Διαγραφή της κράτησης
  await Reservation.findByIdAndDelete(reservationId);

  return reservation;
};

// Συνάρτηση για την εύρεση κρατήσεων για ένα συγκεκριμένο τραπέζι
const getReservationsForTable = async (tableId) => {
  try {
    const reservations = await Reservation.find({ tableId });

    if (reservations.length === 0) {
      return { success: false, message: 'No reservations found for this table', reservations: [] };
    }

    return { success: true, reservations };
  } catch (error) {
    console.error('Error fetching reservations for table:', error.message);
    throw error;
  }
};

// Συνάρτηση για την αλλαγή τραπεζιού σε μια κράτηση
const setTableIdForReservations = async (reservationIds) => {
  try {
    for (const reservationId of reservationIds) {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error(`Reservation not found: ${reservationId}`);
      }

      reservation.tableId = null; // Αποθήκευση κενό το tableId

      await reservation.save();
    }

    return { success: true, message: 'Table IDs set to null successfully for all reservations' };
  } catch (error) {
    console.error('Error setting table IDs to null for reservations:', error.message);
    throw error;
  }
};


// Συνάρτηση για τον έλεγχο αν οι κρατήσεις είναι έγκυρες με βάση τα νέα bookingStart και bookingEnd
const checkInvalidReservationsWhenBookingHoursChange = (reservations, bookingStart, bookingEnd) => {
  const invalidReservations = [];

  for (const reservation of reservations) {
    const reservationTime = reservation.reservationTime;
    if (reservationTime < bookingStart || reservationTime > bookingEnd) {
      invalidReservations.push(reservation);
    }
  }

  return invalidReservations;
};





module.exports = {
  addReservationService,
  editReservationService,
  deleteReservationService,
  getReservationsForTable,
  setTableIdForReservations,
  checkInvalidReservationsWhenBookingHoursChange,
};
