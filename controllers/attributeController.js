// File: controllers/attributeController.js
const {
    addAttributeService,
    editAttributeService,
    deleteAttributeService,
    getAllAttributesService,
   
} = require('../services/attributeServices');

// Controller για προσθήκη χαρακτηριστικού
const addAttribute = async (req, res) => {
    try {
        const newAttribute = await addAttributeService(req.body);
        res.status(201).json({ success: true, message: 'Attribute added successfully', attribute: newAttribute });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller για επεξεργασία χαρακτηριστικού
const editAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedAttribute = await editAttributeService(id, req.body);
        res.json({ success: true, message: 'Attribute updated successfully', attribute: updatedAttribute });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller για διαγραφή χαρακτηριστικού
const deleteAttribute = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedAttribute = await deleteAttributeService(id);
        res.json({ success: true, message: 'Attribute deleted successfully', attribute: deletedAttribute });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller για ανάκτηση όλων των χαρακτηριστικών
const getAllAttributes = async (req, res) => {
    try {
        const attributes = await getAllAttributesService();
        res.json({ success: true, attributes });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Controller για ανάκτηση συγκεκριμένου χαρακτηριστικού


module.exports = {
    addAttribute,
    editAttribute,
    deleteAttribute,
    getAllAttributes,
    
};
