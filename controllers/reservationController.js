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

module.exports = {
    addReservation,
};
