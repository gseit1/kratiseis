const subtitlePhrases = ["Εξερέυνησε.", "Κάνε κράτηση.", "Απόλαυσε."];
let index = 0, charIndex = 0;
const typingSpeed = 100;
const eraseSpeed = 60;
const delayBetween = 2000;
const subtitleEl = document.getElementById("typedSubtitle");
// --- Modern hero search logic ---
document.addEventListener('DOMContentLoaded', () => {
  // Populate cities and categories
  fetch('/city').then(r => r.json()).then(cities => {
    const cityDropdown = document.getElementById('cityDropdown');
    cities.forEach(city => {
      const opt = document.createElement('option');
      opt.value = city._id;
      opt.textContent = city.name;
      cityDropdown.appendChild(opt);
    });
  });
  fetch('/category').then(r => r.json()).then(data => {
    let cats = data.categories || data;
    const catDropdown = document.getElementById('categoryDropdown');
    cats.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat._id;
      opt.textContent = cat.name;
      catDropdown.appendChild(opt);
    });
  });
  // Search button logic
  document.getElementById('searchBtn').onclick = () => {
    const cityId = document.getElementById('cityDropdown').value;
    const catId = document.getElementById('categoryDropdown').value;
    if (cityId && catId) {
      window.location.href = `searchShops.html?cityId=${cityId}&categoryId=${catId}`;
    } else if (cityId) {
      window.location.href = `searchShops.html?cityId=${cityId}`;
    } else {
      window.location.href = 'searchShops.html';
    }
  };
  document.getElementById('viewAllBtn').onclick = () => {
    const cityId = document.getElementById('cityDropdown').value;
    if (cityId) {
      window.location.href = `searchShops.html?cityId=${cityId}`;
    } else {
      window.location.href = 'searchShops.html';
    }
  };
});

function typeLoop() {
  if (charIndex < subtitlePhrases[index].length) {
    subtitleEl.textContent += subtitlePhrases[index].charAt(charIndex++);
    setTimeout(typeLoop, typingSpeed);
  } else {
    setTimeout(eraseLoop, delayBetween);
  }
}

function eraseLoop() {
  if (charIndex > 0) {
    subtitleEl.textContent = subtitlePhrases[index].substring(0, --charIndex);
    setTimeout(eraseLoop, eraseSpeed);
  } else {
    index = (index + 1) % subtitlePhrases.length;
    setTimeout(typeLoop, 500);
  }
}

document.addEventListener("DOMContentLoaded", typeLoop);
// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);
gsap.from(".hero-text h1", {
  y: 60,
  opacity: 0,
  duration: 1,
  ease: "power4.out",
  scrollTrigger: {
    trigger: "#heroSection",
    start: "top center"
  }
});

gsap.from(".hero-text p, .cta-button", {
  y: 30,
  opacity: 0,
  duration: 1,
  delay: 0.3,
  ease: "power3.out",
  scrollTrigger: {
    trigger: "#heroSection",
    start: "top center"
  }
});

// Cursor Interaction
document.addEventListener("mousemove", (e) => {
  const { clientX: x, clientY: y } = e;
  document.querySelectorAll(".floating").forEach((el, i) => {
    const movement = 25 + i * 10;
    const offsetX = (window.innerWidth / 2 - x) / movement;
    const offsetY = (window.innerHeight / 2 - y) / movement;
    el.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  });
});
AOS.init();

async function displayCities() {
  console.log('displayCities called');
  const citiesContainer = document.getElementById('citiesContainer');
  const heroCitiesContainer = document.getElementById('heroCitiesContainer'); // For popular cities in hero section

  try {
    // Fetch cities from the backend
    const response = await fetch('/city');
    if (!response.ok) throw new Error('Failed to fetch cities');
    const cities = await response.json();

    // Populate city cards dynamically
    cities.forEach((city, index) => {
      const cityCard = document.createElement('div');
      cityCard.className = 'city-card';
      cityCard.style.backgroundImage = `url('${city.image || '/images/default-city.jpg'}')`;
      cityCard.innerHTML = `<span>${city.name}</span>`;

      // Add to the main cities section
      citiesContainer.appendChild(cityCard);

      // Add the first 4 cities to the hero section
      if (index < 4) {
        const heroCityCard = cityCard.cloneNode(true); // Clone the card for the hero section
        heroCitiesContainer.appendChild(heroCityCard);
      }
    });
  } catch (error) {
    console.error('Error fetching cities:', error);
    citiesContainer.innerHTML = '<p class="text-danger">Failed to load cities. Please try again later.</p>';
  }
}

// Call the function on page load

async function fetchShopsByCity(cityId) {
  try {
    const response = await fetch(`/search/city/${cityId}`);
    if (!response.ok) throw new Error(`Failed to fetch shops for city ID ${cityId}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  const selectedShopIds = ['680b3a29dde23ef9047d534c', '680b3f6bdde23ef9047d5606', '680b410edde23ef9047d571a'];
  const selectedShopsContainer = document.getElementById('selectedShopsContainer');
  const thessalonikiShopsContainer = document.getElementById('thessalonikiShopsContainer');
  const athensShopsContainer = document.getElementById('athensShopsContainer');

  // Fetch and display shops by specific IDs
  for (const id of selectedShopIds) {
    const shop = await fetchShopById(id);
    if (shop) {
      selectedShopsContainer.innerHTML += createShopCard(shop);
    }
  }

  // Fetch and display shops in Thessaloniki
  const thessalonikiShops = await fetchShopsByCity('67ef5b2f15e5f9c8a42e2e91'); // Replace with the actual city ID for Thessaloniki
  thessalonikiShops.forEach(shop => {
    thessalonikiShopsContainer.innerHTML += createShopCard(shop);
  });

  // Fetch and display shops in Athens
  const athensShops = await fetchShopsByCity('67ef5b2215e5f9c8a42e2e8e'); // Replace with the actual city ID for Athens
  athensShops.forEach(shop => {
    athensShopsContainer.innerHTML += createShopCard(shop);
  });

});

// Helper function to fetch a shop by ID
async function fetchShopById(id) {
  try {
    const response = await fetch(`/api/shop/${id}`);
    if (!response.ok) throw new Error(`Failed to fetch shop with ID ${id}`);
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Helper function to create a shop card
function createShopCard(shop) {
  const shopId = shop._id || shop.id; // Use `_id` if available, otherwise fallback to `id`

  if (!shopId) {
    console.error('Shop ID is missing:', shop);
    return ''; // Skip rendering this shop
  }

  return `
    <div class="card mb-2 p-2 position-relative" style="min-width: 180px; max-width: 180px; border-radius: 14px; box-shadow: 0 2px 8px rgba(80,0,120,0.07); height: 270px;">
      <img src="${shop.images && shop.images[0] ? shop.images[0] : shop.image || 'images/default-placeholder.jpg'}" class="card-img-top" alt="${shop.shopName || 'Shop'}" style="height: 110px; object-fit: cover; border-radius: 10px;">
      <div class="card-body p-2" style="padding-bottom: 56px !important;">
        <h6 class="card-title mb-1" style="font-size: 1rem; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          <i class="bi bi-shop me-1"></i>${shop.shopName || 'Unnamed Shop'}
        </h6>
        <div class="card-text mb-1" style="font-size: 0.92rem; color: #555;">
          <i class="bi bi-geo-alt me-1"></i>${shop.address || 'No location'}
        </div>
        <div class="d-flex align-items-center mb-1" style="font-size: 0.92rem;">
          <span class="me-2"><i class="bi bi-star-fill text-warning"></i> ${typeof shop.reviewRatingAverage === 'number' ? shop.reviewRatingAverage.toFixed(1) : '—'}</span>
          <span><i class="bi bi-cash-coin"></i> ${shop.priceRange || ''}</span>
        </div>
        <a href="shop.html?id=${shopId}" class="btn btn-outline-primary btn-sm w-90 shop-card-btn-fixed" style="font-size: 0.92rem; position: absolute; left: 12px; right: 12px; bottom: 12px;">
          <i class="bi bi-box-arrow-up-right me-1"></i>Λεπτομέρειες
        </a>
      </div>
    </div>
  `;
}

const lightCursor = document.querySelector('.custom-cursor-light');
document.addEventListener("mousemove", e => {
  lightCursor.style.top = e.clientY + 'px';
  lightCursor.style.left = e.clientX + 'px';
});

// Function to handle city and category selection
async function setupCityAndCategorySelection() {
  const cityDropdown = document.getElementById('cityDropdown'); // Dropdown for city selection
  const cityGrid = document.querySelector('.city-grid'); // Container for category tiles

  try {
    // Fetch cities dynamically
    const cityResponse = await fetch('/city');
    if (!cityResponse.ok) throw new Error('Failed to fetch cities');
    const cities = await cityResponse.json();

    // Populate city dropdown
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city._id;
      option.textContent = city.name;
      cityDropdown.appendChild(option);
    });

    // Add event listener to city dropdown
    cityDropdown.addEventListener('change', async () => {
      const selectedCityId = cityDropdown.value;

      // Clear existing category tiles
      cityGrid.innerHTML = '';

      if (selectedCityId) {
        // Display 3 fixed category options for the selected city
        const categories = [
          { id: '67ef5a1015e5f9c8a42e2e59', name: '☕ καφέ' },
          { id: '67ef5aad15e5f9c8a42e2e64', name: '🍔 εστιατόριο' },
          { id: '67ef5abf15e5f9c8a42e2e6f', name: '🍻 τσιπουράδικο' }
        ];

        categories.forEach(category => {
          const categoryTile = document.createElement('a');
          categoryTile.href = '#';
          categoryTile.className = 'city-tile';
          categoryTile.dataset.categoryId = category.id; // Store category ID in a data attribute
          categoryTile.textContent = category.name; // Display category name
          categoryTile.addEventListener('click', (event) => {
            event.preventDefault();

            // Store the selected city and category in localStorage
            localStorage.setItem('selectedCity', selectedCityId);
            localStorage.setItem('selectedCategory', category.id);

            // Redirect to the searchShops page
            window.location.href = 'searchShops.html';
          });
          cityGrid.appendChild(categoryTile);
        });
      }
    });
  } catch (error) {
    console.error('Error setting up city and category selection:', error);
  }
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', setupCityAndCategorySelection);

// Fetch and display the 4 latest shops
async function fetchLatestShops() {
  try {
    const response = await fetch('/api/shop/');
    if (!response.ok) {
      throw new Error('Failed to fetch latest shops');
    }

    const latestShops = await response.json();
    const latestShopsContainer = document.getElementById('latestShopsContainer');

    latestShopsContainer.innerHTML = latestShops
      .slice(0, 4) // Limit to 4 shops
      .map(shop => `
        <div class="col-md-3">
          <div class="card mb-4">
            <img src="${shop.images && shop.images[0] ? shop.images[0] : shop.image || 'images/default-placeholder.jpg'}" class="card-img-top" alt="${shop.shopName || 'Shop'}">
            <div class="card-body">
              <h5 class="card-title">
                <i class="bi bi-shop me-2"></i>${shop.shopName || 'Unnamed Shop'}
              </h5>
              <p class="card-text">
                <i class="bi bi-geo-alt me-2"></i>${(shop.address || '').substring(0, 50)}...
                <span class="ms-2"><i class="bi bi-star-fill text-warning"></i> ${typeof shop.reviewRatingAverage === 'number' ? shop.reviewRatingAverage.toFixed(1) : '—'}</span>
                <span class="ms-2"><i class="bi bi-cash-coin"></i> ${shop.priceLevel || ''}</span>
              </p>
              <a href="shop.html?id=${shop._id}" class="btn btn-primary">
                <i class="bi bi-box-arrow-up-right me-1"></i> View Details
              </a>
            </div>
          </div>
        </div>
      `)
      .join('');
  } catch (error) {
    console.error('Error fetching latest shops:', error);
  }
}

document.addEventListener('DOMContentLoaded', fetchLatestShops);

document.addEventListener('DOMContentLoaded', async () => {
  // --- LATEST & TOP RATED SHOPS ---
  const latestShopsList = document.getElementById('latestShopsList');
  const topRatedShopsList = document.getElementById('topRatedShopsList');
  if (latestShopsList && topRatedShopsList) {
    try {
      // Fetch all shops from /api/shop
      const res = await fetch('/api/shop');
      const shops = await res.json();
      // Sort for latest (by createdAt desc)
      const latestShops = [...shops].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 6);
      // Sort for top rated (by reviewRatingAverage desc, then reviews count desc)
      const topRatedShops = [...shops]
        .filter(s => typeof s.reviewRatingAverage === 'number')
        .sort((a, b) => {
          if (b.reviewRatingAverage !== a.reviewRatingAverage) return b.reviewRatingAverage - a.reviewRatingAverage;
          return (b.reviewsCount || 0) - (a.reviewsCount || 0);
        })
        .slice(0, 6);
      // Render latest shops
      latestShopsList.innerHTML = '';
      latestShops.forEach(shop => {
        let imageUrl = shop.image || (shop.images && shop.images[0]) || '/images/default-placeholder.jpg';
        if (imageUrl.startsWith('/')) imageUrl = `http://localhost:300${imageUrl}`;
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${imageUrl}" class="latest-shop-img" alt="${shop.shopName}">
          <div class="latest-shop-info">
            <div class="latest-shop-title">${shop.shopName}</div>
            <div class="latest-shop-meta">
              <span class="latest-shop-rating"><i class="bi bi-star-fill"></i> ${shop.reviewRatingAverage ? shop.reviewRatingAverage.toFixed(1) : '—'}${shop.reviewsCount ? ` <span style='color:#888;font-weight:400;'>(${shop.reviewsCount})</span>` : ''}</span>
              ${shop.categoryName ? shop.categoryName + ' • ' : ''}${shop.priceLevel || ''}
            </div>
            <div class="latest-shop-location"><i class="bi bi-geo-alt"></i> ${shop.address || ''}
            </div>
          </div>
          <button class="latest-shop-fav" title="Add to Favourites"><i class="bi bi-heart"></i></button>
        `;
        li.querySelector('.latest-shop-fav').addEventListener('click', async (e) => {
          e.stopPropagation();
          li.querySelector('.latest-shop-fav').classList.toggle('active');
        });
        li.addEventListener('click', (e) => {
          if (!e.target.closest('.latest-shop-fav')) {
            window.location.href = `shop.html?id=${shop._id || shop.id}`;
          }
        });
        latestShopsList.appendChild(li);
      });
      // Render top rated shops
      topRatedShopsList.innerHTML = '';
      topRatedShops.forEach(shop => {
        let imageUrl = shop.image || (shop.images && shop.images[0]) || '/images/default-placeholder.jpg';
        if (imageUrl.startsWith('/')) imageUrl = `http://localhost:300${imageUrl}`;
        const li = document.createElement('li');
        li.innerHTML = `
          <img src="${imageUrl}" class="latest-shop-img" alt="${shop.shopName}">
          <div class="latest-shop-info">
            <div class="latest-shop-title">${shop.shopName}</div>
            <div class="latest-shop-meta">
              <span class="latest-shop-rating"><i class="bi bi-star-fill"></i> ${shop.reviewRatingAverage ? shop.reviewRatingAverage.toFixed(1) : '—'}${shop.reviewsCount ? ` <span style='color:#888;font-weight:400;'>(${shop.reviewsCount})</span>` : ''}</span>
              ${shop.categoryName ? shop.categoryName + ' • ' : ''}${shop.priceLevel || ''}
            </div>
            <div class="latest-shop-location"><i class="bi bi-geo-alt"></i> ${shop.address || ''}
            </div>
          </div>
          <button class="latest-shop-fav" title="Add to Favourites"><i class="bi bi-heart"></i></button>
        `;
        li.querySelector('.latest-shop-fav').addEventListener('click', async (e) => {
          e.stopPropagation();
          li.querySelector('.latest-shop-fav').classList.toggle('active');
        });
        li.addEventListener('click', (e) => {
          if (!e.target.closest('.latest-shop-fav')) {
            window.location.href = `shop.html?id=${shop._id || shop.id}`;
          }
        });
        topRatedShopsList.appendChild(li);
      });
    } catch (err) {
      latestShopsList.innerHTML = '<div class="text-center text-muted">No shops found.</div>';
      topRatedShopsList.innerHTML = '<div class="text-center text-muted">No shops found.</div>';
    }
  }
});

// --- CITIES SECTION ---
// --- Enhanced Homepage City Cards Section ---
async function renderHomepageCityCards() {
  const row = document.getElementById('cityCardsRow');
  if (!row) return;
  try {
    const res = await fetch('/city');
    const cities = await res.json();
    row.innerHTML = '';
    cities.forEach(city => {
      const card = document.createElement('div');
      card.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
      card.innerHTML = `
        <a href="searchShops.html?cityId=${city._id}" class="city-card-link">
          <div class="city-card city-card-glass">
            <div class="city-card-img-wrap">
              <img src="${city.image || '/images/default-city.jpg'}" alt="${city.name}" class="city-card-img">
              <div class="city-card-gradient"></div>
              <div class="city-card-content">
                <span class="city-card-pin"><i class="bi bi-geo-alt-fill"></i></span>
                <h3 class="city-card-title">${city.name}</h3>
                <p class="city-card-desc">${city.description || 'Explore the best of ' + city.name}</p>
                <span class="city-card-btn">View Shops <i class="bi bi-arrow-right"></i></span>
              </div>
            </div>
          </div>
        </a>
      `;
      row.appendChild(card);
    });
  } catch (e) {
    row.innerHTML = '<div class="col-12 text-center text-danger">Could not load cities.</div>';
  }
}

document.addEventListener('DOMContentLoaded', renderHomepageCityCards);

// --- Draggable Collapse/Expand Map Logic ---
document.addEventListener('DOMContentLoaded', function() {
  const splitLayout = document.getElementById('splitLayout');
  const mapSection = document.getElementById('mapSection');
  const categoriesPanel = document.getElementById('categoriesPanel');
  const toggleMapBtn = document.getElementById('toggleMapBtn');
  const toggleMapIcon = document.getElementById('toggleMapIcon');
  let isMapHidden = false;

  // Remove previous event listeners if any
  if (toggleMapBtn) {
    toggleMapBtn.replaceWith(toggleMapBtn.cloneNode(true));
  }
  const newToggleBtn = document.getElementById('toggleMapBtn');

  // Toggle button click (for accessibility/mobile)
  newToggleBtn.addEventListener('click', function() {
    if (!isMapHidden) {
      mapSection.style.display = 'none';
      categoriesPanel.style.width = '100%';
      categoriesPanel.classList.add('expanded-panel');
      isMapHidden = true;
      toggleMapIcon.className = 'bi bi-chevron-right';
    } else {
      mapSection.style.display = '';
      categoriesPanel.style.width = '';
      categoriesPanel.classList.remove('expanded-panel');
      isMapHidden = false;
      toggleMapIcon.className = 'bi bi-chevron-left';
    }
  });
});
