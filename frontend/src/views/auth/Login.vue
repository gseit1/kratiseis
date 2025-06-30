<template>
  <div class="auth-page">
    <div class="container-fluid">
      <div class="row min-vh-100">
        <!-- Left Side - Image/Brand -->
        <div class="col-lg-6 d-none d-lg-flex auth-brand-section">
          <div class="d-flex flex-column justify-content-center align-items-center text-white p-5">
            <div class="text-center mb-4">
              <i class="bi bi-calendar-check display-1 mb-3"></i>
              <h2 class="display-4 fw-bold">Welcome Back!</h2>
              <p class="lead">
                Sign in to access your reservations and discover amazing dining experiences.
              </p>
            </div>
            
            <!-- Features -->
            <div class="row text-center mt-5">
              <div class="col-4">
                <i class="bi bi-lightning-charge fs-1 mb-2"></i>
                <p class="small">Instant Booking</p>
              </div>
              <div class="col-4">
                <i class="bi bi-star-fill fs-1 mb-2"></i>
                <p class="small">Best Restaurants</p>
              </div>
              <div class="col-4">
                <i class="bi bi-shield-check fs-1 mb-2"></i>
                <p class="small">Secure Platform</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Side - Login Form -->
        <div class="col-lg-6 d-flex align-items-center">
          <div class="auth-form-container w-100 p-4">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary mb-2">Sign In</h3>
              <p class="text-muted">Enter your credentials to access your account</p>
            </div>
            
            <form @submit.prevent="handleLogin" class="auth-form">
              <!-- Email -->
              <div class="form-floating mb-3">
                <input 
                  type="email" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  id="email"
                  v-model="loginForm.email"
                  placeholder="name@example.com"
                  required
                >
                <label for="email">
                  <i class="bi bi-envelope me-2"></i>Email Address
                </label>
                <div v-if="errors.email" class="invalid-feedback">
                  {{ errors.email }}
                </div>
              </div>
              
              <!-- Password -->
              <div class="form-floating mb-3">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="password"
                  v-model="loginForm.password"
                  placeholder="Password"
                  required
                >
                <label for="password">
                  <i class="bi bi-lock me-2"></i>Password
                </label>
                <button 
                  type="button"
                  class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                  @click="showPassword = !showPassword"
                  style="z-index: 10;"
                >
                  <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
                <div v-if="errors.password" class="invalid-feedback">
                  {{ errors.password }}
                </div>
              </div>
              
              <!-- Remember Me & Forgot Password -->
              <div class="d-flex justify-content-between align-items-center mb-4">
                <div class="form-check">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="rememberMe"
                    v-model="loginForm.rememberMe"
                  >
                  <label class="form-check-label text-muted" for="rememberMe">
                    Remember me
                  </label>
                </div>
                <a href="#" class="text-primary text-decoration-none">
                  Forgot password?
                </a>
              </div>
              
              <!-- Submit Button -->
              <button 
                type="submit" 
                class="btn btn-gradient w-100 py-3 fw-bold"
                :disabled="authStore.loading"
              >
                <div v-if="authStore.loading" class="spinner-border spinner-border-sm me-2" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <i v-else class="bi bi-box-arrow-in-right me-2"></i>
                {{ authStore.loading ? 'Signing In...' : 'Sign In' }}
              </button>
              
              <!-- Divider -->
              <div class="text-center my-4">
                <span class="text-muted">Don't have an account?</span>
              </div>
              
              <!-- Register Link -->
              <RouterLink 
                to="/register" 
                class="btn btn-outline-gradient w-100 py-3 fw-bold"
              >
                <i class="bi bi-person-plus me-2"></i>
                Create New Account
              </RouterLink>
            </form>
            
            <!-- Social Login (Optional) -->
            <div class="text-center mt-4">
              <p class="text-muted small mb-3">Or sign in with</p>
              <div class="d-flex gap-2 justify-content-center">
                <button class="btn btn-outline-dark btn-sm">
                  <i class="bi bi-google"></i>
                </button>
                <button class="btn btn-outline-dark btn-sm">
                  <i class="bi bi-facebook"></i>
                </button>
                <button class="btn btn-outline-dark btn-sm">
                  <i class="bi bi-twitter"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const route = useRoute()
    const authStore = useAuthStore()
    const toast = useToast()
    
    const showPassword = ref(false)
    const errors = ref({})
    
    const loginForm = reactive({
      email: '',
      password: '',
      rememberMe: false
    })
    
    const validateForm = () => {
      errors.value = {}
      
      if (!loginForm.email) {
        errors.value.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
        errors.value.email = 'Please enter a valid email'
      }
      
      if (!loginForm.password) {
        errors.value.password = 'Password is required'
      } else if (loginForm.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters'
      }
      
      return Object.keys(errors.value).length === 0
    }
    
    const handleLogin = async () => {
      if (!validateForm()) {
        return
      }
      
      const result = await authStore.login({
        email: loginForm.email,
        password: loginForm.password
      })
      
      if (result.success) {
        // Redirect based on user role or intended destination
        const redirect = route.query.redirect || getDashboardRoute(result.user.role)
        router.push(redirect)
      }
    }
    
    const getDashboardRoute = (role) => {
      switch (role) {
        case 'admin':
          return '/admin/dashboard'
        case 'shopOwner':
          return '/shop-owner/dashboard'
        default:
          return '/dashboard'
      }
    }
    
    return {
      authStore,
      loginForm,
      showPassword,
      errors,
      handleLogin
    }
  }
}
</script>

<style scoped>
.auth-page {
  padding-top: 80px;
}

.auth-brand-section {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9), rgba(118, 75, 162, 0.9)), 
              radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%);
  position: relative;
}

.auth-brand-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><polygon fill="%23ffffff" fill-opacity="0.05" points="0,1000 1000,0 1000,1000"/></svg>');
  background-size: cover;
}

.auth-form-container {
  max-width: 450px;
  margin: 0 auto;
}

.auth-form {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.form-floating .form-control {
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding-right: 3rem;
  transition: all 0.3s ease;
}

.form-floating .form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.form-floating label {
  color: #6c757d;
  font-weight: 500;
}

.btn-gradient {
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-gradient:hover {
  background: linear-gradient(45deg, #764ba2, #667eea);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-outline-gradient {
  border: 2px solid #667eea;
  color: #667eea;
  background: transparent;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.btn-outline-gradient:hover {
  background: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-outline-dark {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-outline-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
}

@media (max-width: 991px) {
  .auth-page {
    padding-top: 100px;
    background: linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1));
  }
  
  .auth-form-container {
    padding: 2rem 1rem;
  }
  
  .auth-form {
    margin: 0;
    box-shadow: none;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
  }
}

@media (max-width: 576px) {
  .auth-form {
    padding: 1.5rem;
    border-radius: 15px;
  }
  
  .btn {
    padding: 0.75rem 1rem;
  }
}
</style>
