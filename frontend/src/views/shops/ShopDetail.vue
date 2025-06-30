<template>
  <div class="shop-detail-container">
    <div class="shop-detail-page">
      <!-- Loading State -->
      <div v-if="shopStore.loading" class="loading-container">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <!-- Shop Details -->
      <div v-else-if="shop" class="shop-detail">
      <!-- Hero Section with Image Gallery -->
      <section class="shop-hero">
        <div class="container-fluid p-0">
          <div class="shop-gallery">
            <div class="main-image">
              <img 
                :src="currentImage" 
                :alt="shop.shopName || shop.name"
                class="img-fluid w-100"
                style="height: 400px; object-fit: cover;"
              >
              <div class="image-overlay">
                <div class="container">
                  <div class="row align-items-end h-100">
                    <div class="col-12">
                      <div class="shop-title-card">
                        <h1 class="display-4 fw-bold text-white mb-2">
                          {{ shop.shopName || shop.name }}
                        </h1>
                        <div class="d-flex align-items-center text-white mb-3">
                          <div class="rating-stars me-3">
                            <i v-for="star in 5" :key="star" 
                               :class="star <= averageRating ? 'bi bi-star-fill' : 'bi bi-star'"></i>
                          </div>
                          <span class="me-3">{{ averageRating.toFixed(1) }} ({{ reviewCount }} reviews)</span>
                          <span v-if="shop.recommended || shop.isRecommended" class="badge bg-warning">
                            <i class="bi bi-star-fill me-1"></i>Featured
                          </span>
                        </div>
                        <p class="lead text-white-75 mb-0">
                          <i class="bi bi-geo-alt me-2"></i>{{ shop.address }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Thumbnail Gallery -->
            <div v-if="shopImages.length > 1" class="thumbnail-gallery mt-3">
              <div class="container">
                <div class="row g-2">
                  <div 
                    v-for="(image, index) in shopImages.slice(0, 6)" 
                    :key="index"
                    class="col-2"
                  >
                    <img 
                      :src="image" 
                      :alt="`${shop.shopName || shop.name} - Image ${index + 1}`"
                      class="img-fluid rounded cursor-pointer thumbnail"
                      :class="{ active: currentImage === image }"
                      @click="currentImage = image"
                      style="height: 80px; object-fit: cover;"
                    >
                  </div>
                  <div v-if="shopImages.length > 6" class="col-2">
                    <div class="more-images-indicator rounded d-flex align-items-center justify-content-center">
                      <span class="text-white fw-bold">+{{ shopImages.length - 6 }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content -->
      <section class="shop-content py-5">
        <div class="container">
          <div class="row">
            <!-- Left Column - Shop Information -->
            <div class="col-lg-8 mb-4">
              <!-- Quick Actions -->
              <div class="quick-actions mb-4">
                <div class="row g-3">
                  <div class="col-md-4">
                    <button 
                      @click="showReservationModal = true"
                      class="btn btn-gradient w-100 btn-lg"
                    >
                      <i class="bi bi-calendar-plus me-2"></i>
                      Reserve Table
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button 
                      @click="toggleFavorite"
                      class="btn btn-outline-danger w-100 btn-lg"
                      :class="{ 'btn-danger': isFavorite }"
                    >
                      <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'" class="me-2"></i>
                      {{ isFavorite ? 'Favorited' : 'Add to Favorites' }}
                    </button>
                  </div>
                  <div class="col-md-4">
                    <button class="btn btn-outline-primary w-100 btn-lg">
                      <i class="bi bi-share me-2"></i>
                      Share
                    </button>
                  </div>
                </div>
              </div>

              <!-- About Section -->
              <div class="shop-section mb-5">
                <h3 class="section-title">About</h3>
                <p class="shop-description">
                  {{ shop.shopDescription || shop.description || 'No description available.' }}
                </p>
                
                <!-- Categories and Cuisine -->
                <div class="shop-tags mb-3">
                  <span v-if="shop.category" class="badge bg-primary me-2 mb-2">
                    {{ shop.category.name || shop.category }}
                  </span>
                  <span v-for="category in (shop.categories || [])" :key="category._id"
                        class="badge bg-primary me-2 mb-2">
                    {{ category.name }}
                  </span>
                </div>

                <!-- Price Range -->
                <div v-if="shop.priceRange" class="price-range mb-3">
                  <strong>Price Range: </strong>
                  <span class="text-success">{{ getPriceRangeDisplay(shop.priceRange) }}</span>
                </div>
              </div>

              <!-- Amenities & Features -->
              <div v-if="shop.attributes && shop.attributes.length" class="shop-section mb-5">
                <h3 class="section-title">Amenities & Features</h3>
                <div class="row g-3">
                  <div 
                    v-for="attribute in shop.attributes" 
                    :key="attribute._id"
                    class="col-md-6"
                  >
                    <div class="amenity-item">
                      <i :class="getAttributeIcon(attribute.name)" class="text-primary me-2"></i>
                      {{ attribute.name }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Opening Hours -->
              <div v-if="shop.openingHours" class="shop-section mb-5">
                <h3 class="section-title">Opening Hours</h3>
                <div class="opening-hours">
                  <div 
                    v-for="(day, dayName) in shop.openingHours" 
                    :key="dayName"
                    class="day-hours d-flex justify-content-between py-2 border-bottom"
                  >
                    <span class="fw-medium text-capitalize">{{ dayName }}</span>
                    <span v-if="day.isOpen" class="text-success">
                      {{ formatTime(day.open) }} - {{ formatTime(day.close) }}
                    </span>
                    <span v-else class="text-muted">Closed</span>
                  </div>
                </div>
              </div>

              <!-- Location -->
              <div class="shop-section mb-5">
                <h3 class="section-title">Location</h3>
                <div class="location-info">
                  <p class="mb-2">
                    <i class="bi bi-geo-alt text-primary me-2"></i>
                    {{ shop.address }}
                  </p>
                  <p class="mb-2" v-if="shop.city">
                    <i class="bi bi-building text-primary me-2"></i>
                    {{ shop.city.name || shop.city }}
                    <span v-if="shop.region">, {{ shop.region.name || shop.region }}</span>
                  </p>
                  <p class="mb-0" v-if="shop.phone">
                    <i class="bi bi-telephone text-primary me-2"></i>
                    <a :href="`tel:${shop.phone}`" class="text-decoration-none">{{ shop.phone }}</a>
                  </p>
                </div>
              </div>

              <!-- Reviews Section -->
              <div class="shop-section">
                <div class="d-flex justify-content-between align-items-center mb-4">
                  <h3 class="section-title mb-0">Reviews ({{ reviews.length }})</h3>
                  <button 
                    v-if="authStore.isAuthenticated && authStore.isUser"
                    @click="showReviewModal = true"
                    class="btn btn-outline-primary"
                  >
                    <i class="bi bi-plus-circle me-2"></i>
                    Write Review
                  </button>
                </div>

                <!-- Reviews List -->
                <div v-if="reviews.length > 0" class="reviews-list">
                  <div 
                    v-for="review in reviews.slice(0, showAllReviews ? reviews.length : 3)" 
                    :key="review._id"
                    class="review-item mb-4"
                  >
                    <div class="d-flex align-items-start">
                      <div class="review-avatar me-3">
                        <div class="avatar-circle">
                          {{ getInitials(review.userName || review.user?.name || 'Anonymous') }}
                        </div>
                      </div>
                      <div class="review-content flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 class="mb-1">{{ review.userName || review.user?.name || 'Anonymous User' }}</h6>
                            <div class="review-rating">
                              <i v-for="star in 5" :key="star" 
                                 :class="star <= review.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'"></i>
                            </div>
                          </div>
                          <small class="text-muted">{{ formatDate(review.createdAt) }}</small>
                        </div>
                        <p class="review-text mb-0">{{ review.comment }}</p>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    v-if="reviews.length > 3 && !showAllReviews"
                    @click="showAllReviews = true"
                    class="btn btn-outline-secondary"
                  >
                    Show All Reviews
                  </button>
                </div>

                <div v-else class="text-center py-5">
                  <i class="bi bi-chat-dots display-1 text-muted mb-3"></i>
                  <h5 class="text-muted">No reviews yet</h5>
                  <p class="text-muted">Be the first to review this restaurant!</p>
                </div>
              </div>
            </div>

            <!-- Right Column - Reservation Widget -->
            <div class="col-lg-4">
              <div class="reservation-widget sticky-top">
                <div class="card border-0 shadow">
                  <div class="card-header bg-primary text-white">
                    <h5 class="mb-0">
                      <i class="bi bi-calendar-check me-2"></i>
                      Make a Reservation
                    </h5>
                  </div>
                  <div class="card-body">
                    <!-- Simple reservation form for now -->
                    <form @submit.prevent="makeReservation">
                      <div class="mb-3">
                        <label class="form-label">Date</label>
                        <input type="date" class="form-control" v-model="reservationForm.date" :min="today" required>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Time</label>
                        <select class="form-select" v-model="reservationForm.time" required>
                          <option value="">Select time</option>
                          <option v-for="time in timeSlots" :key="time" :value="time">{{ time }}</option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Party Size</label>
                        <select class="form-select" v-model="reservationForm.partySize" required>
                          <option value="">Select party size</option>
                          <option v-for="size in [1,2,3,4,5,6,7,8]" :key="size" :value="size">
                            {{ size }} {{ size === 1 ? 'person' : 'people' }}
                          </option>
                        </select>
                      </div>
                      <div class="mb-3">
                        <label class="form-label">Special Requests (Optional)</label>
                        <textarea 
                          class="form-control" 
                          v-model="reservationForm.comment"
                          rows="2"
                          placeholder="Any special requests or dietary requirements..."
                          maxlength="200"
                        ></textarea>
                        <div class="form-text">{{ reservationForm.comment.length }}/200 characters</div>
                      </div>
                      <button type="submit" class="btn btn-gradient w-100" :disabled="reservationStore.loading">
                        <div v-if="reservationStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></div>
                        <i v-else class="bi bi-calendar-plus me-2"></i>
                        {{ reservationStore.loading ? 'Reserving...' : 'Reserve Now' }}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Not Found -->
    <div v-else class="not-found-container">
      <div class="container text-center py-5">
        <i class="bi bi-shop display-1 text-muted mb-4"></i>
        <h2 class="text-muted">Restaurant Not Found</h2>
        <p class="text-muted">The restaurant you're looking for doesn't exist or has been removed.</p>
        <RouterLink to="/shops" class="btn btn-primary">
          <i class="bi bi-arrow-left me-2"></i>
          Back to Restaurants
        </RouterLink>
      </div>
    </div>
  </div>

  <!-- Review Modal -->
  <div class="modal fade" id="reviewModal" tabindex="-1" v-if="showReviewModal">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Write a Review</h5>
          <button type="button" class="btn-close" @click="showReviewModal = false"></button>
        </div>
        <form @submit.prevent="submitReview">
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Rating</label>
              <div class="rating-input">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  type="button"
                  class="btn btn-link p-0 me-1"
                  @click="reviewForm.rating = star"
                >
                  <i :class="star <= reviewForm.rating ? 'bi bi-star-fill text-warning' : 'bi bi-star text-muted'" 
                     style="font-size: 1.5rem;"></i>
                </button>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Your Review</label>
              <textarea 
                class="form-control" 
                v-model="reviewForm.comment"
                rows="4"
                placeholder="Share your experience..."
                required
                maxlength="500"
              ></textarea>
              <div class="form-text">{{ reviewForm.comment.length }}/500 characters</div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showReviewModal = false">Cancel</button>
            <button type="submit" class="btn btn-gradient" :disabled="shopStore.loading">
              <div v-if="shopStore.loading" class="spinner-border spinner-border-sm me-2" role="status"></div>
              {{ shopStore.loading ? 'Submitting...' : 'Submit Review' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useShopStore } from '@/stores/shop'
import { useReservationStore } from '@/stores/reservation'
import { getRestaurantImage } from '@/utils/imageUtils'
import { format } from 'date-fns'

export default {
  name: 'ShopDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const authStore = useAuthStore()
    const shopStore = useShopStore()
    const reservationStore = useReservationStore()
    
    const shop = ref(null)
    const reviews = ref([])
    const isFavorite = ref(false)
    const showAllReviews = ref(false)
    const currentImage = ref('')
    const showReservationModal = ref(false)
    const showReviewModal = ref(false)
    
    const reservationForm = ref({
      date: '',
      time: '',
      partySize: '',
      comment: ''
    })
    
    const reviewForm = ref({
      rating: 5,
      comment: ''
    })
    
    const today = format(new Date(), 'yyyy-MM-dd')
    const timeSlots = [
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00', '21:30', '22:00'
    ]
    
    const shopImages = computed(() => {
      const images = []
      
      // Add images from backend format
      if (shop.value?.images && Array.isArray(shop.value.images)) {
        shop.value.images.forEach(image => {
          images.push(getRestaurantImage({ images: [image] }))
        })
      }
      
      // Add images from frontend format
      if (shop.value?.photos && Array.isArray(shop.value.photos)) {
        shop.value.photos.forEach(photo => {
          images.push(photo.url || photo)
        })
      }
      
      // If no images, use placeholder
      if (images.length === 0) {
        images.push(getRestaurantImage(shop.value || {}))
      }
      
      return images
    })
    
    const averageRating = computed(() => {
      if (shop.value?.averageRating) return shop.value.averageRating
      if (shop.value?.reviewRatingAverage && shop.value.reviewRatingAverage > 0) {
        return shop.value.reviewRatingAverage
      }
      if (reviews.value.length === 0) return 0
      const total = reviews.value.reduce((sum, review) => sum + review.rating, 0)
      return total / reviews.value.length
    })
    
    const reviewCount = computed(() => {
      if (shop.value?.reviewCount !== undefined) return shop.value.reviewCount
      if (shop.value?.reviewList && Array.isArray(shop.value.reviewList)) {
        return shop.value.reviewList.length
      }
      return reviews.value.length
    })
    
    const fetchShopData = async () => {
      const shopId = route.params.id
      if (!shopId) {
        router.push('/shops')
        return
      }
      
      try {
        // Fetch shop details
        shop.value = await shopStore.fetchShopById(shopId)
        
        if (!shop.value) {
          return
        }
        
        // Set current image
        currentImage.value = shopImages.value[0]
        
        // Fetch reviews
        try {
          reviews.value = await shopStore.getShopReviews(shopId)
        } catch (error) {
          console.log('Reviews not available:', error)
          reviews.value = []
        }
        
        // Check if favorited
        if (authStore.isAuthenticated && authStore.isUser) {
          try {
            const favoriteShops = await authStore.getFavoriteShops()
            isFavorite.value = favoriteShops.some(fav => fav._id === shopId)
          } catch (error) {
            console.error('Error checking favorite status:', error)
          }
        }
      } catch (error) {
        console.error('Error fetching shop data:', error)
      }
    }
    
    const toggleFavorite = async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }
      
      try {
        if (isFavorite.value) {
          const success = await authStore.removeFromFavorites(shop.value._id)
          if (success) isFavorite.value = false
        } else {
          const success = await authStore.addToFavorites(shop.value._id)
          if (success) isFavorite.value = true
        }
      } catch (error) {
        console.error('Error toggling favorite:', error)
      }
    }
    
    const makeReservation = async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }
      
      if (!reservationForm.value.date || !reservationForm.value.time || !reservationForm.value.partySize) {
        alert('Please fill in all required fields')
        return
      }
      
      try {
        // Convert time to decimal format (backend expects this)
        const [hours, minutes] = reservationForm.value.time.split(':')
        const reservationTime = parseInt(hours) + (parseInt(minutes) / 60)
        
        const reservationData = {
          reservationDate: reservationForm.value.date,
          reservationTime: reservationTime,
          shopId: shop.value._id,
          shopName: shop.value.shopName || shop.value.name,
          name: authStore.user.firstName || authStore.user.name || '',
          surname: authStore.user.lastName || authStore.user.surname || '',
          seats: parseInt(reservationForm.value.partySize),
          commentFromUser: reservationForm.value.comment || ''
        }
        
        const result = await reservationStore.createUserReservation(reservationData)
        
        if (result.success) {
          // Reset form
          reservationForm.value = {
            date: '',
            time: '',
            partySize: '',
            comment: ''
          }
          
          // Optionally redirect to reservations page
          router.push('/reservations')
        }
      } catch (error) {
        console.error('Error making reservation:', error)
        alert('Failed to make reservation. Please try again.')
      }
    }
    
    const submitReview = async () => {
      if (!authStore.isAuthenticated) {
        router.push('/login')
        return
      }
      
      if (!reviewForm.value.comment.trim()) {
        alert('Please write a review comment')
        return
      }
      
      try {
        const reviewData = {
          rating: reviewForm.value.rating,
          comment: reviewForm.value.comment.trim()
        }
        
        const result = await shopStore.addShopReview(shop.value._id, reviewData)
        
        if (result.success) {
          // Reset form and close modal
          reviewForm.value = {
            rating: 5,
            comment: ''
          }
          showReviewModal.value = false
          
          // Refresh reviews
          try {
            reviews.value = await shopStore.getShopReviews(shop.value._id)
          } catch (error) {
            console.log('Error refreshing reviews:', error)
          }
        }
      } catch (error) {
        console.error('Error submitting review:', error)
        alert('Failed to submit review. Please try again.')
      }
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
        1: '€ (Budget)',
        2: '€€ (Moderate)',
        3: '€€€ (Expensive)',
        4: '€€€€ (Very Expensive)'
      }
      return ranges[priceRange] || '€€ (Moderate)'
    }
    
    const formatTime = (hour) => {
      return `${hour.toString().padStart(2, '0')}:00`
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const getInitials = (name) => {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
    
    // Watch for route changes
    watch(() => route.params.id, fetchShopData, { immediate: true })
    
    onMounted(() => {
      // Check if we should show reservation modal from query
      if (route.query.action === 'reserve') {
        // Scroll to reservation form
        setTimeout(() => {
          const reservationWidget = document.querySelector('.reservation-widget')
          if (reservationWidget) {
            reservationWidget.scrollIntoView({ behavior: 'smooth' })
          }
        }, 500)
      }
    })
    
    return {
      shop,
      reviews,
      isFavorite,
      showAllReviews,
      currentImage,
      shopImages,
      averageRating,
      reviewCount,
      reservationForm,
      reviewForm,
      showReservationModal,
      showReviewModal,
      today,
      timeSlots,
      authStore,
      shopStore,
      reservationStore,
      toggleFavorite,
      makeReservation,
      submitReview,
      getAttributeIcon,
      getPriceRangeDisplay,
      formatTime,
      formatDate,
      getInitials
    }
  }
}
</script>

<style scoped>
.loading-container,
.not-found-container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.shop-hero {
  position: relative;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7));
  display: flex;
  align-items: end;
  padding-bottom: 2rem;
}

.shop-title-card {
  background: rgba(0,0,0,0.5);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
}

.rating-stars {
  color: #ffc107;
}

.thumbnail {
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail:hover,
.thumbnail.active {
  border-color: #667eea;
  transform: scale(1.05);
}

.cursor-pointer {
  cursor: pointer;
}

.more-images-indicator {
  height: 80px;
  background: rgba(0,0,0,0.7);
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

.section-title {
  color: #333;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
  margin-bottom: 1.5rem;
}

.shop-description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #555;
}

.amenity-item {
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

.day-hours:last-child {
  border-bottom: none !important;
}

.reservation-widget {
  top: 120px;
}

.review-item {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  border-left: 4px solid #667eea;
}

.avatar-circle {
  width: 50px;
  height: 50px;
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.review-text {
  color: #555;
  line-height: 1.6;
}

@media (max-width: 991px) {
  .reservation-widget {
    position: static !important;
  }
  
  .image-overlay {
    padding-bottom: 1rem;
  }
  
  .shop-title-card {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .shop-title-card h1 {
    font-size: 2rem;
  }
  
  .thumbnail-gallery .col-2 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* Modal Styles */
.modal {
  background: rgba(0, 0, 0, 0.5);
  display: flex !important;
  align-items: center;
}

.rating-input .btn {
  border: none !important;
  box-shadow: none !important;
}

.rating-input .btn:hover {
  background: none !important;
}
</style>
