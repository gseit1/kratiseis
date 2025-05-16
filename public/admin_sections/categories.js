// --- Categories Section Logic ---
let selectedCategoryId = null;

async function fetchCategories() {
  try {
    const response = await fetch('/category');
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    const categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    data.categories.forEach(category => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div class="d-flex align-items-center">
          <img src="${category.image}" alt="${category.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
          <span>${category.name}</span>
        </div>
        <div>
          <button class="btn btn-sm btn-warning me-2" onclick="editCategory('${category._id}', '${category.name}', '${category.image}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCategory('${category._id}')">Delete</button>
        </div>
      `;
      categoryList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}

async function addCategory(event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('categoryName').value);
  formData.append('image', document.getElementById('categoryImage').files[0]);
  try {
    const response = await fetch('/category', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to add category');
    alert('Category added successfully');
    fetchCategories();
    document.getElementById('addCategoryForm').reset();
  } catch (error) {
    console.error('Error adding category:', error);
    alert('Error adding category');
  }
}

function editCategory(id, name, imageUrl) {
  selectedCategoryId = id;
  document.getElementById('editCategoryName').value = name;
  document.getElementById('editCategorySection').style.display = 'block';
}

function cancelEditCategory() {
  document.getElementById('editCategorySection').style.display = 'none';
  selectedCategoryId = null;
}

if (document.getElementById('editCategoryForm')) {
  document.getElementById('editCategoryForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('editCategoryName').value.trim();
    const imageFile = document.getElementById('editCategoryImage').files[0];
    if (!name) {
      alert('Category name is required');
      return;
    }
    const formData = new FormData();
    formData.append('name', name);
    if (imageFile) {
      formData.append('image', imageFile);
    }
    try {
      const response = await fetch(`/category/${selectedCategoryId}`, {
        method: 'PATCH',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to edit category');
      alert('Category updated successfully');
      fetchCategories();
      document.getElementById('editCategorySection').style.display = 'none';
    } catch (error) {
      console.error('Error editing category:', error);
      alert('Error editing category');
    }
  });
}

async function deleteCategory(id) {
  if (confirm('Are you sure you want to delete this category?')) {
    try {
      await fetch(`/category/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  }
}

if (document.getElementById('addCategoryForm')) {
  document.getElementById('addCategoryForm').addEventListener('submit', addCategory);
  fetchCategories();
}
