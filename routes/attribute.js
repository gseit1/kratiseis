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
attributeRouter.post('/api/attributes', addAttribute);
attributeRouter.put('/api/attributes/:id', editAttribute);
attributeRouter.delete('/api/attributes/:id', deleteAttribute);
attributeRouter.get('/api/attributes', getAllAttributes);

module.exports = attributeRouter;
