<template>
  <div class="relative" ref="containerRef">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-1.5 px-3 py-2 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/15 transition-all duration-200 border border-white/15 cursor-pointer min-h-[36px]"
    >
      <UIcon name="i-heroicons-language" class="w-4 h-4 text-[#C9A962]" />
      <span class="font-medium uppercase text-sm">{{ locale }}</span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="w-3.5 h-3.5 text-white/50 transition-transform duration-200"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="isOpen"
        class="absolute right-0 top-full mt-2 w-44 bg-[#1A1A1A]/95 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl shadow-black/30 overflow-hidden z-50"
      >
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="flex items-center gap-3 w-full px-4 py-3 text-left transition-colors duration-150 cursor-pointer min-h-[44px]"
          :class="[
            locale === lang.code
              ? 'bg-[#C9A962]/10 text-[#C9A962]'
              : 'text-white/70 hover:bg-white/5 hover:text-white'
          ]"
        >
          <span class="text-base">{{ lang.flag }}</span>
          <span class="text-sm font-medium flex-1">{{ lang.label }}</span>
          <UIcon
            v-if="locale === lang.code"
            name="i-heroicons-check"
            class="w-4 h-4 text-[#C9A962]"
          />
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '~/composables/useLocale'

const { locale, setLocale } = useLocale()

const isOpen = ref(false)
const containerRef = ref<HTMLElement>()

const languages = [
  { code: 'fr' as Locale, label: 'Français', flag: '🇫🇷' },
  { code: 'en' as Locale, label: 'English', flag: '🇬🇧' },
  { code: 'es' as Locale, label: 'Español', flag: '🇪🇸' },
]

function selectLanguage(code: Locale) {
  setLocale(code)
  isOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>
