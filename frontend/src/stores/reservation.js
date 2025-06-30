import { defineStore } from 'pinia'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useReservationStore = defineStore('reservation', {
  state: () => ({
    reservations: [],
    userReservations: [],
    shopReservations: [],
    loading: false
  }),

  getters: {
    getReservationById: (state) => (id) => {
      return state.reservations.find(reservation => reservation._id === id)
    },
    upcomingReservations: (state) => {
      const now = new Date()
      return state.userReservations.filter(reservation => 
        new Date(reservation.date) >= now && reservation.status !== 'cancelled'
      )
    },
    pastReservations: (state) => {
      const now = new Date()
      return state.userReservations.filter(reservation => 
        new Date(reservation.date) < now || reservation.status === 'completed'
      )
    }
  },

  actions: {
    async createUserReservation(reservationData) {
      this.loading = true
      try {
        const response = await axios.post('/api/reservation/user', reservationData)
        const newReservation = response.data.reservation || response.data
        
        this.userReservations.unshift(newReservation)
        toast.success('Reservation created successfully!')
        return { success: true, reservation: newReservation }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create reservation'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async createGuestReservation(reservationData) {
      this.loading = true
      try {
        const response = await axios.post('/api/reservation/guest', reservationData)
        const newReservation = response.data.reservation || response.data
        
        toast.success('Reservation created successfully!')
        return { success: true, reservation: newReservation }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create reservation'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async createManualReservation(reservationData) {
      this.loading = true
      try {
        const response = await axios.post('/api/reservation/manual', reservationData)
        const newReservation = response.data.reservation || response.data
        
        this.shopReservations.unshift(newReservation)
        toast.success('Manual reservation created successfully!')
        return { success: true, reservation: newReservation }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to create manual reservation'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async fetchUserReservations() {
      this.loading = true
      try {
        const response = await axios.get('/api/user/reservationHistory')
        this.userReservations = response.data.reservationHistory || response.data
        return this.userReservations
      } catch (error) {
        toast.error('Failed to fetch reservations')
        console.error('Error fetching user reservations:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchShopReservations() {
      this.loading = true
      try {
        const response = await axios.get('/api/shop/reservationList')
        this.shopReservations = response.data.reservations || response.data
        return this.shopReservations
      } catch (error) {
        toast.error('Failed to fetch shop reservations')
        console.error('Error fetching shop reservations:', error)
        return []
      } finally {
        this.loading = false
      }
    },

    async updateReservationStatus(reservationId, status) {
      this.loading = true
      try {
        const response = await axios.patch(`/api/reservation/${reservationId}/status`, { status })
        const updatedReservation = response.data.reservation || response.data
        
        // Update in userReservations
        const userIndex = this.userReservations.findIndex(res => res._id === reservationId)
        if (userIndex !== -1) {
          this.userReservations[userIndex] = updatedReservation
        }
        
        // Update in shopReservations
        const shopIndex = this.shopReservations.findIndex(res => res._id === reservationId)
        if (shopIndex !== -1) {
          this.shopReservations[shopIndex] = updatedReservation
        }
        
        toast.success(`Reservation ${status} successfully!`)
        return { success: true, reservation: updatedReservation }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to update reservation status'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async cancelReservation(reservationId) {
      return this.updateReservationStatus(reservationId, 'cancelled')
    },

    async confirmReservation(reservationId) {
      return this.updateReservationStatus(reservationId, 'confirmed')
    },

    async completeReservation(reservationId) {
      return this.updateReservationStatus(reservationId, 'completed')
    },

    async deleteReservation(reservationId) {
      this.loading = true
      try {
        await axios.delete(`/api/reservation/${reservationId}`)
        
        // Remove from userReservations
        this.userReservations = this.userReservations.filter(res => res._id !== reservationId)
        
        // Remove from shopReservations
        this.shopReservations = this.shopReservations.filter(res => res._id !== reservationId)
        
        toast.success('Reservation deleted successfully!')
        return { success: true }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to delete reservation'
        toast.error(message)
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async getAvailableTables(shopId, date, time, duration, numberOfGuests) {
      try {
        const response = await axios.get('/api/table/availability', {
          params: { shopId, date, time, duration, numberOfGuests }
        })
        return response.data.availableTables || response.data
      } catch (error) {
        console.error('Error fetching available tables:', error)
        return []
      }
    },

    async assignTable(reservationId, tableId) {
      try {
        const response = await axios.patch(`/api/reservation/${reservationId}/assign-table`, { tableId })
        const updatedReservation = response.data.reservation || response.data
        
        // Update in shopReservations
        const index = this.shopReservations.findIndex(res => res._id === reservationId)
        if (index !== -1) {
          this.shopReservations[index] = updatedReservation
        }
        
        toast.success('Table assigned successfully!')
        return { success: true, reservation: updatedReservation }
      } catch (error) {
        const message = error.response?.data?.message || 'Failed to assign table'
        toast.error(message)
        return { success: false, message }
      }
    }
  }
})
