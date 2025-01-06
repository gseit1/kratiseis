const Shop = require('../models/shop');
const Table = require('../models/table');

// Συνάρτηση για να ρυθμίσει τη διαθεσιμότητα για μια συγκεκριμένη ημερομηνία
const setAvailabilityForDate = async (shopId, tableId, dateString) => {
    try {
        // Μετατροπή της ημερομηνίας σε αντικείμενο Date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
        }

        // Υπολογισμός ημέρας της εβδομάδας (π.χ., Monday, Tuesday)
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const day = daysOfWeek[date.getDay()];

        // Βρες το κατάστημα και έλεγξε αν υπάρχει
        const shop = await Shop.findById(shopId);
        if (!shop) {
            throw new Error('Shop not found');
        }

        // Πάρε το timeSlotSplit του καταστήματος
        const timeSlotSplit = shop.timeSlotSplit;

        // Βρες το τραπέζι
        const table = await Table.findOne({ shopId, _id: tableId });
        if (!table) {
            throw new Error('Table not found');
        }

        // Έλεγχος αν υπάρχει ήδη διαθεσιμότητα για την ημερομηνία
        if (table.availability.has(dateString)) {
            return { success: true, message: `Availability for ${dateString} already exists. No changes made.` };
        }

        // Επαλήθευση του bookingHours για την ημέρα
        const bookingHours = table.bookingHours[day];
        if (!bookingHours || !bookingHours.isBookingAllowed) {
            return { success: false, message: `Booking is not allowed on ${day}` };
        }

        const { start, end } = bookingHours;
        if (start === null || end === null) {
            return { success: false, message: `Invalid booking hours for ${day}` };
        }

        // Υπολογισμός διαθεσιμότητας
        const availability = [];
        let currentTime = start;

        while (currentTime < end) {
            availability.push(currentTime);
            currentTime = +(currentTime + timeSlotSplit / 60).toFixed(2);
            if (currentTime % 1 === 0.6) {
                currentTime = Math.floor(currentTime) + 1; // Διορθώνει τα 10.6 -> 11.0
            }
        }

        // Ενημέρωση του availability map για κάθε τραπέζι
        table.availability.set(dateString, availability);
        await table.save();

        return { success: true, message: `Availability set for ${dateString}` };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

// Συνάρτηση για να ελέγξει τη διαθεσιμότητα
const checkAvailability = async (req, res) => {
    const { shopId, dateString, seats } = req.query;

    try {
        // Μετατροπή της ημερομηνίας σε αντικείμενο Date
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format', availability: [] });
        }

        // Ανάκτηση όλων των τραπεζιών του καταστήματος
        const tables = await Table.find({ shopId });
        if (!tables || tables.length === 0) {
            return res.status(404).json({ success: false, message: 'No tables found for this shop', availability: [] });
        }

        const availableHoursSet = new Set(); // Χρησιμοποιούμε Set για να αποφεύγουμε διπλότυπες ώρες

        // Εκτέλεση της setAvailabilityForDate για κάθε τραπέζι πριν από τον έλεγχο
        for (const table of tables) {
            // Ενημέρωση availability για την ημερομηνία (αν χρειάζεται)
            await setAvailabilityForDate(shopId, table._id, dateString);
        }

        // Έλεγχος διαθεσιμότητας για κάθε τραπέζι που πληροί τις προϋποθέσεις (ανάλογα με τις θέσεις)
        for (const table of tables) {
            // Έλεγχος αν το τραπέζι πληροί τον αριθμό των θέσεων
            if (table.seats >= seats) {
                // Ανάκτηση διαθεσιμότητας για τη συγκεκριμένη ημερομηνία
                const availabilityForDate = table.availability.get(dateString) || [];

                // Προσθήκη των ωρών στο Set
                for (const hour of availabilityForDate) {
                    availableHoursSet.add(hour);
                }
            }
        }

        // Μετατροπή του Set σε πίνακα και ταξινόμηση σε αύξουσα σειρά
        const availableHours = Array.from(availableHoursSet).sort((a, b) => a - b);

        return res.json({ success: true, availability: availableHours });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message, availability: [] });
    }
};

module.exports = { checkAvailability };
