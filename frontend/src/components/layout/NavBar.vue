<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-white shadow-sm fixed-top">
    <div class="container">
      <RouterLink to="/" class="navbar-brand text-primary">
        <i class="bi bi-calendar-check me-2"></i>
        <strong>ReserveEasy</strong>
      </RouterLink>
      
      <button 
        class="navbar-toggler border-0" 
        type="button" 
        data-bs-toggle="collapse" 
        data-bs-target="#navbarNav"
        aria-controls="navbarNav" 
        aria-expanded="false" 
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link text-dark fw-medium">
              <i class="bi bi-house me-1"></i>Home
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/shops" class="nav-link text-dark fw-medium">
              <i class="bi bi-shop me-1"></i>Shops
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/search" class="nav-link text-dark fw-medium">
              <i class="bi bi-search me-1"></i>Search
            </RouterLink>
          </li>
        </ul>
        
        <ul class="navbar-nav">
          <template v-if="!authStore.isAuthenticated">
            <li class="nav-item">
              <RouterLink to="/login" class="nav-link text-dark fw-medium">
                <i class="bi bi-box-arrow-in-right me-1"></i>Login
              </RouterLink>
            </li>
            <li class="nav-item">
              <RouterLink to="/register" class="btn btn-gradient ms-2 text-white fw-medium">
                <i class="bi bi-person-plus me-1"></i>Register
              </RouterLink>
            </li>
          </template>
          
          <template v-else>
            <li class="nav-item dropdown">
              <a 
                class="nav-link dropdown-toggle text-dark fw-medium d-flex align-items-center" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div class="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2" 
                     style="width: 32px; height: 32px; font-size: 14px;">
                  {{ userInitials }}
                </div>
                {{ authStore.user?.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                <li>
                  <RouterLink to="/profile" class="dropdown-item">
                    <i class="bi bi-person me-2"></i>Profile
                  </RouterLink>
                </li>
                <li>
                  <RouterLink 
                    :to="dashboardRoute" 
                    class="dropdown-item"
                  >
                    <i class="bi bi-speedometer2 me-2"></i>Dashboard
                  </RouterLink>
                </li>
                <li v-if="authStore.isUser">
                  <RouterLink to="/reservations" class="dropdown-item">
                    <i class="bi bi-calendar3 me-2"></i>My Reservations
                  </RouterLink>
                </li>
                <li v-if="authStore.isShopOwner">
                  <RouterLink to="/manage-shop" class="dropdown-item">
                    <i class="bi bi-shop me-2"></i>Manage Shop
                  </RouterLink>
                </li>
                <li v-if="authStore.isShopOwner">
                  <RouterLink to="/create-shop" class="dropdown-item">
                    <i class="bi bi-plus-circle me-2"></i>Create Shop
                  </RouterLink>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <button @click="handleLogout" class="dropdown-item text-danger">
                    <i class="bi bi-box-arrow-right me-2"></i>Logout
                  </button>
                </li>
              </ul>
            </li>
          </template>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'NavBar',
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    
    const userInitials = computed(() => {
      if (!authStore.user) return ''
      const name = authStore.user.name || ''
      const surname = authStore.user.surname || ''
      return (name.charAt(0) + surname.charAt(0)).toUpperCase()
    })
    
    const dashboardRoute = computed(() => {
      if (authStore.isAdmin) return '/admin/dashboard'
      if (authStore.isShopOwner) return '/shop-owner/dashboard'
      return '/dashboard'
    })
    
    const handleLogout = async () => {
      await authStore.logout()
      router.push('/')
    }
    
    return {
      authStore,
      userInitials,
      dashboardRoute,
      handleLogout
    }
  }
}
</script>

<style scoped>
.navbar {
  padding-top: 1rem;
  padding-bottom: 1rem;
}

.navbar-brand {
  font-size: 1.5rem;
}

.nav-link {
  border-radius: 8px;
  margin: 0 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: rgba(102, 126, 234, 0.1);
  transform: translateY(-1px);
}

.btn-gradient {
  border-radius: 25px;
  padding: 8px 20px;
  border: none;
}

.dropdown-menu {
  border-radius: 12px;
  padding: 8px;
  margin-top: 8px;
}

.dropdown-item {
  border-radius: 8px;
  padding: 8px 12px;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: rgba(102, 126, 234, 0.1);
  transform: translateX(4px);
}

@media (max-width: 991px) {
  .navbar-nav .nav-link {
    margin: 4px 0;
  }
  
  .btn-gradient {
    margin-top: 8px;
    margin-left: 0 !important;
  }
}
</style>
