<template>
  <div class="min-h-screen bg-[#FAF9F6]">
    <!-- Hero Section -->
    <section class="relative min-h-[100svh] flex flex-col overflow-hidden">
      <!-- Background Image -->
      <div class="absolute inset-0">
        <div class="absolute inset-0 bg-cover bg-center bg-no-repeat" style="background-image: url('/background.jpg')"></div>
        <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-bordeaux-700/30 to-transparent"></div>
      </div>

      <!-- Floating Navigation -->
      <nav class="relative z-20 w-full">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2 sm:gap-3">
              <img src="/favicon.png" alt="Logo" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover" />
              <span class="font-serif text-lg sm:text-xl text-white font-semibold">Bordeaux</span>
            </div>
            <div class="flex items-center gap-2 sm:gap-3">
              <nav class="hidden sm:flex items-center bg-white/10 backdrop-blur-md rounded-full border border-white/15 p-1">
                <button
                  @click="scrollToRestaurants"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-white/80 hover:text-[#C9A962] hover:bg-[#C9A962]/10 transition-all duration-200 cursor-pointer min-h-[36px]"
                >
                  <UIcon name="i-heroicons-building-storefront" class="w-4 h-4" />
                  <span>Restaurants</span>
                </button>
                <button
                  v-if="articles && articles.length > 0"
                  @click="scrollToArticles"
                  class="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm text-white/80 hover:text-[#C9A962] hover:bg-[#C9A962]/10 transition-all duration-200 cursor-pointer min-h-[36px]"
                >
                  <UIcon name="i-heroicons-newspaper" class="w-4 h-4" />
                  <span>{{ t.articles.title }}</span>
                </button>
              </nav>
              <!-- Mobile: icon-only buttons -->
              <button
                @click="scrollToRestaurants"
                class="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 hover:text-[#C9A962] hover:bg-[#C9A962]/10 hover:border-[#C9A962]/30 transition-all duration-200 cursor-pointer"
                aria-label="Restaurants"
              >
                <UIcon name="i-heroicons-building-storefront" class="w-4 h-4" />
              </button>
              <button
                v-if="articles && articles.length > 0"
                @click="scrollToArticles"
                class="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/80 hover:text-[#C9A962] hover:bg-[#C9A962]/10 hover:border-[#C9A962]/30 transition-all duration-200 cursor-pointer"
                aria-label="Articles"
              >
                <UIcon name="i-heroicons-newspaper" class="w-4 h-4" />
              </button>
              <LanguageSelector />
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Content -->
      <div class="relative z-10 flex-1 flex items-center">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 w-full">
          <div class="max-w-3xl">
            <!-- Location Badge -->
            <div class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full mb-4 sm:mb-8 border border-white/20">
              <UIcon name="i-heroicons-map-pin-solid" class="w-4 h-4 text-gold" />
              <span class="text-xs sm:text-sm font-medium text-white/90">Bordeaux, France</span>
            </div>

            <h1 class="font-serif text-3xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
              {{ t.hero.title }}
              <span class="block text-gold">{{ t.hero.subtitle }}</span>
            </h1>

            <p class="text-base sm:text-xl text-white/80 max-w-2xl mb-6 sm:mb-10 leading-relaxed">
              {{ t.hero.description }}
            </p>

            <!-- Search Bar -->
            <div class="max-w-xl">
              <div class="relative cursor-pointer group" @click="scrollToSearch">
                <div class="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/20 group-hover:bg-white/10 transition-colors"></div>
                <div class="relative flex items-center px-4 sm:px-6 py-3.5 sm:py-4">
                  <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-white/60 mr-3 sm:mr-4" />
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
            <div @click="scrollToRestaurants" class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer">
              <div class="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{{ restaurants.length }}</div>
              <div class="text-white/60 text-xs sm:text-sm">{{ t.stats.restaurants }}</div>
            </div>
            <div @click="scrollToRestaurants" class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer">
              <div class="flex items-center gap-1.5 sm:gap-2">
                <span class="text-2xl sm:text-3xl font-bold text-white">{{ averageRating }}</span>
                <UIcon name="i-heroicons-star-solid" class="w-4 h-4 sm:w-5 sm:h-5 text-gold" />
              </div>
              <div class="text-white/60 text-xs sm:text-sm">{{ t.stats.avgRating }}</div>
            </div>
            <div @click="scrollToRestaurants" class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer">
              <div class="text-2xl sm:text-3xl font-bold text-white mb-0.5 sm:mb-1">{{ topRatedCount }}</div>
              <div class="text-white/60 text-xs sm:text-sm">{{ t.stats.topRated }}</div>
            </div>
            <div @click="scrollToRestaurants" class="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer">
              <div class="text-2xl sm:text-3xl font-bold text-gold mb-0.5 sm:mb-1">100%</div>
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
            <UIcon name="i-heroicons-arrow-down" class="w-5 h-5 sm:w-6 sm:h-6 text-white/60" />
          </div>
        </button>
      </div>

      <!-- Curved Transition -->
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
          <div class="flex-1 lg:max-w-lg relative">
            <UIcon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              :placeholder="t.search.placeholder"
              type="text"
              class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-base text-[#1A1A1A] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-bordeaux-700/20 focus:border-bordeaux-700 transition-colors min-h-[44px]"
            />
          </div>

          <!-- Filters -->
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="filter in filters"
              :key="filter.value"
              @click="selectedFilter = filter.value"
              :class="[
                'px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap text-sm sm:text-base min-h-[44px]',
                selectedFilter === filter.value
                  ? 'bg-bordeaux-700 text-white shadow-lg shadow-bordeaux-700/20'
                  : 'bg-white text-[#555] hover:bg-bordeaux-700/5 border border-gray-200'
              ]"
            >
              {{ filter.label }}
            </button>

            <!-- Cuisine Origin Filter -->
            <div v-if="availableCuisineOrigins.length > 0" class="relative" ref="cuisineDropdownRef">
              <button
                @click="cuisineDropdownOpen = !cuisineDropdownOpen"
                :class="[
                  'flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap text-sm sm:text-base min-h-[44px]',
                  selectedCuisineOrigin
                    ? 'bg-bordeaux-700 text-white shadow-lg shadow-bordeaux-700/20'
                    : 'bg-white text-[#555] hover:bg-bordeaux-700/5 border border-gray-200'
                ]"
              >
                <span>{{ selectedCuisineOrigin || t.filters.allCuisines }}</span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  :class="['w-4 h-4 transition-transform duration-200', cuisineDropdownOpen ? 'rotate-180' : '', selectedCuisineOrigin ? 'text-white/70' : 'text-[#999]']"
                />
              </button>
              <Transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="cuisineDropdownOpen"
                  class="fixed sm:absolute top-auto sm:top-full left-4 right-4 sm:left-0 sm:right-auto mt-2 sm:w-56 max-h-64 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-xl shadow-black/10 z-50"
                >
                  <button
                    @click="selectedCuisineOrigin = ''; cuisineDropdownOpen = false"
                    :class="[
                      'w-full text-left px-4 py-3 sm:py-2.5 text-sm transition-colors duration-150 cursor-pointer',
                      !selectedCuisineOrigin ? 'bg-bordeaux-700/10 text-bordeaux-700 font-medium' : 'text-[#555] hover:bg-gray-50'
                    ]"
                  >
                    {{ t.filters.allCuisines }}
                  </button>
                  <button
                    v-for="origin in availableCuisineOrigins"
                    :key="origin"
                    @click="selectedCuisineOrigin = origin; cuisineDropdownOpen = false"
                    :class="[
                      'w-full text-left px-4 py-3 sm:py-2.5 text-sm transition-colors duration-150 cursor-pointer',
                      selectedCuisineOrigin === origin ? 'bg-bordeaux-700/10 text-bordeaux-700 font-medium' : 'text-[#555] hover:bg-gray-50'
                    ]"
                  >
                    {{ origin }}
                  </button>
                </div>
              </Transition>
            </div>

            <!-- Type Filter -->
            <div v-if="availableTypes.length > 0" class="relative" ref="typeDropdownRef">
              <button
                @click="typeDropdownOpen = !typeDropdownOpen"
                :class="[
                  'flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer whitespace-nowrap text-sm sm:text-base min-h-[44px]',
                  selectedType
                    ? 'bg-bordeaux-700 text-white shadow-lg shadow-bordeaux-700/20'
                    : 'bg-white text-[#555] hover:bg-bordeaux-700/5 border border-gray-200'
                ]"
              >
                <span>{{ selectedType ? translateType(selectedType) : t.filters.allTypes }}</span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  :class="['w-4 h-4 transition-transform duration-200', typeDropdownOpen ? 'rotate-180' : '', selectedType ? 'text-white/70' : 'text-[#999]']"
                />
              </button>
              <Transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="typeDropdownOpen"
                  class="fixed sm:absolute top-auto sm:top-full left-4 right-4 sm:left-0 sm:right-auto mt-2 sm:w-56 max-h-64 overflow-y-auto bg-white rounded-xl border border-gray-200 shadow-xl shadow-black/10 z-50"
                >
                  <button
                    @click="selectedType = ''; typeDropdownOpen = false"
                    :class="[
                      'w-full text-left px-4 py-3 sm:py-2.5 text-sm transition-colors duration-150 cursor-pointer',
                      !selectedType ? 'bg-bordeaux-700/10 text-bordeaux-700 font-medium' : 'text-[#555] hover:bg-gray-50'
                    ]"
                  >
                    {{ t.filters.allTypes }}
                  </button>
                  <button
                    v-for="type in availableTypes"
                    :key="type"
                    @click="selectedType = type; typeDropdownOpen = false"
                    :class="[
                      'w-full text-left px-4 py-3 sm:py-2.5 text-sm transition-colors duration-150 cursor-pointer',
                      selectedType === type ? 'bg-bordeaux-700/10 text-bordeaux-700 font-medium' : 'text-[#555] hover:bg-gray-50'
                    ]"
                  >
                    {{ translateType(type) }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="flex flex-col justify-center items-center py-24">
          <div class="w-12 h-12 border-4 border-bordeaux-700/20 border-t-bordeaux-700 rounded-full animate-spin"></div>
          <p class="mt-4 text-[#666]">{{ t.ui.loadingRestaurants }}</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="text-center py-24">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-50 flex items-center justify-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="w-10 h-10 text-red-500" />
          </div>
          <h3 class="font-serif text-2xl text-[#1A1A1A] mb-2">{{ t.ui.errorTitle }}</h3>
          <p class="text-[#666] mb-8">{{ t.ui.errorDescription }}</p>
          <UButton color="bordeaux" size="lg" @click="refresh()" class="rounded-full">
            {{ t.ui.retry }}
          </UButton>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredRestaurants || filteredRestaurants.length === 0" class="text-center py-24">
          <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-bordeaux-700/10 flex items-center justify-center">
            <UIcon name="i-heroicons-magnifying-glass" class="w-10 h-10 text-bordeaux-700" />
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

            <div class="relative" ref="sortDropdownRef">
              <button
                @click="sortDropdownOpen = !sortDropdownOpen"
                class="flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-white border border-gray-200 rounded-xl font-medium text-[#555] cursor-pointer transition-all duration-200 hover:bg-bordeaux-700/5 text-sm sm:text-base min-h-[44px] whitespace-nowrap"
              >
                <UIcon name="i-heroicons-arrows-up-down" class="w-4 h-4 text-[#999]" />
                <span>{{ sortOptions.find(o => o.value === sortBy)?.label }}</span>
                <UIcon
                  name="i-heroicons-chevron-down"
                  :class="['w-4 h-4 text-[#999] transition-transform duration-200', sortDropdownOpen ? 'rotate-180' : '']"
                />
              </button>
              <Transition
                enter-active-class="transition ease-out duration-150"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition ease-in duration-100"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >
                <div
                  v-if="sortDropdownOpen"
                  class="fixed sm:absolute top-auto sm:top-full left-4 right-4 sm:left-auto sm:right-0 mt-2 sm:w-48 bg-white rounded-xl border border-gray-200 shadow-xl shadow-black/10 z-50"
                >
                  <button
                    v-for="option in sortOptions"
                    :key="option.value"
                    @click="sortBy = option.value; sortDropdownOpen = false"
                    :class="[
                      'w-full text-left px-4 py-3 sm:py-2.5 text-sm transition-colors duration-150 cursor-pointer',
                      sortBy === option.value ? 'bg-bordeaux-700/10 text-bordeaux-700 font-medium' : 'text-[#555] hover:bg-gray-50'
                    ]"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </Transition>
            </div>
          </div>

          <!-- Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <RestaurantCard
              v-for="(restaurant, index) in sortedRestaurants"
              :key="restaurant.id"
              :restaurant="restaurant"
              :is-featured="isFeatured(restaurant)"
              :animation-delay="index * 50"
            />
          </div>
        </div>
      </div>
    </main>

    <!-- Articles Section -->
    <section id="articles" v-if="articles && articles.length > 0" class="relative bg-[#1A1A1A] py-16 sm:py-24 overflow-hidden">
      <!-- Decorative background -->
      <div class="absolute inset-0 opacity-[0.03]" style="background-image: url('data:image/svg+xml,<svg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;><g fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;><g fill=&quot;%23ffffff&quot;><path d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/></g></g></svg>')"></div>
      <div class="absolute top-0 left-0 w-72 h-72 bg-bordeaux-700/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#C9A962]/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6">
        <!-- Section Header -->
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-[#C9A962]/10 rounded-full mb-4 border border-[#C9A962]/20">
              <UIcon name="i-heroicons-newspaper" class="w-3.5 h-3.5 text-[#C9A962]" />
              <span class="text-xs font-medium text-[#C9A962] uppercase tracking-wider">Blog</span>
            </div>
            <h2 class="font-serif text-2xl sm:text-4xl lg:text-5xl text-white mb-2 sm:mb-3">
              {{ t.articles.title }}
            </h2>
            <p class="text-white/50 text-sm sm:text-lg max-w-xl">
              {{ t.articles.subtitle }}
            </p>
          </div>
          <div class="hidden sm:flex items-center gap-2">
            <button
              @click="scrollArticles('left')"
              class="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <UIcon name="i-heroicons-chevron-left" class="w-5 h-5" />
            </button>
            <button
              @click="scrollArticles('right')"
              class="w-11 h-11 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
            >
              <UIcon name="i-heroicons-chevron-right" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Featured Article (first one, desktop only) -->
        <a
          v-if="articles[0]"
          :href="articles[0].url"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden lg:grid grid-cols-2 gap-0 mb-10 group cursor-pointer rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-[#C9A962]/30 transition-all duration-500"
        >
          <div class="relative h-72 lg:h-80 overflow-hidden">
            <img
              v-if="articles[0].image"
              :src="articles[0].image"
              :alt="articles[0].title"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div v-else class="w-full h-full bg-gradient-to-br from-bordeaux-700/30 to-[#C9A962]/20 flex items-center justify-center">
              <UIcon name="i-heroicons-newspaper" class="w-16 h-16 text-white/20" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-r from-transparent to-[#1A1A1A]/30"></div>
          </div>
          <div class="flex flex-col justify-center p-8 lg:p-10">
            <div class="inline-flex items-center gap-2 mb-4">
              <span class="px-3 py-1 bg-bordeaux-700/80 text-white text-xs font-medium rounded-full capitalize">
                {{ articles[0].category }}
              </span>
              <span v-if="articles[0].published_date" class="text-xs text-white/40">
                {{ formatArticleDate(articles[0].published_date) }}
              </span>
            </div>
            <h3 class="font-serif text-2xl lg:text-3xl font-semibold text-white mb-3 line-clamp-3 group-hover:text-[#C9A962] transition-colors duration-300">
              {{ articles[0].title }}
            </h3>
            <p v-if="articles[0].excerpt" class="text-white/50 text-sm lg:text-base line-clamp-3 mb-6 leading-relaxed">
              {{ articles[0].excerpt }}
            </p>
            <div class="flex items-center gap-2 text-[#C9A962] text-sm font-medium">
              <span>{{ t.articles.readArticle }}</span>
              <UIcon name="i-heroicons-arrow-right" class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </a>

        <!-- Articles Carousel -->
        <div class="relative">
          <div
            ref="articlesScrollRef"
            class="flex gap-4 sm:gap-5 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide snap-x snap-mandatory scroll-smooth"
          >
            <ArticleCard
              v-for="article in articlesForCarousel"
              :key="article.id"
              :article="article"
            />
          </div>
          <!-- Mobile scroll hint -->
          <div class="sm:hidden flex items-center justify-center mt-4 gap-1.5 text-white/30">
            <UIcon name="i-heroicons-chevron-left" class="w-3.5 h-3.5" />
            <span class="text-xs">Swipe</span>
            <UIcon name="i-heroicons-chevron-right" class="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <AppFooter
      :restaurant-count="restaurants?.length || 0"
      :average-rating="averageRating"
    />
  </div>
</template>

<script setup lang="ts">
import type { Restaurant } from '~/composables/useRestaurants'
import { isRestaurantOpenNow } from '~/composables/useOpeningHours'

const { getAll } = useRestaurants()
const { getAll: getAllArticles } = useArticles()
const { t, translateType } = useTranslations()

const FEATURED_NAME = 'Restaurant La Rencontre'
const isFeatured = (r: Restaurant) => r.name?.trim() === FEATURED_NAME

const searchInputRef = ref<HTMLInputElement>()

const { data: restaurants, pending, error, refresh } = await useAsyncData(
  'restaurants',
  () => getAll(),
  { lazy: true }
)

const { data: articles } = await useAsyncData(
  'articles',
  () => getAllArticles(),
  { lazy: true }
)

const searchQuery = ref('')
const selectedFilter = ref('all')
const sortBy = ref('rating')
const selectedCuisineOrigin = ref('')
const selectedType = ref('')

// Dropdown open states
const cuisineDropdownOpen = ref(false)
const typeDropdownOpen = ref(false)
const sortDropdownOpen = ref(false)

// Dropdown refs for click-outside
const cuisineDropdownRef = ref<HTMLElement>()
const typeDropdownRef = ref<HTMLElement>()
const sortDropdownRef = ref<HTMLElement>()

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node
  if (cuisineDropdownRef.value && !cuisineDropdownRef.value.contains(target)) {
    cuisineDropdownOpen.value = false
  }
  if (typeDropdownRef.value && !typeDropdownRef.value.contains(target)) {
    typeDropdownOpen.value = false
  }
  if (sortDropdownRef.value && !sortDropdownRef.value.contains(target)) {
    sortDropdownOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const availableCuisineOrigins = computed(() =>
  [...new Set(restaurants.value?.map(r => r.cuisine_origin).filter(Boolean))].sort()
)
const availableTypes = computed(() =>
  [...new Set(restaurants.value?.flatMap(r => r.types || []).filter(t => !['establishment', 'point_of_interest', 'food'].includes(t)))].sort()
)

const filters = computed(() => [
  { label: t.value.filters.all, value: 'all' },
  { label: t.value.filters.openNow, value: 'open' },
  { label: t.value.filters.topRated, value: 'top' },
])

const sortOptions = computed(() => [
  { label: t.value.sort.rating, value: 'rating' },
  { label: t.value.sort.name, value: 'name' },
  { label: t.value.sort.recent, value: 'recent' },
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
      r.address?.toLowerCase().includes(query) ||
      r.cuisine_origin?.toLowerCase().includes(query) ||
      r.types?.some(t => t.toLowerCase().includes(query) || translateType(t).toLowerCase().includes(query))
    )
  }

  if (selectedFilter.value === 'open') {
    filtered = filtered.filter((r) => isRestaurantOpenNow(r))
  } else if (selectedFilter.value === 'top') {
    filtered = filtered.filter((r) => toRating(r) >= 4.5)
  }

  if (selectedCuisineOrigin.value) {
    filtered = filtered.filter(r => r.cuisine_origin === selectedCuisineOrigin.value)
  }
  if (selectedType.value) {
    filtered = filtered.filter(r => r.types?.includes(selectedType.value))
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

const articlesScrollRef = ref<HTMLElement>()

const articlesForCarousel = computed(() => {
  if (!articles.value) return []
  // On desktop, skip the first article (shown as featured)
  // On SSR, return all — the template handles visibility
  return articles.value.slice(0, 10)
})

function formatArticleDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function scrollArticles(direction: 'left' | 'right'): void {
  const container = articlesScrollRef.value
  if (!container) return
  const scrollAmount = 340
  container.scrollBy({ left: direction === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' })
}

function scrollToRestaurants(): void {
  document.getElementById('restaurants')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToArticles(): void {
  document.getElementById('articles')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function scrollToSearch(): void {
  scrollToRestaurants()
  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 500)
}

useHead({
  title: 'Restaurants Bordeaux - Les meilleurs restaurants de la ville',
  script: [
    {
      innerHTML: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-T2SGPNBR');`,
    },
  ],
  noscript: [
    {
      innerHTML: '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T2SGPNBR" height="0" width="0" style="display:none;visibility:hidden"></iframe>',
    },
  ],
  meta: [
    { name: 'description', content: 'Découvrez une sélection des meilleurs restaurants de Bordeaux. Notes, avis, et descriptions détaillées.' },
    { property: 'og:title', content: 'Restaurants Bordeaux - Les meilleurs restaurants de la ville' },
    { property: 'og:description', content: 'Découvrez une sélection des meilleurs restaurants de Bordeaux. Notes, avis, et descriptions détaillées.' },
    { property: 'og:image', content: 'https://restaurants-bordeaux.com/background.jpg' },
    { property: 'og:url', content: 'https://restaurants-bordeaux.com' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Restaurants Bordeaux' },
    { property: 'og:locale', content: 'fr_FR' },
    { property: 'og:locale:alternate', content: 'en_US' },
    { property: 'og:locale:alternate', content: 'es_ES' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'Restaurants Bordeaux - Les meilleurs restaurants de la ville' },
    { name: 'twitter:description', content: 'Découvrez une sélection des meilleurs restaurants de Bordeaux. Notes, avis, et descriptions détaillées.' },
    { name: 'twitter:image', content: 'https://restaurants-bordeaux.com/background.jpg' },
  ],
  link: [
    { rel: 'canonical', href: 'https://restaurants-bordeaux.com' }
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

@media (prefers-reduced-motion: reduce) {
  article {
    animation: none;
  }
}

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
