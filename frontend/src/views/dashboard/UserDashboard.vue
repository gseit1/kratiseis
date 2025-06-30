<template>
  <div class="user-dashboard">
    <!-- Header Section -->
    <section class="dashboard-header">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-8">
            <h1 class="display-5 fw-bold text-primary mb-2">
              Welcome back, {{ userName }}!
            </h1>
            <p class="lead text-muted">
              Manage your reservations and discover new dining experiences
            </p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <RouterLink to="/shops" class="btn btn-gradient btn-lg">
              <i class="bi bi-search me-2"></i>
              Find Restaurants
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Quick Stats -->
    <section class="py-4 bg-light">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-3 col-md-6">
            <div class="stat-card">
              <div class="stat-icon bg-primary">
                <i class="bi bi-calendar-check text-white"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.upcomingReservations }}</h3>
                <p class="stat-label">Upcoming Reservations</p>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="stat-card">
              <div class="stat-icon bg-success">
                <i class="bi bi-clock-history text-white"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.totalReservations }}</h3>
                <p class="stat-label">Total Reservations</p>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="stat-card">
              <div class="stat-icon bg-warning">
                <i class="bi bi-heart-fill text-white"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.favoriteShops }}</h3>
                <p class="stat-label">Favorite Places</p>
              </div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6">
            <div class="stat-card">
              <div class="stat-icon bg-info">
                <i class="bi bi-star-fill text-white"></i>
              </div>
              <div class="stat-content">
                <h3 class="stat-number">{{ stats.reviewsWritten }}</h3>
                <p class="stat-label">Reviews Written</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main Content -->
    <section class="py-5">
      <div class="container">
        <div class="row g-4">
          <!-- Left Column -->
          <div class="col-lg-8">
            <!-- Upcoming Reservations -->
            <div class="dashboard-card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-calendar-event me-2"></i>
                  Upcoming Reservations
                </h5>
                <RouterLink to="/reservations" class="btn btn-outline-primary btn-sm">
                  View All
                </RouterLink>
              </div>
              <div class="card-body">
                <div v-if="upcomingReservations.length > 0" class="reservation-list">
                  <div 
                    v-for="reservation in upcomingReservations.slice(0, 3)" 
                    :key="reservation._id"
                    class="reservation-item"
                  >
                    <div class="reservation-info">
                      <h6 class="reservation-shop">{{ reservation.shopName }}</h6>
                      <p class="reservation-details">
                        <i class="bi bi-calendar3 me-1"></i>
                        {{ formatDate(reservation.reservationDate) }}
                        <i class="bi bi-clock ms-3 me-1"></i>
                        {{ formatTime(reservation.reservationTime) }}
                        <i class="bi bi-people ms-3 me-1"></i>
                        {{ reservation.seats }} {{ reservation.seats === 1 ? 'person' : 'people' }}
                      </p>
                      <span :class="`badge bg-${getStatusColor(reservation.state)}`">
                        {{ getStatusText(reservation.state) }}
                      </span>
                    </div>
                    <div class="reservation-actions">
                      <button class="btn btn-outline-primary btn-sm">
                        <i class="bi bi-eye"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <i class="bi bi-calendar-x display-1 text-muted mb-3"></i>
                  <h6 class="text-muted">No upcoming reservations</h6>
                  <p class="text-muted">Start exploring restaurants to make your first reservation!</p>
                  <RouterLink to="/shops" class="btn btn-primary">
                    Browse Restaurants
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="dashboard-card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-activity me-2"></i>
                  Recent Activity
                </h5>
              </div>
              <div class="card-body">
                <div v-if="recentActivity.length > 0" class="activity-list">
                  <div 
                    v-for="activity in recentActivity" 
                    :key="activity.id"
                    class="activity-item"
                  >
                    <div class="activity-icon">
                      <i :class="activity.icon" :style="{ color: activity.color }"></i>
                    </div>
                    <div class="activity-content">
                      <p class="mb-0">{{ activity.description }}</p>
                      <small class="text-muted">{{ activity.timestamp }}</small>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <i class="bi bi-clock-history display-1 text-muted mb-3"></i>
                  <h6 class="text-muted">No recent activity</h6>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div class="col-lg-4">
            <!-- Quick Actions -->
            <div class="dashboard-card mb-4">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-lightning-charge me-2"></i>
                  Quick Actions
                </h5>
              </div>
              <div class="card-body">
                <div class="d-grid gap-2">
                  <RouterLink to="/shops" class="btn btn-primary">
                    <i class="bi bi-search me-2"></i>
                    Find Restaurants
                  </RouterLink>
                  <RouterLink to="/reservations" class="btn btn-outline-primary">
                    <i class="bi bi-calendar-check me-2"></i>
                    View Reservations
                  </RouterLink>
                  <RouterLink to="/profile" class="btn btn-outline-secondary">
                    <i class="bi bi-person-gear me-2"></i>
                    Edit Profile
                  </RouterLink>
                </div>
              </div>
            </div>

            <!-- Favorite Restaurants -->
            <div class="dashboard-card">
              <div class="card-header">
                <h5 class="mb-0">
                  <i class="bi bi-heart-fill me-2"></i>
                  Favorite Places
                </h5>
              </div>
              <div class="card-body">
                <div v-if="favoriteShops.length > 0" class="favorite-list">
                  <div 
                    v-for="shop in favoriteShops.slice(0, 4)" 
                    :key="shop._id"
                    class="favorite-item"
                    @click="$router.push(`/shops/${shop._id}`)"
                  >
                    <img 
                      :src="getShopImage(shop)" 
                      :alt="shop.shopName || shop.name"
                      class="favorite-image"
                    >
                    <div class="favorite-info">
                      <h6 class="mb-1">{{ shop.shopName || shop.name }}</h6>
                      <small class="text-muted">{{ shop.address }}</small>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-4">
                  <i class="bi bi-heart display-1 text-muted mb-3"></i>
                  <h6 class="text-muted">No favorites yet</h6>
                  <p class="small text-muted">Add restaurants to your favorites for quick access!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReservationStore } from '@/stores/reservation'
import { getRestaurantImage } from '@/utils/imageUtils'
import { format } from 'date-fns'

export default {
  name: 'UserDashboard',
  setup() {
    const authStore = useAuthStore()
    const reservationStore = useReservationStore()
    
    const favoriteShops = ref([])
    const recentActivity = ref([])
    
    const userName = computed(() => {
      return authStore.user?.name || authStore.user?.firstName || 'User'
    })
    
    const upcomingReservations = computed(() => {
      return reservationStore.upcomingReservations || []
    })
    
    const stats = computed(() => ({
      upcomingReservations: upcomingReservations.value.length,
      totalReservations: reservationStore.userReservations?.length || 0,
      favoriteShops: favoriteShops.value.length,
      reviewsWritten: 0 // Will be implemented later
    }))
    
    const formatDate = (date) => {
      return format(new Date(date), 'MMM dd, yyyy')
    }
    
    const formatTime = (time) => {
      // Convert decimal time to HH:MM format
      const hours = Math.floor(time)
      const minutes = Math.round((time % 1) * 60)
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }
    
    const getStatusColor = (status) => {
      const colors = {
        'pending': 'warning',
        'accepted': 'success',
        'completed': 'info',
        'notShown': 'danger'
      }
      return colors[status] || 'secondary'
    }
    
    const getStatusText = (status) => {
      const texts = {
        'pending': 'Pending',
        'accepted': 'Confirmed',
        'completed': 'Completed',
        'notShown': 'No Show'
      }
      return texts[status] || status
    }
    
    const getShopImage = (shop) => {
      return getRestaurantImage(shop, 60, 60)
    }
    
    const loadDashboardData = async () => {
      try {
        // Load user reservations
        await reservationStore.fetchUserReservations()
        
        // Load favorite shops
        favoriteShops.value = await authStore.getFavoriteShops()
        
        // Generate recent activity (mock data for now)
        recentActivity.value = [
          {
            id: 1,
            icon: 'bi bi-calendar-plus',
            color: '#198754',
            description: 'Made a reservation at Taverna Kosta',
            timestamp: '2 hours ago'
          },
          {
            id: 2,
            icon: 'bi bi-heart-fill',
            color: '#dc3545',
            description: 'Added Mediterranean Bistro to favorites',
            timestamp: '1 day ago'
          },
          {
            id: 3,
            icon: 'bi bi-star-fill',
            color: '#ffc107',
            description: 'Reviewed Ocean View Restaurant',
            timestamp: '3 days ago'
          }
        ]
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      }
    }
    
    onMounted(() => {
      loadDashboardData()
    })
    
    return {
      authStore,
      userName,
      upcomingReservations,
      favoriteShops,
      recentActivity,
      stats,
      formatDate,
      formatTime,
      getStatusColor,
      getStatusText,
      getShopImage
    }
  }
}
</script>

<style scoped>
.dashboard-header {
  background: linear-gradient(135deg, #f8f9fc 0%, #e3e7f3 100%);
  padding: 3rem 0;
}

.stat-card {
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  color: #2d3748;
}

.stat-label {
  color: #718096;
  margin-bottom: 0;
  font-size: 0.875rem;
}

.dashboard-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.dashboard-card .card-header {
  background: #f8f9fc;
  border-bottom: 1px solid #e2e8f0;
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-card .card-body {
  padding: 1.5rem;
}

.reservation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.reservation-item:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.15);
}

.reservation-item:last-child {
  margin-bottom: 0;
}

.reservation-shop {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #2d3748;
}

.reservation-details {
  color: #718096;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  width: 40px;
  height: 40px;
  background: #f7fafc;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.2rem;
}

.favorite-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: 10px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.favorite-item:hover {
  background: #f7fafc;
}

.favorite-image {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  object-fit: cover;
  margin-right: 1rem;
}

.favorite-info h6 {
  color: #2d3748;
  font-weight: 600;
}

@media (max-width: 768px) {
  .dashboard-header {
    text-align: center;
    padding: 2rem 0;
  }
  
  .stat-card {
    margin-bottom: 1rem;
  }
  
  .reservation-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .reservation-actions {
    margin-top: 0.75rem;
  }
}
</style>
