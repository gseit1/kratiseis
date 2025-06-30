<template>
  <div class="shop-card card-modern h-100">
    <div class="position-relative overflow-hidden">
      <img 
        :src="shopImage" 
        :alt="shop.shopName || shop.name || 'Restaurant'"
        class="card-img-top"
        @error="(e) => handleImageError(e, shop.shopName || shop.name || 'Restaurant')"
      >
      
      <!-- Image Overlay Gradient -->
      <div class="image-overlay-gradient"></div>
      
      <!-- Favorite Button -->
      <button 
        v-if="authStore.isAuthenticated && authStore.isUser"
        @click="toggleFavorite"
        class="btn btn-sm position-absolute top-0 end-0 m-3 btn-glass rounded-circle p-2"
        :class="isFavorite ? 'btn-danger' : 'btn-light'"
      >
        <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
      </button>
      
      <!-- Status Badge -->
      <span 
        v-if="shop.recommended || shop.isRecommended"
        class="badge badge-featured position-absolute top-0 start-0 m-3"
      >
        <i class="bi bi-star-fill me-1"></i>Featured
      </span>
    </div>
    
    <div class="card-body p-4">
      <div class="mb-3">
        <h5 class="card-title fw-bold text-truncate mb-2 text-dark">
          {{ shop.shopName || shop.name || 'Unnamed Restaurant' }}
        </h5>
        <p class="text-muted small mb-2 d-flex align-items-center">
          <i class="bi bi-geo-alt me-2 text-primary"></i>
          {{ shop.address || 'Address not available' }}
        </p>
      </div>
      
      <!-- Rating with modern design -->
      <div class="d-flex align-items-center mb-3">
        <div class="rating-stars me-2">
          <i 
            v-for="star in 5" 
            :key="star"
            :class="star <= averageRating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"
          ></i>
        </div>
        <span class="small text-muted fw-medium">
          <template v-if="averageRating > 0">
            {{ averageRating.toFixed(1) }} 
            <span class="text-primary">({{ reviewCount }} review{{ reviewCount !== 1 ? 's' : '' }})</span>
          </template>
          <template v-else>
            <span class="text-muted">No reviews yet</span>
          </template>
        </span>
      </div>
      
      <!-- Categories with modern badges -->
      <div class="mb-3">
        <span 
          v-for="category in shopCategories" 
          :key="category._id"
          class="badge badge-category me-2 mb-1"
        >
          {{ category.name }}
        </span>
      </div>
      
      <!-- Amenities with icons -->
      <div class="mb-4" v-if="shop.attributes && shop.attributes.length">
        <div class="d-flex flex-wrap gap-2">
          <span 
            v-for="attribute in shop.attributes.slice(0, 3)" 
            :key="attribute._id"
            class="badge badge-amenity"
          >
            <i :class="getAttributeIcon(attribute.name)" class="me-1"></i>
            {{ attribute.name }}
          </span>
          <span 
            v-if="shop.attributes.length > 3"
            class="badge badge-more"
          >
            +{{ shop.attributes.length - 3 }} more
          </span>
        </div>
      </div>
      
      <!-- Price Range with better styling -->
      <div class="mb-3" v-if="shop.priceRange">
        <div class="d-flex align-items-center">
          <span class="text-muted small me-2">Price:</span>
          <span class="price-range fw-bold text-success">
            {{ getPriceRangeDisplay(shop.priceRange) }}
          </span>
        </div>
      </div>
      
      <div class="mt-auto">
        <div class="d-flex gap-2">
          <RouterLink 
            :to="{ name: 'ShopDetail', params: { id: shop._id } }"
            class="btn btn-gradient flex-grow-1 text-decoration-none"
          >
            <i class="bi bi-eye me-2"></i>
            View Details
          </RouterLink>
          <button 
            @click="quickReserve"
            class="btn btn-outline-primary btn-modern-secondary px-3"
            :disabled="!isAvailable"
            :title="isAvailable ? 'Quick Reserve' : 'Not Available'"
          >
            <i class="bi bi-calendar-plus"></i>
          </button>
        </div>
        
        <!-- Availability Status -->
        <div class="mt-2 text-center">
          <span 
            :class="`badge ${isAvailable ? 'bg-success' : 'bg-danger'}`"
          >
            {{ isAvailable ? 'Available Now' : 'Currently Closed' }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { getRestaurantImage, handleImageError } from '@/utils/imageUtils'

export default {
  name: 'ShopCard',
  props: {
    shop: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const isFavorite = ref(false)
    
    const shopImage = computed(() => {
      return getRestaurantImage(props.shop, 300, 200)
    })
    
    const averageRating = computed(() => {
      // Handle backend's reviewRatingAverage field
      if (props.shop.reviewRatingAverage !== undefined && props.shop.reviewRatingAverage !== -1) {
        return props.shop.reviewRatingAverage
      }
      // Fallback to other possible rating fields
      return props.shop.averageRating || 0
    })
    
    const reviewCount = computed(() => {
      // Handle backend's reviewList array
      if (props.shop.reviewList && Array.isArray(props.shop.reviewList)) {
        return props.shop.reviewList.length
      }
      // Fallback to other possible count fields
      if (props.shop.reviewCount !== undefined) {
        return props.shop.reviewCount
      }
      return 0
    })
    
    const shopCategories = computed(() => {
      // Handle both single category (backend) and categories array (if frontend expects it)
      if (props.shop.category) {
        return [props.shop.category]
      }
      return props.shop.categories || []
    })
    
    const isAvailable = computed(() => {
      // Simple check - in a real app you'd check actual opening hours
      const now = new Date()
      const currentHour = now.getHours()
      return currentHour >= 11 && currentHour <= 22
    })
    
    const toggleFavorite = async () => {
      if (isFavorite.value) {
        const success = await authStore.removeFromFavorites(props.shop._id)
        if (success) isFavorite.value = false
      } else {
        const success = await authStore.addToFavorites(props.shop._id)
        if (success) isFavorite.value = true
      }
    }
    
    const quickReserve = () => {
      router.push({
        name: 'ShopDetail',
        params: { id: props.shop._id },
        query: { action: 'reserve' }
      })
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
    
    const getPriceRangeDisplay = (priceRange) => {
      const ranges = {
        1: '€',
        2: '€€',
        3: '€€€',
        4: '€€€€'
      }
      return ranges[priceRange] || '€€'
    }
    
    onMounted(async () => {
      if (authStore.isAuthenticated && authStore.isUser) {
        try {
          const favoriteShops = await authStore.getFavoriteShops()
          isFavorite.value = favoriteShops.some(fav => fav._id === props.shop._id)
        } catch (error) {
          console.error('Error checking favorite status:', error)
        }
      }
    })
    
    return {
      authStore,
      isFavorite,
      shopImage,
      averageRating,
      reviewCount,
      shopCategories,
      isAvailable,
      toggleFavorite,
      quickReserve,
      getAttributeIcon,
      getPriceRangeDisplay
    }
  }
}
</script>

<style scoped>
.shop-card {
  border: none;
  border-radius: var(--radius-xl);
  overflow: hidden;
  transition: all var(--transition-normal);
  background: white;
  box-shadow: var(--shadow-md);
  height: 100%;
}

.shop-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-xl);
}

.card-img-top {
  height: 240px;
  object-fit: cover;
  transition: transform var(--transition-slow);
}

.shop-card:hover .card-img-top {
  transform: scale(1.05);
}

.image-overlay-gradient {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(transparent, rgba(0,0,0,0.1));
  pointer-events: none;
}

.btn-glass {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all var(--transition-fast);
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.05);
}

.badge-featured {
  background: linear-gradient(135deg, var(--warning-500), var(--warning-400));
  color: white;
  font-weight: 600;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  box-shadow: var(--shadow-md);
}

.badge-category {
  background: var(--primary-100);
  color: var(--primary-800);
  border: 1px solid var(--primary-200);
  font-weight: 500;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
}

.badge-amenity {
  background: var(--gray-100);
  color: var(--gray-700);
  border: 1px solid var(--gray-200);
  font-weight: 500;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  transition: all var(--transition-fast);
}

.badge-amenity:hover {
  background: var(--primary-100);
  color: var(--primary-800);
  border-color: var(--primary-200);
}

.badge-more {
  background: var(--secondary-100);
  color: var(--secondary-800);
  border: 1px solid var(--secondary-200);
  font-weight: 500;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
}

.rating-stars {
  display: flex;
  gap: 2px;
  
  i {
    font-size: 14px;
    transition: all var(--transition-fast);
  }
  
  .bi-star-fill {
    color: var(--warning-500);
  }
  
  .bi-star {
    color: var(--gray-300);
  }
}

.price-range {
  color: var(--success-600);
  font-size: var(--text-sm);
}

.card-title {
  color: var(--gray-900);
  font-weight: 700;
  line-height: var(--leading-tight);
}

.btn-outline-primary {
  border-radius: var(--radius-full);
  border-width: 2px;
  transition: all var(--transition-normal);
  font-weight: 600;
}

.btn-outline-primary:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.position-absolute.btn {
  backdrop-filter: blur(10px);
}

.card-body {
  padding: 1.25rem;
}

.text-truncate {
  max-width: 100%;
}

@media (max-width: 576px) {
  .card-img-top {
    height: 150px;
  }
  
  .card-body {
    padding: 1rem;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
    gap: 0.5rem !important;
  }
  
  .flex-grow-1 {
    flex-grow: 0 !important;
  }
}
</style>
