const express = require('express');
const upload = require('../middlewares/multerMiddleware');
const categoryRouter = express.Router();

const {
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} = require('../controllers/categoryController');


categoryRouter.post('/api/category', upload.single('image'), addCategory);
categoryRouter.patch('/api/category/:id', upload.single('image'), editCategory);
categoryRouter.delete('/api/category/:id', deleteCategory);
categoryRouter.get('/api/category', getAllCategories);
categoryRouter.get('/api/category/:id', getCategoryById);

module.exports = categoryRouter;
