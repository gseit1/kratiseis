const Shop = require('../models/shop');

//!Function για προσθηκη μαγαζιου
const addShop = async (req, res) => {
    try {
        const newShop = new Shop(req.body);
        await newShop.save();
        res.status(201).json({ message: "Shop created successfully!", shop: newShop });
    } catch (error) {
        res.status(400).json({ message: "Error creating shop", error });
    }
};

//! function για επιστροφη ολων των καταστηματων
const getAllShops = async (req, res) => {
    try {
        const shops = await Shop.find()//.populate('tables').populate('reservationList');
        if (shops.length === 0) {
            return res.status(404).json({ message: 'No shops found' });
        }
        res.status(200).json(shops);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



//! Function για επιστροφη συγκεκριμενου καταστηματος
const getShopById = async (req, res) => {
    try {
        const shopId = req.params.shopId;
        const shop = await Shop.findById(shopId).populate('tables').populate('reservationList');
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }
        res.status(200).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


//! Function για edit shop
const editShop = async (req, res) => {
    try {
        // Βρίσκουμε το κατάστημα με το ID που δόθηκε
        const shop = await Shop.findById(req.params.id);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Ενημέρωση μόνο των πεδίων που υπάρχουν στο req.body
        const updatedShop = req.body;

        // Ενημέρωση του καταστήματος με τα δεδομένα από το αίτημα
        Object.assign(shop, updatedShop);

        // Αποθήκευση των αλλαγών στο κατάστημα
        await shop.save();

        // Επιστροφή του ενημερωμένου καταστήματος
        res.status(200).json(shop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getShopReservationList = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Εύρεση του καταστήματος
        const shop = await Shop.findById(shopId);

        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Έλεγχος αν υπάρχει η λίστα κρατήσεων
        if (!shop.reservationList || shop.reservationList.size === 0) {
            return res.status(200).json({ message: 'No reservations found', reservationList: {} });
        }

        // Επιστροφή της λίστας κρατήσεων
        const reservationList = Object.fromEntries(shop.reservationList);
        return res.status(200).json({ reservationList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};




module.exports = { 
    addShop,
    getAllShops,
    getShopById,
    editShop,
    getShopReservationList,
};
