const subtitlePhrases = ["Εξερέυνησε.", "Κάνε κράτηση.", "Απόλαυσε."];
let index = 0, charIndex = 0;
const typingSpeed = 100;
const eraseSpeed = 60;
const delayBetween = 2000;
const subtitleEl = document.getElementById("typedSubtitle");
// Event listener for city grid tiles
document.querySelectorAll('.city-tile').forEach(tile => {
    tile.addEventListener('click', (event) => {
        const categoryId = tile.dataset.categoryId; // Get category ID from data attribute
        const cityId = '67ef5b2215e5f9c8a42e2e8e'; // Replace with a valid city ID

        // Store the selected filters in localStorage
        localStorage.setItem('selectedCity', cityId);
        localStorage.setItem('selectedCategory', categoryId);

        // Redirect to the filteredShops page
        window.location.href = 'filteredShops.html';
    });
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

// Helper function to fetch shops by city


// Helper function to create a shop card
function createShopCard(shop) {
    const shopId = shop._id || shop.id; // Use `_id` if available, otherwise fallback to `id`

    if (!shopId) {
        console.error('Shop ID is missing:', shop);
        return ''; // Skip rendering this shop
    }

    return `
        <div class="card mb-3" style="min-width: 240px; max-width: 240px;">
            <img src="${shop.images && shop.images[0] ? shop.images[0] : shop.image || 'images/default-placeholder.jpg'}" class="card-img-top" alt="${shop.shopName || 'Shop'}">
            <div class="card-body">
                <h5 class="card-title">${shop.shopName || 'Unnamed Shop'}</h5>
                <p class="card-text">${(shop.address || 'no location')}</p>
                <a href="shop.html?id=${shopId}" class="btn btn-outline-primary">Λεπτομέρειες</a>
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

                        // Redirect to the filteredShops page
                        window.location.href = 'filteredShops.html';
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
              <h5 class="card-title">${shop.shopName}</h5>
              <p class="card-text">${(shop.shopDescription || '').substring(0, 50)}...</p>
              <a href="shop.html?id=${shop._id}" class="btn btn-primary">View Details</a>
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
