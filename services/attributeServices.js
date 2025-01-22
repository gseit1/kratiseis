// File: services/attributeServices.js
const Attribute = require('../models/attribute');

// Service για προσθήκη νέου χαρακτηριστικού
const addAttributeService = async (attributeData) => {
    const { name } = attributeData;
    if (!name) {
        throw new Error('Attribute name is required');
    }

    const newAttribute = new Attribute({ name });
    await newAttribute.save();
    return newAttribute;
};

// Service για επεξεργασία χαρακτηριστικού
const editAttributeService = async (attributeId, updatedData) => {
    const attribute = await Attribute.findById(attributeId);
    if (!attribute) {
        throw new Error('Attribute not found');
    }

    attribute.name = updatedData.name || attribute.name;
    await attribute.save();
    return attribute;
};

// Service για διαγραφή χαρακτηριστικού
const deleteAttributeService = async (attributeId) => {
    const attribute = await Attribute.findById(attributeId);
    if (!attribute) {
        throw new Error('Attribute not found');
    }

    await Attribute.findByIdAndDelete(attributeId);
    return attribute;
};

// Service για ανάκτηση όλων των χαρακτηριστικών
const getAllAttributesService = async () => {
    return await Attribute.find({});
};

// Service για ανάκτηση συγκεκριμένου χαρακτηριστικού


module.exports = {
    addAttributeService,
    editAttributeService,
    deleteAttributeService,
    getAllAttributesService,
    
};
