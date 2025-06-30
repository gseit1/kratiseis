<template>
  <div class="auth-page">
    <div class="container-fluid">
      <div class="row min-vh-100">
        <!-- Left Side - Registration Form -->
        <div class="col-lg-6 d-flex align-items-center">
          <div class="auth-form-container w-100 p-4">
            <div class="text-center mb-4">
              <h3 class="fw-bold text-primary mb-2">Create Account</h3>
              <p class="text-muted">Join ReserveEasy and start booking amazing dining experiences</p>
            </div>
            
            <form @submit.prevent="handleRegister" class="auth-form">
              <!-- Name Row -->
              <div class="row g-3 mb-3">
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="text" 
                      class="form-control"
                      :class="{ 'is-invalid': errors.name }"
                      id="firstName"
                      v-model="registerForm.name"
                      placeholder="First Name"
                      required
                    >
                    <label for="firstName">
                      <i class="bi bi-person me-2"></i>First Name
                    </label>
                    <div v-if="errors.name" class="invalid-feedback">
                      {{ errors.name }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-floating">
                    <input 
                      type="text" 
                      class="form-control"
                      :class="{ 'is-invalid': errors.surname }"
                      id="lastName"
                      v-model="registerForm.surname"
                      placeholder="Last Name"
                      required
                    >
                    <label for="lastName">
                      <i class="bi bi-person me-2"></i>Last Name
                    </label>
                    <div v-if="errors.surname" class="invalid-feedback">
                      {{ errors.surname }}
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Email -->
              <div class="form-floating mb-3">
                <input 
                  type="email" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  id="email"
                  v-model="registerForm.email"
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
              
              <!-- Phone -->
              <div class="form-floating mb-3">
                <input 
                  type="tel" 
                  class="form-control"
                  :class="{ 'is-invalid': errors.phone }"
                  id="phone"
                  v-model="registerForm.phone"
                  placeholder="+30 123 456 7890"
                >
                <label for="phone">
                  <i class="bi bi-telephone me-2"></i>Phone Number (Optional)
                </label>
                <div v-if="errors.phone" class="invalid-feedback">
                  {{ errors.phone }}
                </div>
              </div>
              
              <!-- Password -->
              <div class="form-floating mb-3">
                <input 
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.password }"
                  id="password"
                  v-model="registerForm.password"
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
              
              <!-- Confirm Password -->
              <div class="form-floating mb-3">
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{ 'is-invalid': errors.confirmPassword }"
                  id="confirmPassword"
                  v-model="registerForm.confirmPassword"
                  placeholder="Confirm Password"
                  required
                >
                <label for="confirmPassword">
                  <i class="bi bi-lock me-2"></i>Confirm Password
                </label>
                <button 
                  type="button"
                  class="btn btn-link position-absolute end-0 top-50 translate-middle-y me-3 text-muted"
                  @click="showConfirmPassword = !showConfirmPassword"
                  style="z-index: 10;"
                >
                  <i :class="showConfirmPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                </button>
                <div v-if="errors.confirmPassword" class="invalid-feedback">
                  {{ errors.confirmPassword }}
                </div>
              </div>
              
              <!-- User Role -->
              <div class="mb-3">
                <label class="form-label fw-bold text-dark">
                  <i class="bi bi-briefcase me-2"></i>Account Type
                </label>
                <div class="row g-2">
                  <div class="col-md-6">
                    <div class="form-check form-check-card">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="role" 
                        id="roleUser"
                        value="user"
                        v-model="registerForm.role"
                      >
                      <label class="form-check-label w-100 p-3 border rounded" for="roleUser">
                        <div class="text-center">
                          <i class="bi bi-person-circle fs-3 text-primary mb-2 d-block"></i>
                          <strong>Customer</strong>
                          <div class="small text-muted">Make reservations</div>
                        </div>
                      </label>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="form-check form-check-card">
                      <input 
                        class="form-check-input" 
                        type="radio" 
                        name="role" 
                        id="roleShopOwner"
                        value="shopOwner"
                        v-model="registerForm.role"
                      >
                      <label class="form-check-label w-100 p-3 border rounded" for="roleShopOwner">
                        <div class="text-center">
                          <i class="bi bi-shop fs-3 text-success mb-2 d-block"></i>
                          <strong>Restaurant Owner</strong>
                          <div class="small text-muted">Manage restaurant</div>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Terms and Conditions -->
              <div class="form-check mb-4">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="agreeTerms"
                  v-model="registerForm.agreeTerms"
                  required
                >
                <label class="form-check-label text-muted" for="agreeTerms">
                  I agree to the 
                  <a href="#" class="text-primary text-decoration-none">Terms of Service</a> 
                  and 
                  <a href="#" class="text-primary text-decoration-none">Privacy Policy</a>
                </label>
              </div>
              
              <!-- Newsletter -->
              <div class="form-check mb-4">
                <input 
                  class="form-check-input" 
                  type="checkbox" 
                  id="newsletter"
                  v-model="registerForm.newsletter"
                >
                <label class="form-check-label text-muted" for="newsletter">
                  Subscribe to our newsletter for updates and special offers
                </label>
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
                <i v-else class="bi bi-person-plus me-2"></i>
                {{ authStore.loading ? 'Creating Account...' : 'Create Account' }}
              </button>
              
              <!-- Divider -->
              <div class="text-center my-4">
                <span class="text-muted">Already have an account?</span>
              </div>
              
              <!-- Login Link -->
              <RouterLink 
                to="/login" 
                class="btn btn-outline-gradient w-100 py-3 fw-bold"
              >
                <i class="bi bi-box-arrow-in-right me-2"></i>
                Sign In to Your Account
              </RouterLink>
            </form>
          </div>
        </div>
        
        <!-- Right Side - Brand/Features -->
        <div class="col-lg-6 d-none d-lg-flex auth-brand-section">
          <div class="d-flex flex-column justify-content-center align-items-center text-white p-5">
            <div class="text-center mb-4">
              <i class="bi bi-calendar-check display-1 mb-3"></i>
              <h2 class="display-4 fw-bold">Join ReserveEasy</h2>
              <p class="lead">
                Start your journey with us and discover the best dining experiences in your city.
              </p>
            </div>
            
            <!-- Benefits -->
            <div class="mt-5">
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-check-circle-fill fs-4 me-3 text-warning"></i>
                <span>Free account registration</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-check-circle-fill fs-4 me-3 text-warning"></i>
                <span>Instant booking confirmations</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-check-circle-fill fs-4 me-3 text-warning"></i>
                <span>Exclusive member deals</span>
              </div>
              <div class="d-flex align-items-center mb-3">
                <i class="bi bi-check-circle-fill fs-4 me-3 text-warning"></i>
                <span>Personalized recommendations</span>
              </div>
              <div class="d-flex align-items-center">
                <i class="bi bi-check-circle-fill fs-4 me-3 text-warning"></i>
                <span>24/7 customer support</span>
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const showPassword = ref(false)
    const showConfirmPassword = ref(false)
    const errors = ref({})
    
    const registerForm = reactive({
      name: '',
      surname: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      agreeTerms: false,
      newsletter: false
    })
    
    const validateForm = () => {
      errors.value = {}
      
      // Name validation
      if (!registerForm.name) {
        errors.value.name = 'First name is required'
      } else if (registerForm.name.length < 2) {
        errors.value.name = 'First name must be at least 2 characters'
      }
      
      // Surname validation
      if (!registerForm.surname) {
        errors.value.surname = 'Last name is required'
      } else if (registerForm.surname.length < 2) {
        errors.value.surname = 'Last name must be at least 2 characters'
      }
      
      // Email validation
      if (!registerForm.email) {
        errors.value.email = 'Email is required'
      } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
        errors.value.email = 'Please enter a valid email'
      }
      
      // Phone validation (optional)
      if (registerForm.phone && !/^\+?[\d\s\-\(\)]+$/.test(registerForm.phone)) {
        errors.value.phone = 'Please enter a valid phone number'
      }
      
      // Password validation
      if (!registerForm.password) {
        errors.value.password = 'Password is required'
      } else if (registerForm.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters'
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(registerForm.password)) {
        errors.value.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      }
      
      // Confirm password validation
      if (!registerForm.confirmPassword) {
        errors.value.confirmPassword = 'Please confirm your password'
      } else if (registerForm.password !== registerForm.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match'
      }
      
      return Object.keys(errors.value).length === 0
    }
    
    const handleRegister = async () => {
      if (!validateForm()) {
        return
      }
      
      const userData = {
        name: registerForm.name,
        surname: registerForm.surname,
        email: registerForm.email,
        password: registerForm.password,
        role: registerForm.role
      }
      
      if (registerForm.phone) {
        userData.phone = registerForm.phone
      }
      
      const result = await authStore.register(userData)
      
      if (result.success) {
        // Redirect based on user role
        const redirect = getDashboardRoute(result.user.role)
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
      registerForm,
      showPassword,
      showConfirmPassword,
      errors,
      handleRegister
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
  max-width: 550px;
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

.form-check-card .form-check-label {
  cursor: pointer;
  transition: all 0.3s ease;
}

.form-check-card .form-check-input:checked + .form-check-label {
  border-color: #667eea !important;
  background-color: rgba(102, 126, 234, 0.1);
}

.form-check-card .form-check-label:hover {
  border-color: #667eea !important;
  background-color: rgba(102, 126, 234, 0.05);
}

.form-check-input:checked {
  background-color: #667eea;
  border-color: #667eea;
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
  
  .form-check-card .col-md-6 {
    margin-bottom: 1rem;
  }
}
</style>
