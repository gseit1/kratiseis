const Category = require('../models/category');

const addCategoryService = async (categoryData) => {
  const { name, image, banner } = categoryData;
  const newCategory = new Category({ name, image, banner });
  await newCategory.save();
  return newCategory;
};

const editCategoryService = async (categoryId, updatedCategoryData) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not Found');
  }
  Object.assign(category, updatedCategoryData);
  await category.save();
  return category;
};

const deleteCategoryService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }
  await Category.findByIdAndDelete(categoryId);
  return category;
};

const getAllCategoriesService = async () => {
  return await Category.find({});
};

const getCategoryByIdService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }
  return category;
};

module.exports = {
  addCategoryService,
  editCategoryService,
  deleteCategoryService,
  getAllCategoriesService,
  getCategoryByIdService,
};