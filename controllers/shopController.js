const Shop  = require('../models/shop');
const shopService = require('../services/shopServices');
const { isAvailableTable } = require('../services/tableServices');
const { swapTableForReservation } = require('../services/reservationServices');
const Reservation = require('../models/reservation');
const mongoose = require('mongoose');

//! Function για προσθηκη μαγαζιου
const addShop = async (req, res) => {
    try {
        const newShop = await shopService.addShopService(req.body);
        res.status(201).json({ message: "Shop created successfully!", shop: newShop });
    } catch (error) {
        res.status(400).json({ message: "Error creating shop", error });
    }
};

//! function για επιστροφη ολων των καταστηματων
const getAllShops = async (req, res) => {
    try {
        const shops = await shopService.getAllShopsService();
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
        const shop = await shopService.getShopByIdService(shopId);
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
        const shopId = req.params.id;
        const updatedData = req.body;
        const updatedShop = await shopService.editShop(shopId, updatedData);
        res.status(200).json(updatedShop);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getShopReservationList = async (req, res) => {
    try {
        const { shopId } = req.params;

        // Χρήση της υπηρεσίας για την επιστροφή της λίστας κρατήσεων
        const reservationList = await shopService.getShopReservationList(shopId);

        res.status(200).json({ reservationList });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

//! Function για αλλαγή τραπεζιού σε μια κράτηση


module.exports = { 
    addShop,
    getAllShops,
    getShopById,
    editShop,
    getShopReservationList,
};
