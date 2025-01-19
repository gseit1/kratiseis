const Table = require('../models/table');
const Reservation = require('../models/reservation');
const Shop = require('../models/shop');

// Service για τη δημιουργία τραπεζιού
const createTable = async (shopId, tableData) => {
  const shop = await Shop.findById(shopId);
  if (!shop) throw new Error('Shop not found');

  const newTable = new Table(tableData);
  await newTable.save();

  shop.tables.push(newTable._id);
  await shop.save();

  // Initialize availability for the entire month
  const today = new Date();
  const availabilityMap = new Map();

  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0]; // Format: YYYY-MM-DD

    const availability = await initializeAvailabilityForDateBatch(shop, newTable, dateString);
    availabilityMap.set(dateString, availability);
  }

  // Save the table with all the availability at once
  newTable.availability = availabilityMap;
  await newTable.save();

  return newTable;
};

// Service για την επεξεργασία τραπεζιού
const updateTable = async (tableId, updateData) => {
  const table = await Table.findById(tableId);
  if (!table) throw new Error('Table not found');

  const updatedTable = await Table.findByIdAndUpdate(tableId, updateData, {
    new: true,
    runValidators: true,
  });

  return updatedTable;
};

// Service για τη διαγραφή τραπεζιού
const deleteTableService = async (tableId) => {
  const table = await Table.findById(tableId);
  if (!table) throw new Error('Table not found');

  const shop = await Shop.findById(table.shopId);
  if (!shop) throw new Error('Shop not found');

  shop.tables = shop.tables.filter((tableIdRef) => tableIdRef.toString() !== table._id.toString());
  await shop.save();

  await Table.findByIdAndDelete(tableId);
};

// Υπολογισμός της αρχικής διαθεσιμότητας του τραπεζιού βάσει των παραμέτρων bookingHours
const calculateInitializeTableAvailability = (start, end, timeSlotSplit) => {
  const availability = [];
  let currentTime = start;

  while (currentTime < end) {
    availability.push(currentTime);
    currentTime = +(currentTime + timeSlotSplit / 60).toFixed(2);
    if (currentTime % 1 === 0.6) {
      currentTime = Math.floor(currentTime) + 1;
    }
  }

  return availability;
};

// Αρχικοποίηση της διαθεσιμότητας του τραπεζιού για έναν μήνα με βάση το ωράριο κρατήσεων του καταστήματος
const initializeAvailabilityForDateBatch = async (shop, table, dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) throw new Error('Invalid date format');

  const day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];

  // Check if booking is allowed for the specific day
  const bookingHours = table.bookingHours?.[day];
  if (!bookingHours?.isBookingAllowed) {
    return []; // No availability for this day
  }

  // Calculate availability based on shop's opening hours
  const shopBookingHours = shop.openingHours?.[day];
  return calculateInitializeTableAvailability(
    shopBookingHours?.bookingStart,
    shopBookingHours?.bookingEnd,
    shop.timeSlotSplit
  );
};



const checkAvailability = async (req) => {
  const { shopId, dateString, seats } = req.query;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { success: false, message: 'Invalid date format', availability: [] };
    }

    // Retrieve the shop and its booking hours
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return { success: false, message: 'Shop not found', availability: [] };
    }

  

    

    const tables = await Table.find({ shopId });
    if (!tables || tables.length === 0) {
      return { success: false, message: 'No tables found for this shop', availability: [] };
    }

    const availableHoursSet = new Set();

    for (const table of tables) {
      // Check seat capacity
      if (table.seats >= seats) {
        const availabilityForDate = table.availability?.get(dateString) || [];

        for (const hour of availabilityForDate) {
          availableHoursSet.add(hour);
        }

      }
    }

    const availableHours = Array.from(availableHoursSet);

    return { success: true, availability: availableHours };

  } catch (error) {
    console.error(error);
    return { success: false, message: error.message, availability: [] };
  }
};



// Utility Function to Add Minutes to a Time String (e.g., "09:00")
const addMinutesToTime = (timeString, minutes) => {
  const [hours, mins] = timeString.split(':').map(Number);
  const totalMinutes = hours * 60 + mins + minutes;
  const newHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const newMinutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${newHours}:${newMinutes}`;
};

// Βοηθητική συνάρτηση για την εύρεση του τραπεζιού
const findTableById = async (tableId) => {
  const table = await Table.findById(tableId);
  if (!table) {
    throw new Error('Table not found');
  }
  return table;
};

// Βοηθητική συνάρτηση για την προετοιμασία της διαθεσιμότητας
const prepareAvailability = (table, reservationDate) => {
  if (!(table.availability instanceof Map)) {
    throw new Error('Table availability is not a Map');
  }

  const dateKey = new Date(reservationDate).toISOString().split('T')[0];
  const availableHours = table.availability.get(dateKey) || [];

  if (!Array.isArray(availableHours)) {
    throw new Error('Availability for the date is not an array of hours');
  }

  return { dateKey, availableHours };
};

// Συνάρτηση για την ενημέρωση της διαθεσιμότητας κατά την προσθήκη κράτησης
const updateTableAvailability = async (tableId, reservationDate, reservationTime) => {
  try {
    const table = await findTableById(tableId);
    const { dateKey, availableHours } = prepareAvailability(table, reservationDate);

    const estimatedReservationTime = table.estimatedReservationTime;
    const startTime = reservationTime - Math.ceil(estimatedReservationTime / 60);
    const endTime = reservationTime + Math.ceil(estimatedReservationTime / 60);

    const updatedAvailability = availableHours.filter(hour => hour <= startTime || hour >= endTime);

    table.availability.set(dateKey, updatedAvailability);
    await table.save();

    console.log('Table availability updated successfully!');
  } catch (error) {
    console.error('Error updating table availability:', error.message);
    throw error;
  }
};

// Συνάρτηση για την ενημέρωση της διαθεσιμότητας κατά τη διαγραφή κράτησης
const updateWhenReservationDelete = async (tableId, reservationDate, reservationTime) => {
  try {
    const table = await findTableById(tableId);
    const { dateKey, availableHours } = prepareAvailability(table, reservationDate);

    const estimatedReservationTime = table.estimatedReservationTime;
    const startTime = reservationTime - Math.ceil(estimatedReservationTime / 60);
    const endTime = reservationTime + Math.ceil(estimatedReservationTime / 60);

    console.log(`Updating availability for tableId: ${tableId} after reservation deletion`);
    console.log(`Date Key: ${dateKey}`);
    console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

    // Παίρνουμε την τρέχουσα διαθεσιμότητα για την ημερομηνία
    const currentAvailability = new Set(availableHours);

    console.log(`Current availability for ${dateKey}:`, Array.from(currentAvailability));

    // Βρίσκουμε το κατάστημα για να πάρουμε τα booking hours
    const shop = await Shop.findById(table.shopId);
    if (!shop) throw new Error('Shop not found');

    const dayOfWeek = new Date(reservationDate).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const bookingHours = shop.openingHours[dayOfWeek];


    // Προσθέτουμε τις ώρες που επικαλύπτονται με την κράτηση πίσω στη διαθεσιμότητα
    for (let hour = startTime; hour < endTime; hour += 0.5) {
      if (hour <= bookingHours.bookingEnd) {
        currentAvailability.add(hour);
      }
    }

    console.log(`Updated availability for ${dateKey}:`, Array.from(currentAvailability));

    // Ενημερώνουμε τη διαθεσιμότητα για αυτή την ημερομηνία
    table.availability.set(dateKey, Array.from(currentAvailability));

    // Αποθηκεύουμε τις αλλαγές
    await table.save();

    console.log('Table availability updated successfully after reservation deletion!');
  } catch (error) {
    console.error('Error updating table availability after reservation deletion:', error.message);
    throw error;
  }
};
// Συνάρτηση για την εύρεση του καταλληλότερου διαθέσιμου τραπεζιού
const findBestAvailableTable = async (shopId, reservationDate, reservationTime, numberOfPeople) => {
  try {
    const tables = await Table.find({ shopId }).sort({ seats: 1 });

    console.log(`Searching for the best available table for ${numberOfPeople} people on ${reservationDate} at ${reservationTime}`);

    for (let i = numberOfPeople; i <= Math.max(...tables.map(table => table.seats)); i++) {
      console.log(`Checking for tables with at least ${i} seats`);
      for (const table of tables) {
        if (table.seats >= i) {
          const { dateKey, availableHours } = prepareAvailability(table, reservationDate);

          console.log(`Checking table with ${table.seats} seats (ID: ${table._id})`);
          console.log(`Available hours for ${dateKey}:`, availableHours);
          console.log(`Checking availability for ${reservationTime}`);

          if (availableHours.includes(reservationTime)) {
            console.log(`Table found: ${table._id}`);
            return table;
          } else {
            console.log(`Table with ${table.seats} seats (ID: ${table._id}) is not available at ${reservationTime}`);
          }
        }
      }
    }

    throw new Error('No available table found');
  } catch (error) {
    console.error('Error finding best available table:', error.message);
    throw error;
  }
};


const clearAvailabilityForDay = async (tableId, day) => {
  try {
    const table = await Table.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    const availabilityDates = Array.from(table.availability.keys());
    for (const dateString of availabilityDates) {
      const date = new Date(dateString);
      const dayOfWeek = date.toLocaleString('en-us', { weekday: 'long' }).toLowerCase();
      if (dayOfWeek === day) {
        table.availability.set(dateString, []);
      }
    }
    await table.save();
  } catch (error) {
    console.error('Error clearing availability for day:', error.message);
    throw error;
  }
};

// Συνάρτηση για την αρχικοποίηση της διαθεσιμότητας για συγκεκριμένη ημέρα
const setAvailabilityForDay = async (tableId, dayOfWeek) => {
  try {
    const table = await Table.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    const shop = await Shop.findById(table.shopId);
    if (!shop) throw new Error('Shop not found');

    const availabilityDates = Array.from(table.availability.keys());
    for (const dateString of availabilityDates) {
      const date = new Date(dateString);
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const day = daysOfWeek[date.getDay()];

      if (dayOfWeek === day && table.availability.get(dateString).length === 0) {
        const shopBookingHours = shop.openingHours[day];
        const { bookingStart, bookingEnd } = shopBookingHours;
        if (bookingStart !== null && bookingEnd !== null) {
          const availability = calculateInitializeTableAvailability(bookingStart, bookingEnd, shop.timeSlotSplit);
          table.availability.set(dateString, availability);
        }
      }
    }
    await table.save();
  } catch (error) {
    console.error('Error initializing availability for day:', error.message);
    throw error;
  }
};

// Συνάρτηση για τον έλεγχο αν το νέο seatsInput υποστηρίζει μια λίστα κρατήσεων
const unvalidReservationsAfterSeatsEdit = async (reservationIds, seatsInput) => {
  try {
    const invalidReservations = [];

    for (const reservationId of reservationIds) {
      const reservation = await Reservation.findById(reservationId);
      if (!reservation) {
        throw new Error(`Reservation not found: ${reservationId}`);
      }

      const table = await Table.findById(reservation.tableId);
      if (!table) {
        throw new Error(`Table not found for reservation: ${reservationId}`);
      }

      if (seatsInput <reservation.seats) {
        invalidReservations.push(reservation);
      }
    }

    return invalidReservations;
  } catch (error) {
    console.error('Error checking seats input for reservations:', error.message);
    throw error;
  }
};

const invalidReservationForIsBookingAllowedEdit = async (reservations, day) => {
  try {
    const invalidReservations = [];

    for (const reservation of reservations) {
      const reservationDate = new Date(reservation.reservationDate);
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const reservationDay = daysOfWeek[reservationDate.getDay()];

      if (reservationDay === day) {
        invalidReservations.push(reservation);
      }
    }

    return invalidReservations;
  } catch (error) {
    console.error('Error checking reservations for isBookingAllowed edit:', error.message);
    throw error;
  }
};

const getTablesByShopId = async (shopId) => {
  try {
    const tables = await Table.find({ shopId });
    return tables;
  } catch (error) {
    console.error('Error getting tables by shop ID:', error.message);
    throw error;
  }
};

// Συνάρτηση για την ενημέρωση της διαθεσιμότητας βάσει των νέων booking hours
const updateAvailabilityForBookingHoursEdit = async (tableId, dayOfWeek, newBookingStart, newBookingEnd) => {
  try {
    const table = await Table.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    const shop = await Shop.findById(table.shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }

    const oldBookingStart = shop.openingHours[dayOfWeek].bookingStart;
    const oldBookingEnd = shop.openingHours[dayOfWeek].bookingEnd;

    const availabilityDates = Array.from(table.availability.keys());
    for (const dateString of availabilityDates) {
      const date = new Date(dateString);
      const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const day = daysOfWeek[date.getDay()];

      if (dayOfWeek === day) {
        let availability = table.availability.get(dateString);

        // Αφαίρεση ωρών που είναι εκτός του νέου booking end
        if (oldBookingEnd > newBookingEnd) {
          availability = availability.filter(time => time <= newBookingEnd);
        }

        // Αφαίρεση ωρών που είναι εκτός του νέου booking start
        if (oldBookingStart < newBookingStart) {
          availability = availability.filter(time => time >= newBookingStart);
        }

// Προσθήκη ωρών που είναι εντός του νέου booking end
        // Προσθήκη ωρών που είναι εντός του νέου booking end
        if (oldBookingEnd < newBookingEnd) {
          let time = oldBookingEnd;
          while (time < newBookingEnd) {
            5;
            
            if (time <+ newBookingEnd && !availability.includes(time)) {
              availability.push(time);
            }

            time = +time + 0.5;
            if (time % 1 === 0.6) {
              time = Math.floor(time) + 1;
            }

          }
        }

        // Προσθήκη ωρών που είναι εντός του νέου booking start
        if (oldBookingStart >newBookingStart) {
          let time = newBookingStart;
          while (time < oldBookingStart) {
            if (!availability.includes(time)) {
              availability.push(time);
            }
            time = +time + 0.5 ;
            if (time % 1 === 0.6) {
              time = Math.floor(time) + 0.1;
            }
          }
        }

        table.availability.set(dateString, availability.sort((a, b) => a - b));
      }
    }
    await table.save();
  } catch (error) {
    console.error('Error updating availability for booking hours edit:', error.message);
    throw error;
  }
};


module.exports = {
  createTable,
  updateTable,
  deleteTableService,
  initializeAvailabilityForDateBatch,
  checkAvailability,
  updateTableAvailability,
  updateWhenReservationDelete,
  findBestAvailableTable,
  unvalidReservationsAfterSeatsEdit,
  invalidReservationForIsBookingAllowedEdit,
  clearAvailabilityForDay, // Προσθήκη της νέας συνάρτησης στο export
 setAvailabilityForDay, // Προσθήκη της νέας συνάρτησης στο export
 updateAvailabilityForBookingHoursEdit,
 getTablesByShopId,
};
