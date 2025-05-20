const { getReservationsForTable, setTableIdForReservations } = require('../services/reservationServices');
const { addReservationToUndefinedList } = require('../services/shopServices');
const { updateAvailabilityForBookingHoursEdit, unvalidReservationsAfterSeatsEdit, invalidReservationForIsBookingAllowedEdit, clearAvailabilityForDay, setAvailabilityForDay, updateWhenReservationDelete } = require('../services/tableServices');
const Table = require('../models/table');
const Shop = require('../models/shop');

// Middleware για την επεξεργασία των booking hours
const handleBookingHoursUpdate = async (req, res, next) => {
  // Get shopId from the authenticated user instead of params
  const shopId = req.user.shopId;
  
  if (!shopId) {
    return res.status(400).json({ message: 'Shop ID not found in user profile' });
  }
  
  const { day, bookingStart: newBookingStart, bookingEnd: newBookingEnd } = req.body;
  
  try {
    console.log("Received req.body:", req.body);
    console.log("Using shopId from user:", shopId);
    console.log("Request body:", { day, newBookingStart, newBookingEnd });

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
          console.log("Set tableId to null for reservations:", dayReservations.map(reservation => reservation._id));
          // Αφαίρεση της προσθήκης στη λίστα undefined
          // for (const reservation of dayReservations) {
          //   await addReservationToUndefinedList(reservation.shopId, reservation._id);
          //   console.log("Added reservation to undefined list:", reservation._id);
          // }
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
  const { seats, minimumSeats } = req.body; // Δέχεται και τα δύο πεδία

  try {
    const reservationsResult = await getReservationsForTable(id);

    // Validation: Αν το `seats` ή το `minimumSeats` είναι 0, απορρίπτουμε το αίτημα
    if (seats === 0 || minimumSeats === 0) {
      return res.status(400).json({
        message: 'Seats and Minimum Seats must be greater than 0',
      });
    }

    if (reservationsResult.success && reservationsResult.reservations.length > 0) {
      let invalidReservations = [];

      // Έλεγχος για `seats`
      if (seats !== undefined) {
        invalidReservations = await unvalidReservationsAfterSeatsEdit(
          reservationsResult.reservations.map((reservation) => reservation._id),
          seats
        );
      }

      // Έλεγχος για `minimumSeats`
      if (minimumSeats !== undefined) {
        invalidReservations = invalidReservations.concat(
          reservationsResult.reservations.filter((reservation) => {
            return reservation.seats < minimumSeats; // Κρατήσεις που δεν πληρούν το νέο `minimumSeats`
          })
        );
      }

      if (invalidReservations.length > 0) {
        // Αλλαγή του `tableId` σε `null` για τις μη έγκυρες κρατήσεις
        await setTableIdForReservations(
          invalidReservations.map((reservation) => reservation._id)
        );

        // Ενημέρωση διαθεσιμότητας για τις κρατήσεις που επηρεάζονται
        for (const reservation of invalidReservations) {
          
          await updateWhenReservationDelete(
            id,
            reservation.reservationDate,
            reservation.reservationTime
          );
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
      // Αφαίρεση αυτής της λογικής
      // for (const reservation of reservationsResult.reservations) {
      //     await addReservationToUndefinedList(reservation.shopId, reservation._id);
      // }
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Middleware για αλλαγή isOpen για μια μέρα (isOpenForDay)
const handleIsOpenForDayUpdate = async (req, res) => {
  const { day, isOpen, open, close, bookingStart, bookingEnd } = req.body;
  const shopId = req.params.shopId;
  console.log('handleIsOpenForDayUpdate called with:', { shopId, day, isOpen, open, close, bookingStart, bookingEnd });

  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found', details: 'Invalid shopId' });
    }

    if (isOpen) {
      // Validation
      if (
        typeof open !== 'number' || typeof close !== 'number' ||
        typeof bookingStart !== 'number' || typeof bookingEnd !== 'number'
      ) {
        return res.status(400).json({ message: 'All hours must be provided as numbers' });
      }
      if (open >= close) {
        return res.status(400).json({ message: 'Open time must be before close time' });
      }
      if (bookingStart >= bookingEnd) {
        return res.status(400).json({ message: 'Booking start must be before booking end' });
      }
      if (bookingStart < open || bookingEnd > close) {
        return res.status(400).json({ message: 'Booking hours must be within opening hours' });
      }

      // Αρχικοποίηση openingHours[day]
      shop.openingHours[day] = {
        isOpen: true,
        open,
        close,
        bookingStart,
        bookingEnd
      };
      shop.markModified('openingHours');
      await shop.save();
      return res.status(200).json({
        message: 'Day set to open',
        day,
        openingHours: shop.openingHours[day]
      });
    }

    // Αν το μαγαζί κλείνει, κάνε τα openingHours[day] = 0
    shop.openingHours[day] = {
      isOpen: false,
      open: 0,
      close: 0,
      bookingStart: 0,
      bookingEnd: 0
    };
    shop.markModified('openingHours');
    await shop.save();

    // Για κάθε τραπέζι κάνε τις ίδιες λειτουργίες με handleIsBookingAllowedUpdate ΚΑΙ isOpen=false
    const tables = await Table.find({ shopId });
    for (const table of tables) {
      // 1. Ακύρωσε κρατήσεις για τη μέρα
      const reservationsResult = await getReservationsForTable(table._id);
      if (reservationsResult.success && reservationsResult.reservations.length > 0) {
        const invalidReservations = await invalidReservationForIsBookingAllowedEdit(reservationsResult.reservations, day);
        if (invalidReservations.length > 0) {
          await setTableIdForReservations(invalidReservations.map(reservation => reservation._id));
        }
      }

      // 2. Καθάρισε availability για τη μέρα
      await clearAvailabilityForDay(table._id, day);

      // 3. Κάνε isBookingAllowed και isOpen false για τη μέρα
      if (!table.bookingHours) table.bookingHours = {};
      if (!table.bookingHours[day]) table.bookingHours[day] = {};
      table.bookingHours[day].isBookingAllowed = false;
      table.bookingHours[day].isOpen = false;
      await table.save();
    }

    res.status(200).json({
      message: 'Day set to closed and openingHours set to null',
      day,
      openingHours: shop.openingHours[day]
    });
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
  handleIsOpenForDayUpdate, // export the new middleware
};