<template>
  <div class="home">
    <!-- Enhanced Hero Section -->
    <section class="hero-section">
      <div class="hero-particles">
        <div class="particle" v-for="i in 50" :key="i"></div>
      </div>
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6" data-aos="fade-right">
            <div class="hero-content">
              <div class="hero-badge mb-3" data-aos="fade-up" data-aos-delay="100">
                <span class="badge bg-gradient-light px-3 py-2 rounded-pill">
                  <i class="bi bi-award me-1"></i>
                  #1 Restaurant Booking Platform
                </span>
              </div>
              <h1 class="display-4 fw-bold text-white mb-4" data-aos="fade-up" data-aos-delay="200">
                Reserve Your Perfect
                <span class="text-warning hero-highlight">Dining Experience</span>
              </h1>
              <p class="lead text-white-50 mb-4" data-aos="fade-up" data-aos-delay="300">
                Discover amazing restaurants and book your table in just a few clicks. 
                Experience hassle-free dining reservations with <strong class="text-white">ReserveEasy</strong>.
              </p>
              
              <!-- Enhanced Stats Preview -->
              <div class="hero-stats mb-4" data-aos="fade-up" data-aos-delay="400">
                <div class="d-flex flex-wrap gap-4 text-center">
                  <div class="stat-preview">
                    <div class="stat-number text-warning fw-bold">150+</div>
                    <div class="stat-label text-white-50 small">Restaurants</div>
                  </div>
                  <div class="stat-preview">
                    <div class="stat-number text-info fw-bold">25K+</div>
                    <div class="stat-label text-white-50 small">Happy Users</div>
                  </div>
                  <div class="stat-preview">
                    <div class="stat-number text-success fw-bold">4.9★</div>
                    <div class="stat-label text-white-50 small">Rating</div>
                  </div>
                </div>
              </div>
              
              <div class="d-flex flex-wrap gap-3" data-aos="fade-up" data-aos-delay="500">
                <RouterLink to="/shops" class="btn btn-light btn-lg px-4 hero-cta-primary">
                  <i class="bi bi-search me-2"></i>
                  Find Restaurants
                  <span class="btn-shine"></span>
                </RouterLink>
                <RouterLink 
                  v-if="!authStore.isAuthenticated" 
                  to="/register" 
                  class="btn btn-outline-light btn-lg px-4 hero-cta-secondary"
                >
                  <i class="bi bi-person-plus me-2"></i>
                  Join Now
                  <span class="btn-ripple"></span>
                </RouterLink>
              </div>
              
              <!-- Social Proof -->
              <div class="hero-social-proof mt-4" data-aos="fade-up" data-aos-delay="600">
                <p class="text-white-50 small mb-2">Join thousands of satisfied diners</p>
                <div class="d-flex align-items-center">
                  <div class="avatar-stack me-3">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="User" class="avatar">
                    <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="User" class="avatar">
                    <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="User" class="avatar">
                    <img src="https://randomuser.me/api/portraits/men/4.jpg" alt="User" class="avatar">
                    <div class="avatar more-count">+5K</div>
                  </div>
                  <div class="social-proof-text">
                    <div class="stars text-warning mb-1">
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                      <i class="bi bi-star-fill"></i>
                    </div>
                    <small class="text-white-50">Trusted by 25,000+ users</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6" data-aos="fade-left">
            <div class="hero-card">
              <div class="card-header-custom mb-3">
                <h5 class="card-title mb-0 text-center">
                  <i class="bi bi-calendar-check text-primary me-2"></i>
                  Book Your Table Now
                </h5>
                <p class="text-muted small text-center mb-0">Quick & Easy Reservation</p>
              </div>
              <SearchWidget />
              <div class="trust-indicators mt-3">
                <div class="d-flex justify-content-center align-items-center gap-3 text-muted small">
                  <span><i class="bi bi-shield-check text-success"></i> Secure</span>
                  <span><i class="bi bi-lightning-charge text-warning"></i> Instant</span>
                  <span><i class="bi bi-check-circle text-info"></i> Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5" data-aos="fade-up">
            <h2 class="display-5 fw-bold text-dark">
              Why Choose ReserveEasy?
            </h2>
            <p class="lead text-muted">
              We make restaurant reservations simple, fast, and convenient
            </p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="feature-card text-center p-4 h-100">
              <div class="feature-icon gradient-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i class="bi bi-lightning-charge fs-3"></i>
              </div>
              <h5 class="fw-bold">Instant Booking</h5>
              <p class="text-muted">
                Book your table instantly with real-time availability. 
                No waiting, no phone calls required.
              </p>
            </div>
          </div>
          
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div class="feature-card text-center p-4 h-100">
              <div class="feature-icon gradient-secondary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i class="bi bi-star-fill fs-3"></i>
              </div>
              <h5 class="fw-bold">Verified Reviews</h5>
              <p class="text-muted">
                Read authentic reviews from real customers to make 
                informed dining decisions.
              </p>
            </div>
          </div>
          
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div class="feature-card text-center p-4 h-100">
              <div class="feature-icon gradient-success text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
                <i class="bi bi-shield-check fs-3"></i>
              </div>
              <h5 class="fw-bold">Secure & Reliable</h5>
              <p class="text-muted">
                Your personal information is protected with 
                enterprise-grade security measures.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Restaurants -->
    <section class="py-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5" data-aos="fade-up">
            <h2 class="display-5 fw-bold text-dark">
              Featured Restaurants
            </h2>
            <p class="lead text-muted">
              Discover the most popular dining destinations
            </p>
          </div>
        </div>
        
        <div class="row g-4" v-if="!shopStore.loading">
          <div 
            class="col-lg-4 col-md-6" 
            v-for="shop in featuredShops" 
            :key="shop._id"
            data-aos="fade-up"
          >
            <ShopCard :shop="shop" />
          </div>
        </div>
        
        <div v-else class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div class="text-center mt-5" data-aos="fade-up">
          <RouterLink to="/shops" class="btn btn-gradient btn-lg px-5">
            <i class="bi bi-arrow-right me-2"></i>
            View All Restaurants
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- Live Stats Section with Animation -->
    <section class="py-5 stats-section gradient-hero text-white position-relative overflow-hidden">
      <div class="floating-shapes">
        <div class="shape shape-1"></div>
        <div class="shape shape-2"></div>
        <div class="shape shape-3"></div>
      </div>
      <div class="container position-relative">
        <div class="row text-center">
          <div class="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="100">
            <div class="stat-item animated-stat">
              <div class="stat-icon mb-3">
                <i class="bi bi-shop text-warning fs-1"></i>
              </div>
              <h3 class="display-4 fw-bold counter" data-target="150">0</h3>
              <span class="stat-plus">+</span>
              <p class="lead">Partner Restaurants</p>
              <div class="stat-underline"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="200">
            <div class="stat-item animated-stat">
              <div class="stat-icon mb-3">
                <i class="bi bi-people-fill text-info fs-1"></i>
              </div>
              <h3 class="display-4 fw-bold counter" data-target="25">0</h3>
              <span class="stat-plus">K+</span>
              <p class="lead">Happy Customers</p>
              <div class="stat-underline"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="300">
            <div class="stat-item animated-stat">
              <div class="stat-icon mb-3">
                <i class="bi bi-calendar-check text-success fs-1"></i>
              </div>
              <h3 class="display-4 fw-bold counter" data-target="100">0</h3>
              <span class="stat-plus">K+</span>
              <p class="lead">Successful Bookings</p>
              <div class="stat-underline"></div>
            </div>
          </div>
          <div class="col-lg-3 col-md-6 mb-4" data-aos="fade-up" data-aos-delay="400">
            <div class="stat-item animated-stat">
              <div class="stat-icon mb-3">
                <i class="bi bi-geo-alt-fill text-danger fs-1"></i>
              </div>
              <h3 class="display-4 fw-bold counter" data-target="12">0</h3>
              <span class="stat-plus">+</span>
              <p class="lead">Cities Served</p>
              <div class="stat-underline"></div>
            </div>
          </div>
        </div>
        
        <!-- Live Activity Ticker -->
        <div class="row mt-5">
          <div class="col-12 text-center">
            <div class="live-activity-ticker" data-aos="fade-up" data-aos-delay="500">
              <div class="ticker-item">
                <span class="live-indicator"></span>
                <span class="ticker-text">{{ liveActivity.message }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-5 testimonials-section bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5" data-aos="fade-up">
            <h2 class="display-5 fw-bold text-dark">
              What Our Customers Say
            </h2>
            <p class="lead text-muted">
              Real experiences from real diners who love using ReserveEasy
            </p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="100">
            <div class="testimonial-card h-100">
              <div class="testimonial-header">
                <div class="stars mb-3">
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                </div>
                <p class="testimonial-text">
                  "Absolutely amazing experience! I found the perfect restaurant for my anniversary dinner in just minutes. The booking process was seamless."
                </p>
              </div>
              <div class="testimonial-footer mt-auto">
                <div class="d-flex align-items-center">
                  <div class="avatar-wrapper me-3">
                    <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Sarah Johnson" class="testimonial-avatar">
                    <div class="verified-badge">
                      <i class="bi bi-check-circle-fill text-success"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold">Sarah Johnson</h6>
                    <small class="text-muted">Verified Customer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="200">
            <div class="testimonial-card h-100">
              <div class="testimonial-header">
                <div class="stars mb-3">
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                </div>
                <p class="testimonial-text">
                  "Game changer! No more waiting on hold or showing up to find out there's no table. Real-time availability is exactly what we needed."
                </p>
              </div>
              <div class="testimonial-footer mt-auto">
                <div class="d-flex align-items-center">
                  <div class="avatar-wrapper me-3">
                    <img src="https://randomuser.me/api/portraits/men/2.jpg" alt="Michael Chen" class="testimonial-avatar">
                    <div class="verified-badge">
                      <i class="bi bi-check-circle-fill text-success"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold">Michael Chen</h6>
                    <small class="text-muted">Verified Customer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="300">
            <div class="testimonial-card h-100">
              <div class="testimonial-header">
                <div class="stars mb-3">
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                  <i class="bi bi-star-fill text-warning"></i>
                </div>
                <p class="testimonial-text">
                  "The reviews helped me pick the perfect spot for our business lunch. Everything was exactly as described. Highly recommend!"
                </p>
              </div>
              <div class="testimonial-footer mt-auto">
                <div class="d-flex align-items-center">
                  <div class="avatar-wrapper me-3">
                    <img src="https://randomuser.me/api/portraits/women/3.jpg" alt="Emily Rodriguez" class="testimonial-avatar">
                    <div class="verified-badge">
                      <i class="bi bi-check-circle-fill text-success"></i>
                    </div>
                  </div>
                  <div>
                    <h6 class="mb-0 fw-bold">Emily Rodriguez</h6>
                    <small class="text-muted">Verified Customer</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Now Section -->
    <section class="py-5 trending-section">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5" data-aos="fade-up">
            <div class="section-badge">
              <span class="badge bg-gradient-primary px-3 py-2 rounded-pill">
                <i class="bi bi-fire me-1"></i>
                Trending Now
              </span>
            </div>
            <h2 class="display-5 fw-bold text-dark mt-3">
              Hot Right Now
            </h2>
            <p class="lead text-muted">
              Most booked restaurants this week - don't miss out!
            </p>
          </div>
        </div>
        
        <div class="trending-carousel" data-aos="fade-up" data-aos-delay="200">
          <div class="row g-4">
            <div class="col-lg-3 col-md-6" v-for="(shop, index) in trendingShops" :key="shop._id">
              <div class="trending-card" :style="{ animationDelay: `${index * 0.1}s` }">
                <div class="trending-badge">
                  <span class="badge bg-danger">
                    <i class="bi bi-fire"></i>
                    #{{ index + 1 }}
                  </span>
                </div>
                <div class="card-image-wrapper">
                  <img :src="shop.image || 'https://via.placeholder.com/300x200'" :alt="shop.name" class="card-img-top">
                  <div class="image-overlay">
                    <div class="availability-indicator" :class="shop.isAvailable ? 'available' : 'busy'">
                      <span class="indicator-dot"></span>
                      {{ shop.isAvailable ? 'Available Now' : 'Busy' }}
                    </div>
                  </div>
                </div>
                <div class="card-body">
                  <h6 class="card-title fw-bold">{{ shop.name }}</h6>
                  <p class="card-text text-muted small">{{ shop.cuisine || 'Fine Dining' }}</p>
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="rating">
                      <i class="bi bi-star-fill text-warning"></i>
                      <span class="fw-bold">{{ shop.rating || '4.8' }}</span>
                    </div>
                    <div class="booking-count">
                      <small class="text-muted">{{ shop.bookingsToday || Math.floor(Math.random() * 50) + 10 }} bookings today</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Trust & Partnerships -->
    <section class="py-5 trust-section bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5" data-aos="fade-up">
            <h5 class="text-muted mb-4">Trusted by thousands of restaurants and millions of diners</h5>
          </div>
        </div>
        
        <div class="row align-items-center justify-content-center">
          <div class="col-lg-10">
            <div class="trust-badges" data-aos="fade-up" data-aos-delay="200">
              <div class="trust-item" v-for="badge in trustBadges" :key="badge.name">
                <div class="trust-icon">
                  <i :class="badge.icon" class="fs-2"></i>
                </div>
                <h6 class="mt-2 mb-0">{{ badge.name }}</h6>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Security & Trust Info -->
        <div class="row mt-5">
          <div class="col-lg-8 mx-auto">
            <div class="security-info text-center" data-aos="fade-up" data-aos-delay="300">
              <div class="d-flex justify-content-center align-items-center flex-wrap gap-4">
                <div class="security-badge">
                  <i class="bi bi-shield-check text-success me-2"></i>
                  <span class="small">SSL Secured</span>
                </div>
                <div class="security-badge">
                  <i class="bi bi-credit-card text-primary me-2"></i>
                  <span class="small">PCI Compliant</span>
                </div>
                <div class="security-badge">
                  <i class="bi bi-award text-warning me-2"></i>
                  <span class="small">Award Winning</span>
                </div>
                <div class="security-badge">
                  <i class="bi bi-headset text-info me-2"></i>
                  <span class="small">24/7 Support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-5 bg-light">
      <div class="container">
        <div class="row">
          <div class="col-lg-8 mx-auto text-center mb-5" data-aos="fade-up">
            <h2 class="display-5 fw-bold text-dark">
              How It Works
            </h2>
            <p class="lead text-muted">
              Simple steps to your perfect dining experience
            </p>
          </div>
        </div>
        
        <div class="row g-4">
          <div class="col-lg-4 text-center" data-aos="fade-up" data-aos-delay="100">
            <div class="step-number gradient-primary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
              <span class="fw-bold fs-4">1</span>
            </div>
            <h5 class="fw-bold">Search & Browse</h5>
            <p class="text-muted">
              Find restaurants by location, cuisine type, or special features. 
              Browse photos, menus, and reviews.
            </p>
          </div>
          
          <div class="col-lg-4 text-center" data-aos="fade-up" data-aos-delay="200">
            <div class="step-number gradient-secondary text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
              <span class="fw-bold fs-4">2</span>
            </div>
            <h5 class="fw-bold">Choose & Book</h5>
            <p class="text-muted">
              Select your preferred date, time, and party size. 
              Choose from available tables and book instantly.
            </p>
          </div>
          
          <div class="col-lg-4 text-center" data-aos="fade-up" data-aos-delay="300">
            <div class="step-number gradient-success text-white rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center">
              <span class="fw-bold fs-4">3</span>
            </div>
            <h5 class="fw-bold">Enjoy & Review</h5>
            <p class="text-muted">
              Arrive at your reserved time and enjoy your meal. 
              Share your experience with the community.
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { ref, onMounted, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useShopStore } from '@/stores/shop'
import ShopCard from '@/components/shops/ShopCard.vue'
import SearchWidget from '@/components/search/SearchWidget.vue'

export default {
  name: 'Home',
  components: {
    ShopCard,
    SearchWidget
  },
  setup() {
    const authStore = useAuthStore()
    const shopStore = useShopStore()
    
    const stats = ref({
      totalRestaurants: 150,
      totalUsers: 25,
      totalReservations: 100,
      totalCities: 12
    })
    
    const liveActivity = ref({
      message: "🔥 Sarah just booked a table at Mediterranean Delight"
    })
    
    const trustBadges = ref([
      { name: 'SSL Secure', icon: 'bi bi-shield-check text-success' },
      { name: 'Verified Reviews', icon: 'bi bi-patch-check text-primary' },
      { name: 'Instant Booking', icon: 'bi bi-lightning-charge text-warning' },
      { name: '24/7 Support', icon: 'bi bi-headset text-info' },
      { name: 'No Hidden Fees', icon: 'bi bi-transparency text-success' }
    ])
    
    const featuredShops = computed(() => {
      return shopStore.getFeaturedShops
    })
    
    const trendingShops = computed(() => {
      // Get a subset of shops for trending section with mock trending data
      const shops = shopStore.shops.slice(0, 4)
      return shops.map((shop, index) => ({
        ...shop,
        isAvailable: Math.random() > 0.3, // 70% chance of being available
        bookingsToday: Math.floor(Math.random() * 50) + 10,
        rating: (4.2 + Math.random() * 0.8).toFixed(1)
      }))
    })
    
    // Animated counter function
    const animateCounter = (element, target, duration = 2000) => {
      const start = 0
      const increment = target / (duration / 16)
      let current = 0
      
      const timer = setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timer)
        }
        element.textContent = Math.floor(current)
      }, 16)
    }
    
    // Live activity rotation
    const liveActivities = [
      "🔥 Sarah just booked a table at Mediterranean Delight",
      "⭐ Mike left a 5-star review for Ocean View Bistro",
      "🎉 Emma confirmed her reservation at Italian Corner",
      "📅 David booked dinner for tonight at Rooftop Garden",
      "💫 Lisa discovered her new favorite restaurant",
      "🍽️ Alex just made their 10th booking this month"
    ]
    
    const rotateLiveActivity = () => {
      let currentIndex = 0
      setInterval(() => {
        currentIndex = (currentIndex + 1) % liveActivities.length
        liveActivity.value.message = liveActivities[currentIndex]
      }, 4000)
    }
    
    onMounted(async () => {
      await shopStore.fetchShops()
      
      // Initialize counter animations when stats section is visible
      nextTick(() => {
        const observerOptions = {
          threshold: 0.5,
          rootMargin: '0px 0px -50px 0px'
        }
        
        const statsObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              const counters = entry.target.querySelectorAll('.counter')
              counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'))
                animateCounter(counter, target)
              })
              statsObserver.unobserve(entry.target)
            }
          })
        }, observerOptions)
        
        const statsSection = document.querySelector('.stats-section')
        if (statsSection) {
          statsObserver.observe(statsSection)
        }
        
        // Initialize hero particles
        initializeParticles()
        
        // Start live activity rotation
        rotateLiveActivity()
      })
    })
    
    // Initialize particle system
    const initializeParticles = () => {
      const particlesContainer = document.querySelector('.hero-particles')
      if (!particlesContainer) return
      
      const particles = particlesContainer.querySelectorAll('.particle')
      particles.forEach((particle, index) => {
        // Random starting position
        const startX = Math.random() * window.innerWidth
        const size = Math.random() * 4 + 2
        
        particle.style.left = startX + 'px'
        particle.style.width = size + 'px'
        particle.style.height = size + 'px'
        particle.style.animationDelay = (index * 0.5) + 's'
        
        // Random horizontal drift
        particle.style.setProperty('--drift', (Math.random() - 0.5) * 200 + 'px')
      })
    }
    
    return {
      authStore,
      shopStore,
      stats,
      featuredShops,
      trendingShops,
      liveActivity,
      trustBadges
    }
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)), 
              url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><pattern id="restaurant-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse" opacity="0.1"><circle cx="30" cy="30" r="2" fill="white"/><circle cx="10" cy="10" r="1" fill="white"/><circle cx="50" cy="15" r="1" fill="white"/><circle cx="15" cy="45" r="1" fill="white"/></pattern></defs><rect width="100%" height="100%" fill="url(%23restaurant-pattern)"/></svg>');
  background-size: cover, 60px 60px;
  background-position: center, center;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 100px;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 50%);
}

.hero-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float-particles 20s infinite linear;
  pointer-events: none;
}

.particle:nth-child(odd) {
  width: 4px;
  height: 4px;
  animation-duration: 15s;
}

.particle:nth-child(even) {
  width: 6px;
  height: 6px;
  animation-duration: 25s;
}

.particle:nth-child(3n) {
  width: 2px;
  height: 2px;
  animation-duration: 30s;
}

@keyframes float-particles {
  0% {
    transform: translateY(100vh) translateX(0px) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) translateX(100px) rotate(360deg);
    opacity: 0;
  }
}

.hero-badge .badge {
  background: rgba(255, 255, 255, 0.2) !important;
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.hero-highlight {
  position: relative;
  display: inline-block;
}

.hero-highlight::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, #ffc107, #fd7e14);
  animation: underlineExpand 1s ease-out 0.5s both;
}

@keyframes underlineExpand {
  0% { width: 0; }
  100% { width: 100%; }
}

.hero-stats {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-preview {
  min-width: 80px;
}

.stat-number {
  font-size: 1.5rem;
  line-height: 1;
}

.stat-label {
  font-size: 0.8rem;
}

.hero-cta-primary {
  position: relative;
  overflow: hidden;
  background: linear-gradient(45deg, #fff, #f8f9fa);
  border: none;
  color: #495057;
  font-weight: 600;
  transition: all 0.3s ease;
}

.hero-cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
  color: #495057;
  background: linear-gradient(45deg, #f8f9fa, #fff);
}

.btn-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
  transition: left 0.6s;
}

.hero-cta-primary:hover .btn-shine {
  left: 100%;
}

.hero-cta-secondary {
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
}

.hero-cta-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.avatar-stack {
  display: flex;
  align-items: center;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  margin-left: -10px;
  object-fit: cover;
}

.avatar:first-child {
  margin-left: 0;
}

.more-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.stars {
  font-size: 0.9rem;
}

.hero-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
}

.hero-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 35px 60px rgba(0, 0, 0, 0.2);
}

.card-header-custom {
  text-align: center;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.trust-indicators {
  padding-top: 15px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.feature-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: none;
}

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.feature-icon {
  width: 80px;
  height: 80px;
}

.step-number {
  width: 80px;
  height: 80px;
  font-size: 1.5rem;
}

/* Enhanced Stats Section */
.stats-section {
  position: relative;
  overflow: hidden;
}

.floating-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.shape {
  position: absolute;
  opacity: 0.1;
  animation: float 6s ease-in-out infinite;
}

.shape-1 {
  width: 100px;
  height: 100px;
  background: white;
  border-radius: 50%;
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.shape-2 {
  width: 150px;
  height: 150px;
  background: white;
  border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
  top: 60%;
  right: 15%;
  animation-delay: 2s;
}

.shape-3 {
  width: 80px;
  height: 80px;
  background: white;
  transform: rotate(45deg);
  top: 40%;
  left: 80%;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(180deg); }
}

.animated-stat {
  position: relative;
  transition: all 0.3s ease;
}

.animated-stat:hover {
  transform: translateY(-5px);
}

.stat-icon {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.stat-item h3 {
  background: linear-gradient(45deg, #fff, #f8f9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.stat-plus {
  background: linear-gradient(45deg, #fff, #f8f9fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: bold;
  font-size: 1.5rem;
}

.stat-underline {
  width: 50px;
  height: 3px;
  background: linear-gradient(45deg, #ffc107, #fd7e14);
  margin: 0 auto;
  border-radius: 2px;
  animation: expandLine 1s ease-out 0.5s both;
}

@keyframes expandLine {
  0% { width: 0; }
  100% { width: 50px; }
}

.live-activity-ticker {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 50px;
  padding: 15px 30px;
  display: inline-block;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.live-indicator {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #28a745;
  border-radius: 50%;
  margin-right: 10px;
  animation: blink 1.5s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}

.ticker-text {
  color: white;
  font-weight: 500;
}

/* Testimonials Section */
.testimonials-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.testimonial-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.testimonial-text {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #495057;
  font-style: italic;
}

.testimonial-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-wrapper {
  position: relative;
}

.verified-badge {
  position: absolute;
  bottom: -5px;
  right: -5px;
  background: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Trending Section */
.trending-section {
  background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%);
}

.section-badge .badge {
  font-size: 0.9rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-5px); }
  60% { transform: translateY(-3px); }
}

.trending-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: fadeInUp 0.6s ease-out both;
}

.trending-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
}

@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.trending-badge {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 2;
}

.card-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.trending-card:hover .card-image-wrapper img {
  transform: scale(1.1);
}

.image-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 20px 15px 15px;
}

.availability-indicator {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.95);
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
}

.availability-indicator.available {
  color: #28a745;
}

.availability-indicator.busy {
  color: #dc3545;
}

.indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  animation: pulse 2s infinite;
}

.available .indicator-dot {
  background: #28a745;
}

.busy .indicator-dot {
  background: #dc3545;
}

/* Trust Section */
.trust-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

.trust-badges {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 3rem;
}

.trust-item {
  text-align: center;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.trust-item:hover {
  opacity: 1;
  transform: translateY(-5px);
}

.trust-icon {
  margin-bottom: 10px;
  color: #6c757d;
}

.security-info {
  background: white;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.security-badge {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background: rgba(0, 0, 0, 0.05);
  border-radius: 25px;
  transition: all 0.3s ease;
}

.security-badge:hover {
  background: rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .hero-section {
    min-height: 80vh;
    text-align: center;
  }
  
  .hero-section .display-4 {
    font-size: 2.5rem;
  }
  
  .hero-card {
    margin-top: 2rem;
  }
  
  .trust-badges {
    gap: 2rem;
  }
  
  .trust-badges .trust-item {
    flex: 0 0 auto;
  }
  
  .security-info .d-flex {
    flex-direction: column;
    gap: 1rem;
  }
  
  .testimonial-card {
    margin-bottom: 2rem;
  }
  
  .floating-shapes {
    display: none;
  }
}

@media (max-width: 576px) {
  .stats-section .col-lg-3 {
    margin-bottom: 2rem;
  }
  
  .trending-card {
    margin-bottom: 1.5rem;
  }
  
  .trust-badges {
    gap: 1.5rem;
  }
}
</style>
