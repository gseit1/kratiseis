import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views
import Home from '@/views/Home.vue'
import Login from '@/views/auth/Login.vue'
import Register from '@/views/auth/Register.vue'
import ShopList from '@/views/shops/ShopList.vue'
import ShopDetail from '@/views/shops/ShopDetail.vue'
import SearchResults from '@/views/search/SearchResults.vue'
import UserDashboard from '@/views/dashboard/UserDashboard.vue'
import ShopOwnerDashboard from '@/views/dashboard/ShopOwnerDashboard.vue'
import AdminDashboard from '@/views/dashboard/AdminDashboard.vue'
import Profile from '@/views/user/Profile.vue'
import Reservations from '@/views/reservations/Reservations.vue'
import CreateShop from '@/views/shops/CreateShop.vue'
import ManageShop from '@/views/shops/ManageShop.vue'
import AuthTest from '@/views/debug/AuthTest.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresGuest: true }
  },
  {
    path: '/shops',
    name: 'ShopList',
    component: ShopList
  },
  {
    path: '/shop/:id',
    name: 'ShopDetail',
    component: ShopDetail,
    props: true
  },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults
  },
  {
    path: '/dashboard',
    name: 'UserDashboard',
    component: UserDashboard,
    meta: { requiresAuth: true, role: 'user' }
  },
  {
    path: '/shop-owner/dashboard',
    name: 'ShopOwnerDashboard',
    component: ShopOwnerDashboard,
    // Temporarily disabled authentication for testing
    // meta: { requiresAuth: true, role: 'shopOwner' }
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { requiresAuth: true, role: 'admin' }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/reservations',
    name: 'Reservations',
    component: Reservations,
    meta: { requiresAuth: true }
  },
  {
    path: '/create-shop',
    name: 'CreateShop',
    component: CreateShop,
    meta: { requiresAuth: true, role: 'shopOwner' }
  },
  {
    path: '/manage-shop',
    name: 'ManageShop',
    component: ManageShop,
    meta: { requiresAuth: true, role: 'shopOwner' }
  },
  {
    path: '/debug/auth-test',
    name: 'AuthTest',
    component: AuthTest
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Check if user is authenticated
  if (!authStore.isAuthenticated && localStorage.getItem('token')) {
    await authStore.checkAuth()
  }

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Handle routes that require guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/dashboard')
    return
  }

  // Handle role-based access
  if (to.meta.role && authStore.user && authStore.user.role !== to.meta.role) {
    // Redirect based on user role
    switch (authStore.user.role) {
      case 'admin':
        next('/admin/dashboard')
        break
      case 'shopOwner':
        next('/shop-owner/dashboard')
        break
      default:
        next('/dashboard')
    }
    return
  }

  next()
})

export default router
