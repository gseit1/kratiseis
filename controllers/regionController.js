const { addRegionService, deleteRegionService ,getAllRegionsService,editRegionService} = require('../services/regionServices');

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




const editRegion = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedRegion = await editRegionService(id, req.body);
    res.status(200).json({ success: true, message: 'Region updated successfully', region: updatedRegion });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};






const getAllRegions = async (req, res) => {
  try {
    const regions = await getAllRegionsService();
    res.status(200).json({ success: true, regions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}
module.exports = {
  addRegion,
  deleteRegion,
  getAllRegions,
  editRegion, // Προσθήκη της νέας λειτουργίας
};
