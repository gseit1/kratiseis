

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
async function displayDynamicCities() {
    const cityGrid = document.querySelector('.city-grid'); // Ensure this container exists in your HTML
    try {
        const response = await fetch('/city'); // Fetch cities from the backend
        if (!response.ok) throw new Error('Failed to fetch cities');
        const cities = await response.json();

        // Display the first 3 cities as options
        cities.slice(0, 3).forEach(city => {
            const cityTile = document.createElement('a');
            cityTile.href = '#';
            cityTile.className = 'city-tile';
            cityTile.dataset.cityId = city._id; // Store city ID in a data attribute
            cityTile.textContent = city.name; // Display city name
            cityTile.addEventListener('click', (event) => {
                event.preventDefault();

                // Store the selected city in localStorage
                localStorage.setItem('selectedCity', city._id);

                // Redirect to the filteredShops page
                window.location.href = 'filteredShops.html';
            });
            cityGrid.appendChild(cityTile);
        });
    } catch (error) {
        console.error('Error fetching cities:', error);
    }
}
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
    const selectedShopIds = ['67f3a9c6a4cb7debf70023bd', '67f3ac7ba4cb7debf7002435', '67f3acaba4cb7debf700244a'];
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
   const thessalonikiShops = await fetchShopsByCity('67ef5b1015e5f9c8a42e2e8b'); // Replace with the actual city ID for Thessaloniki
    thessalonikiShops.forEach(shop => {
        thessalonikiShopsContainer.innerHTML += createShopCard(shop);
    });

    // Fetch and display shops in Athens
    const athensShops = await fetchShopsByCity('67ef5b2215e5f9c8a42e2e8e'); // Replace with the actual city ID for Athens
    athensShops.forEach(shop => {
        athensShopsContainer.innerHTML += createShopCard(shop);
    });
    displayDynamicCities();

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
                <p class="card-text">${shop.shopDescription || 'No description available.'}</p>
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
