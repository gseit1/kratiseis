<template>
  <div class="auth-test-page p-4">
    <div class="container">
      <h1>Auth & API Test Page</h1>
      
      <!-- Auth Status -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>Authentication Status</h3>
        </div>
        <div class="card-body">
          <p><strong>Authenticated:</strong> {{ authStore.isAuthenticated }}</p>
          <p><strong>User:</strong> {{ JSON.stringify(authStore.user, null, 2) }}</p>
          <p><strong>Role:</strong> {{ authStore.user?.role || 'None' }}</p>
          <p><strong>Shop ID:</strong> {{ authStore.user?.shopId || 'None' }}</p>
        </div>
      </div>
      
      <!-- API Test -->
      <div class="card mb-4">
        <div class="card-header">
          <h3>API Tests</h3>
        </div>
        <div class="card-body">
          <div class="d-flex gap-2 mb-3">
            <button @click="testUserDetails" class="btn btn-primary">Test /api/users/details</button>
            <button @click="testReservations" class="btn btn-secondary">Test /api/shop/reservationList</button>
            <button @click="testTables" class="btn btn-success">Test /api/shop/tables</button>
            <button @click="testStats" class="btn btn-warning">Test /api/stats/total-reservations</button>
            <button @click="createTestShop" class="btn btn-info">Create Test Shop</button>
            <button @click="logout" class="btn btn-danger">Logout</button>
            <button @click="refreshUserData" class="btn btn-warning">Refresh User Data</button>
          </div>
          
          <div v-if="testResults" class="mt-3">
            <h5>Last Test Result:</h5>
            <pre class="bg-light p-3 rounded">{{ JSON.stringify(testResults, null, 2) }}</pre>
          </div>
        </div>
      </div>
      
      <!-- Quick Login Form -->
      <div class="card">
        <div class="card-header">
          <h3>Quick Login Test</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="quickLogin">
            <div class="row">
              <div class="col-md-4">
                <input v-model="loginData.email" type="email" class="form-control" placeholder="Email" required>
              </div>
              <div class="col-md-4">
                <input v-model="loginData.password" type="password" class="form-control" placeholder="Password" required>
              </div>
              <div class="col-md-4">
                <button type="submit" class="btn btn-primary" :disabled="authStore.loading">
                  {{ authStore.loading ? 'Logging in...' : 'Login' }}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/utils/axios'

export default {
  name: 'AuthTest',
  setup() {
    const authStore = useAuthStore()
    const testResults = ref(null)
    
    const loginData = reactive({
      email: 'shopowner@test.com',
      password: 'password123'
    })
    
    const testUserDetails = async () => {
      try {
        console.log('Testing /api/users/details...')
        const response = await api.get('/api/users/details')
        testResults.value = {
          endpoint: '/api/users/details',
          status: 'success',
          data: response.data
        }
        console.log('User details response:', response.data)
        
        // Also update the auth store if we find shopId
        if (response.data.isAuthenticated && response.data.user) {
          console.log('Updating auth store with user data:', response.data.user)
          // Directly assign the user object to ensure reactivity
          authStore.user = response.data.user
          console.log('Updated auth store user:', authStore.user)
        }
      } catch (error) {
        testResults.value = {
          endpoint: '/api/users/details',
          status: 'error',
          error: error.response?.data || error.message
        }
        console.error('User details error:', error)
      }
    }
    
    const testReservations = async () => {
      try {
        console.log('Testing /api/shop/reservationList...')
        const response = await api.get('/api/shop/reservationList')
        testResults.value = {
          endpoint: '/api/shop/reservationList',
          status: 'success',
          data: response.data
        }
        console.log('Reservations response:', response.data)
      } catch (error) {
        testResults.value = {
          endpoint: '/api/shop/reservationList',
          status: 'error',
          error: error.response?.data || error.message
        }
        console.error('Reservations error:', error)
      }
    }
    
    const testTables = async () => {
      try {
        console.log('Testing /api/shop/tables...')
        const response = await api.get('/api/shop/tables')
        testResults.value = {
          endpoint: '/api/shop/tables',
          status: 'success',
          data: response.data
        }
        console.log('Tables response:', response.data)
      } catch (error) {
        testResults.value = {
          endpoint: '/api/shop/tables',
          status: 'error',
          error: error.response?.data || error.message
        }
        console.error('Tables error:', error)
      }
    }
    
    const testStats = async () => {
      try {
        console.log('Testing /api/stats/total-reservations...')
        const response = await api.get('/api/stats/total-reservations')
        testResults.value = {
          endpoint: '/api/stats/total-reservations',
          status: 'success',
          data: response.data
        }
        console.log('Stats response:', response.data)
      } catch (error) {
        testResults.value = {
          endpoint: '/api/stats/total-reservations',
          status: 'error',
          error: error.response?.data || error.message
        }
        console.error('Stats error:', error)
      }
    }
    
    const quickLogin = async () => {
      const result = await authStore.login(loginData)
      console.log('Login result:', result)
    }
    
    const createTestShop = async () => {
      try {
        console.log('Creating test shop...')
        const shopData = {
          shopName: 'Test Restaurant',
          phone: '1234567890',
          shopDescription: 'A test restaurant for development',
          address: 'Test Address 123',
          cityId: '1', // You might need to adjust this
          regionId: '1', // You might need to adjust this
          coordinates: { lat: 40.7128, lng: -74.0060 }
        }
        
        const response = await api.post('/api/shop', shopData)
        testResults.value = {
          endpoint: '/api/shop (POST)',
          status: 'success',
          data: response.data
        }
        console.log('Shop creation response:', response.data)
        
        // Refresh user details to get the new shopId
        await testUserDetails()
      } catch (error) {
        testResults.value = {
          endpoint: '/api/shop (POST)',
          status: 'error',
          error: error.response?.data || error.message
        }
        console.error('Shop creation error:', error)
      }
    }
    
    const logout = async () => {
      await authStore.logout()
      console.log('Logged out')
    }
    
    const refreshUserData = async () => {
      await testUserDetails()
    }
    
    return {
      authStore,
      testResults,
      loginData,
      testUserDetails,
      testReservations,
      testTables,
      testStats,
      quickLogin,
      createTestShop,
      logout,
      refreshUserData
    }
  }
}
</script>

<style scoped>
.auth-test-page {
  min-height: 100vh;
  background-color: #f8f9fa;
}

pre {
  max-height: 300px;
  overflow-y: auto;
}
</style>
