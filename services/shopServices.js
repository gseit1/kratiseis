const mongoose = require('mongoose');
const Shop = require('../models/shop');
const Reservation = require('../models/reservation');

// Επεξεργασία (edit) καταστήματος
const editShop = async (shopId, updatedData) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }
    Object.assign(shop, updatedData);
    return await shop.save();
};

// Προσθήκη νέου καταστήματος
const addShopService = async (shopData) => {
    const newShop = new Shop(shopData);
    await newShop.save();
    return newShop;
};

// Επιστροφή όλων των καταστημάτων
const getAllShopsService = async () => {
    const shops = await Shop.find();
    return shops;
};

// Επιστροφή συγκεκριμένου καταστήματος
const getShopByIdService = async (shopId) => {
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
        throw new Error('Invalid shopId');
    }

    const shop = await Shop.findById(shopId).populate('tables').populate('reservationList');
    if (!shop) {
        throw new Error('Shop not found');
    }
    return shop;
};

// Επιστροφή λίστας κρατήσεων για συγκεκριμένο κατάστημα
const getShopReservationList = async (shopId) => {
    const shop = await Shop.findById(shopId).populate({
        path: 'reservationList',
        populate: {
            path: 'reservations',
            model: 'Reservation'
        }
    });

    if (!shop) {
        throw new Error('Shop not found');
    }

    const reservationList = {};

    for (const [date, reservations] of Object.entries(shop.reservationList)) {
        const populatedReservations = await Reservation.find({ _id: { $in: reservations } });
        reservationList[date] = {
            count: populatedReservations.length,
            reservations: populatedReservations
        };
    }

    return reservationList;
};


const addToReservationList = async (shopId, date, reservationId) => {
    try {
        console.log(`🔍 addToReservationList | shopId: ${shopId}, date: ${date}, reservationId: ${reservationId}`);

        const shop = await Shop.findById(shopId);
        if (!shop) throw new Error('❌ Shop not found');
        console.log('🏪 Found shop:', shop._id);

        // Μετατροπή ημερομηνίας σε "YYYY-MM-DD"
        const dateString = new Date(date).toISOString().split('T')[0];
        console.log(`📅 Converted date: ${date} -> ${dateString}`);

        // Ελέγχουμε αν το reservationList υπάρχει
        if (!shop.reservationList || typeof shop.reservationList !== 'object') {
            console.log('⚠️ reservationList is undefined or not an object. Initializing...');
            shop.reservationList = {};
        }

        // Αν δεν υπάρχει η συγκεκριμένη ημερομηνία, την προσθέτουμε
        if (!shop.reservationList[dateString]) {
            console.log(`📌 No reservations for ${dateString}, creating empty array.`);
            shop.reservationList[dateString] = [];
        }

        // Προσθήκη κράτησης
        shop.reservationList[dateString].push(reservationId);
        console.log(`✅ Added reservationId ${reservationId} to ${dateString}`);

        shop.markModified('reservationList');
        await shop.save();
        console.log('💾 Reservation list updated successfully.');

        return { success: true, message: 'Reservation added successfully' };
    } catch (error) {
        console.error('❌ Error updating reservation list:', error.message);
        throw error;
    }
};




// Συνάρτηση για την προσθήκη κράτησης στην undefinedReservationList
const addReservationToUndefinedList = async (shopId, reservationId) => {
    try {
        const shop = await Shop.findById(shopId);
        if (!shop) {
            throw new Error('Shop not found');
        }

        // Προσθήκη της κράτησης στην undefinedReservationList
        shop.undefinedReservationList.push(reservationId);

        // Αποθήκευση του καταστήματος με την ενημερωμένη λίστα
        await shop.save();

        return { success: true, message: 'Reservation added to undefinedReservationList successfully' };
    } catch (error) {
        console.error('Error adding reservation to undefinedReservationList:', error.message);
        throw error;
    }
};




const deleteToReservationList = async (shopId, date, reservationId) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    // Μετατροπή της ημερομηνίας σε ISO string (μόνο το date, χωρίς ώρα)
    const dateString = new Date(date).toISOString().split('T')[0]; // Μόνο YYYY-MM-DD

    console.log(`Deleting reservation with ID: ${reservationId} for date: ${dateString}`);

    const reservationsForDate = shop.reservationList[dateString];

    if (!reservationsForDate || !Array.isArray(reservationsForDate)) {
        throw new Error(`No reservations found for date ${dateString}`);
    }

    // Φιλτράρουμε τις κρατήσεις αφαιρώντας αυτή με το συγκεκριμένο reservationId
    const updatedReservations = reservationsForDate.filter(reservation => reservation.toString() !== reservationId.toString());

    // Ενημερώνουμε το αντικείμενο
    if (updatedReservations.length > 0) {
        shop.reservationList[dateString] = updatedReservations;
    } else {
        // Αν δεν υπάρχουν κρατήσεις για την ημερομηνία, αφαιρούμε το key από το αντικείμενο
        delete shop.reservationList[dateString];
    }

    await shop.save();
    return { success: true, message: 'Reservation deleted successfully' };
};



// Διαχείριση του reviewList του Shop
const updateReviewList = async (shopId, reviewId, action) => {
    const shop = await Shop.findById(shopId);
    if (!shop) {
        throw new Error('Shop not found');
    }

    if (action === 'POST') {
        // Προσθήκη του reviewId στη λίστα
        if (!shop.reviewList.includes(reviewId)) {
            shop.reviewList.push(reviewId);
        }
    } else if (action === 'DELETE') {
        // Διαγραφή του reviewId από τη λίστα
        shop.reviewList = shop.reviewList.filter(id => id.toString() !== reviewId.toString());
    } else {
        throw new Error('Invalid action. Must be "POST" or "DELETE".');
    }

    await shop.save();
    return { success: true, message: `Review ${action === 'POST' ? 'added to' : 'removed from'} reviewList successfully` };
};


// Υπολογισμός του μέσου όρου αξιολόγησης
const updateReviewRatingAverage = async (shopId) => {
    const shop = await Shop.findById(shopId).populate('reviewList');
    if (!shop) {
        throw new Error('Shop not found');
    }

    if (shop.reviewList.length === 0) {
        shop.reviewRatingAverage = -1; // Δεν υπάρχουν reviews
    } else {
        const totalRating = shop.reviewList.reduce((sum, review) => sum + review.rating, 0);
        shop.reviewRatingAverage = totalRating / shop.reviewList.length;
    }

    await shop.save();
    return { success: true, message: 'Review rating average updated successfully', averageRating: shop.reviewRatingAverage };
};

const getShopReviews = async (shopId) => {
    try {
      // Εύρεση του καταστήματος και των reviews του
      const shop = await Shop.findById(shopId).populate('reviewList').exec();
  
      if (!shop) {
        throw new Error('Shop not found');
      }
  
      return shop.reviewList; // Επιστροφή των reviews
    } catch (error) {
      throw new Error(error.message);
    }
  };





module.exports = {
    editShop,
    addShopService,
    getAllShopsService,
    getShopByIdService,
    getShopReservationList,
    addReservationToUndefinedList, 
    addToReservationList,
    deleteToReservationList,
    updateReviewList,
    updateReviewRatingAverage,
    getShopReviews,
};

