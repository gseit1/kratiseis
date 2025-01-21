const express = require('express');
const categoryRouter = express.Router();

const {
  addCategory,
  editCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
} = require('../controllers/categoryController');



categoryRouter.post('/category', addCategory);
categoryRouter.patch('/category/:id', editCategory);
categoryRouter.delete('/category/:id', deleteCategory);
categoryRouter.get('/category', getAllCategories);
categoryRouter.get('/category/:id', getCategoryById);

module.exports = categoryRouter;
