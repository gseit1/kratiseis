import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useShopStore = defineStore('shop', {
  state: () => ({
    shops: [],
    currentShop: null,
    categories: [],
    cities: [],
    regions: [],
    attributes: [],
    loading: false,
    searchResults: [],
    favoriteShops: []
  }),

  getters: {
    getShopById: (state) => (id) => {
      return state.shops.find(shop => shop._id === id)
    },
    getFeaturedShops: (state) => {
      return state.shops.filter(shop => shop.recommended || shop.isRecommended).slice(0, 6)
    }
  },

  actions: {
    async fetchShops() {
      this.loading = true
      try {
        const response = await axios.get('/api/shop')
        const shopsData = response.data.shops || response.data
        console.log('Raw shops data from backend:', shopsData)
        // Filter out invalid shop data and ensure minimum required fields
        this.shops = Array.isArray(shopsData) ? shopsData.filter(shop => 
          shop && shop._id && typeof shop._id === 'string'
        ) : []
        console.log('Processed shops:', this.shops)
        return this.shops
      } catch (error) {
        toast.error('Failed to fetch shops')
        console.error('Error fetching shops:', error)
        this.shops = [] // Ensure shops is always an array
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchShopById(id) {
      this.loading = true
      try {
        const response = await axios.get(`/api/shop/${id}`)
        this.currentShop = response.data.shop || response.data
        return this.currentShop
      } catch (error) {
        toast.error('Failed to fetch shop details')
        console.error('Error fetching shop:', error)
        return null
      } finally {
        this.loading = false
      }
    },

    async createShop(shopData) {
      this.loading = true
      try {
        const response = await axios.post('/api/shop', shopData)
        const newShop = response.data.shop || response.data
        this.shops.push(newShop)
        toast.success('Shop created successfully!')
        return { success: true, shop: newShop }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create shop'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async updateShop(id, shopData) {
      this.loading = true
      try {
        const response = await axios.patch(`/api/shop/${id}`, shopData)
        const updatedShop = response.data.shop || response.data
        
        // Update shop in shops array
        const index = this.shops.findIndex(shop => shop._id === id)
        if (index !== -1) {
          this.shops[index] = updatedShop
        }
        
        // Update current shop if it's the same
        if (this.currentShop && this.currentShop._id === id) {
          this.currentShop = updatedShop
        }
        
        toast.success('Shop updated successfully!')
        return { success: true, shop: updatedShop }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update shop'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async searchShops(searchParams) {
      this.loading = true
      try {
        let url = '/api/search'
        const { cityId, regionId, categoryId } = searchParams
        
        if (cityId && regionId && categoryId) {
          url = `/api/search/city/${cityId}/region/${regionId}/category/${categoryId}`
        } else if (cityId && categoryId) {
          url = `/api/search/city/${cityId}/category/${categoryId}`
        } else if (cityId && regionId) {
          url = `/api/search/city/${cityId}/region/${regionId}`
        } else if (cityId) {
          url = `/api/search/city/${cityId}`
        }
        
        const response = await axios.get(url)
        this.searchResults = response.data.shops || response.data
        return this.searchResults
      } catch (error) {
        toast.error('Search failed')
        console.error('Error searching shops:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async searchShopsWithAvailability(searchParams) {
      this.loading = true
      try {
        const { cityId, regionId, categoryId, date, time, partySize } = searchParams
        
        // Convert time from decimal back to HH:mm format if needed
        let timeStr = time
        if (typeof time === 'number') {
          const hours = Math.floor(time)
          const minutes = Math.round((time - hours) * 60)
          timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        }
        
        const params = new URLSearchParams({
          cityId,
          date,
          time: timeStr,
          partySize: partySize.toString()
        })
        
        if (regionId) params.append('regionId', regionId)
        if (categoryId) params.append('categoryId', categoryId)
        
        const response = await axios.get(`/api/search/availability?${params}`)
        this.searchResults = response.data.shops || response.data || []
        return this.searchResults
      } catch (error) {
        toast.error('Availability search failed')
        console.error('Error searching shops with availability:', error)
        this.searchResults = []
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchCategories() {
      try {
        const response = await axios.get('/api/category')
        this.categories = response.data.categories || response.data
        return this.categories
      } catch (error) {
        console.error('Error fetching categories:', error)
        return []
      }
    },

    async fetchCities() {
      try {
        const response = await axios.get('/api/city')
        this.cities = response.data.cities || response.data
        return this.cities
      } catch (error) {
        console.error('Error fetching cities:', error)
        return []
      }
    },

    async fetchRegions() {
      try {
        const response = await axios.get('/api/region')
        this.regions = response.data.regions || response.data
        return this.regions
      } catch (error) {
        console.error('Error fetching regions:', error)
        return []
      }
    },

    async fetchAttributes() {
      try {
        const response = await axios.get('/api/attributes')
        this.attributes = response.data.attributes || response.data
        return this.attributes
      } catch (error) {
        console.error('Error fetching attributes:', error)
        return []
      }
    },

    async getShopReviews(shopId) {
      try {
        const response = await axios.get(`/api/shop/${shopId}/reviews`)
        return response.data.reviews || response.data
      } catch (error) {
        console.error('Error fetching shop reviews:', error)
        return []
      }
    },

    async addShopReview(shopId, reviewData) {
      this.loading = true
      try {
        const response = await axios.post('/api/review', {
          shopId: shopId,
          rating: reviewData.rating,
          comment: reviewData.comment
        })
        
        toast.success('Review submitted successfully!')
        return { success: true, review: response.data }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to submit review'
        toast.error(message)
        console.error('Error submitting review:', error)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async addShopPhoto(photo) {
      try {
        const formData = new FormData()
        formData.append('photo', photo)
        
        const response = await axios.post('/api/shop/photos', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        
        toast.success('Photo added successfully!')
        return { success: true, photo: response.data.photo }
      } catch (error) {
        toast.error('Failed to add photo')
        return { success: false }
      }
    },

    async deleteShopPhoto(photoId) {
      try {
        await axios.delete('/api/shop/photos', { data: { photoId } })
        toast.success('Photo deleted successfully!')
        return true
      } catch (error) {
        toast.error('Failed to delete photo')
        return false
      }
    }
  }
})
