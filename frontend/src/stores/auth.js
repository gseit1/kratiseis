import { defineStore } from 'pinia'
import api from '@/utils/axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userRole: (state) => state.user?.role || null,
    isAdmin: (state) => state.user?.role === 'admin',
    isShopOwner: (state) => state.user?.role === 'shopOwner',
    isUser: (state) => state.user?.role === 'user'
  },

  actions: {
    async login(credentials) {
      this.loading = true
      try {
        console.log('🔐 Starting login process with credentials:', { email: credentials.email })
        
        const response = await api.post('/api/login', credentials)
        console.log('✅ Login API response:', response.data)
        
        const { message, role, shopId, userId } = response.data
        
        // Create initial user object from login response
        const user = {
          id: userId,
          role: role,
          shopId: shopId
        }
        
        console.log('👤 Initial user object created:', user)
        this.user = user
        
        // Always fetch complete user details to get the most up-to-date information
        console.log('📋 Fetching complete user details...')
        try {
          const detailsResponse = await api.get('/api/users/details')
          console.log('✅ User details response:', detailsResponse.data)
          
          if (detailsResponse.data.isAuthenticated && detailsResponse.data.user) {
            // Update user with complete data from details endpoint
            this.user = detailsResponse.data.user
            console.log('✅ Updated user with complete details:', this.user)
          }
        } catch (detailsError) {
          console.error('❌ Error fetching user details:', detailsError)
          console.log('⚠️ Continuing with basic user data from login response')
        }
        
        toast.success('Login successful!')
        return { success: true, user: this.user }
      } catch (error) {
        console.error('❌ Login error:', error)
        console.error('❌ Error response:', error.response?.data)
        const message = error.response?.data?.message || 'Login failed'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async register(userData) {
      this.loading = true
      try {
        const response = await api.post('/api/signup', userData)
        const { message, userId } = response.data
        
        // After registration, check auth status
        await this.checkAuth()
        
        toast.success('Registration successful!')
        return { success: true, user: this.user }
      } catch (error) {
        const message = error.response?.data?.message || 'Registration failed'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await api.post('/api/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        toast.success('Logged out successfully!')
      }
    },

    async checkAuth() {
      try {
        const response = await api.get('/api/check-auth')
        if (response.data.isAuthenticated && response.data.user) {
          this.user = response.data.user
          this.initialized = true
          return true
        } else {
          this.user = null
          this.initialized = true
          return false
        }
      } catch (error) {
        // Not authenticated or error
        this.user = null
        this.initialized = true
        return false
      }
    },

    async updateProfile(userData) {
      this.loading = true
      try {
        const response = await api.put('/api/profile', userData)
        this.user = { ...this.user, ...response.data.user }
        toast.success('Profile updated successfully!')
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Profile update failed'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async addToFavorites(shopId) {
      try {
        await api.post('/api/users/favourites', { shopId })
        toast.success('Added to favorites!')
        return true
      } catch (error) {
        toast.error('Failed to add to favorites')
        return false
      }
    },

    async removeFromFavorites(shopId) {
      try {
        await api.delete('/api/users/favourites', { data: { shopId } })
        toast.success('Removed from favorites!')
        return true
      } catch (error) {
        toast.error('Failed to remove from favorites')
        return false
      }
    },

    async getFavoriteShops() {
      try {
        const response = await api.get('/api/users/favourites')
        return response.data.favouriteShops || []
      } catch (error) {
        console.error('Error fetching favorite shops:', error)
        return []
      }
    }
  }
})
