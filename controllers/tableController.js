const Table = require('../models/table');
const Shop = require('../models/shop');


//!Function gia add table
const addTable = async (req, res) => {
    try {
      // Εξαγωγή των δεδομένων από το body του request
      const { shopId, tableNumber, seats,  estimatedReservationTime, bookingHours,  reserved,  } = req.body;
  
      // Ελέγξτε αν το κατάστημα υπάρχει
      const shop = await Shop.findById(shopId);
      if (!shop) {
        return res.status(404).json({ message: 'Shop not found' });
      }
  
      // Δημιουργία του νέου τραπεζιού
      const newTable = new Table({ shopId,tableNumber,seats, estimatedReservationTime,  bookingHours, reserved,});
  
      // Αποθήκευση του τραπεζιού στη βάση δεδομένων
      await newTable.save();

      // Προσθήκη του τραπεζιού στον πίνακα του καταστήματος
    shop.tables.push(newTable._id);
    await shop.save();
  
      // Επιστροφή επιτυχίας με το δημιουργημένο τραπέζι
      res.status(201).json(newTable);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

  

//!Function gia edit table
const editTable= async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;  // Το σώμα περιέχει τα δεδομένα που θέλεις να ενημερώσεις.

    try {
        // Βρίσκουμε το τραπέζι με το αντίστοιχο id
        let table = await Table.findById(id);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Αν θέλεις να ελέγξεις το καταστημα που ανήκει το τραπέζι (προαιρετικό)
        const shop = await Shop.findById(table.shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Ενημερώνουμε τα πεδία του τραπεζιού με τα δεδομένα που παρέχει το frontend
        table = await Table.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        // Επιστρέφουμε το ενημερωμένο τραπέζι
        res.json(table);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};

//! Function gia delete table
const deleteTable = async (req, res) => {
    try {
        // Βρίσκουμε το τραπέζι με το ID που δόθηκε
        const id = req.params.id; // Παίρνουμε το id από τα params
        const table = await Table.findById(id);
        if (!table) {
            return res.status(404).json({ message: 'Table not found' });
        }

        // Βρίσκουμε το κατάστημα στο οποίο ανήκει το τραπέζι
        const shop = await Shop.findById(table.shopId);
        if (!shop) {
            return res.status(404).json({ message: 'Shop not found' });
        }

        // Αφαιρούμε το τραπέζι από τη λίστα τραπεζιών του καταστήματος
        shop.tables = shop.tables.filter(tableId => tableId.toString() !== table._id.toString());

        // Αποθήκευση του καταστήματος μετά την αφαίρεση
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

module.exports={
    addTable,
    editTable,
    deleteTable,
};