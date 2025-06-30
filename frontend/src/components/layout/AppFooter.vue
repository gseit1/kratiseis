<template>
  <footer class="footer">
    <div class="container">
      <div class="row">
        <!-- Brand Section -->
        <div class="col-lg-4 mb-4">
          <h5 class="brand-title mb-3">
            <i class="bi bi-calendar-check me-2"></i>
            ReserveEasy
          </h5>
          <p class="footer-description">
            The ultimate platform for restaurant reservations. 
            Discover amazing dining experiences and book your table in just a few clicks.
          </p>
          <div class="social-links">
            <a href="#" class="social-link hover-lift">
              <i class="bi bi-facebook"></i>
            </a>
            <a href="#" class="social-link hover-lift">
              <i class="bi bi-twitter"></i>
            </a>
            <a href="#" class="social-link hover-lift">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#" class="social-link hover-lift">
              <i class="bi bi-linkedin"></i>
            </a>
          </div>
        </div>
        
        <!-- Quick Links -->
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="footer-section-title mb-3">Quick Links</h6>
          <ul class="footer-links">
            <li class="mb-2">
              <RouterLink to="/" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>Home
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/shops" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>Restaurants
              </RouterLink>
            </li>
            <li class="mb-2">
              <RouterLink to="/search" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>Search
              </RouterLink>
            </li>
            <li class="mb-2">
              <a href="#about" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>About Us
              </a>
            </li>
          </ul>
        </div>
        
        <!-- Account -->
        <div class="col-lg-2 col-md-6 mb-4">
          <h6 class="footer-section-title mb-3">Account</h6>
          <ul class="footer-links">
            <li class="mb-2" v-if="!authStore.isAuthenticated">
              <RouterLink to="/login" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>Login
              </RouterLink>
            </li>
            <li class="mb-2" v-if="!authStore.isAuthenticated">
              <RouterLink to="/register" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>Register
              </RouterLink>
            </li>
            <li class="mb-2" v-if="authStore.isAuthenticated">
              <RouterLink to="/profile" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>Profile
              </RouterLink>
            </li>
            <li class="mb-2" v-if="authStore.isAuthenticated">
              <RouterLink to="/reservations" class="footer-link">
                <i class="bi bi-chevron-right me-1"></i>My Reservations
              </RouterLink>
            </li>
          </ul>
        </div>
        
        <!-- Contact Info -->
        <div class="col-lg-4 mb-4">
          <h6 class="footer-section-title mb-3">Contact Info</h6>
          <div class="contact-info mb-4">
            <div class="contact-item">
              <i class="bi bi-geo-alt text-gradient me-2"></i>
              <span>123 Main Street, Athens, Greece</span>
            </div>
            <div class="contact-item">
              <i class="bi bi-telephone text-gradient me-2"></i>
              <span>+30 210 123 4567</span>
            </div>
            <div class="contact-item">
              <i class="bi bi-envelope text-gradient me-2"></i>
              <span>info@reserveeasy.com</span>
            </div>
          </div>
          
          <!-- Newsletter -->
          <div class="newsletter">
            <h6 class="footer-section-title mb-2">Newsletter</h6>
            <p class="newsletter-description mb-3">Subscribe to get updates on new restaurants and special offers.</p>
            <div class="newsletter-form">
              <input 
                type="email" 
                class="form-control newsletter-input" 
                placeholder="Your email"
                v-model="newsletterEmail"
              >
              <button 
                class="btn btn-gradient newsletter-btn" 
                type="button"
                @click="subscribeNewsletter"
              >
                <i class="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <hr class="footer-divider">
      
      <!-- Bottom Footer -->
      <div class="row align-items-center">
        <div class="col-md-6">
          <p class="footer-copyright">
            &copy; 2025 ReserveEasy. All rights reserved.
          </p>
        </div>
        <div class="col-md-6 text-md-end">
          <ul class="footer-bottom-links">
            <li class="list-inline-item">
              <a href="#" class="footer-bottom-link">Privacy Policy</a>
            </li>
            <li class="list-inline-item">
              <span class="footer-separator">|</span>
            </li>
            <li class="list-inline-item">
              <a href="#" class="footer-bottom-link">Terms of Service</a>
            </li>
            <li class="list-inline-item">
              <span class="footer-separator">|</span>
            </li>
            <li class="list-inline-item">
              <a href="#" class="footer-bottom-link">Support</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'AppFooter',
  setup() {
    const authStore = useAuthStore()
    const toast = useToast()
    const newsletterEmail = ref('')
    
    const subscribeNewsletter = () => {
      if (!newsletterEmail.value) {
        toast.error('Please enter your email address')
        return
      }
      
      // Here you would typically make an API call to subscribe the user
      toast.success('Thank you for subscribing to our newsletter!')
      newsletterEmail.value = ''
    }
    
    return {
      authStore,
      newsletterEmail,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, var(--gray-900) 0%, var(--gray-800) 100%);
  color: white;
  padding: var(--space-20) 0 var(--space-8);
  margin-top: var(--space-20);
}

.brand-title {
  font-family: var(--font-family-display);
  font-weight: 800;
  font-size: var(--text-xl);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.footer-description {
  color: var(--gray-300);
  line-height: var(--leading-relaxed);
  font-size: var(--text-sm);
}

.footer-section-title {
  color: white;
  font-weight: 600;
  font-size: var(--text-base);
  margin-bottom: var(--space-3);
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-link {
  color: var(--gray-300);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: all var(--transition-fast);
  display: inline-flex;
  align-items: center;
}

.footer-link:hover {
  color: var(--primary-400);
  transform: translateX(4px);
}

.social-links {
  display: flex;
  gap: var(--space-3);
  margin-top: var(--space-4);
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.1);
  color: var(--gray-300);
  text-decoration: none;
  transition: all var(--transition-normal);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-link:hover {
  background: var(--primary-600);
  color: white;
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.contact-info {
  margin-bottom: var(--space-6);
}

.contact-item {
  display: flex;
  align-items: center;
  margin-bottom: var(--space-3);
  color: var(--gray-300);
  font-size: var(--text-sm);
}

.newsletter-description {
  color: var(--gray-300);
  font-size: var(--text-xs);
  line-height: var(--leading-relaxed);
}

.newsletter-form {
  display: flex;
  border-radius: var(--radius-full);
  overflow: hidden;
  background: white;
  box-shadow: var(--shadow-md);
}

.newsletter-input {
  border: none;
  border-radius: 0;
  padding: var(--space-3) var(--space-4);
  flex: 1;
  font-size: var(--text-sm);
}

.newsletter-input:focus {
  box-shadow: none;
  outline: none;
}

.newsletter-btn {
  border: none;
  border-radius: 0;
  padding: var(--space-3) var(--space-4);
  background: var(--gradient-primary);
  color: white;
  transition: all var(--transition-fast);
}

.newsletter-btn:hover {
  background: linear-gradient(135deg, var(--primary-700), var(--secondary-700));
}

.footer-divider {
  border-color: var(--gray-700);
  margin: var(--space-12) 0 var(--space-8);
}

.footer-copyright {
  color: var(--gray-400);
  font-size: var(--text-sm);
  margin: 0;
}

.footer-bottom-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: inline-flex;
  gap: var(--space-1);
  align-items: center;
}

.footer-bottom-link {
  color: var(--gray-400);
  text-decoration: none;
  font-size: var(--text-sm);
  transition: color var(--transition-fast);
}

.footer-bottom-link:hover {
  color: var(--primary-400);
}

.footer-separator {
  color: var(--gray-600);
  margin: 0 var(--space-2);
}

@media (max-width: 768px) {
  .footer {
    padding: var(--space-16) 0 var(--space-6);
    text-align: center;
  }
  
  .social-links {
    justify-content: center;
  }
  
  .newsletter-form {
    flex-direction: column;
    border-radius: var(--radius-lg);
  }
  
  .newsletter-input,
  .newsletter-btn {
    border-radius: var(--radius-lg);
  }
  
  .newsletter-btn {
    margin-top: var(--space-2);
  }
  
  .footer-bottom-links {
    flex-direction: column;
    gap: var(--space-2);
  }
  
  .footer-separator {
    display: none;
  }
}
</style>
