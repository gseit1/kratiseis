<template>
  <div class="search-page bg-light min-vh-100">
    <!-- Search Header -->
    <div class="search-header gradient-hero text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-6 fw-bold mb-2">
              <i class="bi bi-search me-3"></i>Find Your Perfect Restaurant
            </h1>
            <p class="lead mb-0">
              Discover amazing dining experiences with our advanced search filters
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <RouterLink to="/" class="btn btn-outline-light">
              <i class="bi bi-house me-2"></i>Back to Home
            </RouterLink>
          </div>
        </div>
      </div>
    </div>

    <div class="container py-4">
      <div class="row">
        <!-- Search Filters Sidebar -->
        <div class="col-lg-4 col-xl-3 mb-4">
          <div class="search-filters">
            <!-- Search Form Card -->
            <div class="card shadow-sm border-0 mb-4">
              <div class="card-header bg-white border-bottom">
                <h5 class="mb-0">
                  <i class="bi bi-funnel me-2 text-primary"></i>Search Filters
                </h5>
              </div>
              <div class="card-body">
                <form @submit.prevent="performSearch">
                  <!-- Text Search -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Restaurant Name</label>
                    <div class="input-group">
                      <span class="input-group-text bg-light border-end-0">
                        <i class="bi bi-search text-muted"></i>
                      </span>
                      <input
                        type="text"
                        class="form-control border-start-0"
                        v-model="searchFilters.searchTerm"
                        placeholder="Search restaurants..."
                      >
                    </div>
                  </div>

                  <!-- City Selection -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">City</label>
                    <select 
                      v-model="searchFilters.cityId" 
                      class="form-select"
                      @change="onCityChange"
                    >
                      <option value="">All Cities</option>
                      <option 
                        v-for="city in cities" 
                        :key="city._id" 
                        :value="city._id"
                      >
                        {{ city.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Region Selection -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Region</label>
                    <select 
                      v-model="searchFilters.regionId" 
                      class="form-select"
                      :disabled="!searchFilters.cityId"
                    >
                      <option value="">All Regions</option>
                      <option 
                        v-for="region in filteredRegions" 
                        :key="region._id" 
                        :value="region._id"
                      >
                        {{ region.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Category Selection -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Cuisine Type</label>
                    <select 
                      v-model="searchFilters.categoryId" 
                      class="form-select"
                    >
                      <option value="">All Cuisines</option>
                      <option 
                        v-for="category in categories" 
                        :key="category._id" 
                        :value="category._id"
                      >
                        {{ category.name }}
                      </option>
                    </select>
                  </div>

                  <!-- Rating Filter -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Minimum Rating</label>
                    <select v-model="searchFilters.minRating" class="form-select">
                      <option value="">Any Rating</option>
                      <option value="4.5">4.5+ Stars</option>
                      <option value="4.0">4.0+ Stars</option>
                      <option value="3.5">3.5+ Stars</option>
                      <option value="3.0">3.0+ Stars</option>
                    </select>
                  </div>

                  <!-- Availability Search -->
                  <div class="mb-3">
                    <h6 class="fw-semibold text-primary mb-3">
                      <i class="bi bi-calendar-check me-2"></i>Check Availability
                    </h6>
                    
                    <!-- Date -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Date</label>
                      <input 
                        type="date" 
                        v-model="searchFilters.date" 
                        class="form-control"
                        :min="today"
                      >
                    </div>
                    
                    <!-- Time -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Time</label>
                      <select v-model="searchFilters.time" class="form-select">
                        <option value="">Any Time</option>
                        <option v-for="time in timeSlots" :key="time" :value="time">
                          {{ time }}
                        </option>
                      </select>
                    </div>
                    
                    <!-- Party Size -->
                    <div class="mb-3">
                      <label class="form-label fw-semibold">Party Size</label>
                      <select v-model="searchFilters.partySize" class="form-select">
                        <option value="">Any Size</option>
                        <option v-for="size in partySizes" :key="size" :value="size">
                          {{ size }} {{ size === 1 ? 'person' : 'people' }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <!-- Date and Time Filters (if searching for reservations) -->
                  <div v-if="searchFilters.date || searchFilters.time || searchFilters.partySize" class="mb-3">
                    <h6 class="fw-semibold text-primary mb-2">
                      <i class="bi bi-calendar-check me-2"></i>Reservation Details
                    </h6>
                    
                    <div v-if="searchFilters.date" class="mb-2">
                      <small class="text-muted fw-semibold">Date:</small>
                      <div class="small">{{ formatDisplayDate(searchFilters.date) }}</div>
                    </div>
                    
                    <div v-if="searchFilters.time" class="mb-2">
                      <small class="text-muted fw-semibold">Time:</small>
                      <div class="small">{{ searchFilters.time }}</div>
                    </div>
                    
                    <div v-if="searchFilters.partySize" class="mb-2">
                      <small class="text-muted fw-semibold">Party Size:</small>
                      <div class="small">{{ searchFilters.partySize }} {{ searchFilters.partySize === '1' ? 'person' : 'people' }}</div>
                    </div>
                    
                    <hr class="my-3">
                  </div>

                  <!-- Features Filter -->
                  <div class="mb-3">
                    <label class="form-label fw-semibold">Features</label>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="searchFilters.features.wifi"
                        id="wifi"
                      >
                      <label class="form-check-label" for="wifi">
                        <i class="bi bi-wifi me-1"></i>Free WiFi
                      </label>
                    </div>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="searchFilters.features.parking"
                        id="parking"
                      >
                      <label class="form-check-label" for="parking">
                        <i class="bi bi-car-front me-1"></i>Parking Available
                      </label>
                    </div>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="searchFilters.features.outdoor"
                        id="outdoor"
                      >
                      <label class="form-check-label" for="outdoor">
                        <i class="bi bi-tree me-1"></i>Outdoor Seating
                      </label>
                    </div>
                    <div class="form-check">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        v-model="searchFilters.features.delivery"
                        id="delivery"
                      >
                      <label class="form-check-label" for="delivery">
                        <i class="bi bi-truck me-1"></i>Delivery Available
                      </label>
                    </div>
                  </div>

                  <!-- Action Buttons -->
                  <div class="d-grid gap-2">
                    <button 
                      type="submit" 
                      class="btn btn-primary"
                      :disabled="loading"
                    >
                      <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                      <i v-else class="bi bi-search me-2"></i>
                      Search
                    </button>
                    <button 
                      type="button" 
                      class="btn btn-outline-secondary"
                      @click="clearFilters"
                    >
                      <i class="bi bi-arrow-clockwise me-2"></i>Clear Filters
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <!-- Popular Searches -->
            <div class="card shadow-sm border-0">
              <div class="card-header bg-white border-bottom">
                <h6 class="mb-0">
                  <i class="bi bi-star me-2 text-warning"></i>Popular Searches
                </h6>
              </div>
              <div class="card-body">
                <div class="d-flex flex-wrap gap-2">
                  <button 
                    v-for="tag in popularSearches" 
                    :key="tag.name"
                    @click="quickSearch(tag)"
                    class="btn btn-outline-primary btn-sm"
                  >
                    {{ tag.name }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Search Results -->
        <div class="col-lg-8 col-xl-9">
          <!-- Results Header -->
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h4 class="mb-1">
                {{ filteredShops.length }} Restaurant{{ filteredShops.length !== 1 ? 's' : '' }} Found
              </h4>
              <p class="text-muted mb-0" v-if="hasActiveFilters">
                Showing results for your search criteria
              </p>
            </div>
            
            <!-- Sort Options -->
            <div class="d-flex align-items-center gap-3">
              <label class="form-label mb-0 fw-semibold">Sort by:</label>
              <select v-model="sortOption" class="form-select" style="width: auto;">
                <option value="relevance">Relevance</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name (A-Z)</option>
                <option value="newest">Newest</option>
              </select>
            </div>
          </div>

          <!-- Active Filters Display -->
          <div v-if="activeFiltersArray.length > 0" class="mb-4">
            <div class="d-flex flex-wrap gap-2 align-items-center">
              <span class="fw-semibold text-muted">Active filters:</span>
              <span 
                v-for="filter in activeFiltersArray" 
                :key="filter.key"
                class="badge bg-primary d-flex align-items-center gap-1"
              >
                {{ filter.label }}
                <button 
                  type="button" 
                  class="btn-close btn-close-white"
                  style="font-size: 0.7em;"
                  @click="removeFilter(filter.key)"
                ></button>
              </span>
              <button 
                type="button" 
                class="btn btn-link btn-sm p-0 text-decoration-none"
                @click="clearFilters"
              >
                Clear all
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mt-3">Searching restaurants...</p>
          </div>

          <!-- No Results -->
          <div v-else-if="filteredShops.length === 0" class="text-center py-5">
            <div class="card border-0 bg-white">
              <div class="card-body py-5">
                <i class="bi bi-search text-muted" style="font-size: 4rem;"></i>
                <h4 class="mt-3 mb-2">No restaurants found</h4>
                <p class="text-muted mb-4">
                  Try adjusting your search filters or exploring different areas.
                </p>
                <button class="btn btn-primary" @click="clearFilters">
                  <i class="bi bi-arrow-clockwise me-2"></i>Reset Search
                </button>
              </div>
            </div>
          </div>

          <!-- Results Grid -->
          <div v-else class="row g-4">
            <div 
              v-for="shop in sortedShops" 
              :key="shop._id"
              class="col-md-6 col-lg-4"
            >
              <ShopCard :shop="shop" />
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreResults" class="text-center mt-5">
            <button 
              class="btn btn-outline-primary btn-lg"
              @click="loadMoreResults"
              :disabled="loading"
            >
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else class="bi bi-arrow-down me-2"></i>
              Load More Results
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'
import ShopCard from '@/components/shops/ShopCard.vue'
import axios from 'axios'
import { format } from 'date-fns'

export default {
  name: 'SearchResults',
  components: {
    ShopCard
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const shopStore = useShopStore()

    const loading = ref(false)
    const cities = ref([])
    const regions = ref([])
    const categories = ref([])
    const allShops = ref([])
    const resultsLimit = ref(12)
    const currentPage = ref(1)

    const searchFilters = ref({
      searchTerm: '',
      cityId: '',
      regionId: '',
      categoryId: '',
      minRating: '',
      date: '',
      time: '',
      partySize: '',
      features: {
        wifi: false,
        parking: false,
        outdoor: false,
        delivery: false
      }
    })

    const sortOption = ref('relevance')

    const today = format(new Date(), 'yyyy-MM-dd')
    
    const timeSlots = [
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
    ]
    
    const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

    const popularSearches = ref([
      { name: 'Italian', categoryId: null, type: 'category' },
      { name: 'Greek', categoryId: null, type: 'category' },
      { name: 'Fast Food', categoryId: null, type: 'category' },
      { name: 'Athens', cityId: null, type: 'city' },
      { name: 'High Rated', minRating: '4.0', type: 'rating' }
    ])

    const filteredRegions = computed(() => {
      if (!searchFilters.value.cityId) return []
      return regions.value.filter(region => region.city === searchFilters.value.cityId)
    })

    const filteredShops = computed(() => {
      let shops = [...allShops.value]

      // Text search
      if (searchFilters.value.searchTerm) {
        const searchTerm = searchFilters.value.searchTerm.toLowerCase()
        shops = shops.filter(shop => 
          shop.name?.toLowerCase().includes(searchTerm) ||
          shop.description?.toLowerCase().includes(searchTerm)
        )
      }

      // City filter
      if (searchFilters.value.cityId) {
        shops = shops.filter(shop => {
          const shopCityId = shop.city?._id || shop.city
          return shopCityId === searchFilters.value.cityId
        })
      }

      // Region filter
      if (searchFilters.value.regionId) {
        shops = shops.filter(shop => {
          const shopRegionId = shop.region?._id || shop.region
          return shopRegionId === searchFilters.value.regionId
        })
      }

      // Category filter
      if (searchFilters.value.categoryId) {
        shops = shops.filter(shop => {
          const shopCategoryId = shop.category?._id || shop.category
          return shopCategoryId === searchFilters.value.categoryId
        })
      }

      // Rating filter
      if (searchFilters.value.minRating) {
        const minRating = parseFloat(searchFilters.value.minRating)
        shops = shops.filter(shop => {
          const rating = shop.averageRating || shop.rating || 0
          return rating >= minRating
        })
      }

      // Features filter
      if (searchFilters.value.features.wifi) {
        shops = shops.filter(shop => shop.attributes?.includes('WiFi') || shop.features?.wifi)
      }
      if (searchFilters.value.features.parking) {
        shops = shops.filter(shop => shop.attributes?.includes('Parking') || shop.features?.parking)
      }
      if (searchFilters.value.features.outdoor) {
        shops = shops.filter(shop => shop.attributes?.includes('Outdoor Seating') || shop.features?.outdoor)
      }
      if (searchFilters.value.features.delivery) {
        shops = shops.filter(shop => shop.attributes?.includes('Delivery') || shop.features?.delivery)
      }

      return shops
    })

    const sortedShops = computed(() => {
      const shops = [...filteredShops.value]
      
      switch (sortOption.value) {
        case 'rating':
          return shops.sort((a, b) => (b.averageRating || b.rating || 0) - (a.averageRating || a.rating || 0))
        case 'name':
          return shops.sort((a, b) => (a.name || '').localeCompare(b.name || ''))
        case 'newest':
          return shops.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        case 'relevance':
        default:
          return shops
      }
    })

    const hasActiveFilters = computed(() => {
      return searchFilters.value.searchTerm ||
             searchFilters.value.cityId ||
             searchFilters.value.regionId ||
             searchFilters.value.categoryId ||
             searchFilters.value.minRating ||
             Object.values(searchFilters.value.features).some(feature => feature)
    })

    const activeFiltersArray = computed(() => {
      const filters = []
      
      if (searchFilters.value.searchTerm) {
        filters.push({ key: 'searchTerm', label: `"${searchFilters.value.searchTerm}"` })
      }
      if (searchFilters.value.cityId) {
        const city = cities.value.find(c => c._id === searchFilters.value.cityId)
        filters.push({ key: 'cityId', label: city?.name || 'City' })
      }
      if (searchFilters.value.regionId) {
        const region = regions.value.find(r => r._id === searchFilters.value.regionId)
        filters.push({ key: 'regionId', label: region?.name || 'Region' })
      }
      if (searchFilters.value.categoryId) {
        const category = categories.value.find(c => c._id === searchFilters.value.categoryId)
        filters.push({ key: 'categoryId', label: category?.name || 'Category' })
      }
      if (searchFilters.value.minRating) {
        filters.push({ key: 'minRating', label: `${searchFilters.value.minRating}+ Stars` })
      }
      
      Object.entries(searchFilters.value.features).forEach(([key, value]) => {
        if (value) {
          const labels = {
            wifi: 'WiFi',
            parking: 'Parking',
            outdoor: 'Outdoor Seating',
            delivery: 'Delivery'
          }
          filters.push({ key: `features.${key}`, label: labels[key] })
        }
      })
      
      return filters
    })

    const hasMoreResults = computed(() => {
      return sortedShops.value.length > resultsLimit.value * currentPage.value
    })

    const onCityChange = () => {
      searchFilters.value.regionId = ''
    }

    const performSearch = () => {
      // Update URL with search parameters
      const query = {}
      if (searchFilters.value.searchTerm) query.q = searchFilters.value.searchTerm
      if (searchFilters.value.cityId) query.city = searchFilters.value.cityId
      if (searchFilters.value.regionId) query.region = searchFilters.value.regionId
      if (searchFilters.value.categoryId) query.category = searchFilters.value.categoryId
      if (searchFilters.value.minRating) query.rating = searchFilters.value.minRating
      if (searchFilters.value.date) query.date = searchFilters.value.date
      if (searchFilters.value.time) query.time = searchFilters.value.time
      if (searchFilters.value.partySize) query.partySize = searchFilters.value.partySize
      
      router.replace({ query })
      currentPage.value = 1
    }

    const clearFilters = () => {
      searchFilters.value = {
        searchTerm: '',
        cityId: '',
        regionId: '',
        categoryId: '',
        minRating: '',
        date: '',
        time: '',
        partySize: '',
        features: {
          wifi: false,
          parking: false,
          outdoor: false,
          delivery: false
        }
      }
      router.replace({ query: {} })
      currentPage.value = 1
    }

    const removeFilter = (filterKey) => {
      const keys = filterKey.split('.')
      if (keys.length === 1) {
        searchFilters.value[keys[0]] = ''
      } else if (keys[0] === 'features') {
        searchFilters.value.features[keys[1]] = false
      }
      performSearch()
    }

    const quickSearch = (tag) => {
      clearFilters()
      if (tag.type === 'category') {
        // Find category by name
        const category = categories.value.find(c => c.name.toLowerCase().includes(tag.name.toLowerCase()))
        if (category) {
          searchFilters.value.categoryId = category._id
        }
      } else if (tag.type === 'city') {
        // Find city by name
        const city = cities.value.find(c => c.name.toLowerCase().includes(tag.name.toLowerCase()))
        if (city) {
          searchFilters.value.cityId = city._id
        }
      } else if (tag.type === 'rating') {
        searchFilters.value.minRating = tag.minRating
      }
      performSearch()
    }

    const loadMoreResults = () => {
      currentPage.value++
    }

    const formatDisplayDate = (dateString) => {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (error) {
        return dateString
      }
    }

    const loadFilterData = async () => {
      try {
        const [citiesRes, regionsRes, categoriesRes] = await Promise.all([
          axios.get('/city'),
          axios.get('/region'),
          axios.get('/category')
        ])
        
        cities.value = citiesRes.data.cities || citiesRes.data
        regions.value = regionsRes.data.regions || regionsRes.data
        categories.value = categoriesRes.data.categories || categoriesRes.data
      } catch (error) {
        console.error('Error loading filter data:', error)
      }
    }

    const loadShops = async () => {
      loading.value = true
      try {
        // Check if we have availability search criteria
        const query = route.query
        if (query.city && query.date && query.time && query.partySize) {
          // Use availability-aware search
          const searchParams = {
            cityId: query.city,
            regionId: query.region || null,
            categoryId: query.category || null,
            date: query.date,
            time: query.time,
            partySize: parseInt(query.partySize)
          }
          await shopStore.searchShopsWithAvailability(searchParams)
          allShops.value = shopStore.searchResults
        } else {
          // Use regular shop loading
          await shopStore.fetchShops()
          allShops.value = shopStore.shops
        }
      } catch (error) {
        console.error('Error loading shops:', error)
      } finally {
        loading.value = false
      }
    }

    const initializeFromQuery = () => {
      const query = route.query
      if (query.q) searchFilters.value.searchTerm = query.q
      if (query.city) searchFilters.value.cityId = query.city
      if (query.region) searchFilters.value.regionId = query.region
      if (query.category) searchFilters.value.categoryId = query.category
      if (query.rating) searchFilters.value.minRating = query.rating
      if (query.date) searchFilters.value.date = query.date
      if (query.time) searchFilters.value.time = query.time
      if (query.partySize) searchFilters.value.partySize = query.partySize
    }

    onMounted(async () => {
      await Promise.all([loadFilterData(), loadShops()])
      initializeFromQuery()
    })

    watch(() => route.query, async () => {
      await loadShops()
      initializeFromQuery()
    })

    return {
      loading,
      cities,
      regions,
      categories,
      searchFilters,
      sortOption,
      today,
      timeSlots,
      partySizes,
      popularSearches,
      filteredRegions,
      filteredShops,
      sortedShops,
      hasActiveFilters,
      activeFiltersArray,
      hasMoreResults,
      onCityChange,
      performSearch,
      clearFilters,
      removeFilter,
      quickSearch,
      loadMoreResults,
      formatDisplayDate
    }
  }
}
</script>

<style scoped>
.search-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.search-filters {
  position: sticky;
  top: 20px;
}

.card {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

.btn {
  transition: all 0.2s ease-in-out;
}

.form-check-input:checked {
  background-color: #0d6efd;
  border-color: #0d6efd;
}

.badge {
  font-size: 0.875em;
}

@media (max-width: 991.98px) {
  .search-filters {
    position: static;
  }
}
</style>
