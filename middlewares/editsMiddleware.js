const { getReservationsForTable, setTableIdForReservations } = require('../services/reservationServices');
const { addReservationToUndefinedList } = require('../services/shopServices');
const { updateAvailabilityForBookingHoursEdit, unvalidReservationsAfterSeatsEdit, invalidReservationForIsBookingAllowedEdit, clearAvailabilityForDay, setAvailabilityForDay, updateWhenReservationDelete } = require('../services/tableServices');
const Table = require('../models/table');
const Shop = require('../models/shop');

// Middleware για την επεξεργασία των booking hours
const handleBookingHoursUpdate = async (req, res, next) => {
  const { shopId } = req.params;
  const { day, bookingStart: newBookingStart, bookingEnd: newBookingEnd } = req.body;
  try {
    console.log("Received req.body:", req.body);
    console.log("Middleware triggered for shopId:", shopId); // Log το shopId
    console.log("Request body:", { day, newBookingStart, newBookingEnd }); // Log τα δεδομένα του αιτήματος

    const shop = await Shop.findById(shopId);
    if (!shop) {
      console.error("Shop not found for shopId:", shopId); // Log αν το shop δεν βρέθηκε
      return res.status(404).json({ message: 'Shop not found' });
    }

    console.log("Shop found:", shop); // Log τα δεδομένα του shop

    const openingHours = shop.openingHours[day];
    console.log(`Opening hours for ${day}:`, openingHours); // Log τα opening hours για την ημέρα

    if (!openingHours || !openingHours.isOpen) {
      console.error(`Shop is closed on ${day}`); // Log αν το shop είναι κλειστό
      return res.status(400).json({ message: `Shop is closed on ${day}` });
    }

    // Validate that the new booking hours are within the shop's opening hours.
    if (newBookingStart < openingHours.open || newBookingEnd > openingHours.close) {
      console.error("Invalid booking hours:", { newBookingStart, newBookingEnd }); // Log αν οι ώρες είναι εκτός ορίων
      return res.status(400).json({
        message: 'Booking hours must be within shop opening hours'
      });
    }

    const tables = await Table.find({ shopId });
    console.log("Tables found for shop:", tables); // Log τα τραπέζια του shop

    for (const table of tables) {
      console.log("Processing table:", table._id); // Log το ID του τραπεζιού

      // Retrieve all reservations for this table.
      const reservationsResult = await getReservationsForTable(table._id);
      console.log("Reservations for table:", reservationsResult); // Log τις κρατήσεις

      if (reservationsResult.success && reservationsResult.reservations.length > 0) {
        // Filter reservations that occur on the same day as the edited day.
        const dayReservations = reservationsResult.reservations.filter(reservation => {
          const resDate = new Date(reservation.reservationDate);
          const resDay = resDate.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
          return resDay === day;
        });

        console.log(`Reservations for ${day}:`, dayReservations); // Log τις κρατήσεις για την ημέρα

        if (dayReservations.length > 0) {
          // Set tableId for all these reservations to null.
          await setTableIdForReservations(dayReservations.map(reservation => reservation._id));
          console.log("Set tableId to null for reservations:", dayReservations.map(reservation => reservation._id)); // Log τις κρατήσεις που ενημερώθηκαν

          // Add each reservation to the undefinedReservationList.
          for (const reservation of dayReservations) {
            await addReservationToUndefinedList(reservation.shopId, reservation._id);
            console.log("Added reservation to undefined list:", reservation._id); // Log την προσθήκη στη λίστα
          }
        }
      }

      // Reinitialize the availability for the table for all dates matching the edited day.
      await updateAvailabilityForBookingHoursEdit(table._id, day, newBookingStart, newBookingEnd);
      console.log("Updated availability for table:", table._id); // Log την ενημέρωση διαθεσιμότητας
    }

    next();
  } catch (error) {
    console.error("Error in handleBookingHoursUpdate:", error); // Log το σφάλμα
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware για την επεξεργασία των seats
const handleSeatsUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { seats } = req.body;

  try {
    const reservationsResult = await getReservationsForTable(id);

    //Validation an ektelestei to edit logo seat input=0
    if (seats == 0){
      return res.status(400).json({ 
        message: 'Seats must be >0' 
      });
    }


    if (reservationsResult.success && reservationsResult.reservations.length > 0) {
      const invalidReservations = await unvalidReservationsAfterSeatsEdit(reservationsResult.reservations.map(reservation => reservation._id), seats);

      if (invalidReservations.length > 0) {
        await setTableIdForReservations(invalidReservations.map(reservation => reservation._id));
        for (const reservation of invalidReservations) {
          await addReservationToUndefinedList(reservation.shopId, reservation._id);
          await updateWhenReservationDelete(id,reservation.reservationDate, reservation.reservationTime);
        }
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware για την επεξεργασία του isBookingAllowed
const handleIsBookingAllowedUpdate = async (req, res, next) => {
  const { id } = req.params;
  const { day, isBookingAllowed } = req.body;

  try {
    const table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    if (!isBookingAllowed) {
      const reservationsResult = await getReservationsForTable(id);

      if (reservationsResult.success && reservationsResult.reservations.length > 0) {
        const invalidReservations = await invalidReservationForIsBookingAllowedEdit(reservationsResult.reservations, day);

        if (invalidReservations.length > 0) {
          await setTableIdForReservations(invalidReservations.map(reservation => reservation._id));
          for (const reservation of invalidReservations) {
            await addReservationToUndefinedList(reservation.shopId, reservation._id);
          }
        }
      }

      await clearAvailabilityForDay(id, day);
    } else {
      await setAvailabilityForDay(id, day);
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware για τη διαγραφή τραπεζιού
const handleTableDeletion = async (req, res, next) => {
  const { id } = req.params;

  try {
    const reservationsResult = await getReservationsForTable(id);

    if (reservationsResult.success && reservationsResult.reservations.length > 0) {
      await setTableIdForReservations(reservationsResult.reservations.map(reservation => reservation._id));
      for (const reservation of reservationsResult.reservations) {
        await addReservationToUndefinedList(reservation.shopId, reservation._id);
      }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  handleBookingHoursUpdate,
  handleSeatsUpdate,
  handleIsBookingAllowedUpdate,
  handleTableDeletion,
};