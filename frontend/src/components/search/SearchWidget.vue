<template>
  <div class="search-widget">
    <h4 class="text-center fw-bold mb-4 text-display">
      <i class="bi bi-search me-2 text-gradient"></i>
      Find Your Perfect Table
    </h4>
    
    <form @submit.prevent="handleSearch">
      <div class="row g-4">
        <!-- City Selection -->
        <div class="col-md-6">
          <div class="form-floating">
            <select 
              v-model="searchForm.cityId" 
              class="form-select form-control-modern" 
              id="citySelect"
              @change="onCityChange"
              required
            >
              <option value="">Choose City</option>
              <option 
                v-for="city in cities" 
                :key="city._id" 
                :value="city._id"
              >
                {{ city.name }}
              </option>
            </select>
            <label for="citySelect" class="form-label-modern">
              <i class="bi bi-geo-alt me-1"></i>City
            </label>
          </div>
        </div>
        
        <!-- Region Selection -->
        <div class="col-md-6">
          <div class="form-floating">
            <select 
              v-model="searchForm.regionId" 
              class="form-select form-control-modern" 
              id="regionSelect"
              :disabled="!searchForm.cityId"
            >
              <option value="">Any Region</option>
              <option 
                v-for="region in filteredRegions" 
                :key="region._id" 
                :value="region._id"
              >
                {{ region.name }}
              </option>
            </select>
            <label for="regionSelect" class="form-label-modern">
              <i class="bi bi-map me-1"></i>Region
            </label>
          </div>
        </div>
        
        <!-- Category Selection -->
        <div class="col-md-6">
          <div class="form-floating">
            <select 
              v-model="searchForm.categoryId" 
              class="form-select form-control-modern" 
              id="categorySelect"
            >
              <option value="">Any Cuisine</option>
              <option 
                v-for="category in categories" 
                :key="category._id" 
                :value="category._id"
              >
                {{ category.name }}
              </option>
            </select>
            <label for="categorySelect" class="form-label-modern">
              <i class="bi bi-cup-straw me-1"></i>Cuisine Type
            </label>
          </div>
        </div>
        
        <!-- Date Selection -->
        <div class="col-md-6">
          <div class="form-floating">
            <input 
              type="date" 
              v-model="searchForm.date" 
              class="form-control form-control-modern" 
              id="dateInput"
              :min="today"
            >
            <label for="dateInput" class="form-label-modern">
              <i class="bi bi-calendar-event me-1"></i>Date
            </label>
          </div>
        </div>
        
        <!-- Time Selection -->
        <div class="col-md-6">
          <div class="form-floating">
            <select 
              v-model="searchForm.time" 
              class="form-select form-control-modern" 
              id="timeSelect"
            >
              <option value="">Any Time</option>
              <option v-for="time in timeSlots" :key="time" :value="time">
                {{ time }}
              </option>
            </select>
            <label for="timeSelect" class="form-label-modern">
              <i class="bi bi-clock me-1"></i>Time
            </label>
          </div>
        </div>
        
        <!-- Party Size -->
        <div class="col-md-6">
          <div class="form-floating">
            <select 
              v-model="searchForm.partySize" 
              class="form-select form-control-modern" 
              id="partySizeSelect"
            >
              <option value="">Party Size</option>
              <option v-for="size in partySizes" :key="size" :value="size">
                {{ size }} {{ size === 1 ? 'person' : 'people' }}
              </option>
            </select>
            <label for="partySizeSelect" class="form-label-modern">
              <i class="bi bi-people me-1"></i>Party Size
            </label>
          </div>
        </div>
      </div>
      
      <div class="text-center mt-5">
        <button 
          type="submit" 
          class="btn btn-gradient btn-lg px-5 fw-bold hover-lift"
          :disabled="!searchForm.cityId"
        >
          <i class="bi bi-search me-2"></i>
          Search Restaurants
        </button>
      </div>
    </form>
    
    <!-- Quick Search Tags -->
    <div class="mt-5">
      <p class="text-muted small mb-3 fw-medium">Popular searches:</p>
      <div class="d-flex flex-wrap gap-2">
        <button 
          v-for="tag in popularTags" 
          :key="tag.name"
          @click="quickSearch(tag)"
          class="btn btn-glass btn-sm hover-lift"
        >
          {{ tag.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useShopStore } from '@/stores/shop'
import { format } from 'date-fns'

export default {
  name: 'SearchWidget',
  setup() {
    const router = useRouter()
    const shopStore = useShopStore()
    
    const searchForm = ref({
      cityId: '',
      regionId: '',
      categoryId: '',
      date: '',
      time: '',
      partySize: ''
    })
    
    const cities = ref([])
    const regions = ref([])
    const categories = ref([])
    
    const today = format(new Date(), 'yyyy-MM-dd')
    
    const timeSlots = [
      '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
      '17:00', '17:30', '18:00', '18:30', '19:00', '19:30',
      '20:00', '20:30', '21:00', '21:30', '22:00', '22:30'
    ]
    
    const partySizes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    
    const popularTags = ref([
      { name: 'Italian', categoryName: 'Italian' },
      { name: 'Greek', categoryName: 'Greek' },
      { name: 'Asian', categoryName: 'Asian' },
      { name: 'Tonight', date: today },
      { name: 'Weekend', date: getWeekendDate() }
    ])
    
    const filteredRegions = computed(() => {
      if (!searchForm.value.cityId) return []
      return regions.value.filter(region => region.cityId === searchForm.value.cityId)
    })
    
    function getWeekendDate() {
      const now = new Date()
      const friday = new Date(now)
      friday.setDate(now.getDate() + (5 - now.getDay() + 7) % 7)
      return format(friday, 'yyyy-MM-dd')
    }
    
    const onCityChange = () => {
      searchForm.value.regionId = ''
    }
    
    const handleSearch = () => {
      const query = {}
      
      if (searchForm.value.cityId) query.city = searchForm.value.cityId
      if (searchForm.value.regionId) query.region = searchForm.value.regionId
      if (searchForm.value.categoryId) query.category = searchForm.value.categoryId
      if (searchForm.value.date) query.date = searchForm.value.date
      if (searchForm.value.time) query.time = searchForm.value.time
      if (searchForm.value.partySize) query.partySize = searchForm.value.partySize
      
      router.push({
        name: 'SearchResults',
        query
      })
    }
    
    const quickSearch = (tag) => {
      if (tag.categoryName) {
        const category = categories.value.find(cat => cat.name === tag.categoryName)
        if (category) {
          searchForm.value.categoryId = category._id
        }
      }
      
      if (tag.date) {
        searchForm.value.date = tag.date
      }
      
      if (searchForm.value.cityId) {
        handleSearch()
      }
    }
    
    onMounted(async () => {
      try {
        const [citiesData, regionsData, categoriesData] = await Promise.all([
          shopStore.fetchCities(),
          shopStore.fetchRegions(),
          shopStore.fetchCategories()
        ])
        
        cities.value = Array.isArray(citiesData) ? citiesData : []
        regions.value = Array.isArray(regionsData) ? regionsData : []
        categories.value = Array.isArray(categoriesData) ? categoriesData : []
      } catch (error) {
        console.error('Error loading search data:', error)
        // Initialize with empty arrays on error
        cities.value = []
        regions.value = []
        categories.value = []
      }
    })
    
    return {
      searchForm,
      cities,
      regions,
      categories,
      filteredRegions,
      today,
      timeSlots,
      partySizes,
      popularTags,
      onCityChange,
      handleSearch,
      quickSearch
    }
  }
}
</script>

<style scoped>
.search-widget {
  background: white;
  border-radius: var(--radius-2xl);
  padding: var(--space-8);
  box-shadow: var(--shadow-xl);
  border: 1px solid var(--gray-100);
}

.form-label-modern {
  color: var(--gray-600);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.form-floating .form-control-modern:focus ~ .form-label-modern,
.form-floating .form-select:focus ~ .form-label-modern {
  color: var(--primary-600);
}

.btn-gradient {
  background: var(--gradient-primary);
  border: none;
  border-radius: var(--radius-full);
  transition: all var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.btn-gradient:hover {
  background: linear-gradient(135deg, var(--primary-700), var(--secondary-700));
  transform: translateY(-2px);
  box-shadow: var(--shadow-xl);
}

.btn-gradient:disabled {
  background: var(--gray-300);
  color: var(--gray-500);
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-glass {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-backdrop);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  color: var(--gray-700);
  font-weight: 500;
  transition: all var(--transition-normal);
}

.btn-glass:hover {
  background: rgba(255, 255, 255, 0.2);
  color: var(--gray-900);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.text-display {
  font-family: var(--font-family-display);
  color: var(--gray-800);
}

@media (max-width: 768px) {
  .search-widget {
    padding: var(--space-6);
    border-radius: var(--radius-xl);
  }
  
  .btn-gradient {
    width: 100%;
    justify-content: center;
  }
}
</style>
