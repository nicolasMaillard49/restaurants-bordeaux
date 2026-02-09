<template>
  <div class="min-h-screen bg-[#FAF9F6]">
    <!-- Loading state -->
    <div v-if="pending" class="flex justify-center items-center min-h-screen bg-[#FAF9F6]">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-4 border-bordeaux-700/20 border-t-bordeaux-700 rounded-full animate-spin"></div>
        <span class="text-bordeaux-700/60 font-medium">{{ t.search.loading }}</span>
      </div>
    </div>

    <!-- Error state -->
    <div v-else-if="error || !restaurant" class="min-h-screen flex items-center justify-center bg-[#FAF9F6] px-4">
      <div class="text-center max-w-md">
        <div class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 rounded-full bg-bordeaux-700/10 flex items-center justify-center">
          <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 sm:w-12 sm:h-12 text-bordeaux-700" />
        </div>
        <h1 class="text-xl sm:text-2xl font-serif text-[#1A1A1A] mb-2">{{ t.ui.notFoundTitle }}</h1>
        <p class="text-[#666] mb-8 text-sm sm:text-base">{{ t.ui.notFoundDescription }}</p>
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-bordeaux-700 text-white rounded-full font-medium hover:bg-bordeaux-800 transition-colors cursor-pointer min-h-[44px]"
        >
          <UIcon name="i-heroicons-arrow-left" class="w-5 h-5" />
          {{ t.restaurant.backToList }}
        </NuxtLink>
      </div>
    </div>

    <!-- Restaurant detail -->
    <div v-else>
      <!-- Immersive Hero -->
      <section class="relative h-[60vh] sm:h-[75vh] lg:h-[85vh] min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] overflow-hidden">
        <!-- Background Image -->
        <div class="absolute inset-0">
          <div
            v-if="restaurant.images && restaurant.images.length > 1"
            class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 cursor-pointer transition-transform duration-700 hover:scale-110"
            :style="{ backgroundImage: `url(${restaurant.images[1]})` }"
            @click="openCarousel(1)"
          ></div>
          <div
            v-else-if="restaurant.images && restaurant.images.length === 1"
            class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 cursor-pointer transition-transform duration-700 hover:scale-110"
            :style="{ backgroundImage: `url(${restaurant.images[0]})` }"
            @click="openCarousel(0)"
          ></div>
          <div v-else class="absolute inset-0 bg-gradient-to-br from-bordeaux-700 to-[#1A1A1A]"></div>
        </div>

        <!-- Gradient Overlays -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>

        <!-- Floating Navigation -->
        <nav class="absolute top-0 left-0 right-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
            <div class="flex items-center justify-between">
              <NuxtLink
                to="/#restaurants"
                class="group flex items-center gap-2 sm:gap-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl rounded-full text-white border border-white/20 hover:bg-white/20 transition-all duration-300 cursor-pointer min-h-[44px]"
              >
                <UIcon name="i-heroicons-arrow-left" class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
                <span class="font-medium text-sm sm:text-base">{{ t.restaurant.backToList }}</span>
              </NuxtLink>
              <LanguageSelector />
            </div>
          </div>
        </nav>

        <!-- Hero Content -->
        <div class="absolute bottom-0 left-0 right-0 z-10 pb-20 sm:pb-32 lg:pb-40">
          <div class="max-w-7xl mx-auto px-4 sm:px-6">
            <!-- Categories & Cuisine Origin -->
            <div class="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-6">
              <span
                v-if="restaurant?.cuisine_origin || isFeatured"
                class="px-3 sm:px-4 py-1 sm:py-1.5 bg-bordeaux-700 text-white rounded-full text-xs sm:text-sm font-semibold border border-bordeaux-700"
              >
                🌍 {{ isFeatured ? featuredData.cuisineOrigin : restaurant.cuisine_origin }}
              </span>
              <span
                v-for="type in translatedRestaurant?.types?.slice(0, 3)"
                :key="type"
                class="px-3 sm:px-4 py-1 sm:py-1.5 bg-white/10 backdrop-blur-md text-white/90 rounded-full text-xs sm:text-sm font-medium border border-white/10"
              >
                {{ translateType(type) }}
              </span>
            </div>

            <h1 class="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-3 sm:mb-6 leading-tight">
              {{ restaurant.name }}
            </h1>

            <!-- Meta Row -->
            <div class="flex flex-wrap items-center gap-3 sm:gap-6 text-white/90 text-sm sm:text-base">
              <!-- Rating -->
              <div v-if="restaurant.rating" class="flex items-center gap-2 sm:gap-3">
                <div class="flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-bordeaux-700 rounded-full">
                  <UIcon name="i-heroicons-star-solid" class="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400" />
                  <span class="font-bold text-base sm:text-lg">{{ restaurant.rating.toFixed(1) }}</span>
                </div>
                <div v-if="restaurant.rating_count" class="hidden sm:block px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                  <span class="text-white font-medium text-sm">{{ restaurant.rating_count }} {{ t.stats.reviews.toLowerCase() }}</span>
                </div>
              </div>

              <!-- Location -->
              <div class="flex items-center gap-1.5 sm:gap-2">
                <UIcon name="i-heroicons-map-pin" class="w-4 h-4 sm:w-5 sm:h-5 text-white/70" />
                <span class="line-clamp-1">{{ restaurant.city }}</span>
              </div>

              <!-- Price Level -->
              <div v-if="restaurant.price_level !== null && restaurant.price_level !== undefined" class="flex items-center gap-2">
                <span class="text-lg sm:text-xl font-medium text-gold">{{ getPriceLevel(restaurant.price_level) }}</span>
              </div>

              <!-- Open Status -->
              <div v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0" class="flex items-center gap-2">
                <span
                  :class="[
                    'px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-semibold',
                    isRestaurantOpenNow(restaurant)
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  ]"
                >
                  {{ isRestaurantOpenNow(restaurant) ? t.restaurant.open : t.restaurant.closed }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Curved Transition -->
        <div class="absolute bottom-0 left-0 right-0 h-12 sm:h-24 bg-[#FAF9F6] rounded-t-[2rem] sm:rounded-t-[3rem]"></div>
      </section>

      <!-- Main Content -->
      <main class="relative bg-[#FAF9F6]">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-0 pb-8">
          <!-- Floating Action Cards -->
          <div class="mb-8 sm:mb-12 -mt-4 sm:-mt-8 relative z-20 space-y-3">
            <!-- Row 1: Call, Website, Maps -->
            <div class="relative">
              <div class="flex gap-3 sm:gap-4 overflow-x-auto p-1 pb-3 scrollbar-hide">
                <ActionCard
                  v-if="restaurant.phone"
                  :href="`tel:${restaurant.phone}`"
                  icon="i-heroicons-phone"
                  :label="t.restaurant.phone"
                  :value="restaurant.phone"
                />
                <ActionCard
                  v-if="restaurant.website"
                  :href="restaurant.website"
                  icon="i-heroicons-globe-alt"
                  :label="t.restaurant.website"
                  :value="t.restaurant.visitWebsite"
                  target="_blank"
                />
                <ActionCard
                  v-if="restaurant.google_maps_url"
                  :href="restaurant.google_maps_url"
                  icon="i-heroicons-map-pin"
                  :label="t.restaurant.address"
                  :value="t.restaurant.viewOnMaps"
                  target="_blank"
                />
              </div>
              <!-- Scroll indicator (mobile only) -->
              <div class="sm:hidden absolute right-0 top-0 bottom-1 w-12 bg-gradient-to-l from-[#FAF9F6] to-transparent pointer-events-none rounded-r-2xl"></div>
              <div class="sm:hidden flex items-center justify-center mt-1 gap-1.5 text-[#999] scroll-hint-bounce">
                <UIcon name="i-heroicons-chevron-left" class="w-3 h-3" />
                <UIcon name="i-heroicons-arrows-right-left" class="w-3.5 h-3.5" />
                <UIcon name="i-heroicons-chevron-right" class="w-3 h-3" />
              </div>
            </div>

            <!-- Row 2: Menu (featured) + Reservation -->
            <div v-if="isFeatured || restaurant.reservation_url" class="flex gap-3 sm:gap-4 overflow-x-auto p-1 pb-3 scrollbar-hide">
              <ActionCard
                v-if="isFeatured"
                :href="featuredData.menuUrl"
                icon="i-heroicons-book-open"
                label="Menu"
                :value="t.restaurant.viewMenu"
                target="_blank"
                variant="gold"
              />
              <ActionCard
                v-if="restaurant.reservation_url"
                :href="restaurant.reservation_url"
                icon="i-heroicons-calendar"
                :label="t.restaurant.reservation"
                :value="t.restaurant.bookTable"
                target="_blank"
                variant="primary"
              />
            </div>
          </div>

          <!-- Formulas Section (featured only) -->
          <section v-if="isFeatured" class="mb-8 sm:mb-12">
            <h2 class="font-serif text-xl sm:text-2xl text-[#1A1A1A] mb-4 sm:mb-6">{{ t.restaurant.formulas }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div
                v-for="(formula, index) in featuredData.formulas"
                :key="index"
                class="bg-white rounded-2xl p-5 sm:p-6 shadow-lg shadow-black/5 border border-gold/30 flex items-center justify-between gap-4"
              >
                <p class="text-[#1A1A1A] font-medium text-sm sm:text-base">{{ formula.label[locale] || formula.label.fr }}</p>
                <span class="text-gold font-bold text-lg sm:text-xl whitespace-nowrap">{{ formula.price }}</span>
              </div>
            </div>
          </section>

          <!-- Two Column Layout -->
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <!-- Left Column -->
            <div class="lg:col-span-2 space-y-6 sm:space-y-8">
              <!-- Description Card -->
              <section class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg shadow-black/5">
                <h2 class="font-serif text-xl sm:text-2xl text-[#1A1A1A] mb-3 sm:mb-4">{{ t.restaurant.description }}</h2>
                <p class="text-[#555] leading-relaxed text-base sm:text-lg whitespace-pre-line">
                  {{ isFeatured ? (featuredData.description[locale] || featuredData.description.fr) : translatedRestaurant?.description }}
                </p>
              </section>

              <!-- Photo Gallery -->
              <section v-if="restaurant.images && restaurant.images.length > 1" class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg shadow-black/5">
                <h2 class="font-serif text-xl sm:text-2xl text-[#1A1A1A] mb-4 sm:mb-6">{{ t.restaurant.photos }}</h2>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div
                    v-for="(image, index) in restaurant.images.slice(0, 6)"
                    :key="index"
                    class="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer group"
                    @click="openCarousel(index)"
                  >
                    <img
                      :src="image"
                      :alt="`${restaurant.name} - Photo ${index + 1}`"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div
                      v-if="index === 5 && restaurant.images.length > 6"
                      class="absolute inset-0 bg-black/60 flex items-center justify-center"
                    >
                      <span class="text-white text-xl sm:text-2xl font-bold">+{{ restaurant.images.length - 6 }}</span>
                    </div>
                  </div>
                </div>
              </section>

              <!-- Reviews Section -->
              <section v-if="localizedReviews.length > 0" class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-lg shadow-black/5">
                <div class="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 class="font-serif text-xl sm:text-2xl text-[#1A1A1A]">{{ t.restaurant.reviews }}</h2>
                  <span class="text-[#666] text-xs sm:text-sm">{{ localizedReviews.length }} {{ t.stats.reviews.toLowerCase() }}</span>
                </div>
                <div class="space-y-5 sm:space-y-6">
                  <ReviewItem
                    v-for="(review, index) in localizedReviews.slice(0, showAllReviews ? undefined : 3)"
                    :key="index"
                    :review="review"
                  />
                </div>
                <button
                  v-if="localizedReviews.length > 3"
                  @click="showAllReviews = !showAllReviews"
                  class="mt-4 sm:mt-6 w-full py-3 text-bordeaux-700 font-medium hover:bg-bordeaux-700/5 rounded-xl transition-colors cursor-pointer min-h-[44px]"
                >
                  {{ showAllReviews ? 'Voir moins' : `Voir tous les ${localizedReviews.length} avis` }}
                </button>
              </section>
            </div>

            <!-- Right Column - Sidebar -->
            <aside class="space-y-4 sm:space-y-6">
              <!-- Cuisine Origin Card -->
              <div v-if="translatedRestaurant?.cuisine_origin || isFeatured" class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg shadow-black/5">
                <div class="flex items-center gap-3 mb-3 sm:mb-4">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bordeaux-700/10 flex items-center justify-center">
                    <UIcon name="i-heroicons-globe-americas" class="w-4 h-4 sm:w-5 sm:h-5 text-bordeaux-700" />
                  </div>
                  <h3 class="font-serif text-base sm:text-lg text-[#1A1A1A]">{{ t.restaurant.cuisineOrigin }}</h3>
                </div>
                <p class="text-[#555] leading-relaxed text-sm sm:text-base">{{ isFeatured ? featuredData.cuisineOrigin : translatedRestaurant.cuisine_origin }}</p>
              </div>

              <!-- Map Card -->
              <div class="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg shadow-black/5">
                <div class="h-[180px] sm:h-[200px]">
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
                <div class="p-4 sm:p-5">
                  <p class="text-[#1A1A1A] font-medium mb-1 text-sm sm:text-base">{{ restaurant.address }}</p>
                  <p class="text-[#666] text-xs sm:text-sm">{{ restaurant.city }}</p>
                </div>
              </div>

              <!-- Opening Hours Card -->
              <div v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0" class="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg shadow-black/5">
                <div class="flex items-center gap-3 mb-4 sm:mb-5">
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-bordeaux-700/10 flex items-center justify-center">
                    <UIcon name="i-heroicons-clock" class="w-4 h-4 sm:w-5 sm:h-5 text-bordeaux-700" />
                  </div>
                  <h3 class="font-serif text-base sm:text-lg text-[#1A1A1A]">{{ t.restaurant.openingHours }}</h3>
                </div>
                <OpeningHoursList :opening-hours="restaurant.opening_hours" />
              </div>

              <!-- Meta Info Card -->
              <div class="bg-[#F5F5F0] rounded-2xl sm:rounded-3xl p-5 sm:p-6">
                <div class="flex items-center gap-2 text-xs sm:text-sm text-[#999]">
                  <UIcon name="i-heroicons-information-circle" class="w-4 h-4 flex-shrink-0" />
                  <span>{{ t.restaurant.source }}: {{ restaurant.source }}</span>
                </div>
                <div class="flex items-center gap-2 text-xs sm:text-sm text-[#999] mt-2">
                  <UIcon name="i-heroicons-arrow-path" class="w-4 h-4 flex-shrink-0" />
                  <span>{{ formatDate(restaurant.last_update) }}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <!-- Footer Spacer -->
      <div class="h-12 sm:h-20 bg-[#FAF9F6]"></div>
    </div>

    <!-- Fullscreen Image Carousel -->
    <ImageCarousel
      v-if="restaurant?.images"
      v-model="isCarouselOpen"
      :images="restaurant.images"
      :initial-index="carouselInitialIndex"
    />
  </div>
</template>

<script setup lang="ts">
import { isRestaurantOpenNow } from '~/composables/useOpeningHours'
import { getPriceLevel } from '~/utils/format'

const route = useRoute()
const { getOne } = useRestaurants()
const { t, translateType } = useTranslations()
const { locale } = useLocale()
const { translateRestaurant } = useTranslate()

const FEATURED_NAME = 'Restaurant La Rencontre'
const isFeatured = computed(() => restaurant.value?.name?.trim() === FEATURED_NAME)

const featuredData = {
  description: {
    fr: `La Rencontre, c'est d'abord celle de deux chef(fe)s, Rosie Maillard et Francesco Vastola, qui marient leurs inspirations pour créer une cuisine franco-italienne unique. C'est la rencontre de produits soigneusement choisis, mêlés avec créativité et passion. Et, bien sûr, c'est aussi un lieu où chaque plat devient l'occasion d'une rencontre culinaire.`,
    en: `La Rencontre is first and foremost the meeting of two chefs, Rosie Maillard and Francesco Vastola, who blend their inspirations to create a unique Franco-Italian cuisine. It's the meeting of carefully selected products, mixed with creativity and passion. And, of course, it's also a place where every dish becomes an opportunity for a culinary encounter.`,
    es: `La Rencontre es ante todo el encuentro de dos chefs, Rosie Maillard y Francesco Vastola, que combinan sus inspiraciones para crear una cocina franco-italiana única. Es el encuentro de productos cuidadosamente seleccionados, mezclados con creatividad y pasión. Y, por supuesto, también es un lugar donde cada plato se convierte en la ocasión de un encuentro culinario.`
  } as Record<string, string>,
  cuisineOrigin: 'Française Italienne',
  formulas: [
    { label: { fr: 'Entrée + Plat ou Plat + Dessert', en: 'Starter + Main or Main + Dessert', es: 'Entrada + Plato o Plato + Postre' } as Record<string, string>, price: '24€' },
    { label: { fr: 'Entrée + Plat + Dessert', en: 'Starter + Main + Dessert', es: 'Entrada + Plato + Postre' } as Record<string, string>, price: '29€' }
  ],
  menuUrl: 'https://restaurantlarencontre.com/menu/'
}

// Carousel state
const isCarouselOpen = ref(false)
const carouselInitialIndex = ref(0)
const showAllReviews = ref(false)

const openCarousel = (index: number) => {
  carouselInitialIndex.value = index
  isCarouselOpen.value = true
}

const { data: restaurant, pending, error } = await useAsyncData(
  `restaurant-${route.params.id}`,
  () => getOne(route.params.id as string)
)

// Restaurant traduit automatiquement selon la langue
const translatedRestaurant = ref<any>(null)
const isTranslating = ref(false)

const performTranslation = async () => {
  if (!restaurant.value) return

  const currentLocale = locale.value
  isTranslating.value = true

  try {
    const result = await translateRestaurant(restaurant.value, currentLocale)
    translatedRestaurant.value = result
  } catch (err) {
    console.error('Translation failed:', err)
    translatedRestaurant.value = { ...restaurant.value }
  } finally {
    isTranslating.value = false
  }
}

watch(locale, async () => {
  await performTranslation()
}, { immediate: false })

watch(restaurant, async (newRestaurant) => {
  if (newRestaurant) {
    await performTranslation()
  }
}, { immediate: true })

// SEO
const seoTitle = computed(() => {
  if (!restaurant.value) return 'Restaurant - Bordeaux'
  return `${restaurant.value.name} - Restaurant Bordeaux`
})

const seoDescription = computed(() => {
  if (!restaurant.value) return 'Découvrez ce restaurant à Bordeaux'
  const desc = restaurant.value.description || ''
  return desc.length > 160 ? desc.substring(0, 157) + '...' : desc
})

const seoImage = computed(() => {
  if (!restaurant.value?.images?.length) return 'https://restaurants-bordeaux.com/favicon.png'
  return restaurant.value.images[1] || restaurant.value.images[0]
})

const seoUrl = computed(() => {
  return `https://restaurants-bordeaux.com/restaurants/${route.params.id}`
})

useHead({
  title: seoTitle,
  meta: [
    { name: 'description', content: seoDescription },
    { property: 'og:title', content: seoTitle },
    { property: 'og:description', content: seoDescription },
    { property: 'og:image', content: seoImage },
    { property: 'og:url', content: seoUrl },
    { property: 'og:type', content: 'restaurant' },
    { property: 'og:site_name', content: 'Restaurants Bordeaux' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: seoTitle },
    { name: 'twitter:description', content: seoDescription },
    { name: 'twitter:image', content: seoImage },
  ],
  link: [
    { rel: 'canonical', href: seoUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => {
        if (!restaurant.value) return '{}'
        const r = restaurant.value
        const schema: any = {
          '@context': 'https://schema.org',
          '@type': 'Restaurant',
          name: r.name,
          description: r.description,
          url: seoUrl.value,
          image: r.images?.length ? r.images : undefined,
          address: {
            '@type': 'PostalAddress',
            streetAddress: r.address,
            addressLocality: r.city,
            addressCountry: 'FR'
          },
          telephone: r.phone || undefined,
          priceRange: r.price_level !== null && r.price_level !== undefined
            ? getPriceLevel(r.price_level)
            : undefined,
        }
        if (r.rating) {
          schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: r.rating,
            bestRating: 5,
            ratingCount: r.rating_count || r.reviews?.length || 1
          }
        }
        if (r.opening_hours?.length) {
          schema.openingHours = r.opening_hours
        }
        return JSON.stringify(schema)
      })
    }
  ]
})

const localizedReviews = computed(() => {
  return translatedRestaurant.value?.reviews || []
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : locale.value === 'es' ? 'es-ES' : 'fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #FAF9F6;
}

::-webkit-scrollbar-thumb {
  background: #722F37;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #5a252c;
}

@keyframes scrollHintBounce {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50% { transform: translateX(4px); opacity: 1; }
}

.scroll-hint-bounce {
  animation: scrollHintBounce 2s ease-in-out 3;
}

@media (prefers-reduced-motion: reduce) {
  .scroll-hint-bounce {
    animation: none;
  }
}
</style>
