<template>
  <article
    :class="[
      'group bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.98]',
      isFeatured ? 'ring-2 ring-gold' : ''
    ]"
    :style="{ animationDelay: `${animationDelay}ms` }"
    @click="navigateTo(`/restaurants/${restaurant.id}`)"
  >
    <!-- Image Container -->
    <div class="relative h-44 sm:h-52 overflow-hidden">
      <img
        v-if="restaurant.images && restaurant.images.length > 0"
        :src="restaurant.images.length > 1 ? restaurant.images[1] : restaurant.images[0]"
        :alt="restaurant.name"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-bordeaux-700/20 to-bordeaux-700/40 flex items-center justify-center">
        <UIcon name="i-heroicons-photo" class="w-12 h-12 text-bordeaux-700/40" />
      </div>

      <!-- Gradient Overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

      <!-- Top Badges -->
      <div class="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-start">
        <div class="flex flex-col gap-1.5">
          <!-- Featured Badge -->
          <div
            v-if="isFeatured"
            class="flex items-center gap-1.5 px-3 py-1.5 bg-gold rounded-full shadow-lg w-fit"
          >
            <UIcon name="i-heroicons-star-solid" class="w-3.5 h-3.5 text-white" />
            <span class="text-xs font-semibold text-white">{{ t.restaurant.teamChoice }}</span>
          </div>
          <!-- Open/Closed Badge -->
          <div
            v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0"
            :class="[
              'px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md w-fit',
              isOpen ? 'bg-emerald-500/90 text-white' : 'bg-red-500/90 text-white'
            ]"
          >
            {{ isOpen ? t.restaurant.open : t.restaurant.closed }}
          </div>
        </div>

        <!-- Rating Badge -->
        <div
          v-if="restaurant.rating"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg"
        >
          <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-gold" />
          <span class="font-bold text-[#1A1A1A] text-sm">{{ formatRating(restaurant.rating) }}</span>
        </div>
      </div>

      <!-- Bottom Info on Image -->
      <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
        <h3 class="font-serif text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 drop-shadow-lg">
          {{ restaurant.name?.trim() }}
        </h3>
        <div class="flex items-center gap-1.5 text-white/90 text-sm">
          <UIcon name="i-heroicons-map-pin-solid" class="w-4 h-4" />
          <span class="line-clamp-1">{{ restaurant.city }}</span>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="p-4 sm:p-5">
      <p class="text-[#666] text-sm line-clamp-2 mb-4 leading-relaxed">
        {{ restaurant.description }}
      </p>

      <!-- Footer -->
      <div class="flex items-center justify-between">
        <div v-if="restaurant.price_level !== null && restaurant.price_level !== undefined" class="text-gold font-medium">
          {{ getPriceLevel(restaurant.price_level) }}
        </div>
        <div v-else></div>

        <div class="flex items-center gap-2 text-bordeaux-700 font-medium text-sm group-hover:gap-3 transition-all">
          <span>{{ t.ui.viewMore }}</span>
          <UIcon name="i-heroicons-chevron-right" class="w-4 h-4" />
        </div>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Restaurant } from '~/composables/useRestaurants'
import { isRestaurantOpenNow } from '~/composables/useOpeningHours'
import { formatRating, getPriceLevel } from '~/utils/format'

const props = defineProps<{
  restaurant: Restaurant
  isFeatured?: boolean
  animationDelay?: number
}>()

const { t } = useTranslations()

const isOpen = computed(() => isRestaurantOpenNow(props.restaurant))
</script>
