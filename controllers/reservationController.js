const Reservation = require('../models/reservation');
const Shop = require('../models/shop');
const Table = require('../models/table');

const addReservation = async (req, res) => {
    try {
        const { reservationDate, shopId, userId, tableId, reservationTime, commentFromUser, userName } = req.body;

        // Εύρεση του καταστήματος
        const shop = await Shop.findById(shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Εύρεση του τραπεζιού
        const table = await Table.findById(tableId);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Δημιουργία νέας κράτησης
        const newReservation = new Reservation({
            reservationDate,
            shopName: shop.shopName,
            userName,
            shopId,
            userId,
            tableId,
            reservationTime,
            commentFromUser,
        });

        // Αποθήκευση της κράτησης
        await newReservation.save();

        // Ενημέρωση του reservationList στο Shop
        if (!shop.reservationList) {
            shop.reservationList = new Map(); // Δημιουργία νέου Map αν δεν υπάρχει
        }

        const reservationList = shop.reservationList.get(reservationDate) || []; // Λήψη της ημερομηνίας
        reservationList.push(newReservation._id.toString()); // Προσθήκη του ID της κράτησης
        shop.reservationList.set(reservationDate, reservationList); // Ενημέρωση του Map

        shop.markModified('reservationList'); // Ενημέρωση για το Mongoose ότι το Map άλλαξε
        await shop.save(); // Αποθήκευση του καταστήματος

        // Ενημέρωση του reserved στο Table
        if (!table.reserved) {
            table.reserved = new Map(); // Δημιουργία νέου Map αν δεν υπάρχει
        }

        const reservedTimes = table.reserved.get(reservationDate) || []; // Λήψη των κρατήσεων της ημέρας
        reservedTimes.push(reservationTime); // Προσθήκη της ώρας κράτησης
        table.reserved.set(reservationDate, reservedTimes); // Ενημέρωση του Map

        table.markModified('reserved'); // Ενημέρωση για το Mongoose ότι το Map άλλαξε
        await table.save(); // Αποθήκευση του τραπεζιού

        // Επιστροφή της νέας κράτησης
        res.status(201).json(newReservation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//!Edit reservation για επεξεργασια κρατησεων

const editReservation = async (req, res) => {
    try {
        const { reservationId } = req.params;
        const updates = req.body; // Τα πεδία που θέλεις να ενημερώσεις
        
        // Εύρεση της κράτησης
        const reservation = await Reservation.findById(reservationId);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        // Ενημέρωση της κράτησης
        Object.keys(updates).forEach((key) => {
            reservation[key] = updates[key];
        });

        // Αποθήκευση της ενημερωμένης κράτησης
        await reservation.save();

        // Ενημέρωση του Shop (προαιρετικά αν το reservationDate αλλάζει)
        if (updates.reservationDate || updates.reservationTime || updates.tableId) {
            const shop = await Shop.findById(reservation.shopId);
            if (!shop) {
                return res.status(404).json({ message: 'Shop not found' });
            }

            // Αφαιρούμε την παλιά κράτηση από το reservationList
            const oldReservationDate = reservation.reservationDate.toISOString().split('T')[0];
            const reservationList = shop.reservationList.get(oldReservationDate) || [];
            const index = reservationList.indexOf(reservation._id);
            if (index !== -1) reservationList.splice(index, 1);
            shop.reservationList.set(oldReservationDate, reservationList);

            // Προσθέτουμε τη νέα κράτηση στο νέο reservationDate
            const newReservationDate = updates.reservationDate || oldReservationDate;
            const newReservationList = shop.reservationList.get(newReservationDate) || [];
            newReservationList.push(reservation._id);
            shop.reservationList.set(newReservationDate, newReservationList);

            await shop.save();
        }

        // Ενημέρωση του Table (προαιρετικά αν το tableId αλλάζει)
        if (updates.tableId) {
            const oldTable = await Table.findById(reservation.tableId);
            const newTable = await Table.findById(updates.tableId);

            if (oldTable) {
                const reservedTimes = oldTable.reserved.get(reservation.reservationDate) || [];
                const timeIndex = reservedTimes.indexOf(reservation.reservationTime);
                if (timeIndex !== -1) reservedTimes.splice(timeIndex, 1);
                oldTable.reserved.set(reservation.reservationDate, reservedTimes);
                await oldTable.save();
            }

            if (newTable) {
                const reservedTimes = newTable.reserved.get(updates.reservationDate || reservation.reservationDate) || [];
                reservedTimes.push(updates.reservationTime || reservation.reservationTime);
                newTable.reserved.set(updates.reservationDate || reservation.reservationDate, reservedTimes);
                await newTable.save();
            }
        }

        res.status(200).json({ message: 'Reservation updated successfully', reservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    editReservation,
};


module.exports = {
    addReservation,
    editReservation,
};
