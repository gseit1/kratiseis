// --- Recommended Shops Section Logic ---
// (Placeholder for recommended shops logic)
// Add your fetch, add, edit, delete, and UI event handlers here as needed.
// Example: fetchRecommendedLists();
// --- UI Selectors ---
const citySel = document.getElementById('recCitySelect');
const catSel = document.getElementById('recCatSelect');
const list = document.getElementById('recommendedShopsList');

// --- State ---
let cities = [];
let categories = [];

// --- Fetch Helpers ---
async function fetchCities() {
  const res = await fetch('/city');
  return res.json();
}
async function fetchCategories() {
  const res = await fetch('/category');
  const cats = await res.json();
  return cats.categories || cats;
}
async function fetchRecommended({cityId, categoryId} = {}) {
  let url = '/recommended';
  if (cityId && categoryId) url = `/recommended/city/${cityId}/category/${categoryId}`;
  else if (cityId) url = `/recommended/city/${cityId}`;
  const res = await fetch(url);
  return res.json();
}
async function fetchShopDetails(shopId) {
  const res = await fetch(`/api/shop/${shopId}`);
  return res.json();
}
async function patchRecommended(shopId, value) {
  await fetch(`/api/shop/${shopId}/recommended`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ recommended: value })
  });
}

// --- Render Helpers ---
function renderCities() {
  citySel.innerHTML = '<option value="">Επιλέξτε πόλη</option>' +
    cities.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
}
function renderCategories() {
  catSel.innerHTML = '<option value="">Επιλέξτε κατηγορία</option>' +
    categories.map(c => `<option value="${c._id}">${c.name}</option>`).join('');
}
function renderShops(shops) {
  // Εμφάνιση πλήθους προτεινόμενων
  let countBar = document.getElementById('recommendedCountBar');
  if (!countBar) {
    countBar = document.createElement('div');
    countBar.id = 'recommendedCountBar';
    countBar.className = 'mb-2 fw-bold text-primary';
    list.parentNode.insertBefore(countBar, list);
  }
  countBar.textContent = `Σύνολο προτεινόμενων: ${shops.length}`;

  list.innerHTML = '';
  if (!shops.length) {
    list.innerHTML = '<div class="col-12 text-muted">Δεν βρέθηκαν προτεινόμενα καταστήματα.</div>';
    return;
  }
  shops.forEach(shop => {
    let imageUrl = shop.images?.[0] || shop.image || '/images/default-placeholder.jpg';
    if (imageUrl && imageUrl.startsWith('/')) imageUrl = `http://localhost:300${imageUrl}`;
    list.innerHTML += `
      <div class="col-12 col-sm-6 col-md-4 col-lg-3">
        <div class="card h-100 shadow-sm recommended-shop-card position-relative" data-shop-id="${shop._id || shop.id}" style="cursor:pointer;">
          <button class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2 remove-recommended-btn" title="Αφαίρεση από προτεινόμενα" data-shop-id="${shop._id || shop.id}">-</button>
          <img src="${imageUrl}" class="card-img-top" alt="${shop.shopName}" style="height:180px;object-fit:cover;">
          <div class="card-body">
            <h5 class="card-title">${shop.shopName}</h5>
            <p class="card-text mb-1"><i class="bi bi-geo-alt"></i> ${shop.city?.name || shop.city || ''}</p>
          </div>
        </div>
      </div>
    `;
  });

  // Click για modal
  document.querySelectorAll('.recommended-shop-card').forEach(card => {
    card.onclick = async function(e) {
      if (e.target.classList.contains('remove-recommended-btn')) return;
      const shopId = this.getAttribute('data-shop-id');
      const shop = await fetchShopDetails(shopId);
      showShopDetailsModal(shop);
    };
  });

  // Click για αφαίρεση από προτεινόμενα
  document.querySelectorAll('.remove-recommended-btn').forEach(btn => {
    btn.onclick = async function(e) {
      e.stopPropagation();
      const shopId = this.getAttribute('data-shop-id');
      if (!confirm('Να αφαιρεθεί το κατάστημα από τα προτεινόμενα;')) return;
      await patchRecommended(shopId, false);
      // Refresh λίστα
      fetchRecommended(getCurrentFilters()).then(renderShops);
    };
  });
}

// --- Modal Logic ---
function showShopDetailsModal(shop) {
  document.getElementById('shopDetailsTitle').textContent = shop.shopName;
  document.getElementById('shopDetailsBody').innerHTML = `
    <img src="${(shop.images && shop.images[0]) || '/images/default-placeholder.jpg'}" class="img-fluid mb-3" style="max-height:220px;object-fit:cover;">
    <p><strong>Περιγραφή:</strong> ${shop.shopDescription || ''}</p>
    <p><strong>Διεύθυνση:</strong> ${shop.address || ''}</p>
    <p><strong>Πόλη:</strong> ${shop.city?.name || shop.city || ''}</p>
    <p><strong>Κατηγορία:</strong> ${shop.category?.name || shop.category || ''}</p>
    <p><strong>Τηλέφωνο:</strong> ${shop.phone || ''}</p>
  `;
  const modal = new bootstrap.Modal(document.getElementById('shopDetailsModal'));
  modal.show();
}

function getCurrentFilters() {
  if (citySel.value && catSel.value) {
    return { cityId: citySel.value, categoryId: catSel.value };
  }
  if (citySel.value) {
    return { cityId: citySel.value };
  }
  return {};
}

// --- Init ---
(async function initRecommendedSection() {
  cities = await fetchCities();
  categories = await fetchCategories();
  renderCities();
  renderCategories();
  catSel.disabled = true; // Αρχικά απενεργοποιημένο
  fetchRecommended().then(renderShops);
})();

// --- DropDown Event Logic ---
citySel.onchange = () => {
  if (citySel.value) {
    catSel.disabled = false;
    fetchRecommended({ cityId: citySel.value }).then(renderShops);
  } else {
    catSel.disabled = true;
    catSel.value = '';
    fetchRecommended().then(renderShops);
  }
};
catSel.onchange = () => {
  if (citySel.value && catSel.value) {
    fetchRecommended({ cityId: citySel.value, categoryId: catSel.value }).then(renderShops);
  }
};