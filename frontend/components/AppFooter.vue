<template>
  <footer class="bg-[#1A1A1A] text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-3 mb-4">
            <img src="/favicon.png" alt="Logo" class="w-10 h-10 rounded-full object-cover" />
            <span class="font-serif text-xl font-semibold">{{ t.restaurant.pageTitle }}</span>
          </div>
          <p class="text-white/60 leading-relaxed">
            {{ t.ui.footerTagline }}
          </p>
        </div>

        <!-- Quick Stats -->
        <div>
          <h4 class="font-serif text-lg font-semibold mb-4 text-gold">{{ t.stats.restaurants }}</h4>
          <ul class="space-y-3 text-white/60">
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-check-circle-solid" class="w-4 h-4 text-bordeaux-700" />
              <span>{{ restaurantCount }} {{ t.stats.restaurants.toLowerCase() }}</span>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-star-solid" class="w-4 h-4 text-gold" />
              <span>{{ averageRating }} {{ t.stats.avgRating.toLowerCase() }}</span>
            </li>
            <li class="flex items-center gap-2">
              <UIcon name="i-heroicons-shield-check-solid" class="w-4 h-4 text-emerald-500" />
              <span>100% {{ t.stats.verified.toLowerCase() }}</span>
            </li>
          </ul>
        </div>

        <!-- Location -->
        <div>
          <h4 class="font-serif text-lg font-semibold mb-4 text-gold">Bordeaux</h4>
          <div class="flex items-start gap-3 text-white/60">
            <UIcon name="i-heroicons-map-pin-solid" class="w-5 h-5 mt-0.5 flex-shrink-0" />
            <span>Nouvelle-Aquitaine, France</span>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="border-t border-white/10 mt-12 pt-8 text-center text-white/40 text-sm">
        <p>{{ new Date().getFullYear() }} {{ t.restaurant.pageTitle }} - {{ t.ui.rights }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineProps<{
  restaurantCount: number
  averageRating: string
}>()

const { t } = useTranslations()
</script>
