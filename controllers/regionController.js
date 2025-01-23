const { addRegionService, deleteRegionService } = require('../services/regionServices');

// Προσθήκη νέας περιοχής
const addRegion = async (req, res) => {
  try {
    const newRegion = await addRegionService(req.body);
    res.status(201).json({ success: true, message: 'Region added successfully', region: newRegion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Διαγραφή περιοχής
const deleteRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRegion = await deleteRegionService(id);
    res.status(200).json({ success: true, message: 'Region deleted successfully', region: deletedRegion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  addRegion,
  deleteRegion,
};