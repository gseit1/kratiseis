// --- Cities Section Logic ---
let selectedCityId = null;

async function fetchCities() {
  try {
    const response = await fetch('/city');
    if (!response.ok) throw new Error('Failed to fetch cities');
    const cities = await response.json();
    const citiesList = document.getElementById('citiesList');
    citiesList.innerHTML = '';
    cities.forEach(city => {
      const item = document.createElement('div');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      item.innerHTML = `
        <div>
          <span>${city.name}</span>
          <img src="${city.image}" alt="${city.name}" style="width: 50px; height: 50px; object-fit: cover; margin-left: 10px;">
        </div>
        <div>
          <button class="btn btn-sm btn-warning me-2" onclick="editCity('${city._id}', '${city.name}', '${city.latitude}', '${city.longitude}', '${city.image}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteCity('${city._id}')">Delete</button>
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
    alert('City added successfully');
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
  document.getElementById('editCitySection').style.display = 'block';
  // Reset file input
  document.getElementById('editCityImage').value = '';
}

function cancelEditCity() {
  document.getElementById('editCitySection').style.display = 'none';
  selectedCityId = null;
}

if (document.getElementById('editCityForm')) {
  document.getElementById('editCityForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('name', document.getElementById('editCityName').value);
    formData.append('latitude', document.getElementById('editCityLatitude').value);
    formData.append('longitude', document.getElementById('editCityLongitude').value);
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
      alert('City updated successfully');
      fetchCities();
      document.getElementById('editCitySection').style.display = 'none';
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
}
