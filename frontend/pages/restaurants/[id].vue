     <template>                                                                                      
          <div class="min-h-screen bg-[#FAF9F6]">                                                       
        <!-- Loading state -->                                                                      
        <div v-if="pending" class="flex justify-center items-center min-h-screen                    
  bg-[#FAF9F6]">                                                                                  
          <div class="flex flex-col items-center gap-4">                                            
            <div class="w-12 h-12 border-4 border-[#722F37]/20 border-t-[#722F37]                   
  rounded-full animate-spin"></div>                                                               
            <span class="text-[#722F37]/60 font-medium">{{ t.search.loading }}</span>               
          </div>                                                                                    
        </div>                                                                                      
                                                                                                      
          <!-- Error state -->                                                                        
          <div v-else-if="error || !restaurant" class="min-h-screen flex items-center                 
  justify-center bg-[#FAF9F6] px-4">                                                              
            <div class="text-center max-w-md">                                                        
              <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-[#722F37]/10 flex items-center       
   justify-center">                                                                               
                <svg class="w-12 h-12 text-[#722F37]" fill="none" stroke="currentColor"               
  viewBox="0 0 24 24">                                                                            
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"             
  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732                            
  4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />                          
                </svg>                                                                                
              </div>                                                                                  
              <h1 class="text-2xl font-serif text-[#1A1A1A] mb-2">{{ t.ui.notFoundTitle }}</h1>       
              <p class="text-[#666] mb-8">{{ t.ui.notFoundDescription }}</p>                          
              <NuxtLink
                to="/"
                class="inline-flex items-center gap-2 px-6 py-3 bg-[#722F37] text-white rounded-full font-medium hover:bg-[#5a252c] transition-colors cursor-pointer"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                {{ t.restaurant.backToList }}
              </NuxtLink>                                                                             
            </div>                                                                                    
          </div>                                                                                      
                                                                                                      
          <!-- Restaurant detail -->                                                                  
          <div v-else>                                                                                
            <!-- Immersive Hero -->                                                                   
            <section class="relative h-[85vh] min-h-[600px] overflow-hidden">                         
              <!-- Background Image with Parallax Effect -->                                          
              <div class="absolute inset-0">                                                          
                <div                                                                                  
                  v-if="restaurant.images && restaurant.images.length > 1"                            
                  class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105                   
  cursor-pointer transition-transform duration-700 hover:scale-110"                               
                  :style="{ backgroundImage: `url(${restaurant.images[1]})` }"                        
                  @click="openCarousel(1)"                                                            
                ></div>                                                                               
                <div                                                                                  
                  v-else-if="restaurant.images && restaurant.images.length === 1"                            
                  class="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105                   
  cursor-pointer transition-transform duration-700 hover:scale-110"                               
                  :style="{ backgroundImage: `url(${restaurant.images[0]})` }"                        
                  @click="openCarousel(0)"                                                            
                ></div>                                                                               
                <div v-else class="absolute inset-0 bg-gradient-to-br from-[#722F37]                  
  to-[#1A1A1A]"></div>                                                                            
              </div>                                                                                  
                                                                                                      
              <!-- Gradient Overlays -->                                                              
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30                
  to-transparent"></div>                                                                          
              <div class="absolute inset-0 bg-gradient-to-r from-black/40                             
  to-transparent"></div>                                                                          
                                                                                                      
              <!-- Floating Navigation -->                                                            
              <nav class="absolute top-0 left-0 right-0 z-20">                                        
                <div class="max-w-7xl mx-auto px-6 py-6">                                             
                  <div class="flex items-center justify-between">                                     
                    <NuxtLink                                                                         
                      to="/#restaurants"                                                              
                      class="group flex items-center gap-3 px-5 py-3 bg-white/10                      
  backdrop-blur-xl rounded-full text-white border border-white/20 hover:bg-white/20               
  transition-all duration-300 cursor-pointer"                                                     
                    >                                                                                 
                      <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform             
  duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">                            
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"         
  d="M10 19l-7-7m0 0l7-7m-7 7h18" />                                                              
                      </svg>                                                                          
                      <span class="font-medium">{{ t.restaurant.backToList }}</span>                  
                    </NuxtLink>                                                                       
                    <LanguageSelector />                                                              
                  </div>                                                                              
                </div>                                                                                
              </nav>                                                                                  
                                                                                                      
              <!-- Hero Content -->
              <div class="absolute bottom-0 left-0 right-0 z-10 pb-40">                               
                <div class="max-w-7xl mx-auto px-6">                                                  
                  <!-- Categories & Cuisine Origin -->                                                                 
                  <div class="flex flex-wrap gap-2 mb-6">     
                    <!-- Cuisine Origin Badge -->                                            
                    <span                                                                             
                      v-if="restaurant?.cuisine_origin"                          
                      class="px-4 py-1.5 bg-[#722F37] text-white                   
  rounded-full text-sm font-semibold border border-[#722F37]"                                        
                    >                                                                                 
                      🌍 {{ restaurant.cuisine_origin }}                                                                      
                    </span>     
                    <!-- Types -->                                                
                    <span                                                                             
                      v-for="type in translatedRestaurant?.types?.slice(0, 3)"                          
                      :key="type"                                                                     
                      class="px-4 py-1.5 bg-white/10 backdrop-blur-md text-white/90                   
  rounded-full text-sm font-medium border border-white/10"                                        
                    >                                                                                 
                      {{ translateType(type) }}                                                                      
                    </span>                                                                           
                  </div>                                                                              
                                                                                                      
                  <!-- Restaurant Name -->                                                            
                  <h1 class="font-serif text-5xl sm:text-6xl lg:text-7xl font-bold text-white         
  mb-6 leading-tight">                                                                            
                    {{ restaurant.name }}                                                             
                  </h1>                                                                               
                                                                                                      
                  <!-- Meta Row -->                                                                   
                  <div class="flex flex-wrap items-center gap-6 text-white/90">                       
                    <!-- Rating & Reviews Count -->                                                                   
                    <div v-if="restaurant.rating" class="flex items-center gap-3">                    
                      <div class="flex items-center gap-1.5 px-4 py-2 bg-[#722F37]                    
  rounded-full">                                                                                  
                        <svg class="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0         
  20 20">                                                                                         
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0           
  00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07                   
  3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8                             
  2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98                       
  8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />                         
                        </svg>                                                                        
                        <span class="font-bold text-lg">{{ restaurant.rating.toFixed(1)               
  }}</span>                                                                                       
                      </div>                                                                          
                      <div v-if="restaurant.rating_count" class="px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/10">          
                        <span class="text-white font-medium text-sm">{{ restaurant.rating_count }} {{ t.stats.reviews.toLowerCase() }}</span>         
                      </div>                                                                         
                    </div>                                                                            
                                                                                                      
                    <!-- Location -->                                                                 
                    <div class="flex items-center gap-2">                                             
                      <svg class="w-5 h-5 text-white/70" fill="none" stroke="currentColor"            
  viewBox="0 0 24 24">                                                                            
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"         
  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />       
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"         
  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />                                                         
                      </svg>                                                                          
                      <span>{{ restaurant.city }}</span>                                              
                    </div>                                                                            
                                                                                                      
                    <!-- Price Level -->                                                              
                    <div v-if="restaurant.price_level !== null && restaurant.price_level !==          
  undefined" class="flex items-center gap-2">                                                     
                      <span class="text-xl font-medium text-[#C9A962]">{{                             
  getPriceLevel(restaurant.price_level) }}</span>                                                 
                    </div>                                                                            
                                                                                                      
                    <!-- Open Status -->                                                              
                    <div v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0"       
   class="flex items-center gap-2">                                                               
                      <span                                                                           
                        :class="[                                                                     
                          'px-4 py-1.5 rounded-full text-sm font-semibold',                           
                          isOpenNow(restaurant.opening_hours)                                         
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'       
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'                   
                        ]"                                                                            
                      >                                                                               
                        {{ isOpenNow(restaurant.opening_hours) ? t.restaurant.open :                  
  t.restaurant.closed }}                                                                          
                      </span>                                                                         
                    </div>                                                                            
                  </div>                                                                              
                </div>                                                                                
              </div>                                                                                  
                                                                                                      
                                                                                        
              <!-- Curved Transition -->
              <div class="absolute bottom-0 left-0 right-0 h-24 bg-[#FAF9F6] rounded-t-[3rem]"></div>
            </section>                                                                                
                                                                                                      
            <!-- Main Content -->
            <main class="relative bg-[#FAF9F6]">
              <div class="max-w-6xl mx-auto px-6 pt-0 pb-8">
                <!-- Floating Action Cards (overlapping rounded) -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12 -mt-8 relative z-20">                             
                  <!-- Call Card -->                                                                  
                  <a                                                                                  
                    v-if="restaurant.phone"                                                           
                    :href="`tel:${restaurant.phone}`"                                                 
                    class="group flex items-center gap-4 p-5 bg-white rounded-2xl shadow-lg           
  shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300                 
  cursor-pointer"                                                                                 
                  >                                                                                   
                    <div class="w-12 h-12 rounded-full bg-[#722F37]/10 flex items-center              
  justify-center group-hover:bg-[#722F37] transition-colors">                                     
                      <svg class="w-6 h-6 text-[#722F37] group-hover:text-white                       
  transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">                       
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"         
  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257                 
  1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0               
  01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />                                      
                      </svg>                                                                          
                    </div>                                                                            
                    <div>                                                                             
                      <p class="text-sm text-[#666] mb-0.5">{{ t.restaurant.phone }}</p>              
                      <p class="font-semibold text-[#1A1A1A]">{{ restaurant.phone }}</p>              
                    </div>                                                                            
                  </a>                                                                                
                                                                                                      
                  <!-- Phone Card -->
            

                  <!-- Website Card -->
                  <a
                    v-if="restaurant.website"
                    :href="restaurant.website"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="group flex items-center gap-4 p-5 bg-white rounded-2xl shadow-lg
  shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300
  cursor-pointer"
                  >
                    <div class="w-12 h-12 rounded-full bg-[#722F37]/10 flex items-center              
  justify-center group-hover:bg-[#722F37] transition-colors">                                     
                      <svg class="w-6 h-6 text-[#722F37] group-hover:text-white                       
  transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">                       
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"         
  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03               
  3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />                      
                      </svg>                                                                          
                    </div>                                                                            
                    <div>                                                                             
                      <p class="text-sm text-[#666] mb-0.5">{{ t.restaurant.website }}</p>            
                      <p class="font-semibold text-[#1A1A1A]">{{ t.restaurant.visitWebsite            
  }}</p>                                                                                          
                    </div>                                                                            
                  </a>                                                                                
                                                                                                      
                  <!-- Maps Card -->                                                                  
                  <a                                                                                  
                    v-if="restaurant.google_maps_url"                                                 
                    :href="restaurant.google_maps_url"                                                
                    target="_blank"                                                                   
                    rel="noopener noreferrer"                                                         
                    class="group flex items-center gap-4 p-5 bg-white rounded-2xl shadow-lg           
  shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300                 
  cursor-pointer"                                                                                 
                  >                                                                                   
                    <div class="w-12 h-12 rounded-full bg-[#722F37]/10 flex items-center              
  justify-center group-hover:bg-[#722F37] transition-colors">                                     
                      <svg class="w-6 h-6 text-[#722F37] group-hover:text-white                       
  transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">                       
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"         
  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />       
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"         
  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />                                                         
                      </svg>                                                                          
                    </div>                                                                            
                    <div>                                                                             
                      <p class="text-sm text-[#666] mb-0.5">{{ t.restaurant.address }}</p>            
                      <p class="font-semibold text-[#1A1A1A]">{{ t.restaurant.viewOnMaps }}</p>       
                    </div>                                                                            
                  </a>                                                                                
                </div>                                                                                
                                                                                                      
                <!-- Two Column Layout -->                                                            
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">                                   
                  <!-- Left Column - Main Content -->                                                 
                  <div class="lg:col-span-2 space-y-8">                                               
                    <!-- Description Card -->                                                         
                    <section class="bg-white rounded-3xl p-8 shadow-lg shadow-black/5">               
                      <h2 class="font-serif text-2xl text-[#1A1A1A] mb-4">{{                          
  t.restaurant.description }}</h2>                                                                
                      <p class="text-[#555] leading-relaxed text-lg whitespace-pre-line">             
                        {{ translatedRestaurant?.description }}                                       
                      </p>                                                                            
                    </section>                                                                        
                                                                                                      
                    <!-- Photo Gallery -->                                                            
                    <section v-if="restaurant.images && restaurant.images.length > 1"                 
  class="bg-white rounded-3xl p-8 shadow-lg shadow-black/5">                                      
                      <h2 class="font-serif text-2xl text-[#1A1A1A] mb-6">{{                          
  t.restaurant.photos }}</h2>                                                                     
                      <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">                             
                        <div                                                                          
                          v-for="(image, index) in restaurant.images.slice(0, 6)"                     
                          :key="index"                                                                
                          class="relative aspect-square rounded-2xl overflow-hidden                   
  cursor-pointer group"                                                                           
                          @click="openCarousel(index)"                                                
                        >                                                                             
                          <img                                                                        
                            :src="image"                                                              
                            :alt="`${restaurant.name} - Photo ${index + 1}`"                          
                            class="w-full h-full object-cover group-hover:scale-110                   
  transition-transform duration-500"                                                              
                            loading="lazy"                                                            
                          />                                                                          
                          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20             
  transition-colors duration-300"></div>                                                          
                          <!-- Show count on last visible image if more exist -->                     
                          <div                                                                        
                            v-if="index === 5 && restaurant.images.length > 6"                        
                            class="absolute inset-0 bg-black/60 flex items-center                     
  justify-center"                                                                                 
                          >                                                                           
                            <span class="text-white text-2xl font-bold">+{{                           
  restaurant.images.length - 6 }}</span>                                                          
                          </div>                                                                      
                        </div>                                                                        
                      </div>                                                                          
                    </section>                                                                        
                                                                                                      
                    <!-- Reviews Section -->                                                          
                    <section v-if="localizedReviews.length > 0" class="bg-white rounded-3xl p-8       
   shadow-lg shadow-black/5">                                                                     
                      <div class="flex items-center justify-between mb-6">                            
                        <h2 class="font-serif text-2xl text-[#1A1A1A]">{{ t.restaurant.reviews        
  }}</h2>                                                                                         
                        <span class="text-[#666] text-sm">{{ localizedReviews.length }} {{            
  t.stats.reviews.toLowerCase() }}</span>                                                         
                      </div>                                                                          
                      <div class="space-y-6">                                                         
                        <article                                                                      
                          v-for="(review, index) in localizedReviews.slice(0, showAllReviews ?        
  undefined : 3)"                                                                                 
                          :key="index"                                                                
                          class="pb-6 border-b border-gray-100 last:border-0 last:pb-0"               
                        >                                                                             
                          <div class="flex items-start justify-between mb-3">                         
                            <div class="flex items-center gap-3">                                     
                              <div class="w-10 h-10 rounded-full bg-gradient-to-br                    
  from-[#722F37] to-[#C9A962] flex items-center justify-center text-white font-semibold">         
                                {{ review.author.charAt(0).toUpperCase() }}                           
                              </div>                                                                  
                              <div>                                                                   
                                <p class="font-semibold text-[#1A1A1A]">{{ review.author }}</p>       
                                <p class="text-sm text-[#999]">{{ review.date }}</p>                  
                              </div>                                                                  
                            </div>                                                                    
                            <div class="flex items-center gap-1 px-3 py-1 bg-[#FEF3C7]                
  rounded-full">                                                                                  
                              <svg class="w-4 h-4 text-yellow-500" fill="currentColor"                
  viewBox="0 0 20 20">                                                                            
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1       
   0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07                
  3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8                             
  2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98                       
  8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />                         
                              </svg>                                                                  
                              <span class="font-semibold text-[#92400E] text-sm">{{                   
  review.rating }}</span>                                                                         
                            </div>                                                                    
                          </div>                                                                      
                          <p class="text-[#555] leading-relaxed pl-13">{{ review.text }}</p>          
                        </article>                                                                    
                      </div>                                                                          
                      <!-- Show More Button -->                                                       
                      <button                                                                         
                        v-if="localizedReviews.length > 3"                                            
                        @click="showAllReviews = !showAllReviews"                                     
                        class="mt-6 w-full py-3 text-[#722F37] font-medium hover:bg-[#722F37]/5       
   rounded-xl transition-colors cursor-pointer"                                                   
                      >                                                                               
                        {{ showAllReviews ? 'Voir moins' : `Voir tous les                             
  ${localizedReviews.length} avis` }}                                                             
                      </button>                                                                       
                    </section>                                                                        
                  </div>                                                                              
                                                                                                      
                  <!-- Right Column - Sidebar -->                                                     
                  <aside class="space-y-6">    
                    <!-- Cuisine Origin Card -->                                                       
                    <div v-if="translatedRestaurant?.cuisine_origin" class="bg-white rounded-3xl p-6 shadow-lg shadow-black/5">                       
                      <div class="flex items-center gap-3 mb-4">                                      
                        <div class="w-10 h-10 rounded-full bg-[#722F37]/10 flex items-center          
  justify-center">                                                                                
                          <svg class="w-5 h-5 text-[#722F37]" fill="none" stroke="currentColor"       
   viewBox="0 0 24 24">                                                                           
                            <path stroke-linecap="round" stroke-linejoin="round"                      
  stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />                             
                          </svg>                                                                      
                        </div>                                                                        
                        <h3 class="font-serif text-lg text-[#1A1A1A]">{{                              
  t.restaurant.cuisineOrigin }}</h3>                                                               
                      </div>                                                                          
                      <p class="text-[#555] leading-relaxed">{{ translatedRestaurant.cuisine_origin }}</p>                          
                    </div>                                                           
                    <!-- Map Card -->                                                                 
                    <div class="bg-white rounded-3xl overflow-hidden shadow-lg shadow-black/5">       
                      <div class="h-[200px]">                                                         
                        <iframe                                                                       
                          v-if="restaurant.address"                                                   
                          :src="`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9       
  zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(restaurant.address + ', ' +                     
  restaurant.city)}`"                                                                             
                          width="100%"                                                                
                          height="100%"                                                               
                          style="border:0;"                                                           
                          allowfullscreen=""                                                          
                          loading="lazy"                                                              
                          referrerpolicy="no-referrer-when-downgrade"                                 
                        ></iframe>                                                                    
                      </div>                                                                          
                      <div class="p-5">                                                               
                        <p class="text-[#1A1A1A] font-medium mb-1">{{ restaurant.address }}</p>       
                        <p class="text-[#666] text-sm">{{ restaurant.city }}</p>                      
                      </div>                                                                          
                    </div>                                                                            
                                                                                                      
                    <!-- Opening Hours Card -->                                                       
                    <div v-if="restaurant.opening_hours && restaurant.opening_hours.length > 0"       
   class="bg-white rounded-3xl p-6 shadow-lg shadow-black/5">                                     
                      <div class="flex items-center gap-3 mb-5">                                      
                        <div class="w-10 h-10 rounded-full bg-[#722F37]/10 flex items-center          
  justify-center">                                                                                
                          <svg class="w-5 h-5 text-[#722F37]" fill="none" stroke="currentColor"       
   viewBox="0 0 24 24">                                                                           
                            <path stroke-linecap="round" stroke-linejoin="round"                      
  stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />                             
                          </svg>                                                                      
                        </div>                                                                        
                        <h3 class="font-serif text-lg text-[#1A1A1A]">{{                              
  t.restaurant.openingHours }}</h3>                                                               
                      </div>                                                                          
                      <ul class="space-y-3">                                                          
                        <li                                                                           
                          v-for="(hours, index) in restaurant.opening_hours"                          
                          :key="index"                                                                
                          :class="[                                                                   
                            'flex justify-between items-center py-2 px-3 rounded-lg text-sm',         
                            isCurrentDay(hours) ? 'bg-[#722F37]/5 font-medium' : ''                   
                          ]"                                                                          
                        >                                                                             
                          <span class="text-[#1A1A1A]">{{ getDayFromHours(hours) }}</span>            
                          <span :class="isClosedDay(hours) ? 'text-red-500' : 'text-[#666]'">{{       
   getTimeFromHours(hours) }}</span>                                                              
                        </li>                                                                         
                      </ul>                                                                           
                    </div>                                                                            
                                                                                                      
                    <!-- Meta Info Card -->                                                           
                    <div class="bg-[#F5F5F0] rounded-3xl p-6">                                        
                      <div class="flex items-center gap-2 text-sm text-[#999]">                       
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24        
  24">                                                                                            
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"       
   d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />                               
                        </svg>                                                                        
                        <span>{{ t.restaurant.source }}: {{ restaurant.source }}</span>               
                      </div>                                                                          
                      <div class="flex items-center gap-2 text-sm text-[#999] mt-2">                  
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24        
  24">                                                                                            
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"       
   d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0         
  01-15.357-2m15.357 2H15" />                                                                     
                        </svg>                                                                        
                        <span>{{ formatDate(restaurant.last_update) }}</span>                         
                      </div>                                                                          
                    </div>                                                                            
                  </aside>                                                                            
                </div>                                                                                
              </div>                                                                                  
            </main>                                                                                   
                                                                                                      
            <!-- Footer Spacer -->                                                                    
            <div class="h-20 bg-[#FAF9F6]"></div>                                                     
          </div>                                                                                      
                                                                                                      
          <!-- Fullscreen Image Carousel -->                                                          
          <Teleport to="body">                                                                        
            <Transition                                                                               
              enter-active-class="transition-opacity duration-300"                                    
              leave-active-class="transition-opacity duration-300"                                    
              enter-from-class="opacity-0"                                                            
              leave-to-class="opacity-0"                                                              
            >                                                                                         
              <div                                                                                    
                v-if="isCarouselOpen"                                                                 
                class="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-center         
  justify-center"                                                                                 
                @click="closeCarousel"                                                                
              >                                                                                       
                <!-- Close Button -->                                                                 
                <button                                                                               
                  class="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10                    
  hover:bg-white/20 flex items-center justify-center text-white transition-colors                 
  cursor-pointer"                                                                                 
                  @click="closeCarousel"                                                              
                >                                                                                     
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">         
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6       
   18L18 6M6 6l12 12" />                                                                          
                  </svg>                                                                              
                </button>                                                                             
                                                                                                      
                <!-- Navigation Arrows -->                                                            
                <button                                                                               
                  v-if="restaurant?.images && restaurant.images.length > 1"                           
                  class="absolute left-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20         
  flex items-center justify-center text-white transition-colors cursor-pointer"                   
                  @click.stop="previousImage"                                                         
                >                                                                                     
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">         
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"             
  d="M15 19l-7-7 7-7" />                                                                          
                  </svg>                                                                              
                </button>                                                                             
                                                                                                      
                <button                                                                               
                  v-if="restaurant?.images && restaurant.images.length > 1"                           
                  class="absolute right-6 w-14 h-14 rounded-full bg-white/10 hover:bg-white/20        
  flex items-center justify-center text-white transition-colors cursor-pointer"                   
                  @click.stop="nextImage"                                                             
                >                                                                                     
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">         
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9       
   5l7 7-7 7" />                                                                                  
                  </svg>                                                                              
                </button>                                                                             
                                                                                                      
                <!-- Image Container -->                                                              
                <div class="max-w-5xl max-h-[85vh] px-20" @click.stop>                                
                  <img                                                                                
                    v-if="restaurant?.images"                                                         
                    :src="restaurant.images[currentImageIndex]"                                       
                    :alt="`${restaurant.name} - Photo ${currentImageIndex + 1}`"                      
                    class="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"             
                  />                                                                                  
                </div>                                                                                
                                                                                                      
                <!-- Image Counter -->                                                                
                <div class="absolute bottom-8 left-1/2 -translate-x-1/2 px-5 py-2 bg-white/10         
  backdrop-blur-md rounded-full text-white text-sm">                                              
                  {{ currentImageIndex + 1 }} / {{ restaurant?.images?.length || 0 }}                 
                </div>                                                                                
                                                                                                      
                <!-- Thumbnail Strip -->                                                              
                <div v-if="restaurant?.images && restaurant.images.length > 1" class="absolute        
  bottom-20 left-1/2 -translate-x-1/2 flex gap-2">                                                
                  <button                                                                             
                    v-for="(_, index) in restaurant.images.slice(0, 7)"                               
                    :key="index"                                                                      
                    @click.stop="currentImageIndex = index"                                           
                    :class="[                                                                         
                      'w-2 h-2 rounded-full transition-all cursor-pointer',                           
                      currentImageIndex === index ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'
                    ]"                                                                                
                  ></button>                                                                          
                </div>                                                                                
              </div>                                                                                  
            </Transition>                                                                             
          </Teleport>                                                                                 
        </div>                                                                                        
      </template>                                                                                     
                                                                                                      
      <script setup lang="ts">                                                                        
      const route = useRoute()                                                                        
      const { getOne } = useRestaurants()                                                             
      const { t, translateType } = useTranslations()                                                                 
      const { locale } = useLocale()                                                                  
      const { translateRestaurant } = useTranslate()                                                  
                                                                                                      
      // Carousel state                                                                               
      const isCarouselOpen = ref(false)                                                               
      const currentImageIndex = ref(0)                                                                
      const showAllReviews = ref(false)                                                               
                                                                                                      
      const openCarousel = (index: number) => {                                                       
        currentImageIndex.value = index                                                               
        isCarouselOpen.value = true                                                                   
      }                                                                                               
                                                                                                      
      const closeCarousel = () => {                                                                   
        isCarouselOpen.value = false                                                                  
      }                                                                                               
                                                                                                      
      const nextImage = () => {                                                                       
        if (translatedRestaurant.value?.images) {                                                     
          currentImageIndex.value = (currentImageIndex.value + 1) %                                   
  translatedRestaurant.value.images.length                                                        
        }                                                                                             
      }                                                                                               
                                                                                                      
      const previousImage = () => {                                                                   
        if (translatedRestaurant.value?.images) {                                                     
          currentImageIndex.value = (currentImageIndex.value - 1 +                                    
  translatedRestaurant.value.images.length) % translatedRestaurant.value.images.length            
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
                                                                                                      
      // Traduire quand la langue change                                                              
      watch(locale, async () => {                                                                     
        await performTranslation()                                                                    
      }, { immediate: false })                                                                        
                                                                                                      
      // Traduire quand le restaurant est chargé                                                      
      watch(restaurant, async (newRestaurant) => {                                                    
        if (newRestaurant) {                                                                          
          await performTranslation()                                                                  
        }                                                                                             
      }, { immediate: true })                                                                         
                                                                                                      
      const localizedReviews = computed(() => {                                                       
        return translatedRestaurant.value?.reviews || []                                              
      })                                                                                              
                                                                                                      
      const formatDate = (dateString: string) => {                                                    
        const date = new Date(dateString)                                                             
        return date.toLocaleDateString(locale.value === 'en' ? 'en-US' : locale.value === 'es'        
  ? 'es-ES' : 'fr-FR', {                                                                          
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
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',           
  'Saturday']                                                                                     
        const currentDay = dayNames[now.getDay()]                                                     
        const currentTime = now.getHours() * 60 + now.getMinutes()                                    
                                                                                                      
        const todayHours = openingHours.find(h => h.startsWith(currentDay))                           
        if (!todayHours) return false                                                                 
                                                                                                      
        if (todayHours.includes('Closed') || todayHours.includes('Fermé')) return false               
                                                                                                      
        const timeRanges = todayHours.split(':').slice(1).join(':').split(',')                        
                                                                                                      
        for (const range of timeRanges) {                                                             
          const hasAmPm = /AM|PM/i.test(range)                                                        
                                                                                                      
          if (hasAmPm) {                                                                              
            const times = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)                               
            if (!times || times.length < 2) continue                                                  
                                                                                                      
            const periodMatch = range.match(/(AM|PM)/gi)                                              
            const globalPeriod = periodMatch && periodMatch.length === 1 ?                            
  periodMatch[0].toUpperCase() : null                                                             
                                                                                                      
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
                                                                                                      
            if (closeTime <= openTime) {                                                              
              if (currentTime >= openTime || currentTime < closeTime) {                               
                return true                                                                           
              }                                                                                       
            } else {                                                                                  
              if (currentTime >= openTime && currentTime < closeTime) {                               
                return true                                                                           
              }                                                                                       
            }                                                                                         
          } else {                                                                                    
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
                                                                                                      
            if (closeTime <= openTime) {                                                              
              if (currentTime >= openTime || currentTime < closeTime) {                               
                return true                                                                           
              }                                                                                       
            } else {                                                                                  
              if (currentTime >= openTime && currentTime < closeTime) {                               
                return true                                                                           
              }                                                                                       
            }                                                                                         
          }                                                                                           
        }                                                                                             
                                                                                                      
        return false                                                                                  
      }                                                                                               
                                                                                                      
      // Helper functions for opening hours display                                                   
      const getDayFromHours = (hours: string): string => {                                            
        const dayTranslations: Record<string, Record<string, string>> = {                             
          en: {                                                                                       
            Monday: 'Monday', Tuesday: 'Tuesday', Wednesday: 'Wednesday',                             
            Thursday: 'Thursday', Friday: 'Friday', Saturday: 'Saturday', Sunday: 'Sunday'            
          },                                                                                          
          fr: {                                                                                       
            Monday: 'Lundi', Tuesday: 'Mardi', Wednesday: 'Mercredi',                                 
            Thursday: 'Jeudi', Friday: 'Vendredi', Saturday: 'Samedi', Sunday: 'Dimanche'             
          },                                                                                          
          es: {                                                                                       
            Monday: 'Lunes', Tuesday: 'Martes', Wednesday: 'Miércoles',                               
            Thursday: 'Jueves', Friday: 'Viernes', Saturday: 'Sábado', Sunday: 'Domingo'              
          }                                                                                           
        }                                                                                             
                                                                                                      
        const [rawDay] = hours.split(':')                                                             
        const dayKey = rawDay.trim()                                                                  
        const targetDayMap = dayTranslations[locale.value] || dayTranslations.fr                      
        return targetDayMap[dayKey] || dayKey                                                         
      }                                                                                               
                                                                                                      
      const getTimeFromHours = (hours: string): string => {                                           
        const closedWord = locale.value === 'es' ? 'Cerrado' : locale.value === 'en' ? 'Closed'       
   : 'Fermé'                                                                                      
        const timeParts = hours.split(':').slice(1).join(':').trim()                                  
                                                                                                      
        if (/(Closed|Fermé|Cerrado)/i.test(timeParts)) {                                              
          return closedWord                                                                           
        }                                                                                             
                                                                                                      
        if (locale.value === 'en') {                                                                  
          return timeParts                                                                            
        }                                                                                             
                                                                                                      
        // Convert to 24h format for FR/ES                                                            
        const timeRanges = timeParts.split(',').map(range => range.trim())                            
        const convertRange = (range: string): string => {                                             
          const periodMatch = range.match(/(AM|PM)/gi)                                                
          const rangePeriod = periodMatch && periodMatch.length === 1 ?                               
  periodMatch[0].toUpperCase() : null                                                             
          const times = range.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/gi)                                 
          if (!times) return range                                                                    
                                                                                                      
          let result = range                                                                          
          times.forEach((timeStr) => {                                                                
            const match = timeStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)                              
            if (!match) return                                                                        
                                                                                                      
            let hoursVal = parseInt(match[1])                                                         
            const minutes = match[2]                                                                  
            let period = match[3]?.toUpperCase()                                                      
                                                                                                      
            if (!period && rangePeriod) period = rangePeriod                                          
            if (period === 'PM' && hoursVal !== 12) hoursVal += 12                                    
            if (period === 'AM' && hoursVal === 12) hoursVal = 0                                      
                                                                                                      
            const converted = `${hoursVal}h${minutes}`                                                
            result = result.replace(timeStr, converted)                                               
          })                                                                                          
                                                                                                      
          return result.replace(/\s*(AM|PM)/gi, '')                                                   
        }                                                                                             
                                                                                                      
        return timeRanges.map(convertRange).join(', ')                                                
      }                                                                                               
                                                                                                      
      const isCurrentDay = (hours: string): boolean => {                                              
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday',           
  'Saturday']                                                                                     
        const currentDay = dayNames[new Date().getDay()]                                              
        return hours.startsWith(currentDay)                                                           
      }                                                                                               
                                                                                                      
      const isClosedDay = (hours: string): boolean => {                                               
        return /(Closed|Fermé|Cerrado)/i.test(hours)                                                  
      }                                                                                               
      </script>                                                                                       
                                                                                                      
      <style scoped>                                                                                  
      /* Serif font for headings */                                                                   
      .font-serif {                                                                                   
        font-family: 'Playfair Display', Georgia, serif;                                              
      }                                                                                               
                                                                                                      
      /* Smooth scrolling */                                                                          
      html {                                                                                          
        scroll-behavior: smooth;                                                                      
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