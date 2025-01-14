const Table = require('../models/table');
const Shop = require('../models/shop');

// Service για τη δημιουργία τραπεζιού
const createTable = async (shopId, tableData) => {
  const shop = await Shop.findById(shopId);
  if (!shop) throw new Error('Shop not found');

  const newTable = new Table(tableData);
  await newTable.save();

  shop.tables.push(newTable._id);
  await shop.save();

  // Αρχικοποίηση της διαθεσιμότητας για τις επόμενες 30 ημέρες
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateString = date.toISOString().split('T')[0]; // Μορφή ημερομηνίας YYYY-MM-DD
    await initializeAvailabilityForDate(shopId, newTable._id, dateString);
  }

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
const initializeAvailabilityForDate = async (shopId, tableId, dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const day = daysOfWeek[date.getDay()];

  const shop = await Shop.findById(shopId);
  const table = await Table.findById(tableId);

  if (!shop) throw new Error('Shop not found');
  if (!table) throw new Error('Table not found');

  // Έλεγχος αν είναι επιτρεπτή η κράτηση για την ημέρα
  const bookingHours = table.bookingHours[day];
  if (!bookingHours || !bookingHours.isBookingAllowed) {
    return { success: false, message: `Booking is not allowed on ${day}` };
  }

  const shopBookingHours = shop.openingHours[day];
  const { bookingStart, bookingEnd } = shopBookingHours;
  if (bookingStart === null || bookingEnd === null) {
    return { success: false, message: `Invalid booking hours for ${day}` };
  }

  // Υπολογισμός διαθεσιμότητας με βάση τις ώρες κρατήσεων του καταστήματος
  const availability = calculateInitializeTableAvailability(bookingStart, bookingEnd, shop.timeSlotSplit);

  // Αρχικοποίηση της διαθεσιμότητας για τη συγκεκριμένη ημερομηνία
  if (!table.availability) {
    table.availability = new Map();
  }

  // Ελέγχουμε αν υπάρχει ήδη καταγεγραμμένη διαθεσιμότητα για τη συγκεκριμένη ημερομηνία
  if (table.availability.has(dateString)) {
    return { success: true, message: `Availability for ${dateString} already initialized.` };
  }

  // Αρχικοποίηση της διαθεσιμότητας με τις ώρες για αυτήν την ημερομηνία
  table.availability.set(dateString, availability);

  await table.save();

  return { success: true, message: `Availability initialized for ${dateString}` };
};

const checkAvailability = async (req) => {
  const { shopId, dateString, seats } = req.query;

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return { success: false, message: 'Invalid date format', availability: [] };
    }

    const tables = await Table.find({ shopId });
    if (!tables || tables.length === 0) {
      return { success: false, message: 'No tables found for this shop', availability: [] };
    }

    const availableHoursSet = new Set();

    for (const table of tables) {
      if (table.seats >= seats) {
        const availabilityForDate = table.availability.get(dateString) || [];

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
    const startTime = reservationTime;
    const endTime = reservationTime + Math.ceil(estimatedReservationTime / 60);

    const updatedAvailability = availableHours.filter(hour => hour < startTime || hour >= endTime);

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
    const startTime = reservationTime;
    const endTime = reservationTime + Math.ceil(estimatedReservationTime / 60);

    console.log(`Updating availability for tableId: ${tableId} after reservation deletion`);
    console.log(`Date Key: ${dateKey}`);
    console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

    // Παίρνουμε την τρέχουσα διαθεσιμότητα για την ημερομηνία
    const currentAvailability = [...availableHours];

    console.log(`Current availability for ${dateKey}:`, currentAvailability);

    // Προσθέτουμε τις ώρες που επικαλύπτονται με την κράτηση πίσω στη διαθεσιμότητα
    for (let hour = startTime; hour < endTime; hour += 0.5) {
      if (!currentAvailability.includes(hour)) {
        currentAvailability.push(hour);
      }
    }

    // Ταξινομούμε τις ώρες για να διατηρήσουμε τη σειρά
    currentAvailability.sort((a, b) => a - b);

    console.log(`Updated availability for ${dateKey}:`, currentAvailability);

    // Ενημερώνουμε τη διαθεσιμότητα για αυτή την ημερομηνία
    table.availability.set(dateKey, currentAvailability);

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

module.exports = {
  createTable,
  updateTable,
  deleteTableService,
  checkAvailability,
  updateTableAvailability,
  updateWhenReservationDelete,
  findBestAvailableTable,
};
