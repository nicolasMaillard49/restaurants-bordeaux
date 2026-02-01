<template encode="html" as="utf-8">
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>

    <!-- Error state -->
    <div v-else-if="error || !restaurant" class="max-w-4xl mx-auto px-4 py-12">
      <UAlert
        icon="i-heroicons-exclamation-triangle"
        color="red"
        variant="subtle"
        :title="t.ui.notFoundTitle"
        :description="t.ui.notFoundDescription"
      />
      <UButton
        to="/"
        icon="i-heroicons-arrow-left"
        color="primary"
        variant="soft"
        class="mt-4"
      >
        {{ t.restaurant.backToList }}
      </UButton>
    </div>

    <!-- Restaurant detail -->
    <div v-else class="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <!-- Hero Section with Image -->
      <section class="relative h-[80vh] min-h-[500px] overflow-hidden w-[80vw] rounded-3xl mx-auto mt-6">
        <!-- Background Image -->
        <div
          v-if="restaurant.images && restaurant.images.length > 0"
          class="absolute inset-0 bg-cover bg-center bg-no-repeat cursor-pointer"
          :style="{ backgroundImage: `url(${restaurant.images[0]})` }"
          @click="openCarousel(0)"
        ></div>
        <div v-else class="absolute inset-0 bg-gradient-to-br from-slate-800 to-blue-900"></div>

        <!-- Gradient Overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40"></div>

        <!-- Navigation (top) -->
        <div class="absolute top-0 left-0 right-0 z-10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div class="flex items-center justify-between gap-4">
              <NuxtLink
                to="/#restaurants"
                class="flex items-center gap-2 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all"
              >
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
                <span class="font-medium">{{ t.restaurant.backToList }}</span>
              </NuxtLink>
              <LanguageSelector />
            </div>
          </div>
        </div>

        <!-- Restaurant Info (bottom) -->
        <div class="absolute bottom-0 left-0 right-0 z-10">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <!-- Rating Badge -->
            <div v-if="restaurant.rating" class="flex items-center gap-2 mb-4">
              <div class="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                <UIcon name="i-heroicons-star-solid" class="w-5 h-5 text-yellow-400" />
                <span class="font-bold text-lg text-white">{{ restaurant.rating.toFixed(1) }}</span>
                <span class="text-white/80">/5</span>
              </div>
              <span v-if="restaurant.reviews?.length" class="text-white/70 text-sm">
                ({{ restaurant.reviews.length }} {{ t.stats.reviews.toLowerCase() }})
              </span>
            </div>

            <!-- Restaurant Name -->
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-3 drop-shadow-lg">
              {{ restaurant.name }}
            </h1>

            <!-- Location -->
            <div class="flex items-center gap-2 text-white/90 text-lg">
              <UIcon name="i-heroicons-map-pin" class="w-5 h-5" />
              <span>{{ restaurant.city }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Main Content Container -->
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 -mt-6">
        <!-- Content Card -->
        <div class="bg-white rounded-2xl shadow-xl p-8">

          <!-- Description -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-3">{{ t.restaurant.description }}</h2>
            <p class="text-gray-700 leading-relaxed whitespace-pre-line">
              {{ translatedRestaurant?.description }}
            </p>
          </div>

          <!-- Types/Categories -->
          <div v-if="translatedRestaurant?.types && translatedRestaurant.types.length > 0" class="mb-8">
            <div class="flex flex-wrap gap-2">
              <span
                v-for="type in translatedRestaurant.types"
                :key="type"
                class="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
              >
                {{ type }}
              </span>
            </div>
          </div>

          <!-- Info grid with Map -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <!-- Left Column: Contact Info -->
            <div class="space-y-6">
              <!-- Address -->
              <div class="flex gap-3">
                <UIcon name="i-heroicons-map-pin" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ t.restaurant.address }}</h3>
                  <p class="text-gray-700">{{ restaurant.address }}</p>
                  <p class="text-gray-600">{{ restaurant.city }}</p>
                  <UButton
                    v-if="restaurant.google_maps_url"
                    :to="restaurant.google_maps_url"
                    target="_blank"
                    color="primary"
                    variant="link"
                    icon="i-heroicons-arrow-top-right-on-square"
                    trailing
                    class="mt-1"
                  >
                    {{ t.restaurant.viewOnMaps }}
                  </UButton>
                </div>
              </div>

              <!-- Phone -->
              <div v-if="restaurant.phone" class="flex gap-3">
                <UIcon name="i-heroicons-phone" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ t.restaurant.phone }}</h3>
                  <a :href="`tel:${restaurant.phone}`" class="text-primary hover:underline">
                    {{ restaurant.phone }}
                  </a>
                </div>
              </div>

              <!-- Website -->
              <div v-if="restaurant.website" class="flex gap-3">
                <UIcon name="i-heroicons-globe-alt" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ t.restaurant.website }}</h3>
                  <UButton
                    :to="restaurant.website"
                    target="_blank"
                    color="primary"
                    variant="link"
                    icon="i-heroicons-arrow-top-right-on-square"
                    trailing
                  >
                    {{ t.restaurant.visitWebsite }}
                  </UButton>
                </div>
              </div>

              <!-- Price Level -->
              <div v-if="restaurant.price_level !== null && restaurant.price_level !== undefined" class="flex gap-3">
                <UIcon name="i-heroicons-currency-euro" class="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 class="font-semibold text-gray-900 mb-1">{{ t.restaurant.priceRange }}</h3>
                  <p class="text-2xl text-gray-700">
                    {{ getPriceLevel(restaurant.price_level) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Right Column: Google Maps -->
            <div class="h-[280px] rounded-xl overflow-hidden shadow-lg border border-gray-200">
              <iframe
                v-if="restaurant.address"
                :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(restaurant.address + ', ' + restaurant.city)}`"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <!-- Opening Hours -->
          <div v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0" class="mb-8">
            <div class="flex items-center gap-3 mb-3">
              <h2 class="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <UIcon name="i-heroicons-clock" class="w-6 h-6 text-primary" />
                {{ t.restaurant.openingHours }}
              </h2>
              <span
                :class="[
                  'px-3 py-1 text-sm font-semibold rounded-full',
                  isOpenNow(restaurant.opening_hours)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                ]"
              >
                {{ isOpenNow(restaurant.opening_hours) ? t.restaurant.open : t.restaurant.closed }}
              </span>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <ul class="space-y-2">
                <li
                  v-for="(hours, index) in restaurant.opening_hours"
                  :key="index"
                  class="text-gray-700"
                >
                  {{ formatHoursLocalized(hours) }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Reviews -->
          <div v-if="localizedReviews.length > 0" class="mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UIcon name="i-heroicons-chat-bubble-left-right" class="w-6 h-6 text-primary" />
              {{ t.restaurant.reviews }}
            </h2>
            <div class="space-y-4">
              <div
                v-for="(review, index) in localizedReviews"
                :key="index"
                class="bg-gray-50 rounded-lg p-4"
              >
                <div class="flex items-start justify-between mb-2">
                  <div>
                    <p class="font-semibold text-gray-900">{{ review.author }}</p>
                    <p class="text-sm text-gray-500">{{ review.date }}</p>
                  </div>
                  <div class="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                    <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-yellow-400" />
                    <span class="font-semibold text-gray-900">{{ review.rating }}</span>
                  </div>
                </div>
                <p class="text-gray-700 leading-relaxed">{{ review.text }}</p>
              </div>
            </div>
          </div>

          <!-- Additional images -->
          <div v-if="restaurant.images && restaurant.images.length > 1" class="mb-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-3">{{ t.restaurant.photos }}</h2>
            <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
              <img
                v-for="(image, index) in restaurant.images.slice(1)"
                :key="index"
                :src="image"
                :alt="`${restaurant.name} - Photo ${Number(index) + 2}`"
                class="w-full h-48 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                @click="openCarousel(Number(index) + 1)"
              />
            </div>
          </div>

          <!-- Meta info -->
          <div class="border-t pt-6 mt-6">
            <div class="flex items-center gap-2 text-sm text-gray-500">
              <UIcon name="i-heroicons-information-circle" class="w-4 h-4" />
              <span>{{ t.restaurant.source }} : {{ restaurant.source }}</span>
              <span>•</span>
              <span>{{ t.restaurant.lastUpdate }} : {{ formatDate(restaurant.last_update) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Carousel Modal -->
    <Teleport to="body">
      <div
        v-if="isCarouselOpen"
        class="fixed inset-0 z-[10000] bg-black/90 flex items-center justify-center"
        @click="closeCarousel"
      >
        <button
          class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          @click="closeCarousel"
        >
          <UIcon name="i-heroicons-x-mark" class="w-8 h-8" />
        </button>

        <button
          v-if="restaurant?.images && restaurant.images.length > 1"
          class="absolute left-4 text-white hover:text-gray-300 transition-colors"
          @click.stop="previousImage"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-12 h-12" />
        </button>

        <div class="max-w-7xl max-h-[90vh] px-16" @click.stop>
          <img
            v-if="restaurant?.images"
            :src="restaurant.images[currentImageIndex]"
            :alt="`${restaurant.name} - Photo ${currentImageIndex + 1}`"
            class="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
          <div class="text-center text-white mt-4">
            {{ currentImageIndex + 1 }} / {{ restaurant?.images?.length || 0 }}
          </div>
        </div>

        <button
          v-if="restaurant?.images && restaurant.images.length > 1"
          class="absolute right-4 text-white hover:text-gray-300 transition-colors"
          @click.stop="nextImage"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-12 h-12" />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { getOne } = useRestaurants()
const { t } = useTranslations()
const { locale } = useLocale()
const { translateRestaurant } = useTranslate()

// Carousel state
const isCarouselOpen = ref(false)
const currentImageIndex = ref(0)

const openCarousel = (index: number) => {
  currentImageIndex.value = index
  isCarouselOpen.value = true
}

const closeCarousel = () => {
  isCarouselOpen.value = false
}

const nextImage = () => {
  if (translatedRestaurant.value?.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % translatedRestaurant.value.images.length
  }
}

const previousImage = () => {
  if (translatedRestaurant.value?.images) {
    currentImageIndex.value = (currentImageIndex.value - 1 + translatedRestaurant.value.images.length) % translatedRestaurant.value.images.length
  }
}

// Keyboard navigation
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!isCarouselOpen.value) return
    if (e.key === 'Escape') closeCarousel()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') previousImage()
  }
  window.addEventListener('keydown', handleKeyPress)
  onUnmounted(() => window.removeEventListener('keydown', handleKeyPress))
})

const { data: restaurant, pending, error } = await useAsyncData(
  `restaurant-${route.params.id}`,
  () => getOne(route.params.id as string)
)

// Restaurant traduit automatiquement selon la langue
const translatedRestaurant = ref<any>(null)
const isTranslating = ref(false)

// Fonction pour effectuer la traduction
const performTranslation = async () => {
  if (!restaurant.value) return

  const currentLocale = locale.value
  console.log('Starting translation for locale:', currentLocale)
  isTranslating.value = true

  try {
    // Traduire selon la langue:
    // - Description: FR -> EN/ES
    // - Avis: EN -> FR/ES
    const result = await translateRestaurant(restaurant.value, currentLocale)
    translatedRestaurant.value = result
    console.log('Translation complete, reviews:', translatedRestaurant.value?.reviews?.length)
  } catch (error) {
    console.error('Translation failed:', error)
    translatedRestaurant.value = { ...restaurant.value }
  } finally {
    isTranslating.value = false
  }
}

// Traduire quand la langue change
watch(locale, async (newLocale: string, oldLocale: string) => {
  console.log('Locale changed from', oldLocale, 'to', newLocale)
  await performTranslation()
}, { immediate: false })

// Traduire quand le restaurant est chargé
watch(restaurant, async (newRestaurant) => {
  if (newRestaurant) {
    console.log('Restaurant loaded, performing initial translation')
    await performTranslation()
  }
}, { immediate: true })

const localizedReviews = computed(() => {
  const reviews = translatedRestaurant.value?.reviews || []
  console.log('localizedReviews computed:', reviews.length, 'reviews')
  return reviews
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getPriceLevel = (level: number): string => {
  const prices = ['€', '€€', '€€€', '€€€€']
  return prices[level] || '€'
}

// Fonction pour vérifier si le restaurant est ouvert maintenant
const isOpenNow = (openingHours: string[]): boolean => {
  if (!openingHours || openingHours.length === 0) return false

  const now = new Date()
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const currentDay = dayNames[now.getDay()]
  const currentTime = now.getHours() * 60 + now.getMinutes()

  // Trouver les horaires du jour actuel
  const todayHours = openingHours.find(h => h.startsWith(currentDay))
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

      // Si closeTime < openTime, le restaurant ferme après minuit
      if (closeTime <= openTime) {
        // Ouvert si on est après l'heure d'ouverture OU avant l'heure de fermeture (le lendemain matin)
        if (currentTime >= openTime || currentTime < closeTime) {
          return true
        }
      } else {
        // Cas normal: ferme avant minuit
        if (currentTime >= openTime && currentTime < closeTime) {
          return true
        }
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

      // Si closeTime < openTime, le restaurant ferme après minuit
      if (closeTime <= openTime) {
        // Ouvert si on est après l'heure d'ouverture OU avant l'heure de fermeture (le lendemain matin)
        if (currentTime >= openTime || currentTime < closeTime) {
          return true
        }
      } else {
        // Cas normal: ferme avant minuit
        if (currentTime >= openTime && currentTime < closeTime) {
          return true
        }
      }
    }
  }

  return false
}

// Fonction pour formater les horaires en français
const formatHoursLocalized = (hours: string): string => {
  if (!hours) return ''

  const dayTranslations: Record<string, Record<string, string>> = {
    en: {
      Monday: 'Monday',
      Tuesday: 'Tuesday',
      Wednesday: 'Wednesday',
      Thursday: 'Thursday',
      Friday: 'Friday',
      Saturday: 'Saturday',
      Sunday: 'Sunday'
    },
    fr: {
      Monday: 'Lundi',
      Tuesday: 'Mardi',
      Wednesday: 'Mercredi',
      Thursday: 'Jeudi',
      Friday: 'Vendredi',
      Saturday: 'Samedi',
      Sunday: 'Dimanche'
    },
    es: {
      Monday: 'Lunes',
      Tuesday: 'Martes',
      Wednesday: 'Miércoles',
      Thursday: 'Jueves',
      Friday: 'Viernes',
      Saturday: 'Sábado',
      Sunday: 'Domingo'
    }
  }

  const targetLocale = locale.value
  const targetDayMap = dayTranslations[targetLocale] || dayTranslations.fr
  const closedWord = targetLocale === 'es' ? 'Cerrado' : targetLocale === 'en' ? 'Closed' : 'Ferm?'

  const [rawDay, ...timeParts] = hours.split(':')
  const dayKey = rawDay.trim()
  const dayTranslated = targetDayMap[dayKey] || dayKey
  const timeString = timeParts.join(':').trim()

  if (/(Closed|Ferm?|Cerrado)/i.test(timeString)) {
    return `${dayTranslated}: ${closedWord}`
  }

  if (targetLocale === 'en') {
    return `${dayTranslated}: ${timeString}`
  }

  const timeRanges = timeString.split(',').map(range => range.trim())

  const convertRange = (range: string): string => {
    const periodMatch = range.match(/(AM|PM)/gi)
    const rangePeriod = periodMatch && periodMatch.length === 1 ? periodMatch[0].toUpperCase() : null
    const times = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)
    if (!times) return range

    let result = range

    times.forEach((timeStr) => {
      const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)
      if (!match) return

      let hoursVal = parseInt(match[1])
      const minutes = match[2]
      let period = match[3]?.toUpperCase()

      if (!period && rangePeriod) {
        period = rangePeriod
      }

      if (period === 'PM' && hoursVal !== 12) hoursVal += 12
      if (period === 'AM' && hoursVal === 12) hoursVal = 0

      const converted = `${hoursVal}h${minutes}`
      result = result.replace(timeStr, converted)
    })

    result = result.replace(/\s*(AM|PM)/gi, '')

    return result
  }

  const convertedRanges = timeRanges.map(range => convertRange(range))

  return `${dayTranslated}: ${convertedRanges.join(', ')}`
}

</script>
