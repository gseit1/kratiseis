// --- Applications Section Logic ---
let selectedApplicationId = null;

async function fetchApplications() {
  try {
    const response = await fetch('/api/applications');
    if (!response.ok) throw new Error('Failed to fetch applications');
    const applications = await response.json();
    const applicationsList = document.getElementById('applicationsList');
    applicationsList.innerHTML = '';
    applications.forEach(app => {
      const item = document.createElement('div');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      item.innerHTML = `
        <span>${app.shopName}</span>
        <button class="btn btn-sm btn-primary" onclick="viewApplicationDetails('${app._id}')">View Details</button>
      `;
      applicationsList.appendChild(item);
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
}

async function viewApplicationDetails(applicationId) {
  try {
    const response = await fetch(`/api/applications/${applicationId}`);
    if (!response.ok) throw new Error('Failed to fetch application details');
    const application = await response.json();
    selectedApplicationId = applicationId;
    document.getElementById('appShopName').textContent = application.shopName;
    document.getElementById('appShopDescription').textContent = application.shopDescription;
    document.getElementById('appUser').textContent = `${application.userId.name} (${application.userId.email})`;
    document.getElementById('applicationDetails').style.display = 'block';
  } catch (error) {
    console.error('Error fetching application details:', error);
  }
}

async function handleApplicationDecision(decision) {
  if (!selectedApplicationId) return;
  try {
    const response = await fetch('/api/applications/handle', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicationId: selectedApplicationId, decision }),
    });
    if (!response.ok) throw new Error('Failed to handle application decision');
    alert(`Application ${decision}ed successfully!`);
    document.getElementById('applicationDetails').style.display = 'none';
    fetchApplications();
  } catch (error) {
    console.error('Error handling application decision:', error);
  }
}

if (document.getElementById('applicationsList')) {
  fetchApplications();
}
