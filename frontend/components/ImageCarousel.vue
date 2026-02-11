<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[10000] bg-black/95 backdrop-blur-xl flex items-center justify-center"
        @click="close"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd"
      >
        <!-- Close Button -->
        <button
          class="absolute top-4 right-4 sm:top-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer z-10"
          @click="close"
        >
          <UIcon name="i-heroicons-x-mark" class="w-6 h-6" />
        </button>

        <!-- Navigation Arrows (hidden on mobile, use swipe instead) -->
        <button
          v-if="images.length > 1"
          class="absolute left-2 sm:left-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 hidden sm:flex items-center justify-center text-white transition-colors cursor-pointer"
          @click.stop="previousImage"
        >
          <UIcon name="i-heroicons-chevron-left" class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <button
          v-if="images.length > 1"
          class="absolute right-2 sm:right-6 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white/10 hover:bg-white/20 hidden sm:flex items-center justify-center text-white transition-colors cursor-pointer"
          @click.stop="nextImage"
        >
          <UIcon name="i-heroicons-chevron-right" class="w-6 h-6 sm:w-8 sm:h-8" />
        </button>

        <!-- Image Container -->
        <div class="max-w-5xl max-h-[85vh] px-4 sm:px-20" @click.stop>
          <img
            :src="images[currentIndex]"
            :alt="`Photo ${currentIndex + 1}`"
            class="max-w-full max-h-[80vh] sm:max-h-[85vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
          />
        </div>

        <!-- Image Counter -->
        <div class="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 px-4 sm:px-5 py-1.5 sm:py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs sm:text-sm">
          {{ currentIndex + 1 }} / {{ images.length }}
        </div>

        <!-- Thumbnail Strip -->
        <div v-if="images.length > 1" class="absolute bottom-12 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 sm:gap-2">
          <button
            v-for="(_, index) in images.slice(0, 7)"
            :key="index"
            @click.stop="currentIndex = index"
            :class="[
              'w-2 h-2 rounded-full transition-all cursor-pointer min-h-[8px]',
              currentIndex === index ? 'bg-white w-5 sm:w-6' : 'bg-white/40 hover:bg-white/60'
            ]"
          ></button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  images: string[]
  modelValue: boolean
  initialIndex?: number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const currentIndex = ref(0)

watch(() => props.initialIndex, (val) => {
  if (val !== undefined) currentIndex.value = val
})

watch(() => props.modelValue, (isOpen) => {
  if (isOpen && props.initialIndex !== undefined) {
    currentIndex.value = props.initialIndex
  }
})

const close = () => emit('update:modelValue', false)

const nextImage = () => {
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

const previousImage = () => {
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

// Touch swipe
const touchStartX = ref(0)
const onTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
}
const onTouchEnd = (e: TouchEvent) => {
  const diff = touchStartX.value - e.changedTouches[0].screenX
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextImage()
    else previousImage()
  }
}

// Keyboard navigation
onMounted(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!props.modelValue) return
    if (e.key === 'Escape') close()
    if (e.key === 'ArrowRight') nextImage()
    if (e.key === 'ArrowLeft') previousImage()
  }
  window.addEventListener('keydown', handleKeyPress)
  onUnmounted(() => window.removeEventListener('keydown', handleKeyPress))
})
</script>
