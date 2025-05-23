const FloorPanel = require('../models/floorPanel');
const Shop = require('../models/shop');
const path = require('path');
const fs = require('fs');

// POST: Δημιουργία νέου floor panel και προσθήκη στο shop
exports.createFloorPanel = async (req, res) => {
  try {
    const { shopId, name, width, height, background, settings } = req.body;

    // Έλεγχος για όριο 3 floor panels
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: 'Shop not found' });
    if (shop.floorPanels && shop.floorPanels.length >= 3) {
      return res.status(400).json({ message: 'Maximum 3 floor panels allowed per shop' });
    }

    const floorPanel = new FloorPanel({
      shopId,
      name,
      width,
      height,
      background,
      settings,
      tables: []
    });
    await floorPanel.save();

    // Πρόσθεσε το floorPanel στο shop
    shop.floorPanels.push(floorPanel._id);
    await shop.save();

    res.status(201).json(floorPanel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH: Ενημέρωση floor panel
exports.patchFloorPanel = async (req, res) => {
  try {
    const { floorPanelId } = req.params;
    const updates = req.body;
    const floorPanel = await FloorPanel.findByIdAndUpdate(floorPanelId, updates, { new: true });
    if (!floorPanel) return res.status(404).json({ message: 'Floor panel not found' });
    res.json(floorPanel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: Ανάκτηση ενός floor panel
exports.getFloorPanel = async (req, res) => {
  try {
    const { floorPanelId } = req.params;
    const floorPanel = await FloorPanel.findById(floorPanelId).populate('tables.tableId');
    if (!floorPanel) return res.status(404).json({ message: 'Floor panel not found' });
    res.json(floorPanel);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET: Όλα τα floor panels ενός shop
exports.getShopFloorPanels = async (req, res) => {
  try {
    const { shopId } = req.params;
    const floorPanels = await FloorPanel.find({ shopId }).populate('tables.tableId');
    res.json(floorPanels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST/EDIT: Ανεβάζει ή αλλάζει background εικόνα
exports.uploadBackgroundPhoto = async (req, res) => {
  try {
    const { floorPanelId } = req.params;
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const panel = await FloorPanel.findById(floorPanelId);
    if (!panel) return res.status(404).json({ message: 'Floor panel not found' });

    // Διαγραφή παλιάς εικόνας αν υπάρχει
    if (panel.backgroundPhoto && panel.backgroundPhoto.startsWith('/uploads/')) {
      const oldPath = path.join(__dirname, '..', 'public', panel.backgroundPhoto);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Αποθήκευση νέου path
    panel.backgroundPhoto = `/uploads/floorPanelBackgrounds/${req.file.filename}`;
    await panel.save();

    res.json({ success: true, backgroundPhoto: panel.backgroundPhoto });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE: Διαγραφή background εικόνας
exports.deleteBackgroundPhoto = async (req, res) => {
  try {
    const { floorPanelId } = req.params;
    const panel = await FloorPanel.findById(floorPanelId);
    if (!panel) return res.status(404).json({ message: 'Floor panel not found' });

    if (panel.backgroundPhoto && panel.backgroundPhoto.startsWith('/uploads/')) {
      const filePath = path.join(__dirname, '..', 'public', panel.backgroundPhoto);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    panel.backgroundPhoto = '';
    await panel.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH: Ενημέρωση χρώματος τραπεζιού σε floorPanel
exports.patchTableColor = async (req, res) => {
  try {
    const { floorPanelId, tableId } = req.params;
    const { color } = req.body;

    const floorPanel = await FloorPanel.findById(floorPanelId);
    if (!floorPanel) return res.status(404).json({ message: 'Floor panel not found' });

    const table = floorPanel.tables.id(tableId);
    if (!table) return res.status(404).json({ message: 'Table not found' });

    table.color = color;
    await floorPanel.save();

    res.json({ success: true, table });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};