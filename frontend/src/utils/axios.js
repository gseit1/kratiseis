import axios from 'axios'

// Create axios instance without base URL since Vite proxy handles it
const api = axios.create({
  withCredentials: true // This ensures cookies are sent with requests
})

// Request interceptor - removed token header logic since we use cookies
api.interceptors.request.use(
  (config) => {
    // Log requests for debugging
    console.log('🌐 Making request to:', config.url)
    console.log('🔐 With credentials (cookies):', config.withCredentials)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      console.log('🔒 Authentication error - redirecting to login')
      
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
