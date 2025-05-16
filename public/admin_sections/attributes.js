// --- Attributes Section Logic ---
async function fetchAttributes() {
  try {
    const response = await fetch('/api/attributes');
    if (!response.ok) throw new Error('Failed to fetch attributes');
    const { attributes } = await response.json();
    const attributesList = document.getElementById('attributesList');
    attributesList.innerHTML = '';
    attributes.forEach(attribute => {
      const item = document.createElement('div');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      item.innerHTML = `
        <span>${attribute.name}</span>
        <div>
          <button class="btn btn-sm btn-secondary me-2" onclick="editAttribute('${attribute._id}', '${attribute.name}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deleteAttribute('${attribute._id}')">Delete</button>
        </div>
      `;
      attributesList.appendChild(item);
    });
  } catch (error) {
    console.error('Error fetching attributes:', error);
  }
}

if (document.getElementById('addAttributeForm')) {
  document.getElementById('addAttributeForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const attributeName = document.getElementById('attributeName').value;
    try {
      const response = await fetch('/api/attributes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: attributeName }),
      });
      if (!response.ok) throw new Error('Failed to add attribute');
      document.getElementById('attributeName').value = '';
      fetchAttributes();
    } catch (error) {
      console.error('Error adding attribute:', error);
    }
  });
  fetchAttributes();
}

async function editAttribute(id, currentName) {
  const newName = prompt('Edit attribute name:', currentName);
  if (!newName) return;
  try {
    const response = await fetch(`/api/attributes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName }),
    });
    if (!response.ok) throw new Error('Failed to edit attribute');
    fetchAttributes();
  } catch (error) {
    console.error('Error editing attribute:', error);
  }
}

async function deleteAttribute(id) {
  if (!confirm('Are you sure you want to delete this attribute?')) return;
  try {
    const response = await fetch(`/api/attributes/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete attribute');
    fetchAttributes();
  } catch (error) {
    console.error('Error deleting attribute:', error);
  }
}
