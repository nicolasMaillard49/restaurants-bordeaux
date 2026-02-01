<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <!-- Hero Section -->
    <section id="hero" class="relative overflow-hidden text-white min-h-screen flex flex-col">
      <!-- Background Image -->
      <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/background.jpg')"></div>
      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-950/85 to-black/95"></div>
      <!-- Pattern Overlay -->
      <div class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-10"></div>

      <!-- Language Selector -->
      <div class="absolute top-6 right-6 z-10">
        <LanguageSelector />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 flex-1 flex items-center">
        <div class="text-center">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <UIcon name="i-heroicons-map-pin-solid" class="w-4 h-4" />
            <span class="text-sm font-medium">Bordeaux</span>
          </div>

          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
            {{ t.hero.title }}
            <span class="block text-blue-200">{{ t.hero.subtitle }}</span>
          </h1>

          <p class="text-xl sm:text-2xl text-blue-100 max-w-3xl mx-auto mb-10">
            {{ t.hero.description }}
          </p>

          <!-- Search Bar (Trigger) -->
          <div class="max-w-2xl mx-auto">
            <div class="relative cursor-pointer" @click="scrollToSearch">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60"
              />
              <input
                type="text"
                readonly
                :placeholder="t.hero.searchPlaceholder"
                class="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-white/60 shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all cursor-pointer"
              />
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div v-if="!pending && restaurants" class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div class="text-4xl font-bold mb-2">{{ restaurants.length }}</div>
            <div class="text-blue-100 text-sm">{{ t.stats.restaurants }}</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div class="text-4xl font-bold mb-2">{{ averageRating }}</div>
            <div class="text-blue-100 text-sm">{{ t.stats.avgRating }}</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div class="text-4xl font-bold mb-2">100%</div>
            <div class="text-blue-100 text-sm">{{ t.stats.verified }}</div>
          </div>
          <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transform hover:scale-105 transition-transform">
            <div class="text-4xl font-bold mb-2">{{ topRatedCount }}</div>
            <div class="text-blue-100 text-sm">{{ t.stats.topRated }}</div>
          </div>
        </div>
      </div>

      <!-- Scroll Down Arrow -->
      <div class="relative pb-8">
        <a
          href="#restaurants"
          class="flex flex-col items-center gap-2 animate-bounce cursor-pointer hover:opacity-80 transition-opacity"
          @click.prevent="scrollToRestaurants"
        >
          <span class="text-sm text-blue-100 font-medium">{{ t.hero.discover }}</span>
          <UIcon name="i-heroicons-chevron-down" class="w-8 h-8 text-white" />
        </a>
      </div>
    </section>

    <!-- Main Content -->
    <main id="restaurants" class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <!-- Search and Filters -->
      <div class="flex flex-col justify-between sm:flex-row gap-4 mb-8">
        <!-- Search Input -->
        <div class="flex-1 max-w-md">
          <div class="relative">
            <UIcon
              name="i-heroicons-magnifying-glass"
              class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              :placeholder="t.search.placeholder"
              class="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <!-- Filters -->
        <div class="flex flex-wrap gap-3">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="selectedFilter = filter.value"
            :class="[
              'px-5 py-2.5 rounded-xl font-medium transition-all',
              selectedFilter === filter.value
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            ]"
          >
            {{ filter.label }}
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="pending" class="flex flex-col justify-center items-center py-20">
        <div class="relative w-16 h-16">
          <div class="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p class="mt-4 text-gray-600">{{ t.ui.loadingRestaurants }}</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t.ui.errorTitle }}</h3>
        <p class="text-gray-600 mb-6">{{ t.ui.errorDescription }}</p>
        <button
          @click="refresh()"
          class="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          {{ t.ui.retry }}
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="!filteredRestaurants || filteredRestaurants.length === 0" class="text-center py-20">
        <div class="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-4">
          <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-gray-400" />
        </div>
        <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ t.ui.emptyTitle }}</h3>
        <p class="text-gray-600">{{ t.ui.emptyDescription }}</p>
      </div>

      <!-- Restaurants Grid -->
      <div v-else>
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ filteredRestaurants.length }} {{ t.ui.restaurantsCount }}{{ filteredRestaurants.length > 1 ? 's' : '' }}
          </h2>

          <select
            v-model="sortBy"
            class="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rating">{{ t.sort.rating }}</option>
            <option value="name">{{ t.sort.name }}</option>
            <option value="recent">{{ t.sort.recent }}</option>
          </select>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article
            v-for="(restaurant, index) in sortedRestaurants"
            :key="restaurant.id"
            class="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1"
            :style="{ animationDelay: `${index * 50}ms` }"
            @click="navigateTo(`/restaurants/${restaurant.id}`)"
          >
            <!-- Image -->
            <div class="relative h-56 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
              <img
                v-if="restaurant.images && restaurant.images.length > 0"
                :src="restaurant.images[0]"
                :alt="restaurant.name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div v-else class="flex items-center justify-center h-full">
                <UIcon name="i-heroicons-photo" class="w-16 h-16 text-gray-400" />
              </div>

              <!-- Open/Closed Badge -->
              <div
                v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0"
                :class="[
                  'absolute top-4 left-4 px-3 py-1.5 backdrop-blur-sm text-white text-xs font-bold rounded-full shadow-lg',
                  isRestaurantOpenNow(restaurant) ? 'bg-green-500/95' : 'bg-red-500/95'
                ]"
              >
                {{ isRestaurantOpenNow(restaurant) ? t.restaurant.open : t.restaurant.closed }}
              </div>

              <!-- Rating Badge -->
              <div
                v-if="restaurant.rating"
                class="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg"
              >
                <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                <span class="font-bold text-gray-900">{{ formatRating(restaurant.rating) }}</span>
              </div>
            </div>

            <!-- Content -->
            <div class="p-6">
              <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {{ restaurant.name?.trim() }}
              </h3>

              <p class="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                {{ restaurant.description }}
              </p>

              <!-- Address -->
              <div class="flex items-start gap-2 text-sm text-gray-500 mb-4">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-600" />
                <span class="line-clamp-1">{{ restaurant.address?.trim() }}</span>
              </div>

              <!-- Footer -->
              <div class="flex items-center justify-between pt-4 border-t border-gray-100">
                <span class="text-sm text-gray-500">{{ restaurant.city }}</span>
                <div class="flex items-center gap-2 text-blue-600 font-medium text-sm group-hover:gap-3 transition-all">
                  <span>{{ t.ui.viewMore }}</span>
                  <UIcon name="i-heroicons-arrow-right" class="w-4 h-4" />
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-4">🍽️ {{ t.restaurant.pageTitle }}</h3>
          <p class="text-gray-400 mb-6">
            {{ t.ui.footerTagline }}
          </p>
          <div class="flex justify-center gap-6 text-sm text-gray-400">
            <span>{{ new Date().getFullYear() }} - {{ t.ui.rights }}</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const { getAll } = useRestaurants()
const { t } = useTranslations()

// Search input ref
const searchInputRef = ref<HTMLInputElement | null>(null)

// Type definition (local)
interface Restaurant {
  id: string
  name: string
  description: string
  rating: string | number
  address: string
  city: string
  website: string | null
  opening_hours: string[] | null
  images: string[]
  source: string
  last_update: string
  created_at: string
  updated_at: string
}

// Data fetching
const { data: restaurants, pending, error, refresh } = await useAsyncData(
  'restaurants',
  () => getAll(),
  {
    lazy: true
  }
)

// Search and filters
const searchQuery = ref('')
const selectedFilter = ref('all')
const sortBy = ref('rating')

const filters = computed(() => [
  { label: t.value.filters.all, value: 'all' },
  { label: `🟢 ${t.value.filters.openNow}`, value: 'open' },
  { label: `⭐ ${t.value.filters.topRated}`, value: 'top' },
  { label: `🆕 ${t.value.filters.recent}`, value: 'recent' },
])

// Computed properties
const filteredRestaurants = computed(() => {
  if (!restaurants.value) return []

  let filtered = [...restaurants.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((r: Restaurant) =>
      r.name?.toLowerCase().includes(query) ||
      r.description?.toLowerCase().includes(query) ||
      r.address?.toLowerCase().includes(query)
    )
  }

  // Category filter
  if (selectedFilter.value === 'open') {
    filtered = filtered.filter((r: Restaurant) => isRestaurantOpenNow(r))
  } else if (selectedFilter.value === 'top') {
    filtered = filtered.filter((r: Restaurant) => parseFloat(String(r.rating)) >= 4.5)
  } else if (selectedFilter.value === 'recent') {
    filtered = filtered.sort((a: Restaurant, b: Restaurant) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
  }

  return filtered
})

const sortedRestaurants = computed(() => {
  if (!filteredRestaurants.value) return []

  const sorted = [...filteredRestaurants.value]

  if (sortBy.value === 'rating') {
    sorted.sort((a: Restaurant, b: Restaurant) => parseFloat(String(b.rating)) - parseFloat(String(a.rating)))
  } else if (sortBy.value === 'name') {
    sorted.sort((a: Restaurant, b: Restaurant) => (a.name || '').localeCompare(b.name || ''))
  } else if (sortBy.value === 'recent') {
    sorted.sort((a: Restaurant, b: Restaurant) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  }

  return sorted
})

const averageRating = computed(() => {
  if (!restaurants.value || restaurants.value.length === 0) return '0.0'
  const sum = restaurants.value.reduce((acc: number, r: Restaurant) => acc + parseFloat(String(r.rating) || '0'), 0)
  return (sum / restaurants.value.length).toFixed(1)
})

const topRatedCount = computed(() => {
  if (!restaurants.value) return 0
  return restaurants.value.filter((r: Restaurant) => parseFloat(String(r.rating)) >= 4.5).length
})

// Helper function
const formatRating = (rating: string | number): string => {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating
  return num ? num.toFixed(1) : '0.0'
}

// Fonction pour vérifier si le restaurant est ouvert maintenant
const isRestaurantOpenNow = (restaurant: Restaurant): boolean => {
  if (!restaurant.opening_hours || restaurant.opening_hours.length === 0) return false

  const now = new Date()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const currentDay = dayNames[now.getDay()]
  const currentTime = now.getHours() * 60 + now.getMinutes()

  // Trouver les horaires du jour actuel
  const todayHours = restaurant.opening_hours.find(h => h.startsWith(currentDay))
  if (!todayHours) return false

  // Vérifier si fermé
  if (todayHours.includes('Closed') || todayHours.includes('Fermé')) return false

  // Extraire les heures après le premier ":"
  const timeRanges = todayHours.split(':').slice(1).join(':').split(',')

  for (const range of timeRanges) {
    // Détecter si format AM/PM ou format 24h
    const hasAmPm = /AM|PM/i.test(range)

    if (hasAmPm) {
      // Format 12h avec AM/PM : "11:00 AM – 10:00 PM" ou "7:00 – 10:30 PM"
      const times = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)
      if (!times || times.length < 2) continue

      const periodMatch = range.match(/(AM|PM)/gi)
      const globalPeriod = periodMatch && periodMatch.length === 1 ? periodMatch[0].toUpperCase() : null

      const parseTime = (timeStr: string): number => {
        const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
        if (!match) return 0

        let hours = parseInt(match[1])
        const minutes = parseInt(match[2])
        let period = match[3]?.toUpperCase()

        if (!period && globalPeriod) {
          period = globalPeriod
        }

        if (period === 'PM' && hours !== 12) hours += 12
        if (period === 'AM' && hours === 12) hours = 0

        return hours * 60 + minutes
      }

      const openTime = parseTime(times[0])
      const closeTime = parseTime(times[1])

      if (currentTime >= openTime && currentTime < closeTime) {
        return true
      }
    } else {
      // Format 24h : "11:00 – 22:00"
      const times = range.match(/(\d{1,2}):(\d{2})/g)
      if (!times || times.length < 2) continue

      const parseTime24h = (timeStr: string): number => {
        const match = timeStr.match(/(\d{1,2}):(\d{2})/)
        if (!match) return 0
        const hours = parseInt(match[1])
        const minutes = parseInt(match[2])
        return hours * 60 + minutes
      }

      const openTime = parseTime24h(times[0])
      const closeTime = parseTime24h(times[1])

      if (currentTime >= openTime && currentTime < closeTime) {
        return true
      }
    }
  }

  return false
}

// Smooth scroll to restaurants section
const scrollToRestaurants = () => {
  const restaurantsSection = document.getElementById('restaurants')
  if (restaurantsSection) {
    restaurantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

// Scroll to search and focus input
const scrollToSearch = () => {
  const restaurantsSection = document.getElementById('restaurants')
  if (restaurantsSection) {
    restaurantsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    // Focus input after scroll animation
    setTimeout(() => {
      searchInputRef.value?.focus()
    }, 500)
  }
}

// SEO
useHead({
  title: 'Restaurants Bordeaux - Les meilleurs restaurants de la ville',
  meta: [
    { name: 'description', content: 'Découvrez une sélection des meilleurs restaurants de Bordeaux. Notes, avis, et descriptions détaillées.' }
  ]
})
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

article {
  animation: fadeInUp 0.5s ease-out both;
}
</style>
