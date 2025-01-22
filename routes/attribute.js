// File: routes/attributeRoutes.js
const express = require('express');
const {
    addAttribute,
    editAttribute,
    deleteAttribute,
    getAllAttributes,
    
} = require('../controllers/attributeController');

const attributeRouter = express.Router();

// Routes
attributeRouter.post('/attributes', addAttribute);
attributeRouter.put('/attibrutes/:id', editAttribute);
attributeRouter.delete('/attributes/:id', deleteAttribute);
attributeRouter.get('/attributes', getAllAttributes);

module.exports = attributeRouter;
