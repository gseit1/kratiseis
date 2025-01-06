const mongoose = require('mongoose');
const Table = require('../models/table');
const Shop = require('../models/shop');

//! Function για add table
const addTable = async (req, res) => {
  const { shopId, tableNumber, seats, estimatedReservationTime, bookingHours, availability } = req.body;

  try {
    // Εξέταση αν το κατάστημα υπάρχει
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return res.status(404).json({ message: 'Shop not found' });
    }

    // Αν το availability δεν παρέχεται, ορίζουμε την προεπιλογή του (κενό Map)
    const tableAvailability = availability || {};

    // Δημιουργία νέου τραπεζιού
    const newTable = new Table({
      shopId,
      tableNumber,
      seats,
      estimatedReservationTime,
      bookingHours,
      availability: tableAvailability
    });

    // Αποθήκευση του τραπεζιού
    await newTable.save();

    // Προσθήκη του τραπεζιού στο κατάστημα
    shop.tables.push(newTable._id);
    await shop.save();

    // Επιστροφή του δημιουργημένου τραπεζιού
    res.status(201).json(newTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//! Function για edit table
const editTable = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;  // Τα δεδομένα που παρέχονται στο σώμα του request

  try {
    // Εύρεση του τραπεζιού με το id
    let table = await Table.findById(id);
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    // Ενημέρωση των πεδίων που υπάρχουν στο σώμα του request
    for (let key in updateData) {
      if (updateData[key] === undefined || updateData[key] === null) {
        delete updateData[key];
      }
    }

    // Ενημέρωση του τραπεζιού
    table = await Table.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    // Επιστροφή του ενημερωμένου τραπεζιού
    res.json(table);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};

//! Function για delete table
const deleteTable = async (req, res) => {
    try {
      // Βρίσκουμε το τραπέζι με το ID που δόθηκε
      const id = req.params.id;
      const table = await Table.findById(id);
      if (!table) {
        return res.status(404).json({ message: 'Table not found' });
      }
  
      // Debug: Έλεγχος για το shopId του τραπεζιού
      console.log(`Table ShopId: ${table.shopId}`);
  
      // Βρίσκουμε το κατάστημα του τραπεζιού
      const shop = await Shop.findById(table.shopId);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
  
      // Debug: Έλεγχος αν το κατάστημα υπάρχει
      console.log(`Found Shop: ${shop._id}`);
  
      // Αφαιρούμε το τραπέζι από τη λίστα τραπεζιών του καταστήματος
      shop.tables = shop.tables.filter(tableId => tableId.toString() !== table._id.toString());
      await shop.save();
  
      // Διαγραφή του τραπεζιού
      await Table.findByIdAndDelete(id);
  
      // Επιστροφή επιτυχίας
      res.status(200).json({ message: 'Table deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  

module.exports = {
  addTable,
  editTable,
  deleteTable,
};
