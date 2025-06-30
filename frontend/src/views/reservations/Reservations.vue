<template>
  <div class="reservations-page">
    <div class="container py-5">
      <!-- Header -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-10">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h1 class="display-6 fw-bold text-dark mb-1 text-display">My Reservations</h1>
              <p class="text-muted fs-5">View and manage your restaurant reservations</p>
            </div>
            <RouterLink to="/dashboard" class="btn btn-glass hover-lift">
              <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-10">
          <!-- Filter Tabs -->
          <div class="tabs-modern mb-5">
            <nav class="nav nav-pills-modern" role="tablist">
              <button 
                class="nav-link-modern"
                :class="{ active: activeTab === 'upcoming' }"
                @click="activeTab = 'upcoming'"
                type="button"
              >
                <i class="bi bi-calendar-event me-2"></i>
                Upcoming ({{ upcomingReservations.length }})
              </button>
              <button 
                class="nav-link-modern"
                :class="{ active: activeTab === 'past' }"
                @click="activeTab = 'past'"
                type="button"
              >
                <i class="bi bi-clock-history me-2"></i>
                Past ({{ pastReservations.length }})
              </button>
              <button 
                class="nav-link-modern"
                :class="{ active: activeTab === 'all' }"
                @click="activeTab = 'all'"
                type="button"
              >
                <i class="bi bi-list me-2"></i>
                All ({{ reservationStore.userReservations.length }})
              </button>
            </nav>
          </div>

          <!-- Loading State -->
          <div v-if="reservationStore.loading" class="loading-state">
            <div class="loading-modern"></div>
            <p class="text-muted mt-3">Loading your reservations...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="currentReservations.length === 0" class="empty-state">
            <div class="card-modern text-center">
              <div class="card-body py-5">
                <i class="bi bi-calendar-x empty-icon"></i>
                <h4 class="mt-3 mb-2 text-display">{{ getEmptyStateTitle() }}</h4>
                <p class="text-muted mb-4">{{ getEmptyStateMessage() }}</p>
                <RouterLink to="/shops" class="btn btn-gradient hover-lift">
                  <i class="bi bi-search me-2"></i>Find Restaurants
                </RouterLink>
              </div>
            </div>
          </div>

          <!-- Reservations List -->
          <div v-else class="row g-4">
            <div v-for="reservation in currentReservations" :key="reservation._id" class="col-12">
              <div class="reservation-card">
                <div class="reservation-content">
                  <div class="row align-items-center">
                    <!-- Reservation Image & Basic Info -->
                    <div class="col-md-8">
                      <div class="d-flex">
                        <div class="flex-shrink-0 me-4">
                          <img 
                            :src="getShopImage(reservation.shop)"
                            class="restaurant-image"
                            alt="Restaurant"
                          >
                        </div>
                        <div class="flex-grow-1">
                          <div class="d-flex align-items-start justify-content-between mb-3">
                            <div>
                              <h5 class="mb-1 text-display">{{ getShopName(reservation.shop) }}</h5>
                              <p class="location-text">
                                <i class="bi bi-geo-alt me-1"></i>
                                {{ getShopLocation(reservation.shop) }}
                              </p>
                            </div>
                            <span 
                              class="status-badge"
                              :class="getStatusBadgeClass(reservation.status)"
                            >
                              {{ getStatusLabel(reservation.status) }}
                            </span>
                          </div>
                          
                          <div class="reservation-details">
                            <div class="detail-item">
                              <i class="bi bi-calendar3 me-2"></i>
                              <span>{{ formatDate(reservation.date) }}</span>
                            </div>
                            <div class="detail-item">
                              <i class="bi bi-clock me-2"></i>
                              <span>{{ formatTime(reservation.time) }}</span>
                            </div>
                            <div class="detail-item">
                              <i class="bi bi-people me-2"></i>
                              <span>{{ reservation.numberOfGuests }} guests</span>
                            </div>
                            <div class="detail-item" v-if="reservation.tableId">
                              <i class="bi bi-table me-2"></i>
                              <span>Table {{ getTableNumber(reservation.tableId) }}</span>
                            </div>
                          </div>

                          <!-- Special Requests -->
                          <div v-if="reservation.specialRequests" class="special-requests">
                            <i class="bi bi-chat-square-text me-1"></i>
                            <strong>Special requests:</strong> {{ reservation.specialRequests }}
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Actions -->
                    <div class="col-md-4 text-md-end mt-3 mt-md-0">
                      <div class="action-buttons">
                        <!-- View Details -->
                        <RouterLink 
                          v-if="getShopId(reservation.shop)"
                          :to="`/shops/${getShopId(reservation.shop)}`"
                          class="btn btn-modern-secondary btn-sm hover-lift"
                        >
                          <i class="bi bi-eye me-2"></i>View Restaurant
                        </RouterLink>

                        <!-- Action buttons based on status and date -->
                        <div v-if="canCancelReservation(reservation)">
                          <button 
                            class="btn btn-danger-modern btn-sm w-100 hover-lift"
                            @click="showCancelModal(reservation)"
                            :disabled="reservationStore.loading"
                          >
                            <i class="bi bi-x-circle me-2"></i>Cancel
                          </button>
                        </div>

                        <div v-if="canReserveAgain(reservation) && getShopId(reservation.shop)">
                          <RouterLink 
                            :to="`/shops/${getShopId(reservation.shop)}`"
                            class="btn btn-gradient btn-sm w-100 hover-lift"
                          >
                            <i class="bi bi-arrow-repeat me-2"></i>Book Again
                          </RouterLink>
                        </div>

                        <div v-if="canReview(reservation)">
                          <button 
                            class="btn btn-warning-modern btn-sm w-100 hover-lift"
                            @click="showReviewModal(reservation)"
                          >
                            <i class="bi bi-star me-2"></i>Leave Review
                          </button>
                        </div>
                      </div>

                      <!-- Reservation ID -->
                      <div class="reservation-id">
                        ID: #{{ reservation._id.slice(-8).toUpperCase() }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Cancel Reservation Modal -->
    <div class="modal-modern" :class="{ 'show': showCancelConfirm }">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger text-display">
              <i class="bi bi-exclamation-triangle me-2"></i>Cancel Reservation
            </h5>
            <button type="button" class="btn-close-modern" @click="showCancelConfirm = false">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <p class="mb-3">Are you sure you want to cancel this reservation?</p>
            <div v-if="selectedReservation" class="reservation-summary">
              <strong>{{ getShopName(selectedReservation.shop) }}</strong><br>
              {{ formatDate(selectedReservation.date) }} at {{ formatTime(selectedReservation.time) }}<br>
              {{ selectedReservation.numberOfGuests }} guests
            </div>
            <div class="alert-modern alert-warning">
              <i class="bi bi-info-circle me-2"></i>
              Cancellation policies may apply. Please check with the restaurant for details.
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern-secondary hover-lift" @click="showCancelConfirm = false">
              Keep Reservation
            </button>
            <button 
              type="button" 
              class="btn btn-danger-modern hover-lift"
              @click="cancelReservation"
              :disabled="reservationStore.loading"
            >
              <span v-if="reservationStore.loading" class="loading-modern me-2"></span>
              <i v-else class="bi bi-x-circle me-2"></i>
              Cancel Reservation
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Review Modal -->
    <div class="modal-modern" :class="{ 'show': showReviewForm }">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-display">
              <i class="bi bi-star me-2 text-gradient"></i>Leave a Review
            </h5>
            <button type="button" class="btn-close-modern" @click="showReviewForm = false">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedReservation" class="review-restaurant-info">
              <div class="d-flex align-items-center">
                <img 
                  :src="getShopImage(selectedReservation.shop)"
                  class="restaurant-preview"
                  alt="Restaurant"
                >
                <div>
                  <h6 class="mb-1 text-display">{{ getShopName(selectedReservation.shop) }}</h6>
                  <small class="text-muted">{{ formatDate(selectedReservation.date) }}</small>
                </div>
              </div>
            </div>

            <form @submit.prevent="submitReview">
              <div class="mb-4">
                <label class="form-label-modern">Rating</label>
                <div class="rating-stars">
                  <button
                    v-for="star in 5"
                    :key="star"
                    type="button"
                    class="star-button"
                    @click="reviewForm.rating = star"
                  >
                    <i 
                      class="bi"
                      :class="star <= reviewForm.rating ? 'bi-star-fill' : 'bi-star'"
                    ></i>
                  </button>
                </div>
              </div>

              <div class="mb-3">
                <label for="reviewComment" class="form-label-modern">Your Review</label>
                <textarea
                  id="reviewComment"
                  class="form-control form-control-modern"
                  rows="4"
                  v-model="reviewForm.comment"
                  placeholder="Share your experience..."
                  required
                ></textarea>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern-secondary hover-lift" @click="showReviewForm = false">
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-warning-modern hover-lift"
              @click="submitReview"
              :disabled="!reviewForm.rating || !reviewForm.comment.trim()"
            >
              <i class="bi bi-star me-2"></i>Submit Review
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useReservationStore } from '@/stores/reservation'
import { useShopStore } from '@/stores/shop'
import { useToast } from 'vue-toastification'
import { getImageUrl } from '@/utils/imageUtils'

export default {
  name: 'Reservations',
  setup() {
    const reservationStore = useReservationStore()
    const shopStore = useShopStore()
    const toast = useToast()

    const activeTab = ref('upcoming')
    const showCancelConfirm = ref(false)
    const showReviewForm = ref(false)
    const selectedReservation = ref(null)

    const reviewForm = ref({
      rating: 0,
      comment: ''
    })

    const upcomingReservations = computed(() => reservationStore.upcomingReservations)
    const pastReservations = computed(() => reservationStore.pastReservations)

    const currentReservations = computed(() => {
      switch (activeTab.value) {
        case 'upcoming':
          return upcomingReservations.value
        case 'past':
          return pastReservations.value
        case 'all':
        default:
          return reservationStore.userReservations
      }
    })

    const getShopName = (shop) => {
      if (typeof shop === 'object' && shop !== null) {
        return shop.name || 'Restaurant'
      }
      return 'Restaurant'
    }

    const getShopId = (shop) => {
      if (typeof shop === 'object' && shop !== null && shop._id) {
        return shop._id
      }
      if (typeof shop === 'string') {
        return shop
      }
      return null
    }

    const getShopLocation = (shop) => {
      if (typeof shop === 'object' && shop !== null) {
        const city = shop.city?.name || shop.city || ''
        const region = shop.region?.name || shop.region || ''
        return city && region ? `${city}, ${region}` : city || region || 'Location not available'
      }
      return 'Location not available'
    }

    const getShopImage = (shop) => {
      if (typeof shop === 'object' && shop !== null && shop.images && shop.images.length > 0) {
        return getImageUrl(shop.images[0])
      }
      return getImageUrl('placeholder.jpg')
    }

    const getTableNumber = (tableId) => {
      if (typeof tableId === 'object' && tableId.tableNumber) {
        return tableId.tableNumber
      }
      return 'N/A'
    }

    const formatTime = (time) => {
      if (typeof time === 'number') {
        const hours = Math.floor(time)
        const minutes = Math.round((time - hours) * 60)
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      }
      return time || 'N/A'
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const getStatusLabel = (status) => {
      const statusLabels = {
        pending: 'Pending',
        confirmed: 'Confirmed',
        cancelled: 'Cancelled',
        completed: 'Completed',
        'no-show': 'No Show'
      }
      return statusLabels[status] || status
    }

    const getStatusBadgeClass = (status) => {
      const statusClasses = {
        pending: 'bg-warning text-dark',
        confirmed: 'bg-success text-white',
        cancelled: 'bg-danger text-white',
        completed: 'bg-primary text-white',
        'no-show': 'bg-secondary text-white'
      }
      return statusClasses[status] || 'bg-secondary text-white'
    }

    const canCancelReservation = (reservation) => {
      const reservationDate = new Date(reservation.date)
      const now = new Date()
      const hoursBefore = (reservationDate - now) / (1000 * 60 * 60)
      
      return reservation.status === 'pending' || 
             (reservation.status === 'confirmed' && hoursBefore > 2)
    }

    const canReserveAgain = (reservation) => {
      return ['completed', 'cancelled'].includes(reservation.status)
    }

    const canReview = (reservation) => {
      return reservation.status === 'completed' && !reservation.hasReview
    }

    const getEmptyStateTitle = () => {
      switch (activeTab.value) {
        case 'upcoming':
          return 'No Upcoming Reservations'
        case 'past':
          return 'No Past Reservations'
        default:
          return 'No Reservations Yet'
      }
    }

    const getEmptyStateMessage = () => {
      switch (activeTab.value) {
        case 'upcoming':
          return 'You don\'t have any upcoming reservations. Start exploring restaurants to make your first booking!'
        case 'past':
          return 'You haven\'t completed any reservations yet.'
        default:
          return 'Start your culinary journey by booking a table at one of our amazing restaurants!'
      }
    }

    const showCancelModal = (reservation) => {
      selectedReservation.value = reservation
      showCancelConfirm.value = true
    }

    const showReviewModal = (reservation) => {
      selectedReservation.value = reservation
      reviewForm.value = { rating: 0, comment: '' }
      showReviewForm.value = true
    }

    const cancelReservation = async () => {
      if (!selectedReservation.value) return

      const result = await reservationStore.cancelReservation(selectedReservation.value._id)
      if (result.success) {
        toast.success('Reservation cancelled successfully')
      }
      
      showCancelConfirm.value = false
      selectedReservation.value = null
    }

    const submitReview = async () => {
      if (!selectedReservation.value || !reviewForm.value.rating || !reviewForm.value.comment.trim()) {
        return
      }

      try {
        const reviewData = {
          shopId: getShopId(selectedReservation.value.shop),
          rating: reviewForm.value.rating,
          comment: reviewForm.value.comment.trim()
        }

        await shopStore.addShopReview(reviewData)
        toast.success('Review submitted successfully!')
        
        showReviewForm.value = false
        selectedReservation.value = null
        reviewForm.value = { rating: 0, comment: '' }
      } catch (error) {
        toast.error('Failed to submit review')
      }
    }

    onMounted(async () => {
      await reservationStore.fetchUserReservations()
    })

    return {
      reservationStore,
      activeTab,
      showCancelConfirm,
      showReviewForm,
      selectedReservation,
      reviewForm,
      upcomingReservations,
      pastReservations,
      currentReservations,
      getShopName,
      getShopId,
      getShopLocation,
      getShopImage,
      getTableNumber,
      formatTime,
      formatDate,
      getStatusLabel,
      getStatusBadgeClass,
      canCancelReservation,
      canReserveAgain,
      canReview,
      getEmptyStateTitle,
      getEmptyStateMessage,
      showCancelModal,
      showReviewModal,
      cancelReservation,
      submitReview
    }
  }
}
</script>

<style scoped>
.reservations-page {
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
  min-height: 100vh;
  padding-top: 120px;
}

.tabs-modern {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  border: 1px solid var(--gray-100);
}

.nav-pills-modern {
  display: flex;
  background: white;
}

.nav-link-modern {
  flex: 1;
  padding: var(--space-4) var(--space-6);
  background: none;
  border: none;
  color: var(--gray-600);
  font-weight: 500;
  text-align: center;
  transition: all var(--transition-normal);
  border-bottom: 3px solid transparent;
}

.nav-link-modern:hover {
  background: var(--gray-50);
  color: var(--gray-700);
}

.nav-link-modern.active {
  background: var(--primary-50);
  color: var(--primary-700);
  border-bottom-color: var(--primary-500);
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-20);
}

.empty-state {
  display: flex;
  justify-content: center;
}

.empty-icon {
  font-size: 4rem;
  color: var(--gray-400);
}

.reservation-card {
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--gray-100);
  transition: all var(--transition-normal);
  overflow: hidden;
}

.reservation-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.reservation-content {
  padding: var(--space-6);
}

.restaurant-image {
  width: 80px;
  height: 80px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  box-shadow: var(--shadow-sm);
}

.location-text {
  color: var(--gray-500);
  margin-bottom: var(--space-2);
  font-size: var(--text-sm);
}

.status-badge {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status-badge.bg-warning {
  background: var(--warning-100) !important;
  color: var(--warning-800) !important;
  border: 1px solid var(--warning-200);
}

.status-badge.bg-success {
  background: var(--success-100) !important;
  color: var(--success-800) !important;
  border: 1px solid var(--success-200);
}

.status-badge.bg-danger {
  background: var(--danger-100) !important;
  color: var(--danger-800) !important;
  border: 1px solid var(--danger-200);
}

.status-badge.bg-primary {
  background: var(--primary-100) !important;
  color: var(--primary-800) !important;
  border: 1px solid var(--primary-200);
}

.status-badge.bg-secondary {
  background: var(--gray-100) !important;
  color: var(--gray-800) !important;
  border: 1px solid var(--gray-200);
}

.reservation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-3);
  margin-top: var(--space-3);
}

.detail-item {
  display: flex;
  align-items: center;
  color: var(--gray-600);
  font-size: var(--text-sm);
}

.detail-item i {
  color: var(--primary-500);
}

.special-requests {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--gray-50);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--gray-600);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.action-buttons .btn {
  white-space: nowrap;
}

.reservation-id {
  margin-top: var(--space-3);
  font-size: var(--text-xs);
  color: var(--gray-500);
  font-family: monospace;
}

.btn-warning-modern {
  background: var(--warning-500);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  font-weight: 600;
  transition: all var(--transition-normal);
}

.btn-warning-modern:hover {
  background: var(--warning-600);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-danger-modern {
  background: var(--danger-500);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-2) var(--space-4);
  font-weight: 600;
  transition: all var(--transition-normal);
}

.btn-danger-modern:hover {
  background: var(--danger-600);
  color: white;
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.modal-modern {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1050;
  align-items: center;
  justify-content: center;
}

.modal-modern.show {
  display: flex;
  animation: fadeIn var(--transition-normal);
}

.modal-modern .modal-content {
  background: white;
  border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-2xl);
  border: none;
  overflow: hidden;
  animation: slideUp var(--transition-normal);
  max-width: 500px;
  width: 90%;
}

.modal-modern .modal-header {
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-6);
}

.modal-modern .modal-body {
  padding: var(--space-6);
}

.modal-modern .modal-footer {
  background: var(--gray-50);
  border-top: 1px solid var(--gray-200);
  padding: var(--space-6);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}

.btn-close-modern {
  background: none;
  border: none;
  color: var(--gray-500);
  font-size: var(--text-xl);
  padding: var(--space-2);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.btn-close-modern:hover {
  background: var(--gray-200);
  color: var(--gray-700);
}

.reservation-summary {
  background: var(--gray-50);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}

.alert-modern {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid;
  font-size: var(--text-sm);
}

.alert-warning {
  background: var(--warning-50);
  border-color: var(--warning-200);
  color: var(--warning-800);
}

.review-restaurant-info {
  background: var(--gray-50);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-5);
}

.restaurant-preview {
  width: 50px;
  height: 50px;
  border-radius: var(--radius-lg);
  object-fit: cover;
  margin-right: var(--space-3);
}

.form-label-modern {
  color: var(--gray-700);
  font-weight: 600;
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
}

.rating-stars {
  display: flex;
  gap: var(--space-1);
}

.star-button {
  background: none;
  border: none;
  padding: var(--space-1);
  font-size: var(--text-xl);
  color: var(--gray-300);
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);
}

.star-button:hover {
  color: var(--warning-500);
  transform: scale(1.1);
}

.star-button .bi-star-fill {
  color: var(--warning-500);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .reservations-page {
    padding-top: 100px;
  }
  
  .reservation-details {
    grid-template-columns: 1fr;
    gap: var(--space-2);
  }
  
  .action-buttons {
    flex-direction: column;
    width: 100%;
  }
  
  .action-buttons .btn {
    width: 100% !important;
    justify-content: center;
  }
  
  .modal-modern .modal-dialog {
    margin: var(--space-4);
    max-width: calc(100% - 2rem);
    width: auto;
  }
  
  .restaurant-image {
    width: 60px;
    height: 60px;
  }
}
</style>
