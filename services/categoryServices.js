const fs = require('fs');
const path = require('path');
const Category = require('../models/category');

const addCategoryService = async (categoryData) => {
  const { name, image } = categoryData;
  const newCategory = new Category({ name, image });
  await newCategory.save();
  return newCategory;
};

const editCategoryService = async (categoryId, updatedCategoryData) => {
  try {
    console.log('🔹 Starting category update service');
    console.log('Category ID:', categoryId);
    console.log('Updated data:', updatedCategoryData);

    const { name, file } = updatedCategoryData;

    // Εύρεση της υπάρχουσας κατηγορίας
    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) {
      console.error('❌ Category not found');
      throw new Error('Category not found');
    }

    console.log('✅ Existing category:', existingCategory);

    const updatedData = {};

    // Ενημέρωση ονόματος αν έχει αλλάξει
    if (name && name !== existingCategory.name) {
      updatedData.name = name;
      console.log('🔄 Updating name to:', name);
    }

    // Ενημέρωση εικόνας αν υπάρχει νέα εικόνα
    if (file) {
      const newImagePath = `/uploads/categories/${file.filename}`;
      console.log('🔄 Updating image to:', newImagePath);

      // Διαγραφή της παλιάς εικόνας αν υπάρχει
      if (existingCategory.image) {
        const oldImagePath = path.join(__dirname, '..', 'public', existingCategory.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log('🗑️ Deleted old image:', oldImagePath);
        }
      }

      updatedData.image = newImagePath;
    }

    // Αν δεν υπάρχουν αλλαγές, επιστρέφουμε την υπάρχουσα κατηγορία
    if (Object.keys(updatedData).length === 0) {
      console.log('⚠️ No changes detected. Returning existing category.');
      return existingCategory;
    }

    // Ενημέρωση της κατηγορίας
    const updatedCategory = await Category.findByIdAndUpdate(categoryId, updatedData, { new: true });
    console.log('✅ Category updated successfully:', updatedCategory);

    return updatedCategory;
  } catch (error) {
    console.error('❌ Error in editCategoryService:', error.message);
    throw error;
  }
};

const deleteCategoryService = async (categoryId) => {
  const category = await Category.findById(categoryId);
  if (!category) {
    throw new Error('Category not found');
  }

  // Διαγραφή της εικόνας αν υπάρχει
  if (category.image) {
    const imagePath = path.join(__dirname, '..', 'public', category.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
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