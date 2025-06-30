<template>
  <div class="shop-list-page">
    <!-- Hero Section -->
    <section class="hero-section-small gradient-hero text-white py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-5 fw-bold mb-3">Discover Amazing Restaurants</h1>
            <p class="lead">Find the perfect dining experience from our curated collection of restaurants.</p>
          </div>
          <div class="col-lg-4">
            <div class="text-lg-end">
              <span class="badge bg-light text-dark fs-6 px-3 py-2">
                {{ filteredShops.length }} restaurants found
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="container py-5">
      <div class="row">
        <!-- Filters Sidebar -->
        <div class="col-lg-3 mb-4">
          <div class="filters-card sticky-top">
            <div class="card border-0 shadow-sm">
              <div class="card-header bg-primary text-white">
                <h5 class="mb-0">
                  <i class="bi bi-funnel me-2"></i>Filters
                </h5>
              </div>
              <div class="card-body">
                <!-- Search Input -->
                <div class="mb-4">
                  <label class="form-label fw-bold">Search</label>
                  <div class="input-group">
                    <span class="input-group-text">
                      <i class="bi bi-search"></i>
                    </span>
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="Restaurant name..."
                      v-model="filters.search"
                    >
                  </div>
                </div>

                <!-- City Filter -->
                <div class="mb-4">
                  <label class="form-label fw-bold">City</label>
                  <select v-model="filters.cityId" class="form-select" @change="onCityChange">
                    <option value="">All Cities</option>
                    <option v-for="city in cities" :key="city._id" :value="city._id">
                      {{ city.name }}
                    </option>
                  </select>
                </div>

                <!-- Region Filter -->
                <div class="mb-4" v-if="filters.cityId">
                  <label class="form-label fw-bold">Region</label>
                  <select v-model="filters.regionId" class="form-select">
                    <option value="">All Regions</option>
                    <option v-for="region in filteredRegions" :key="region._id" :value="region._id">
                      {{ region.name }}
                    </option>
                  </select>
                </div>

                <!-- Category Filter -->
                <div class="mb-4">
                  <label class="form-label fw-bold">Cuisine Type</label>
                  <div class="category-checkboxes">
                    <div class="form-check" v-for="category in categories" :key="category._id">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :id="'category-' + category._id"
                        :value="category._id"
                        v-model="filters.categoryIds"
                      >
                      <label class="form-check-label" :for="'category-' + category._id">
                        {{ category.name }}
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Rating Filter -->
                <div class="mb-4">
                  <label class="form-label fw-bold">Minimum Rating</label>
                  <div class="rating-filter">
                    <div class="form-check" v-for="rating in [4, 3, 2, 1]" :key="rating">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        :id="'rating-' + rating"
                        :value="rating"
                        v-model="filters.minRating"
                        name="rating"
                      >
                      <label class="form-check-label d-flex align-items-center" :for="'rating-' + rating">
                        <div class="rating-stars me-2">
                          <i v-for="star in 5" :key="star" 
                             :class="star <= rating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                        </div>
                        & up
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Attributes Filter -->
                <div class="mb-4">
                  <label class="form-label fw-bold">Features</label>
                  <div class="attributes-checkboxes">
                    <div class="form-check" v-for="attribute in attributes" :key="attribute._id">
                      <input 
                        class="form-check-input" 
                        type="checkbox" 
                        :id="'attr-' + attribute._id"
                        :value="attribute._id"
                        v-model="filters.attributeIds"
                      >
                      <label class="form-check-label" :for="'attr-' + attribute._id">
                        <i :class="getAttributeIcon(attribute.name)" class="me-2"></i>
                        {{ attribute.name }}
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Clear Filters -->
                <button @click="clearFilters" class="btn btn-outline-secondary w-100">
                  <i class="bi bi-arrow-clockwise me-2"></i>Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Shop List -->
        <div class="col-lg-9">
          <!-- Sort Options -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h4 class="mb-0">Restaurants ({{ filteredShops.length }})</h4>
            </div>
            <div class="d-flex align-items-center gap-3">
              <!-- View Toggle -->
              <div class="btn-group" role="group">
                <input type="radio" class="btn-check" name="view" id="grid-view" v-model="viewMode" value="grid">
                <label class="btn btn-outline-primary" for="grid-view">
                  <i class="bi bi-grid-3x3-gap"></i>
                </label>
                <input type="radio" class="btn-check" name="view" id="list-view" v-model="viewMode" value="list">
                <label class="btn btn-outline-primary" for="list-view">
                  <i class="bi bi-list"></i>
                </label>
              </div>

              <!-- Sort -->
              <select v-model="sortBy" class="form-select" style="width: auto;">
                <option value="name">Name A-Z</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest</option>
                <option value="featured">Featured First</option>
              </select>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="shopStore.loading" class="loading-spinner">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>

          <!-- Shop Grid/List -->
          <div v-else-if="filteredShops.length > 0">
            <!-- Grid View -->
            <div v-if="viewMode === 'grid'" class="row g-4">
              <div 
                class="col-lg-4 col-md-6" 
                v-for="shop in paginatedShops" 
                :key="shop._id"
                data-aos="fade-up"
              >
                <ShopCard :shop="shop" />
              </div>
            </div>

            <!-- List View -->
            <div v-else class="shop-list-view">
              <div 
                v-for="shop in paginatedShops" 
                :key="shop._id"
                class="shop-list-item card mb-3"
                data-aos="fade-up"
              >
                <div class="row g-0">
                  <div class="col-md-4">
                    <img :src="getShopImage(shop)" class="img-fluid rounded-start h-100" style="object-fit: cover;" :alt="shop.name">
                  </div>
                  <div class="col-md-8">
                    <div class="card-body h-100 d-flex flex-column">
                      <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold">{{ shop.shopName || shop.name || 'Unnamed Restaurant' }}</h5>
                        <span v-if="shop.recommended || shop.isRecommended" class="badge bg-warning">
                          <i class="bi bi-star-fill me-1"></i>Featured
                        </span>
                      </div>
                      
                      <p class="text-muted mb-2">
                        <i class="bi bi-geo-alt me-1"></i>{{ shop.address || 'Address not available' }}
                      </p>
                      
                      <div class="d-flex align-items-center mb-2">
                        <div class="rating-stars me-2">
                          <i v-for="star in 5" :key="star" 
                             :class="star <= (shop.reviewRatingAverage || shop.averageRating || 0) ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                        </div>
                        <span class="small text-muted">{{ (shop.reviewRatingAverage || shop.averageRating || 0).toFixed(1) }} ({{ getReviewCount(shop) }} reviews)</span>
                      </div>
                      
                      <div class="mb-3">
                        <span v-if="shop.category" class="badge bg-light text-dark me-1">
                          {{ shop.category.name || shop.category }}
                        </span>
                        <span v-for="category in (shop.categories || []).slice(0, 2)" :key="category._id"
                              class="badge bg-light text-dark me-1">
                          {{ category.name }}
                        </span>
                      </div>
                      
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div class="d-flex gap-2">
                          <span v-for="attribute in (shop.attributes || []).slice(0, 3)" :key="attribute._id"
                                class="badge bg-primary bg-opacity-10 text-primary">
                            <i :class="getAttributeIcon(attribute.name)" class="me-1"></i>
                            {{ attribute.name }}
                          </span>
                        </div>
                        <RouterLink :to="{ name: 'ShopDetail', params: { id: shop._id } }" 
                                    class="btn btn-gradient">
                          View Details
                        </RouterLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <nav v-if="totalPages > 1" aria-label="Shop pagination" class="mt-5">
              <ul class="pagination justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="changePage(currentPage - 1)" :disabled="currentPage === 1">
                    <i class="bi bi-chevron-left"></i>
                  </button>
                </li>
                
                <li v-for="page in visiblePages" :key="page" 
                    class="page-item" :class="{ active: page === currentPage }">
                  <button class="page-link" @click="changePage(page)">{{ page }}</button>
                </li>
                
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages">
                    <i class="bi bi-chevron-right"></i>
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <!-- No Results -->
          <div v-else class="text-center py-5">
            <i class="bi bi-search display-1 text-muted mb-3"></i>
            <h4 class="text-muted">No restaurants found</h4>
            <p class="text-muted">Try adjusting your filters or search terms.</p>
            <button @click="clearFilters" class="btn btn-primary">
              Clear All Filters
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
import { getRestaurantImage } from '@/utils/imageUtils'

export default {
  name: 'ShopList',
  components: {
    ShopCard
  },
  setup() {
    const route = useRoute()
    const router = useRouter()
    const shopStore = useShopStore()
    
    const viewMode = ref('grid')
    const currentPage = ref(1)
    const itemsPerPage = 12
    const sortBy = ref('name')
    
    const filters = ref({
      search: '',
      cityId: '',
      regionId: '',
      categoryIds: [],
      attributeIds: [],
      minRating: null
    })
    
    const cities = ref([])
    const regions = ref([])
    const categories = ref([])
    const attributes = ref([])
    
    const filteredRegions = computed(() => {
      if (!filters.value.cityId) return []
      return regions.value.filter(region => region.cityId === filters.value.cityId)
    })
    
    const filteredShops = computed(() => {
      let shops = [...shopStore.shops]
      
      // Debug: log first shop to understand structure
      if (shops.length > 0) {
        console.log('Sample shop structure:', shops[0])
      }
      
      // Search filter
      if (filters.value.search) {
        const search = filters.value.search.toLowerCase()
        shops = shops.filter(shop => 
          (shop.shopName && shop.shopName.toLowerCase().includes(search)) ||
          (shop.name && shop.name.toLowerCase().includes(search)) ||
          (shop.shopDescription && shop.shopDescription.toLowerCase().includes(search)) ||
          (shop.description && shop.description.toLowerCase().includes(search))
        )
      }
      
      // City filter
      if (filters.value.cityId) {
        console.log('Filtering by city:', filters.value.cityId)
        shops = shops.filter(shop => {
          // Handle different ways city might be stored
          if (shop.city && typeof shop.city === 'object') {
            console.log('Shop city object:', shop.city)
            return shop.city._id === filters.value.cityId
          }
          // If city is just an ObjectId string
          if (shop.city && typeof shop.city === 'string') {
            console.log('Shop city string:', shop.city)
            return shop.city === filters.value.cityId
          }
          // Legacy cityId field
          if (shop.cityId) {
            console.log('Shop cityId:', shop.cityId)
            return shop.cityId === filters.value.cityId
          }
          console.log('No city found for shop:', shop.shopName || shop.name)
          return false
        })
        console.log('Shops after city filter:', shops.length)
      }
      
      // Region filter
      if (filters.value.regionId) {
        shops = shops.filter(shop => {
          // Handle different ways region might be stored
          if (shop.region && typeof shop.region === 'object') {
            return shop.region._id === filters.value.regionId
          }
          // If region is just an ObjectId string
          if (shop.region && typeof shop.region === 'string') {
            return shop.region === filters.value.regionId
          }
          // Legacy regionId field
          if (shop.regionId) {
            return shop.regionId === filters.value.regionId
          }
          return false
        })
      }
      
      // Category filter
      if (filters.value.categoryIds.length > 0) {
        shops = shops.filter(shop => {
          // Handle single category (backend format)
          if (shop.category) {
            return filters.value.categoryIds.includes(shop.category._id || shop.category)
          }
          // Handle categories array (frontend format)
          if (shop.categories && shop.categories.length > 0) {
            return shop.categories.some(cat => 
              filters.value.categoryIds.includes(cat._id)
            )
          }
          return false
        })
      }
      
      // Attributes filter (this might not be populated by backend)
      if (filters.value.attributeIds.length > 0) {
        shops = shops.filter(shop => 
          shop.attributes && shop.attributes.some(attr => 
            filters.value.attributeIds.includes(attr._id)
          )
        )
      }
      
      // Rating filter
      if (filters.value.minRating) {
        shops = shops.filter(shop => {
          const rating = shop.reviewRatingAverage || shop.averageRating || 0
          // Only filter if the shop actually has reviews (rating !== -1)
          return rating !== -1 && rating >= filters.value.minRating
        })
      }
      
      // Sort
      return sortShops(shops)
    })
    
    const sortShops = (shops) => {
      switch (sortBy.value) {
        case 'rating':
          return shops.sort((a, b) => {
            const ratingA = a.reviewRatingAverage !== -1 ? (a.reviewRatingAverage || a.averageRating || 0) : 0
            const ratingB = b.reviewRatingAverage !== -1 ? (b.reviewRatingAverage || b.averageRating || 0) : 0
            return ratingB - ratingA
          })
        case 'newest':
          return shops.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        case 'featured':
          return shops.sort((a, b) => {
            const aRecommended = a.recommended || a.isRecommended || false
            const bRecommended = b.recommended || b.isRecommended || false
            if (aRecommended && !bRecommended) return -1
            if (!aRecommended && bRecommended) return 1
            return 0
          })
        case 'name':
        default:
          return shops.sort((a, b) => {
            const nameA = a.shopName || a.name || ''
            const nameB = b.shopName || b.name || ''
            return nameA.localeCompare(nameB)
          })
      }
    }
    
    const totalPages = computed(() => {
      return Math.ceil(filteredShops.value.length / itemsPerPage)
    })
    
    const paginatedShops = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage
      const end = start + itemsPerPage
      return filteredShops.value.slice(start, end)
    })
    
    const visiblePages = computed(() => {
      const pages = []
      const maxVisible = 5
      let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
      let end = Math.min(totalPages.value, start + maxVisible - 1)
      
      if (end - start + 1 < maxVisible) {
        start = Math.max(1, end - maxVisible + 1)
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i)
      }
      
      return pages
    })
    
    const onCityChange = () => {
      filters.value.regionId = ''
    }
    
    const clearFilters = () => {
      filters.value = {
        search: '',
        cityId: '',
        regionId: '',
        categoryIds: [],
        attributeIds: [],
        minRating: null
      }
      currentPage.value = 1
    }
    
    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }
    
    const getShopImage = (shop) => {
      return getRestaurantImage(shop, 400, 300)
    }
    
    const getReviewCount = (shop) => {
      // Check for explicit reviewCount field first
      if (shop.reviewCount !== undefined) {
        return shop.reviewCount
      }
      // Use reviewList array length (backend format)
      if (shop.reviewList && Array.isArray(shop.reviewList)) {
        return shop.reviewList.length
      }
      // Fallback to any reviews array
      if (shop.reviews && Array.isArray(shop.reviews)) {
        return shop.reviews.length
      }
      return 0
    }
    
    const getAttributeIcon = (attributeName) => {
      const iconMap = {
        'WiFi': 'bi bi-wifi',
        'Parking': 'bi bi-car-front',
        'Outdoor Seating': 'bi bi-tree',
        'Live Music': 'bi bi-music-note',
        'Bar': 'bi bi-cup-straw',
        'Kids Friendly': 'bi bi-emoji-smile',
        'Pet Friendly': 'bi bi-heart',
        'Delivery': 'bi bi-truck',
        'Takeaway': 'bi bi-bag'
      }
      return iconMap[attributeName] || 'bi bi-check-circle'
    }
    
    // Watch for filter changes to reset pagination
    watch(() => filters.value, () => {
      currentPage.value = 1
    }, { deep: true })
    
    // Watch for sort changes to reset pagination
    watch(() => sortBy.value, () => {
      currentPage.value = 1
    })
    
    onMounted(async () => {
      await Promise.all([
        shopStore.fetchShops(),
        shopStore.fetchCities().then(data => cities.value = data),
        shopStore.fetchRegions().then(data => regions.value = data),
        shopStore.fetchCategories().then(data => categories.value = data),
        shopStore.fetchAttributes().then(data => attributes.value = data)
      ])
      
      // Apply filters from URL query params
      if (route.query.cityId) filters.value.cityId = route.query.cityId
      if (route.query.regionId) filters.value.regionId = route.query.regionId
      if (route.query.categoryId) filters.value.categoryIds = [route.query.categoryId]
      if (route.query.search) filters.value.search = route.query.search
    })
    
    return {
      shopStore,
      filters,
      viewMode,
      sortBy,
      currentPage,
      cities,
      regions,
      categories,
      attributes,
      filteredRegions,
      filteredShops,
      paginatedShops,
      totalPages,
      visiblePages,
      onCityChange,
      clearFilters,
      changePage,
      getShopImage,
      getReviewCount,
      getAttributeIcon
    }
  }
}
</script>

<style scoped>
.hero-section-small {
  padding-top: 120px;
}

.filters-card {
  top: 120px;
}

.category-checkboxes,
.attributes-checkboxes {
  max-height: 200px;
  overflow-y: auto;
}

.rating-stars {
  color: #ffc107;
}

.shop-list-item {
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.shop-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.btn-gradient {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  color: white;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #764ba2, #667eea);
  color: white;
}

.pagination .page-link {
  border-radius: 8px;
  margin: 0 2px;
  border: 2px solid #e9ecef;
}

.pagination .page-item.active .page-link {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border-color: #667eea;
}

@media (max-width: 991px) {
  .filters-card {
    position: static !important;
  }
  
  .hero-section-small {
    padding-top: 100px;
  }
}

@media (max-width: 768px) {
  .shop-list-item .row {
    flex-direction: column;
  }
  
  .shop-list-item .col-md-4,
  .shop-list-item .col-md-8 {
    max-width: 100%;
    flex: 0 0 100%;
  }
  
  .shop-list-item img {
    height: 200px;
    border-radius: 0.375rem 0.375rem 0 0 !important;
  }
}
</style>
