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


categoryRouter.post('/category', upload.single('image'), addCategory);
categoryRouter.patch('/category/:id', upload.single('image'), editCategory);
categoryRouter.delete('/category/:id', deleteCategory);
categoryRouter.get('/category', getAllCategories);
categoryRouter.get('/category/:id', getCategoryById);

module.exports = categoryRouter;
