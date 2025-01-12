const Shop = require('../models/shop');


// Επεξεργασία (edit) καταστήματος
const editShop = async (shopId, updatedData) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }
    Object.assign(shop, updatedData);
    return await shop.save();
};

// Επιστροφή λίστας κρατήσεων για συγκεκριμένο κατάστημα
const getShopReservationList = async (shopId) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }
    return shop.reservationList ? Object.fromEntries(shop.reservationList) : {};
};

const addToReservationList = async (shopId, date, reservationData) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    // Μετατροπή του date σε ISO string
    const dateString = new Date(date).toISOString(); // Αυτό δημιουργεί ένα string τύπου "2025-01-15T19:00:00.000Z"

    // Εάν δεν υπάρχει ήδη το reservationList, το δημιουργούμε
    if (!shop.reservationList) {
        shop.reservationList = new Map();
    }

    // Ελέγχουμε αν υπάρχουν κρατήσεις για την ημερομηνία
    const reservationsForDate = shop.reservationList.get(dateString) || [];

    // Προσθέτουμε τη νέα κράτηση στον πίνακα
    reservationsForDate.push(reservationData);

    // Ενημερώνουμε το Map με το νέο κλειδί ημερομηνίας (ως string)
    shop.reservationList.set(dateString, reservationsForDate);

    // Αποθηκεύουμε το κατάστημα με την ενημερωμένη λίστα κρατήσεων
    await shop.save();

    return { success: true, message: 'Reservation added successfully' };
};





const deleteToReservationList = async (shopId, date, reservationId) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    if (!shop.reservationList || !shop.reservationList.has(date)) {
        throw new Error('No reservations found for the given date');
    }

    const reservationsForDate = shop.reservationList.get(date);

    // Φιλτράρουμε τις κρατήσεις αφαιρώντας αυτή με το συγκεκριμένο reservationId
    const updatedReservations = reservationsForDate.filter(reservation => reservation.id !== reservationId);

    // Ενημερώνουμε το Map
    if (updatedReservations.length > 0) {
        shop.reservationList.set(date, updatedReservations);
    } else {
        // Αν δεν υπάρχουν κρατήσεις για την ημερομηνία, αφαιρούμε το key από το Map
        shop.reservationList.delete(date);
    }

    await shop.save();
    return { success: true, message: 'Reservation deleted successfully' };
};




module.exports = {
    editShop,
    getShopReservationList,
    addToReservationList,
    deleteToReservationList,
};
