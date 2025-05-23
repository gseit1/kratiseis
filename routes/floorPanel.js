const express = require('express');
const floorPanelRouter = express.Router();
const floorPanelController = require('../controllers/floorPanelController');
const { verifyToken, isShopOwner } = require('../middlewares/authMiddleware');
const FloorPanel = require('../models/floorPanel');
const multer = require('../middlewares/multerMiddleware');

// Δημιουργία νέου floor panel
floorPanelRouter.post(
  '/api/floorPanel',
  multer.single('backgroundPhoto'),
  async (req, res) => {
    try {
      const { name, shopId, width, height, background } = req.body;
      let backgroundPhoto = '';
      if (req.file) {
        backgroundPhoto = `/uploads/floorPanelBackgrounds/${req.file.filename}`;
      }
      const panel = await FloorPanel.create({
        name,
        shopId,
        width,
        height,
        background,
        backgroundPhoto
      });
      res.status(201).json(panel);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// Ενημέρωση floor panel
floorPanelRouter.patch('/api/floorPanel/:floorPanelId', verifyToken, isShopOwner, floorPanelController.patchFloorPanel);

// Ανάκτηση ενός floor panel
floorPanelRouter.get('/api/floorPanel/:floorPanelId', verifyToken, isShopOwner, floorPanelController.getFloorPanel);

// Όλα τα floor panels ενός shop
floorPanelRouter.get('/api/shop/:shopId/floorPanels', verifyToken, isShopOwner, floorPanelController.getShopFloorPanels);

// PATCH: Ενημέρωση θέσης τραπεζιού σε floorPanel
floorPanelRouter.patch('/api/floorPanel/:floorPanelId/table/:tableId/position', async (req, res) => {
  const { floorPanelId, tableId } = req.params;
  const { x, y } = req.body;
  try {
    const panel = await FloorPanel.findOneAndUpdate(
      { _id: floorPanelId, "tables.tableId": tableId },
      { $set: { "tables.$.x": x, "tables.$.y": y } },
      { new: true }
    );
    if (!panel) return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Upload background image
floorPanelRouter.post(
  '/api/floorPanel/:floorPanelId/backgroundPhoto',
  multer.single('backgroundPhoto'),
  floorPanelController.uploadBackgroundPhoto
);

// DELETE: Remove background image
floorPanelRouter.delete(
  '/api/floorPanel/:floorPanelId/backgroundPhoto',
  floorPanelController.deleteBackgroundPhoto
);

// PATCH: Ενημέρωση background image URL
floorPanelRouter.patch(
  '/api/floorPanel/:floorPanelId/backgroundPhoto',
  verifyToken,
  isShopOwner,
  async (req, res) => {
    try {
      const { floorPanelId } = req.params;
      const { background } = req.body; // π.χ. null ή νέο url
      const panel = await FloorPanel.findByIdAndUpdate(
        floorPanelId,
        { background },
        { new: true }
      );
      if (!panel) return res.status(404).json({ message: 'Floor panel not found' });
      res.json({ success: true, background: panel.background });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

// PATCH: Ενημέρωση χρώματος τραπεζιού σε floorPanel
floorPanelRouter.patch(
  '/api/floorPanel/:floorPanelId/table/:tableId/color',
  async (req, res) => {
    const { floorPanelId, tableId } = req.params;
    const { color } = req.body;
    try {
      const panel = await FloorPanel.findOneAndUpdate(
        { _id: floorPanelId, "tables.tableId": tableId },
        { $set: { "tables.$.color": color } },
        { new: true }
      );
      if (!panel) return res.status(404).json({ message: "Not found" });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);

module.exports = floorPanelRouter;