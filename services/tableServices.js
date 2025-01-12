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


// Υπολογισμός της αρχικής διαθεσιμότητας του τραπεζιού
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

// Αρχικοποίηση της διαθεσιμότητας του τραπεζιου για εναν μηνα με βαση το ωραριο τραπεζιου για καθε μερα
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

  const { start, end } = bookingHours;
  if (start === null || end === null) {
    return { success: false, message: `Invalid booking hours for ${day}` };
  }

  // Υπολογισμός διαθεσιμότητας με βάση τις ώρες κράτησης
  const availability = calculateInitializeTableAvailability(start, end, shop.timeSlotSplit);

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

const updateTableAvailability = async (tableId, reservationDate, reservationTime) => {
    try {
        // Βρίσκουμε το τραπέζι από το tableId
        const table = await Table.findById(tableId);
        if (!table) {
            throw new Error('Table not found');
        }

        // Ελέγχουμε αν η διαθεσιμότητα είναι Map
        if (!(table.availability instanceof Map)) {
            throw new Error('Table availability is not a Map');
        }

        // Δημιουργούμε το κλειδί της ημερομηνίας
        const dateKey = new Date(reservationDate).toISOString().split('T')[0];

        // Υπολογισμός start και end time
        const estimatedReservationTime = table.estimatedReservationTime; // π.χ. 120 λεπτά
        const startTime = reservationTime - Math.ceil(estimatedReservationTime / 60); // Μετατροπή λεπτών σε ώρες
        const endTime = reservationTime + Math.ceil(estimatedReservationTime / 60);

        console.log(`Updating availability for tableId: ${tableId}`);
        console.log(`Date Key: ${dateKey}`);
        console.log(`Start Time: ${startTime}, End Time: ${endTime}`);

        // Παίρνουμε την τρέχουσα διαθεσιμότητα για την ημερομηνία
        const availableHours = table.availability.get(dateKey) || [];

        console.log(`Current availability for ${dateKey}:`, availableHours);

        // Ελέγχουμε αν το πεδίο availableHours είναι πίνακας
        if (!Array.isArray(availableHours)) {
            throw new Error('Availability for the date is not an array of hours');
        }

        // Φιλτράρουμε τις ώρες που επικαλύπτονται με την κράτηση
        const updatedAvailability = availableHours.filter(hour => hour < startTime || hour >= endTime);

        console.log(`Updated availability for ${dateKey}:`, updatedAvailability);

        // Ενημερώνουμε τη διαθεσιμότητα για αυτή την ημερομηνία
        table.availability.set(dateKey, updatedAvailability);

        // Αποθηκεύουμε τις αλλαγές
        await table.save();

        console.log('Table availability updated successfully!');
    } catch (error) {
        console.error('Error updating table availability:', error.message);
        throw error;
    }
};




  
  
  
  







module.exports = {
  createTable,
  updateTable,
  deleteTableService,
  checkAvailability,
  updateTableAvailability,
};
