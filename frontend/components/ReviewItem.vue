<template>
  <article class="pb-5 sm:pb-6 border-b border-gray-100 last:border-0 last:pb-0">
    <div class="flex items-start justify-between mb-2 sm:mb-3 gap-2">
      <div class="flex items-center gap-2 sm:gap-3 min-w-0">
        <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br flex-shrink-0 from-bordeaux-700 to-gold flex items-center justify-center text-white font-semibold text-sm sm:text-base">
          {{ review.author.charAt(0).toUpperCase() }}
        </div>
        <div class="min-w-0">
          <p class="font-semibold text-[#1A1A1A] text-sm sm:text-base truncate">{{ review.author }}</p>
          <p class="text-xs sm:text-sm text-[#999]">{{ review.date }}</p>
        </div>
      </div>
      <div class="flex items-center gap-1 px-2.5 sm:px-3 py-1 bg-[#FEF3C7] rounded-full flex-shrink-0">
        <UIcon name="i-heroicons-star-solid" class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
        <span class="font-semibold text-[#92400E] text-xs sm:text-sm">{{ review.rating }}</span>
      </div>
    </div>
    <p class="text-[#555] leading-relaxed text-sm sm:text-base sm:pl-13">{{ review.text }}</p>
  </article>
</template>

<script setup lang="ts">
import type { Review } from '~/composables/useRestaurants'

defineProps<{
  review: Review
}>()
</script>
