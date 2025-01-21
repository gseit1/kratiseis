const {
    addCategoryService,
    editCategoryService,
    deleteCategoryService,
    getAllCategoriesService,
    getCategoryByIdService,
  } = require('../services/categoryServices');
  
  const addCategory = async (req, res) => {
    try {
      const categoryData = req.body;
      const newCategory = await addCategoryService(categoryData);
      res.status(201).json({ success: true, message: 'Category added successfully', category: newCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const editCategory = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, image, banner } = req.body;
      const updatedData = { name, image, banner };
      const updatedCategory = await editCategoryService(id, updatedData);
      res.json({ success: true, message: 'Category updated successfully', category: updatedCategory });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;
      await deleteCategoryService(id);
      res.status(200).json({ success: true, message: 'Category deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const getAllCategories = async (req, res) => {
    try {
      const categories = await getAllCategoriesService();
      res.json({ success: true, categories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  const getCategoryById = async (req, res) => {
    try {
      const { id } = req.params;
      const category = await getCategoryByIdService(id);
      res.json({ success: true, category });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
  module.exports = {
    addCategory,
    editCategory,
    deleteCategory,
    getAllCategories,
    getCategoryById,
  };