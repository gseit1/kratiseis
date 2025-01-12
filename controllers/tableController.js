const { createTable, updateTable, deleteTableServ: deleteTableService,checkAvailability } = require('../services/tableServices');

//! Function για add table
const addTable = async (req, res) => {
  const { shopId, tableNumber, seats, estimatedReservationTime, bookingHours, availability } = req.body;

  try {
    const tableData = {
      shopId,
      tableNumber,
      seats,
      estimatedReservationTime,
      bookingHours,
      availability
    };

    const newTable = await createTable(shopId, tableData);
    res.status(201).json(newTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//! Function για edit table
const editTable = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedTable = await updateTable(id, updateData);
    res.json(updatedTable);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//! Function για delete table
const deleteTable = async (req, res) => {
  const { id } = req.params;

  try {
    await deleteTableService(id);
    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

//!Function για ελεγχο διαθεσιμοτητας καταστηματος για συγκεκριμενη μερα
const checkTableAvailability = async (req, res) => {
  const { shopId, dateString, seats } = req.query;

  if (!shopId || !dateString || !seats) {
    return res.status(400).json({
      success: false,
      message: 'Missing required parameters (shopId, dateString, seats)',
      availability: [],
    });
  }

  try {
    // Κλήση της υπηρεσίας checkAvailability και επιστροφή του αποτελέσματος
    const result = await checkAvailability(req);  // Αφαίρεση του res

    if (result.success) {
      return res.json({ success: true, availability: result.availability });
    }

    return res.status(404).json({ success: false, message: result.message, availability: [] });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: error.message, availability: [] });
  }
};



module.exports = {
  addTable,
  editTable,
  deleteTable,
  checkTableAvailability
};
