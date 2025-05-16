// --- Shops Section Logic ---
async function fetchShops(filter = '') {
  try {
    const response = await fetch('/api/shop');
    if (!response.ok) throw new Error('Failed to fetch shops');
    let shops = await response.json();
    if (filter) {
      const f = filter.toLowerCase();
      shops = shops.filter(shop => shop.shopName && shop.shopName.toLowerCase().includes(f));
    }
    const shopList = document.getElementById('shopList');
    shopList.innerHTML = '';
    if (!shops.length) {
      shopList.innerHTML = '<div class="text-center text-muted py-4">No shops found</div>';
      return;
    }
    shops.forEach(shop => {
      const item = document.createElement('div');
      item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
      item.innerHTML = `
        <div>
          <strong>${shop.shopName}</strong><br>
          <small>ID: ${shop._id}</small>
        </div>
        <button class="btn btn-sm btn-primary view-shop-btn" title="View"><i class="fa fa-eye"></i></button>
      `;
      item.querySelector('.view-shop-btn').onclick = e => {
        e.stopPropagation();
        fetchShopDetails(shop._id);
      };
      item.onclick = () => fetchShopDetails(shop._id);
      shopList.appendChild(item);
    });
  } catch (error) {
    console.error('Error fetching shops:', error);
  }
}

async function fetchShopDetails(shopId) {
  try {
    const response = await fetch(`/api/shop/${shopId}`);
    if (!response.ok) throw new Error('Failed to fetch shop details');
    const shop = await response.json();
    document.getElementById('shopName').textContent = shop.shopName;
    document.getElementById('shopDescription').textContent = shop.shopDescription;
    document.getElementById('shopPhone').textContent = shop.phone || 'N/A';
    document.getElementById('shopCity').textContent = shop.city || 'N/A';
    document.getElementById('shopRegion').textContent = shop.region || 'N/A';
    document.getElementById('shopCategory').textContent = shop.category || 'N/A';
    document.getElementById('shopMusicCategory').textContent = shop.musicCategory || 'N/A';
    document.getElementById('shopPriceRange').textContent = shop.priceRange || 'N/A';
    document.getElementById('shopTimeSlotSplit').textContent = shop.timeSlotSplit || 'N/A';
    const openingHoursDiv = document.getElementById('shopOpeningHours');
    openingHoursDiv.innerHTML = shop.openingHours
      ? Object.entries(shop.openingHours)
          .map(([day, hours]) => `
            <p>
              <strong>${day.charAt(0).toUpperCase() + day.slice(1)}:</strong> 
              ${hours.isOpen ? `${hours.open}:00 - ${hours.close}:00 (Booking: ${hours.bookingStart}:00 - ${hours.bookingEnd}:00)` : 'Closed'}
            </p>
          `)
          .join('')
      : 'No opening hours available';
    const imagesDiv = document.getElementById('shopImages');
    imagesDiv.innerHTML = shop.images && shop.images.length
      ? shop.images.map(image => `<img src="${image}" alt="Shop Image" class="img-thumbnail" style="max-width: 110px; margin: 3px;">`).join('')
      : 'No images available';
    const tablesDiv = document.getElementById('shopTables');
    tablesDiv.innerHTML = shop.tables && shop.tables.length
      ? shop.tables.map(table => `<p>Table ID: ${table}</p>`).join('')
      : 'No tables available';
    const reservationsDiv = document.getElementById('shopReservations');
    reservationsDiv.innerHTML = shop.undefinedReservationList && shop.undefinedReservationList.length
      ? shop.undefinedReservationList.map(reservation => `<p>Reservation ID: ${reservation}</p>`).join('')
      : 'No reservations available';
    const reviewsDiv = document.getElementById('shopReviews');
    reviewsDiv.innerHTML = shop.reviewList && shop.reviewList.length
      ? shop.reviewList.map(review => `<p>Review ID: ${review}</p>`).join('')
      : 'No reviews available';
    document.getElementById('shopDetailsCard').style.display = 'block';
    document.getElementById('shopDetailsPlaceholder').style.display = 'none';
  } catch (error) {
    console.error('Error fetching shop details:', error);
  }
}

function closeShopDetails() {
  document.getElementById('shopDetailsCard').style.display = 'none';
  document.getElementById('shopDetailsPlaceholder').style.display = 'flex';
}

if (document.getElementById('shopList')) {
  fetchShops();
  document.getElementById('shopSearch').addEventListener('input', function() {
    fetchShops(this.value);
  });
  document.getElementById('closeShopDetails').addEventListener('click', closeShopDetails);
}
