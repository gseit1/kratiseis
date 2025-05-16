// --- Regions Section Logic ---
async function fetchRegions() {
  try {
    const response = await fetch('/region');
    if (!response.ok) throw new Error('Failed to fetch regions');
    const data = await response.json();
    const regionList = document.getElementById('regionsList');
    regionList.innerHTML = '';
    data.regions.forEach(region => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        ${region.name} (City: ${region.city ? region.city.name : 'No City'})
        <div>
          <button class="btn btn-sm btn-warning" onclick="editRegion('${region._id}', '${region.name}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteRegion('${region._id}')">Delete</button>
        </div>
      `;
      regionList.appendChild(li);
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
  }
}

async function addRegion(event) {
  event.preventDefault();
  const regionName = document.getElementById('regionName').value;
  const cityId = document.getElementById('cityFilter').value;
  if (!regionName || !cityId) {
    alert('Region name and city are required');
    return;
  }
  try {
    const response = await fetch('/region', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: regionName, city: cityId }),
    });
    if (!response.ok) throw new Error('Failed to add region');
    document.getElementById('regionName').value = '';
    fetchRegions();
  } catch (error) {
    console.error('Error adding region:', error);
  }
}

async function editRegion(id, name) {
  const newName = prompt('Enter new region name:', name);
  if (newName && newName !== name) {
    try {
      const response = await fetch(`/region/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (!response.ok) throw new Error('Failed to edit region');
      fetchRegions();
    } catch (error) {
      console.error('Error editing region:', error);
    }
  }
}

async function deleteRegion(id) {
  if (confirm('Are you sure you want to delete this region?')) {
    try {
      await fetch(`/region/${id}`, { method: 'DELETE' });
      fetchRegions();
    } catch (error) {
      console.error('Error deleting region:', error);
    }
  }
}

async function populateCityDropdown() {
  try {
    const response = await fetch('/city');
    if (!response.ok) throw new Error('Failed to fetch cities');
    const cities = await response.json();
    const cityFilter = document.getElementById('cityFilter');
    cityFilter.innerHTML = '<option value="" disabled selected>Select a city</option>';
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city._id;
      option.textContent = city.name;
      cityFilter.appendChild(option);
    });
  } catch (error) {
    console.error('Error populating city dropdown:', error);
  }
}

if (document.getElementById('addRegionForm')) {
  document.getElementById('addRegionForm').addEventListener('submit', addRegion);
  fetchRegions();
  populateCityDropdown();
}
