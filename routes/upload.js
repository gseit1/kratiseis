const express = require('express');
const upload = require('../middlewares/multerMiddleware');
const { addCategoryService } = require('../services/categoryServices');
const {editCategory} = require('../controllers/categoryController');
const router = express.Router();

router.post('/api/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    const { name, type } = req.body;

    if (type === 'category') {
      const imagePath = `/uploads/categories/${req.file.filename}`;
      const newCategory = await addCategoryService({ name, image: imagePath });
      return res.status(201).json({ success: true, message: 'Category added successfully', category: newCategory });
    }

    res.status(400).json({ success: false, message: 'Invalid type specified' });
  } catch (error) {
    console.error('Error uploading file:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.patch('/category/:id', upload.single('image'), editCategory);


module.exports = router; 