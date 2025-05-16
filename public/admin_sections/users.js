// --- Users Section Logic ---
async function fetchUsersByRole(role) {
  try {
    const response = await fetch(`/api/users/filter?role=${role}`);
    if (!response.ok) throw new Error('Failed to fetch users by role');
    const users = await response.json();
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    users.forEach(user => {
      const item = document.createElement('div');
      item.className = 'list-group-item d-flex justify-content-between align-items-center';
      item.innerHTML = `
        <div>
          <strong>Email:</strong> ${user.email} <br>
          <strong>ID:</strong> ${user._id}
        </div>
        <div>
          <button class="btn btn-sm btn-primary me-2" onclick="fetchUserDetails('${user._id}')">View Details</button>
          <button class="btn btn-sm btn-danger" onclick="deleteUser('${user._id}', '${user.email}')">Delete</button>
        </div>
      `;
      userList.appendChild(item);
    });
  } catch (error) {
    console.error('Error fetching users by role:', error);
  }
}

async function fetchUserDetails(userId) {
  try {
    const response = await fetch(`/api/users/details/${userId}`);
    if (!response.ok) throw new Error('Failed to fetch user details');
    const user = await response.json();
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userSurname').textContent = user.surname;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('userRole').value = user.role;
    document.getElementById('userShopId').value = user.shopId || '';
    document.getElementById('userReservationHistory').textContent = user.reservationHistory.join(', ');
    document.getElementById('userDetails').style.display = 'block';
    document.getElementById('updateRoleButton').onclick = () => updateUserRole(userId);
    document.getElementById('updateShopIdButton').onclick = () => updateUserShopId(userId);
  } catch (error) {
    console.error('Error fetching user details:', error);
  }
}

async function updateUserRole(userId) {
  try {
    const role = document.getElementById('userRole').value;
    const response = await fetch('/api/change-role', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: document.getElementById('userEmail').textContent, newRole: role }),
    });
    if (!response.ok) throw new Error('Failed to update role');
    alert('Role updated successfully');
    fetchUsersByRole(role);
  } catch (error) {
    console.error('Error updating role:', error);
    alert('Error updating role');
  }
}

async function updateUserShopId(userId) {
  try {
    const shopId = document.getElementById('userShopId').value;
    const response = await fetch('/api/user/shopId', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shopId }),
    });
    if (!response.ok) throw new Error('Failed to update shop ID');
    alert('Shop ID updated successfully');
  } catch (error) {
    console.error('Error updating shop ID:', error);
    alert('Error updating shop ID');
  }
}

async function deleteUser(userId, userEmail) {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      const response = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      });
      if (!response.ok) throw new Error('Failed to delete user');
      alert('User deleted successfully');
      fetchUsersByRole('user');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user');
    }
  }
}

if (document.getElementById('userList')) {
  fetchUsersByRole('user');
}
