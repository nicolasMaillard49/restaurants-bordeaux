<template>
  <div class="min-h-screen bg-[#FAF9F6]">
    <!-- Hero Section -->
    <section class="relative min-h-[100svh] flex flex-col overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/background.jpg')"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#722F37]/30 to-transparent"></div>
      </div>

      <!-- Floating Navigation -->
      <nav class="relative z-20 w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div class="flex items-center justify-between">
            <!-- Logo -->
            <div class="flex items-center gap-2 sm:gap-3">
              <img :src="'/favicon.png'" alt="Logo" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" />
              <span class="font-serif text-lg sm:text-xl text-white font-semibold">Bordeaux</span>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="relative z-10 flex-1 flex items-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div class="max-w-3xl">
            <!-- Location Badge -->
            <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full mb-4 sm:mb-8 border border-white/20">
              <svg class="w-4 h-4 text-[#C9A962]" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <span class="text-xs sm:text-sm font-medium text-white/90">Bordeaux, France</span>
            </div>

            <!-- Title -->
            <h1 class="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {{ t.hero.title }}
              <span class="block text-[#C9A962]">{{ t.hero.subtitle }}</span>
            </h1>

            <!-- Description -->
            <p class="text-base sm:text-xl text-white/80 max-w-2xl mb-6 sm:mb-10 leading-relaxed">
              {{ t.hero.description }}
            </p>

            <!-- Search Bar -->
            <div class="max-w-xl">
              <div
                class="relative cursor-pointer group"
                @click="scrollToSearch"
              >
                <div class="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 group-hover:bg-white/10 transition-colors"></div>
                <div class="relative flex items-center px-4 sm:px-6 py-3.5 sm:py-4">
                  <svg class="w-5 h-5 text-white/60 mr-3 sm:mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span class="text-sm sm:text-base text-white/60">{{ t.hero.searchPlaceholder }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="relative z-10 pb-4 sm:pb-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6">
          <div v-if="!pending && restaurants" class="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            <div class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-default">
              <div class="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{{ restaurants.length }}</div>
              <div class="text-white/60 text-xs sm:text-sm">{{ t.stats.restaurants }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-default">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-2xl sm:text-3xl font-bold text-white">{{ averageRating }}</span>
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-[#C9A962]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <div class="text-white/60 text-xs sm:text-sm">{{ t.stats.avgRating }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-default">
              <div class="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{{ topRatedCount }}</div>
              <div class="text-white/60 text-xs sm:text-sm">{{ t.stats.topRated }}</div>
            </div>
            <div class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-default">
              <div class="text-2xl sm:text-3xl font-bold text-[#C9A962] mb-0.5 sm:mb-1">100%</div>
              <div class="text-white/60 text-xs sm:text-sm">{{ t.stats.verified }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <div class="relative z-20 pb-8 sm:pb-16">
        <button
          @click="scrollToRestaurants"
          class="flex flex-col items-center gap-1.5 sm:gap-2 mx-auto cursor-pointer hover:opacity-80 transition-opacity min-h-[44px] min-w-[44px]"
        >
          <span class="text-xs sm:text-sm text-white/60 font-medium">{{ t.hero.discover }}</span>
          <div class="animate-bounce">
            <svg class="w-5 h-5 sm:w-6 sm:h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </button>
      </div>

      <!-- Curved Transition (inside hero, at bottom) -->
       <div class="absolute bottom-0 left-0 right-0 h-6 bg-[#FAF9F6] rounded-t-[3rem]"></div>
    </section>

    <!-- Main Content -->
    <main id="restaurants" class="relative bg-[#FAF9F6]">
      <div class="absolute top-0 left-0 right-0 h-8 bg-[#FAF9F6] rounded-b-[3rem] z-10"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-16">
        <!-- Section Header -->
        <div class="text-center mb-8 sm:mb-12">
          <h2 class="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#1A1A1A] mb-3 sm:mb-4">
            {{ t.restaurant.pageTitle }}
          </h2>
          <p class="text-[#666] text-sm sm:text-lg max-w-2xl mx-auto">
            {{ t.ui.footerTagline }}
          </p>
        </div>

        <!-- Search and Filters -->
        <div class="flex flex-col lg:flex-row gap-3 sm:gap-4 mb-6 sm:mb-10">
          <!-- Search Input -->
          <div class="flex-1 lg:max-w-lg">
            <div class="relative">
              <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#999]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                :placeholder="t.search.placeholder"
                class="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-xl bg-white border border-gray-200 text-[#1A1A1A] placeholder-[#999] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] transition-all text-base"
              />
            </div>
          </div>

          <!-- Filters -->
          <div class="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:overflow-visible scrollbar-hide">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="selectedFilter = filter.value"
              :class="[
                'px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap text-sm sm:text-base min-h-[44px]',
                selectedFilter === filter.value
                  ? 'bg-[#722F37] text-white shadow-lg shadow-[#722F37]/20'
                  : 'bg-white text-[#555] hover:bg-[#722F37]/5 border border-gray-200'
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex flex-col justify-center items-center py-24">
          <div class="w-12 h-12 border-4 border-[#722F37]/20 border-t-[#722F37] rounded-full animate-spin"></div>
          <p class="mt-4 text-[#666]">{{ t.ui.loadingRestaurants }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-24">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <svg class="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 class="font-serif text-2xl text-[#1A1A1A] mb-2">{{ t.ui.errorTitle }}</h3>
          <p class="text-[#666] mb-8">{{ t.ui.errorDescription }}</p>
          <button
            @click="refresh()"
            class="px-6 py-3 bg-[#722F37] text-white rounded-full font-medium hover:bg-[#5a252c] transition-colors cursor-pointer"
          >
            {{ t.ui.retry }}
          </button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredRestaurants || filteredRestaurants.length === 0" class="text-center py-24">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-[#722F37]/10 flex items-center justify-center">
            <svg class="w-10 h-10 text-[#722F37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 class="font-serif text-2xl text-[#1A1A1A] mb-2">{{ t.ui.emptyTitle }}</h3>
          <p class="text-[#666]">{{ t.ui.emptyDescription }}</p>
        </div>

        <!-- Restaurants Grid -->
        <div v-else>
          <!-- Results Header -->
          <div class="flex justify-between items-center gap-4 mb-6 sm:mb-8">
            <h3 class="text-[#1A1A1A]">
              <span class="text-xl sm:text-2xl font-semibold">{{ filteredRestaurants.length }}</span>
              <span class="text-[#666] ml-1.5 sm:ml-2 text-sm sm:text-base">{{ t.ui.restaurantsCount }}{{ filteredRestaurants.length > 1 ? 's' : '' }}</span>
            </h3>

            <div class="relative">
              <select
                v-model="sortBy"
                class="appearance-none pl-3 sm:pl-4 pr-9 sm:pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-[#555] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#722F37]/20 focus:border-[#722F37] text-sm sm:text-base min-h-[44px]"
              >
                <option value="rating">{{ t.sort.rating }}</option>
                <option value="name">{{ t.sort.name }}</option>
                <option value="recent">{{ t.sort.recent }}</option>
              </select>
              <svg class="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-[#999] pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <article
              v-for="(restaurant, index) in sortedRestaurants"
              :key="restaurant.id"
              :class="[
                'group bg-white rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer active:scale-[0.98]',
                isFeatured(restaurant) ? 'ring-2 ring-[#C9A962]' : ''
              ]"
              :style="{ animationDelay: `${index * 50}ms` }"
              @click="navigateTo(`/restaurants/${restaurant.id}`)"
            >
              <!-- Image Container -->
              <div class="relative h-44 sm:h-52 overflow-hidden">
                <img
                  v-if="restaurant.images && restaurant.images.length > 0"
                  :src="getRestaurantImage(restaurant.images)"
                  :alt="restaurant.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-gradient-to-br from-[#722F37]/20 to-[#722F37]/40 flex items-center justify-center">
                  <svg class="w-12 h-12 text-[#722F37]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                <!-- Gradient Overlay -->
                <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                <!-- Top Badges -->
                <div class="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 flex justify-between items-start">
                  <div class="flex flex-col gap-1.5">
                    <!-- Featured Badge -->
                    <div
                      v-if="isFeatured(restaurant)"
                      class="flex items-center gap-1.5 px-3 py-1.5 bg-[#C9A962] rounded-full shadow-lg w-fit"
                    >
                      <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span class="text-xs font-semibold text-white">{{ t.restaurant.teamChoice }}</span>
                    </div>
                    <!-- Open/Closed Badge -->
                    <div
                      v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0"
                      :class="[
                        'px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md w-fit',
                        isRestaurantOpenNow(restaurant)
                          ? 'bg-emerald-500/90 text-white'
                          : 'bg-red-500/90 text-white'
                      ]"
                    >
                      {{ isRestaurantOpenNow(restaurant) ? t.restaurant.open : t.restaurant.closed }}
                    </div>
                  </div>

                  <!-- Rating Badge -->
                  <div
                    v-if="restaurant.rating"
                    class="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-full shadow-lg"
                  >
                    <svg class="w-4 h-4 text-[#C9A962]" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span class="font-bold text-[#1A1A1A] text-sm">{{ formatRating(restaurant.rating) }}</span>
                  </div>
                </div>

                <!-- Bottom Info on Image -->
                <div class="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                  <h3 class="font-serif text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1 drop-shadow-lg">
                    {{ restaurant.name?.trim() }}
                  </h3>
                  <div class="flex items-center gap-1.5 text-white/90 text-sm">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
                    </svg>
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
                  <!-- Price Level -->
                  <div v-if="restaurant.price_level !== null && restaurant.price_level !== undefined" class="text-[#C9A962] font-medium">
                    {{ getPriceLevel(restaurant.price_level) }}
                  </div>
                  <div v-else></div>

                  <!-- View More -->
                  <div class="flex items-center gap-2 text-[#722F37] font-medium text-sm group-hover:gap-3 transition-all">
                    <span>{{ t.ui.viewMore }}</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="bg-[#1A1A1A] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          <!-- Brand -->
          <div>
            <div class="flex items-center gap-3 mb-4">
              <img :src="'/favicon.png'" alt="Logo" class="w-10 h-10 rounded-full object-cover" />
              <span class="font-serif text-xl font-semibold">{{ t.restaurant.pageTitle }}</span>
            </div>
            <p class="text-white/60 leading-relaxed">
              {{ t.ui.footerTagline }}
            </p>
          </div>

          <!-- Quick Stats -->
          <div>
            <h4 class="font-serif text-lg font-semibold mb-4 text-[#C9A962]">{{ t.stats.restaurants }}</h4>
            <ul class="space-y-3 text-white/60">
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#722F37]" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>{{ restaurants?.length || 0 }} {{ t.stats.restaurants.toLowerCase() }}</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-[#C9A962]" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{{ averageRating }} {{ t.stats.avgRating.toLowerCase() }}</span>
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <span>100% {{ t.stats.verified.toLowerCase() }}</span>
              </li>
            </ul>
          </div>

          <!-- Location -->
          <div>
            <h4 class="font-serif text-lg font-semibold mb-4 text-[#C9A962]">Bordeaux</h4>
            <div class="flex items-start gap-3 text-white/60">
              <svg class="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
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
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from '~/composables/useRestaurants'
import { isRestaurantOpenNow } from '~/composables/useOpeningHours'

const { getAll } = useRestaurants()
const { t } = useTranslations()

const FEATURED_NAME = 'Restaurant La Rencontre'
const isFeatured = (r: Restaurant) => r.name?.trim() === FEATURED_NAME

const searchInputRef = ref<HTMLInputElement | null>(null)

const { data: restaurants, pending, error, refresh } = await useAsyncData(
  'restaurants',
  () => getAll(),
  { lazy: true }
)

const searchQuery = ref('')
const selectedFilter = ref('all')
const sortBy = ref('rating')

const filters = computed(() => [
  { label: t.value.filters.all, value: 'all' },
  { label: t.value.filters.openNow, value: 'open' },
  { label: t.value.filters.topRated, value: 'top' },
])

function toRating(restaurant: Restaurant): number {
  return parseFloat(String(restaurant.rating)) || 0
}

const filteredRestaurants = computed(() => {
  if (!restaurants.value) return []

  let filtered = [...restaurants.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((r) =>
      r.name?.toLowerCase().includes(query) ||
      r.description?.toLowerCase().includes(query) ||
      r.address?.toLowerCase().includes(query)
    )
  }

  if (selectedFilter.value === 'open') {
    filtered = filtered.filter((r) => isRestaurantOpenNow(r))
  } else if (selectedFilter.value === 'top') {
    filtered = filtered.filter((r) => toRating(r) >= 4.5)
  }

  return filtered
})

const sortComparators: Record<string, (a: Restaurant, b: Restaurant) => number> = {
  rating: (a, b) => toRating(b) - toRating(a),
  name: (a, b) => (a.name || '').localeCompare(b.name || ''),
  recent: (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
}

const sortedRestaurants = computed(() => {
  const sorted = [...filteredRestaurants.value]
  const comparator = sortComparators[sortBy.value]
  if (comparator) {
    sorted.sort(comparator)
  }
  // Always place featured restaurant first
  const featuredIndex = sorted.findIndex(isFeatured)
  if (featuredIndex > 0) {
    const [featured] = sorted.splice(featuredIndex, 1)
    sorted.unshift(featured)
  }
  return sorted
})

const averageRating = computed(() => {
  if (!restaurants.value || restaurants.value.length === 0) return '0.0'
  const sum = restaurants.value.reduce((acc, r) => acc + toRating(r), 0)
  return (sum / restaurants.value.length).toFixed(1)
})

const topRatedCount = computed(() => {
  if (!restaurants.value) return 0
  return restaurants.value.filter((r) => toRating(r) >= 4.5).length
})

function formatRating(rating: string | number): string {
  const num = typeof rating === 'string' ? parseFloat(rating) : rating
  return num ? num.toFixed(1) : '0.0'
}

function getPriceLevel(level: number): string {
  const prices = ['€', '€€', '€€€', '€€€€']
  return prices[level] || '€'
}

function getRestaurantImage(images: string[]): string {
  return images.length > 1 ? images[1] : images[0]
}

function scrollToRestaurants(): void {
  document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToSearch(): void {
  scrollToRestaurants()
  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 500)
}

useHead({
  title: 'Restaurants Bordeaux - Les meilleurs restaurants de la ville',
  meta: [
    { name: 'description', content: 'Découvrez une sélection des meilleurs restaurants de Bordeaux. Notes, avis, et descriptions détaillées.' }
  ]
})
</script>

<style scoped>
/* Serif font for headings */
.font-serif {
  font-family: 'Playfair Display', Georgia, serif;
}

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

@media (prefers-reduced-motion: reduce) {
  article {
    animation: none;
  }
}

/* Hide scrollbar for horizontal filter scroll on mobile */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Custom scrollbar */
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
</style>
