const mongoose = require('mongoose');

// models/FloorPanel.js
const FloorPanelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop', required: true },
  width: { type: Number, default: 800 },
  height: { type: Number, default: 600 },
  background: { type: String }, // url ή χρώμα ή path εικόνας
  backgroundPhoto: { type: String }, // path της εικόνας background (ανεξάρτητα από το background color)
  color: { type: String, default: '#e3e3e3' }, // Κοινό χρώμα για όλα τα τραπέζια
  tables: [{
    tableId: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
    x: Number,
    y: Number,
    rotation: Number,
    // ΑΦΑΙΡΕΣΕ το color από εδώ!
  }],
  settings: { type: Object },
});

module.exports = mongoose.model('FloorPanel', FloorPanelSchema);