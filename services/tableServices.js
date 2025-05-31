const Table = require('../models/table');
const Reservation = require('../models/reservation');
const Shop = require('../models/shop');
const FloorPanel = require('../models/floorPanel');

// Service για τη δημιουργία τραπεζιού
const createTable = async (shopId, tableData) => {
  const shop = await Shop.findById(shopId);
  if (!shop) throw new Error('Shop not found');

  const newTable = new Table(tableData);
  await newTable.save();

  shop.tables.push(newTable._id);
  await shop.save();

  // Αν υπάρχει floorPanelId, ενημέρωσε και το table και το floorPanel
  if (tableData.floorPanelId) {
    // Ενημέρωσε το table (αν δεν το έχει ήδη)
    if (!newTable.floorPanelId || String(newTable.floorPanelId) !== String(tableData.floorPanelId)) {
      newTable.floorPanelId = tableData.floorPanelId;
      await newTable.save();
    }
    // Πρόσθεσε το table στο floorPanel
    await FloorPanel.findByIdAndUpdate(
      tableData.floorPanelId,
      { $push: { tables: { tableId: newTable._id, x: tableData.x || 0, y: tableData.y || 0 } } }
    );
  }

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

  newTable.availability = availabilityMap;
  await newTable.save();

  return newTable;
};

// Service για την επεξεργασία τραπεζιού
const updateTable = async (tableId, updateData) => {
  const table = await Table.findById(tableId);
  if (!table) throw new Error('Table not found');

  // Αν αλλάζει το floorPanelId
  if (updateData.floorPanelId && String(updateData.floorPanelId) !== String(table.floorPanelId)) {
    // Αφαίρεση από το παλιό floorPanel
    if (table.floorPanelId) {
      await FloorPanel.findByIdAndUpdate(
        table.floorPanelId,
        { $pull: { tables: { tableId: table._id } } }
      );
    }
    // Προσθήκη στο νέο floorPanel
    await FloorPanel.findByIdAndUpdate(
      updateData.floorPanelId,
      { $push: { tables: { tableId: table._id, x: updateData.x || 0, y: updateData.y || 0 } } }
    );
    // Ενημέρωσε το πεδίο στο table
    table.floorPanelId = updateData.floorPanelId;
    await table.save();
  }

  // Ενημέρωση των υπόλοιπων πεδίων
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

  // Αφαίρεση από το shop
  shop.tables = shop.tables.filter((tableIdRef) => tableIdRef.toString() !== table._id.toString());
  await shop.save();

  // Αφαίρεση από το floorPanel (αν υπάρχει)
  if (table.floorPanelId) {
    await FloorPanel.findByIdAndUpdate(
      table.floorPanelId,
      { $pull: { tables: { tableId: table._id } } }
    );
  }

  await Table.findByIdAndDelete(tableId);
};

// Υπολογισμός της αρχικής διαθεσιμότητας του τραπεζιού βάσει των παραμέτρων bookingHours
const calculateInitializeTableAvailability = (start, end, timeSlotSplit) => {
  const availability = [];
  let currentTime = start;

  while (currentTime <= end) {
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
  const { shopId, dateString, seats, floorPanelId } = req.query;

  console.log("Checking availability with the following parameters:");
  console.log("Shop ID:", shopId);
  console.log("Date String:", dateString);
  console.log("Seats:", seats);
  console.log("Floor Panel ID:", floorPanelId);

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error("Invalid date format:", dateString);
      return { success: false, message: 'Invalid date format', availability: [] };
    }

    const shop = await Shop.findById(shopId);
    if (!shop) {
      console.error("Shop not found for ID:", shopId);
      return { success: false, message: 'Shop not found', availability: [] };
    }

    const tablesQuery = { shopId };
    if (floorPanelId) {
      tablesQuery.floorPanelId = floorPanelId;
    }

    console.log("Tables Query:", tablesQuery);

    const tables = await Table.find(tablesQuery).populate('floorPanelId');
    console.log("Found Tables:", tables);

    if (!tables || tables.length === 0) {
      console.warn("No tables found for the given criteria.");
      return { success: false, message: 'No tables found for this shop or floor panel', availability: [] };
    }

    const availableHoursSet = new Set();

    for (const table of tables) {
      console.log("Processing Table:", table._id, "Seats:", table.seats);

      if (table.seats >= seats && table.minimumSeats <= seats) {
        let availabilityForDate = [];
        if (table.availability instanceof Map) {
          availabilityForDate = table.availability.get(dateString) || [];
        } else {
          availabilityForDate = table.availability?.[dateString] || [];
        }

        console.log("Availability for Table on Date:", availabilityForDate);

        for (const hour of availabilityForDate) {
          availableHoursSet.add(hour);
        }
      } else {
        console.log("Table does not meet seat requirements:", table._id);
      }
    }

    const availableHours = Array.from(availableHoursSet).sort((a, b) => a - b);
    console.log("Final Available Hours:", availableHours);

    return { success: true, availability: availableHours };
  } catch (error) {
    console.error("Error in checkAvailability:", error.message);
    return { success: false, message: error.message, availability: [] };
  }
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
  // Log αρχικών δεδομένων
  console.log("Raw table object:", JSON.stringify(table, null, 2));
  console.log("Received reservationDate:", reservationDate);

  // Έλεγχος αν το table.availability είναι undefined ή null
  if (!table || !table.availability) {
      console.error("Error: table.availability is undefined or null!");
      return { dateKey: null, availableHours: [] };
  }

  // Έλεγχος αν το availability είναι ήδη Map
  if (!(table.availability instanceof Map)) {
      console.log("Converting table.availability to a Map...");
      try {
          table.availability = new Map(Object.entries(table.availability || {}));
          console.log("Converted table.availability entries:", Array.from(table.availability.entries()));
      } catch (error) {
          console.error("Error converting table.availability to Map:", error);
          return { dateKey: null, availableHours: [] };
      }
  }

  // Έλεγχος αν το reservationDate είναι έγκυρη ημερομηνία
  if (!reservationDate || isNaN(new Date(reservationDate).getTime())) {
      console.error("Error: Invalid reservationDate:", reservationDate);
      return { dateKey: null, availableHours: [] };
  }

  // Δημιουργία του dateKey
  const dateKey = new Date(reservationDate).toISOString().split('T')[0];
  console.log("Using dateKey:", dateKey);

  // Ανάκτηση διαθέσιμων ωρών
  const availableHours = table.availability.get(dateKey);
  console.log("Extracted availableHours:", availableHours);

  // Έλεγχος αν το availableHours είναι array
  if (!Array.isArray(availableHours)) {
      console.error("Error: Availability for the date is not an array!");
      return { dateKey, availableHours: [] };
  }

  return { dateKey, availableHours };
};





// Συνάρτηση για την ενημέρωση της διαθεσιμότητας κατά την προσθήκη κράτησης
const updateTableAvailability = async (tableId, reservationDate, reservationTime) => {
  try {
    reservationTime = parseFloat(reservationTime);
    const table = await findTableById(tableId);
    
    // Build the dateKey
    const dateKey = new Date(reservationDate).toISOString().split('T')[0];
    console.log("Using dateKey:", dateKey);
    
    // Retrieve available hours as a plain object property
    let availableHours = table.availability[dateKey] || [];
    console.log(`Current availability for ${dateKey}:`, availableHours);
    
    const estimatedReservationTime = table.estimatedReservationTime;
    const blockSlots = Math.ceil(estimatedReservationTime / 60);
    const startTime = reservationTime - blockSlots;
    const endTime = reservationTime + blockSlots;
    console.log(`For reservationTime ${reservationTime} and estimatedReservationTime ${estimatedReservationTime} minutes:`);
    console.log(`Calculated startTime: ${startTime}, endTime: ${endTime}`);
    
    // Filter out the reserved block; retain hours less or equal to startTime or greater or equal to endTime.
    const updatedAvailability = availableHours
    .filter(hour => hour <= startTime || hour >= endTime)
    .sort((a, b) => a - b);    console.log(`Updated availability for ${dateKey}:`, updatedAvailability);
    
    // Save the updated availability directly by using the object notation
    table.availability[dateKey] = updatedAvailability;
    table.markModified("availability");
    await table.save();
    console.log("Table availability updated successfully!");
  } catch (error) {
    console.error("Error updating table availability:", error.message);
    throw error;
  }
};

// Συνάρτηση για την ενημέρωση της διαθεσιμότητας κατά τη διαγραφή κράτησης
const updateWhenReservationDelete = async (tableId, reservationDate, reservationTime) => {
  try {
    reservationTime = parseFloat(reservationTime);
    const table = await findTableById(tableId);

    // Build the dateKey using the reservationDate
    const dateKey = new Date(reservationDate).toISOString().split('T')[0];
    console.log("Using dateKey:", dateKey);

    // Retrieve available hours as a plain object property
    let availableHours = table.availability[dateKey] || [];
    console.log(`Extracted availableHours for ${dateKey}:`, availableHours);

    const estimatedReservationTime = table.estimatedReservationTime;
    const startTime = reservationTime - Math.ceil(estimatedReservationTime / 60);
    const endTime = reservationTime + Math.ceil(estimatedReservationTime / 60);
    console.log(`Updating availability for tableId: ${tableId} after reservation deletion`);
    console.log(`Date Key: ${dateKey}`);
    console.log(`Calculated startTime: ${startTime}, endTime: ${endTime}`);

    // Build a Set from the current available hours
    const currentAvailability = new Set(availableHours);
    console.log(`Current availability for ${dateKey}:`, Array.from(currentAvailability));

    // Retrieve all reservations for the same table and date
    const overlappingReservations = await Reservation.find({
      tableId,
      reservationDate: new Date(reservationDate),
    });

    console.log(`Found overlapping reservations for ${dateKey}:`, overlappingReservations);

    // Retrieve the shop to get booking hours
    const shop = await Shop.findById(table.shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }

    // Get the day of the week
    const dayOfWeek = new Date(reservationDate).toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    const bookingHours = shop.openingHours?.[dayOfWeek];

    if (!bookingHours || !bookingHours.isOpen) {
      console.log(`Shop is closed on ${dayOfWeek}. No availability to update.`);
      return;
    }

    const bookingStart = bookingHours.bookingStart;
    const bookingEnd = bookingHours.bookingEnd;

    console.log(`Booking hours for ${dayOfWeek}: start=${bookingStart}, end=${bookingEnd}`);

    // Add the boundary hours (bookingStart and bookingEnd) to the availability if they are not blocked
    if (!overlappingReservations.some(reservation => {
      const resTime = parseFloat(reservation.reservationTime);
      const resStart = resTime - Math.ceil(estimatedReservationTime / 60);
      const resEnd = resTime + Math.ceil(estimatedReservationTime / 60);
      return bookingStart >= resStart && bookingStart < resEnd;
    })) {
      currentAvailability.add(bookingStart);
    }

    if (!overlappingReservations.some(reservation => {
      const resTime = parseFloat(reservation.reservationTime);
      const resStart = resTime - Math.ceil(estimatedReservationTime / 60);
      const resEnd = resTime + Math.ceil(estimatedReservationTime / 60);
      return bookingEnd > resStart && bookingEnd <= resEnd;
    })) {
      currentAvailability.add(bookingEnd);
    }

    // Re-add (or "restore") the hours within the deleted reservation block
    for (let hour = startTime; hour < endTime; hour += 0.5) {
      // Check if this hour is within the booking hours
      if (hour < bookingStart || hour >= bookingEnd) {
        continue; // Skip hours outside the booking range
      }

      // Check if this hour is not blocked by another reservation
      const isBlockedByOtherReservation = overlappingReservations.some((reservation) => {
        const resTime = parseFloat(reservation.reservationTime);
        const resStart = resTime - Math.ceil(estimatedReservationTime / 60);
        const resEnd = resTime + Math.ceil(estimatedReservationTime / 60);
        return hour > resStart && hour < resEnd;
      });

      if (!isBlockedByOtherReservation) {
        currentAvailability.add(hour);
      }
    }

    console.log(`Updated availability for ${dateKey}:`, Array.from(currentAvailability));

    // Save the updated availability back using standard object notation
    table.availability[dateKey] = Array.from(currentAvailability).sort((a, b) => a - b);
    table.markModified("availability");
    await table.save();

    console.log('Table availability updated successfully after reservation deletion!');
  } catch (error) {
    console.error('Error updating table availability after reservation deletion:', error.message);
    throw error;
  }
};




// Συνάρτηση για την εύρεση του καταλληλότερου διαθέσιμου τραπεζιού
const findBestAvailableTable = async (shopId, reservationDate, reservationTime, numberOfPeople, floorPanelId = null) => {
  try {
    const dateKey = new Date(reservationDate).toISOString().split('T')[0];
    const parsedReservationTime = parseFloat(reservationTime);

    // Δημιουργία query για αναζήτηση τραπεζιών
    let tableQuery = {
      shopId,
      seats: { $gte: numberOfPeople },
      minimumSeats: { $lte: numberOfPeople },
      [`availability.${dateKey}`]: { $in: [parsedReservationTime] },
    };

    // Αν υπάρχει floorPanelId, προσθέτουμε φίλτρο για το συγκεκριμένο floorPanel
    if (floorPanelId && floorPanelId !== 'null') {
      tableQuery = {
        ...tableQuery,
        floorPanelId: floorPanelId, // Ενημέρωση του query με το floorPanelId
      };
    }

    console.log("Table Query for findBestAvailableTable:", tableQuery);

    // Αναζήτηση τραπεζιού με βάση το query
    const table = await Table.findOne(tableQuery).sort({ seats: 1 });

    if (!table) {
      throw new Error('No available table found');
    }

    console.log("Best table found:", table);
    return table;
  } catch (error) {
    console.error('Error in findBestAvailableTable:', error.message);
    throw error;
  }
};

const clearAvailabilityForDay = async (tableId, day) => {
  try {
    const table = await Table.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }

    // Ensure availability is a plain object.
    if (table.availability instanceof Map) {
      table.availability = Object.fromEntries(table.availability);
    } else if (!table.availability || typeof table.availability !== 'object') {
      table.availability = {};
    }

    // Iterate over each date key in availability.
    const availabilityDates = Object.keys(table.availability);
    for (const dateString of availabilityDates) {
      const date = new Date(dateString);
      const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
      if (dayOfWeek === day) {
        table.availability[dateString] = [];
        console.log(`Cleared availability for ${dateString}`);
      }
    }
    
    table.markModified('availability');
    await table.save();
    console.log(`Availability cleared successfully for day: ${day}`);
  } catch (error) {
    console.error('Error clearing availability for day:', error.message);
    throw error;
  }
};

// Συνάρτηση για την αρχικοποίηση της διαθεσιμότητας για συγκεκριμένη ημέρα
const setAvailabilityForDay = async (tableId, day) => {
  try {
    const table = await Table.findById(tableId);
    if (!table) throw new Error('Table not found');

    // Ensure availability is a plain object.
    if (!table.availability || typeof table.availability !== 'object') {
      table.availability = {};
    }

    // Get the shop info to calculate new availability.
    const shop = await Shop.findById(table.shopId);
    if (!shop) {
      throw new Error('Shop not found');
    }

    // Get the booking hours for the given day; e.g., shop.openingHours.saturday
    const bookingHours = shop.openingHours[day];
    if (!bookingHours || !bookingHours.isOpen) {
      console.log(`Shop is closed on ${day} -- clearing availability`);
      // If shop is closed on that day, clear all availability for that day.
      const availabilityDates = Object.keys(table.availability);
      for (const dateString of availabilityDates) {
        const date = new Date(dateString);
        const dayOfWeek = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
        if (dayOfWeek === day) {
          table.availability[dateString] = [];
          console.log(`Cleared availability for ${dateString}`);
        }
      }
      table.markModified('availability');
      await table.save();
      return;
    }

    // Calculate the new availability based on the booking hours and the shop's timeSlotSplit.
    const newAvailability = calculateInitializeTableAvailability(
      bookingHours.bookingStart,
      bookingHours.bookingEnd,
      shop.timeSlotSplit
    );
    console.log(`New availability for ${day}:`, newAvailability);

    // Iterate over each date key in the table's availability and reinitialize those matching the day.
    const availabilityDates = Object.keys(table.availability);
    for (const dateString of availabilityDates) {
      const date = new Date(dateString);
      const currentDay = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
      if (currentDay === day) {
        table.availability[dateString] = newAvailability;
        console.log(`Reinitialized availability for ${dateString} to:`, newAvailability);
      }
    }

    table.markModified('availability');
    await table.save();
    console.log('Availability reinitialized successfully for day:', day);
  } catch (error) {
    console.error('Error in setAvailabilityForDay:', error.message);
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
    const tables = await Table.find({ shopId }).populate('floorPanelId');
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

    // Calculate new availability array based on the new booking hours and the shop's timeSlotSplit.
    const newAvailability = calculateInitializeTableAvailability(newBookingStart, newBookingEnd, shop.timeSlotSplit);
    console.log(`New availability calculated for ${dayOfWeek}:`, newAvailability);

    // Ensure availability is a plain object.
    if (!table.availability || typeof table.availability !== 'object') {
      table.availability = {};
    }

    // Iterate over each date in the availability.
    const availabilityDates = Object.keys(table.availability);
    for (const dateString of availabilityDates) {
      const date = new Date(dateString);
      const currentDay = date.toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
      // Check if this date matches the edited day (e.g., "saturday")
      if (currentDay === dayOfWeek) {
        // Reinitialize the availability array with the new booking hours.
        table.availability[dateString] = newAvailability;
        console.log(`Reinitialized availability for ${dateString} to:`, newAvailability);
      }
    }

    table.markModified('availability');
    await table.save();
    console.log('Availability reinitialized successfully for day:', dayOfWeek);
  } catch (error) {
    console.error('Error updating availability for booking hours edit:', error.message);
    throw error;
  }
};



const getTableReservationsForDate = async (tableId, dateString) => {
  // dateString: 'YYYY-MM-DD'
  const reservations = await Reservation.find({
    tableId,
    reservationDate: new Date(dateString)
  });
  return reservations;
};

const getTableWithPanel = async (tableId) => {
  return Table.findById(tableId).populate('floorPanelId');
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
 getTableReservationsForDate,    
 getTableWithPanel, 
                                                                 
};
