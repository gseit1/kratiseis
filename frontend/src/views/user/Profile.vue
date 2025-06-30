<template>
  <div class="profile-page">
    <div class="container py-5">
      <!-- Header -->
      <div class="row justify-content-center mb-5">
        <div class="col-lg-8">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h1 class="display-6 fw-bold text-dark mb-1 text-display">My Profile</h1>
              <p class="text-muted fs-5">Manage your account settings and personal information</p>
            </div>
            <RouterLink to="/dashboard" class="btn btn-glass hover-lift">
              <i class="bi bi-arrow-left me-2"></i>Back to Dashboard
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="row justify-content-center">
        <div class="col-lg-8">
          <!-- Profile Card -->
          <div class="card-modern hover-lift mb-5">
            <div class="profile-header">
              <div class="d-flex align-items-center">
                <div class="avatar-lg">
                  <i class="bi bi-person-fill"></i>
                </div>
                <div class="ms-4">
                  <h5 class="mb-1 text-display">{{ fullName }}</h5>
                  <p class="text-muted mb-2">{{ authStore.user?.email }}</p>
                  <span class="badge-modern" :class="roleClass">{{ roleLabel }}</span>
                </div>
              </div>
            </div>

            <div class="card-body p-5">
              <!-- Profile Form -->
              <form @submit.prevent="updateProfile">
                <div class="row">
                  <div class="col-md-6 mb-4">
                    <label for="firstName" class="form-label-modern">First Name</label>
                    <input
                      type="text"
                      class="form-control form-control-modern"
                      id="firstName"
                      v-model="profileForm.name"
                      :disabled="!editMode"
                      required
                    >
                  </div>
                  <div class="col-md-6 mb-4">
                    <label for="lastName" class="form-label-modern">Last Name</label>
                    <input
                      type="text"
                      class="form-control form-control-modern"
                      id="lastName"
                      v-model="profileForm.surname"
                      :disabled="!editMode"
                      required
                    >
                  </div>
                </div>

                <div class="mb-4">
                  <label for="email" class="form-label-modern">Email Address</label>
                  <input
                    type="email"
                    class="form-control form-control-modern"
                    id="email"
                    v-model="profileForm.email"
                    disabled
                  >
                  <div class="form-text-modern">
                    <i class="bi bi-info-circle me-1"></i>
                    Email cannot be changed. Contact support if you need to update your email.
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label-modern">Account Type</label>
                  <div class="input-group-modern">
                    <span class="input-group-icon">
                      <i class="bi bi-shield-check text-gradient"></i>
                    </span>
                    <input
                      type="text"
                      class="form-control form-control-modern"
                      :value="roleLabel"
                      disabled
                    >
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="d-flex gap-3 mt-5">
                  <button
                    v-if="!editMode"
                    type="button"
                    class="btn btn-modern-primary hover-lift"
                    @click="enableEditMode"
                  >
                    <i class="bi bi-pencil me-2"></i>Edit Profile
                  </button>
                  
                  <template v-else>
                    <button
                      type="submit"
                      class="btn btn-gradient hover-lift"
                      :disabled="authStore.loading"
                    >
                      <span v-if="authStore.loading" class="loading-modern me-2"></span>
                      <i v-else class="bi bi-check2 me-2"></i>
                      Save Changes
                    </button>
                    <button
                      type="button"
                      class="btn btn-modern-secondary hover-lift"
                      @click="cancelEdit"
                    >
                      <i class="bi bi-x me-2"></i>Cancel
                    </button>
                  </template>
                </div>
              </form>
            </div>
          </div>

          <!-- Account Statistics -->
          <div class="card-modern hover-lift mb-5">
            <div class="card-header-modern">
              <h5 class="mb-0 text-display">
                <i class="bi bi-bar-chart me-2 text-gradient"></i>Account Statistics
              </h5>
            </div>
            <div class="card-body p-5">
              <div class="row g-4">
                <div class="col-md-4">
                  <div class="stats-card">
                    <div class="stats-icon bg-primary">
                      <i class="bi bi-calendar-check"></i>
                    </div>
                    <h4 class="stats-number">{{ accountStats.totalReservations }}</h4>
                    <p class="stats-label">Total Reservations</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stats-card">
                    <div class="stats-icon bg-danger">
                      <i class="bi bi-heart-fill"></i>
                    </div>
                    <h4 class="stats-number">{{ accountStats.favoriteShops }}</h4>
                    <p class="stats-label">Favorite Places</p>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="stats-card">
                    <div class="stats-icon bg-warning">
                      <i class="bi bi-star-fill"></i>
                    </div>
                    <h4 class="stats-number">{{ accountStats.reviewsGiven }}</h4>
                    <p class="stats-label">Reviews Given</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Account Actions -->
          <div class="card-modern hover-lift">
            <div class="card-header-modern">
              <h5 class="mb-0 text-display">
                <i class="bi bi-gear me-2 text-gradient"></i>Account Actions
              </h5>
            </div>
            <div class="card-body p-5">
              <div class="row g-3 mb-5">
                <div class="col-md-6">
                  <RouterLink to="/reservations" class="btn btn-modern-primary w-100 d-flex align-items-center justify-content-center hover-lift">
                    <i class="bi bi-calendar-event me-2"></i>View My Reservations
                  </RouterLink>
                </div>
                <div class="col-md-6">
                  <button class="btn btn-modern-secondary w-100 hover-lift" @click="downloadData">
                    <i class="bi bi-download me-2"></i>Download My Data
                  </button>
                </div>
              </div>
              
              <!-- Danger Zone -->
              <div class="danger-zone">
                <h6 class="danger-zone-title">
                  <i class="bi bi-exclamation-triangle me-2"></i>Danger Zone
                </h6>
                <button class="btn btn-danger-modern hover-lift" @click="showDeleteConfirm = true">
                  <i class="bi bi-trash me-2"></i>Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <div class="modal-modern" :class="{ 'show': showDeleteConfirm }">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-danger text-display">
              <i class="bi bi-exclamation-triangle me-2"></i>Delete Account
            </h5>
            <button type="button" class="btn-close-modern" @click="showDeleteConfirm = false">
              <i class="bi bi-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <p class="mb-3">Are you sure you want to delete your account? This action cannot be undone.</p>
            <div class="alert-modern alert-danger">
              <i class="bi bi-info-circle me-2"></i>
              <strong>This will permanently delete:</strong>
              <ul class="mb-0 mt-2">
                <li>Your profile information</li>
                <li>All your reservations</li>
                <li>Your reviews and ratings</li>
                <li>Your favorite places</li>
              </ul>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-modern-secondary hover-lift" @click="showDeleteConfirm = false">
              Cancel
            </button>
            <button type="button" class="btn btn-danger-modern hover-lift" @click="deleteAccount">
              <i class="bi bi-trash me-2"></i>Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useReservationStore } from '@/stores/reservation'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

export default {
  name: 'Profile',
  setup() {
    const authStore = useAuthStore()
    const reservationStore = useReservationStore()
    const toast = useToast()
    const router = useRouter()

    const editMode = ref(false)
    const showDeleteConfirm = ref(false)
    const profileForm = ref({
      name: '',
      surname: '',
      email: ''
    })

    const accountStats = ref({
      totalReservations: 0,
      favoriteShops: 0,
      reviewsGiven: 0
    })

    const fullName = computed(() => {
      return authStore.user ? `${authStore.user.name} ${authStore.user.surname}` : ''
    })

    const roleLabel = computed(() => {
      const role = authStore.user?.role
      switch (role) {
        case 'admin': return 'Administrator'
        case 'shopOwner': return 'Business Owner'
        case 'user': return 'Customer'
        default: return 'Guest'
      }
    })

    const roleClass = computed(() => {
      const role = authStore.user?.role
      switch (role) {
        case 'admin': return 'bg-danger text-white'
        case 'shopOwner': return 'bg-warning text-dark'
        case 'user': return 'bg-primary text-white'
        default: return 'bg-secondary text-white'
      }
    })

    const initializeProfileForm = () => {
      if (authStore.user) {
        profileForm.value = {
          name: authStore.user.name || '',
          surname: authStore.user.surname || '',
          email: authStore.user.email || ''
        }
      }
    }

    const enableEditMode = () => {
      editMode.value = true
    }

    const cancelEdit = () => {
      editMode.value = false
      initializeProfileForm() // Reset form to original values
    }

    const updateProfile = async () => {
      const result = await authStore.updateProfile({
        name: profileForm.value.name,
        surname: profileForm.value.surname
      })

      if (result.success) {
        editMode.value = false
        toast.success('Profile updated successfully!')
      }
    }

    const loadAccountStats = async () => {
      try {
        // Load reservations to count them
        await reservationStore.fetchUserReservations()
        accountStats.value.totalReservations = reservationStore.userReservations.length

        // Load favorite shops
        const favoriteShops = await authStore.getFavoriteShops()
        accountStats.value.favoriteShops = favoriteShops.length

        // Mock reviews count for now (add backend endpoint later)
        accountStats.value.reviewsGiven = 5
      } catch (error) {
        console.error('Error loading account stats:', error)
      }
    }

    const downloadData = () => {
      // Create data object
      const userData = {
        profile: authStore.user,
        reservations: reservationStore.userReservations,
        exportDate: new Date().toISOString()
      }

      // Create and download JSON file
      const dataStr = JSON.stringify(userData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `my-account-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Account data downloaded successfully!')
    }

    const deleteAccount = async () => {
      toast.error('Account deletion is not implemented yet. Please contact support.')
      showDeleteConfirm.value = false
    }

    onMounted(() => {
      initializeProfileForm()
      loadAccountStats()
    })

    return {
      authStore,
      editMode,
      showDeleteConfirm,
      profileForm,
      accountStats,
      fullName,
      roleLabel,
      roleClass,
      enableEditMode,
      cancelEdit,
      updateProfile,
      downloadData,
      deleteAccount
    }
  }
}
</script>

<style scoped>
.profile-page {
  background: linear-gradient(135deg, var(--gray-50) 0%, var(--primary-50) 100%);
  min-height: 100vh;
  padding-top: 120px;
}

.avatar-lg {
  width: 5rem;
  height: 5rem;
  border-radius: var(--radius-full);
  background: var(--gradient-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  box-shadow: var(--shadow-lg);
}

.profile-header {
  background: var(--gradient-primary);
  color: white;
  padding: var(--space-6);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  margin: -1px;
}

.badge-modern {
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.025em;
  
  &.bg-primary {
    background: var(--primary-500) !important;
    color: white;
  }
  
  &.bg-warning {
    background: var(--warning-500) !important;
    color: white;
  }
  
  &.bg-danger {
    background: var(--danger-500) !important;
    color: white;
  }
}

.form-label-modern {
  color: var(--gray-700);
  font-weight: 600;
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
}

.form-text-modern {
  color: var(--gray-500);
  font-size: var(--text-xs);
  margin-top: var(--space-2);
}

.input-group-modern {
  display: flex;
  align-items: center;
  background: white;
  border-radius: var(--radius-lg);
  border: 2px solid var(--gray-200);
  overflow: hidden;
  transition: all var(--transition-normal);
}

.input-group-modern:focus-within {
  border-color: var(--primary-500);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.input-group-icon {
  padding: var(--space-3) var(--space-4);
  background: var(--gray-50);
  border-right: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
}

.input-group-modern .form-control {
  border: none;
  border-radius: 0;
  box-shadow: none;
}

.input-group-modern .form-control:focus {
  box-shadow: none;
}

.card-header-modern {
  background: var(--gray-50);
  border-bottom: 1px solid var(--gray-200);
  padding: var(--space-6);
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  margin: -1px -1px 0 -1px;
}

.stats-card {
  text-align: center;
  padding: var(--space-6);
  background: white;
  border-radius: var(--radius-xl);
  border: 1px solid var(--gray-100);
  transition: all var(--transition-normal);
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.danger-zone {
  border-top: 2px solid var(--danger-200);
  padding-top: var(--space-5);
  margin-top: var(--space-5);
}

.danger-zone-title {
  color: var(--danger-600);
  font-weight: 600;
  margin-bottom: var(--space-3);
}

.btn-danger-modern {
  background: var(--danger-500);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--space-3) var(--space-6);
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

.alert-modern {
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  border: 1px solid;
  font-size: var(--text-sm);
}

.alert-danger {
  background: var(--danger-50);
  border-color: var(--danger-200);
  color: var(--danger-800);
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
  .profile-page {
    padding-top: 100px;
  }
  
  .modal-modern .modal-dialog {
    margin: var(--space-4);
    max-width: calc(100% - 2rem);
  }
  
  .btn-danger-modern,
  .btn-modern-primary,
  .btn-modern-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>
