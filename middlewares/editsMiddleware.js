const { getReservationsForTable, setTableIdForReservations } = require('../services/reservationServices');
const { addReservationToUndefinedList } = require('../services/shopServices');
const { updateAvailabilityForBookingHoursEdit, unvalidReservationsAfterSeatsEdit, invalidReservationForIsBookingAllowedEdit, clearAvailabilityForDay, setAvailabilityForDay, updateWhenReservationDelete } = require('../services/tableServices');
const Table = require('../models/table');
const Shop = require('../models/shop');

// Middleware για την επεξεργασία των booking hours
const handleBookingHoursUpdate = async (req, res, next) => {
  const { shopId } = req.params;
  const { day, newBookingStart, newBookingEnd } = req.body;

 
  try {
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    const openingHours=shop.openingHours[day];
    if (!openingHours || !openingHours.isOpen){
      return res.status(400).json({message:`Shop is close on ${day}`});
    }

    // Ενημερωμένη συνθήκη για το validation
    if (newBookingStart < openingHours.open || newBookingEnd > openingHours.close) {
      return res.status(400).json({ 
        message: 'Booking hours must be within shop opening hours' 
      });
    }


    const tables = await Table.find({ shopId });

    for (const table of tables) {
      const reservationsResult = await getReservationsForTable(table._id);
      if (reservationsResult.success && reservationsResult.reservations.length > 0) {
        const invalidReservations = reservationsResult.reservations.filter(reservation => {
          return reservation.reservationTime < newBookingStart || reservation.reservationTime > newBookingEnd;
        });

        if (invalidReservations.length > 0) {
          await setTableIdForReservations(invalidReservations.map(reservation => reservation._id));
          for (const reservation of invalidReservations) {
            await addReservationToUndefinedList(reservation.shopId, reservation._id);
          }
        }
      }

      await updateAvailabilityForBookingHoursEdit(table._id, day, newBookingStart, newBookingEnd);
    }

    next();
  } catch (error) {
    console.error(error);
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