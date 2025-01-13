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


const addToReservationList = async (shopId, date, reservationId) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    // Μετατροπή της ημερομηνίας σε ISO string (μόνο η ημερομηνία, χωρίς ώρα)
    const dateString = new Date(date).toISOString().split('T')[0]; // Μόνο YYYY-MM-DD

    // Αν δεν υπάρχει ήδη το reservationList, το αρχικοποιούμε
    if (!shop.reservationList) {
        shop.reservationList = new Map();
    }

    // Ελέγχουμε αν υπάρχουν κρατήσεις για την ημερομηνία
    const reservationsForDate = shop.reservationList.get(dateString) || [];

    // Προσθέτουμε το reservationId στον πίνακα κρατήσεων
    reservationsForDate.push(reservationId);

    // Ενημερώνουμε το Map με το νέο κλειδί ημερομηνίας
    shop.reservationList.set(dateString, reservationsForDate);

    // Αποθηκεύουμε το κατάστημα με την ενημερωμένη λίστα κρατήσεων
    await shop.save();

    return { success: true, message: 'Reservation ID added successfully' };
};

const deleteToReservationList = async (shopId, date, reservationId) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    // Μετατροπή της ημερομηνίας σε ISO string (μόνο η ημερομηνία, χωρίς ώρα)
    const dateString = new Date(date).toISOString().split('T')[0]; // Μόνο YYYY-MM-DD

    console.log(`Deleting reservation with ID: ${reservationId} for date: ${dateString}`);

    if (!shop.reservationList || !shop.reservationList.has(dateString)) {
        throw new Error('No reservations found for the given date');
    }

    const reservationsForDate = shop.reservationList.get(dateString);

    // Φιλτράρουμε τις κρατήσεις αφαιρώντας αυτή με το συγκεκριμένο reservationId
    const updatedReservations = reservationsForDate.filter(reservation => reservation.toString() !== reservationId.toString());

    // Ενημερώνουμε το Map
    if (updatedReservations.length > 0) {
        shop.reservationList.set(dateString, updatedReservations);
    } else {
        // Αν δεν υπάρχουν κρατήσεις για την ημερομηνία, αφαιρούμε το key από το Map
        shop.reservationList.delete(dateString);
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
