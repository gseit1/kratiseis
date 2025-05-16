// --- Cities Section Logic ---
let selectedCityId = null;

async function fetchCities(filter = '') {
  try {
    const response = await fetch('/city');
    if (!response.ok) throw new Error('Failed to fetch cities');
    let cities = await response.json();
    if (filter) {
      const f = filter.toLowerCase();
      cities = cities.filter(city => city.name && city.name.toLowerCase().includes(f));
    }
    const citiesList = document.getElementById('citiesList');
    citiesList.innerHTML = '';
    if (!cities.length) {
      citiesList.innerHTML = '<div class="text-center text-muted py-4">No cities found</div>';
      return;
    }
    cities.forEach(city => {
      const item = document.createElement('div');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      item.innerHTML = `
        <div class="d-flex align-items-center gap-2">
          <img src="${city.image}" alt="${city.name}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 8px;">
          <span class="fw-bold">${city.name}</span>
          <span class="text-muted ms-2" style="font-size:0.95em;">(${city.latitude}, ${city.longitude})</span>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-warning" title="Edit" onclick="editCity('${city._id}', '${city.name}', '${city.latitude}', '${city.longitude}', '${city.image}')"><i class="fa fa-pen"></i></button>
          <button class="btn btn-sm btn-danger" title="Delete" onclick="deleteCity('${city._id}')"><i class="fa fa-trash"></i></button>
        </div>
      `;
      citiesList.appendChild(item);
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
  }
}

async function addCity(event) {
  event.preventDefault();
  const formData = new FormData();
  formData.append('name', document.getElementById('cityName').value);
  formData.append('latitude', document.getElementById('cityLatitude').value);
  formData.append('longitude', document.getElementById('cityLongitude').value);
  formData.append('image', document.getElementById('cityImage').files[0]);
  try {
    const response = await fetch('/city', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to add city');
    // Show success toast or message
    if (window.bootstrap) {
      const toast = document.createElement('div');
      toast.className = 'toast align-items-center text-bg-success border-0 show position-fixed top-0 end-0 m-3';
      toast.role = 'alert';
      toast.innerHTML = '<div class="d-flex"><div class="toast-body">City added successfully</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2500);
    }
    fetchCities();
    document.getElementById('addCityForm').reset();
  } catch (error) {
    console.error('Error adding city:', error);
    alert('Error adding city');
  }
}

function editCity(id, name, latitude, longitude, imageUrl) {
  selectedCityId = id;
  document.getElementById('editCityName').value = name;
  document.getElementById('editCityLatitude').value = latitude;
  document.getElementById('editCityLongitude').value = longitude;
  // Reset file input (works in all browsers)
  const fileInput = document.getElementById('editCityImage');
  if (fileInput) {
    fileInput.value = '';
    // Remove and re-add to fully reset (for some browsers)
    const newInput = fileInput.cloneNode(true);
    fileInput.parentNode.replaceChild(newInput, fileInput);
    newInput.id = 'editCityImage';
  }
  // Show modal
  if (window.bootstrap) {
    const modal = new bootstrap.Modal(document.getElementById('editCitySection'));
    modal.show();
  } else {
    document.getElementById('editCitySection').style.display = 'block';
  }
}

function cancelEditCity() {
  if (window.bootstrap) {
    const modal = bootstrap.Modal.getInstance(document.getElementById('editCitySection'));
    if (modal) modal.hide();
  } else {
    document.getElementById('editCitySection').style.display = 'none';
  }
  selectedCityId = null;
}

if (document.getElementById('editCityForm')) {
  document.getElementById('editCityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('editCityName').value);
    formData.append('latitude', document.getElementById('editCityLatitude').value);
    formData.append('longitude', document.getElementById('editCityLongitude').value);
    // Get the file input again in case it was replaced
    const imageFile = document.getElementById('editCityImage').files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }
    try {
      const response = await fetch(`/city/${selectedCityId}`, {
        method: 'PATCH',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to edit city');
      // Show success toast or message
      if (window.bootstrap) {
        const toast = document.createElement('div');
        toast.className = 'toast align-items-center text-bg-success border-0 show position-fixed top-0 end-0 m-3';
        toast.role = 'alert';
        toast.innerHTML = '<div class="d-flex"><div class="toast-body">City updated successfully</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
      }
      fetchCities();
      cancelEditCity();
    } catch (error) {
      console.error('Error editing city:', error);
      alert('Error editing city');
    }
  });
}

async function deleteCity(id) {
  if (confirm('Are you sure you want to delete this city?')) {
    try {
      const response = await fetch(`/city/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete city');
      fetchCities();
    } catch (error) {
      console.error('Error deleting city:', error);
      alert(`Error: ${error.message}`);
    }
  }
}

if (document.getElementById('addCityForm')) {
  document.getElementById('addCityForm').addEventListener('submit', addCity);
  fetchCities();
  document.getElementById('citySearch').addEventListener('input', function() {
    fetchCities(this.value);
  });
}
