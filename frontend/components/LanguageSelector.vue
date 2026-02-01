<template>
  <div ref="root" class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 bg-blue-900 backdrop-blur-sm rounded-lg text-white hover:bg-blue-800 transition-all shadow-lg"
    >
      <UIcon name="i-heroicons-language" class="w-5 h-5" />
      <span class="font-medium uppercase">{{ locale }}</span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown -->
    <div
      v-show="isOpen"
      class="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-xl overflow-hidden z-[9999]"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="selectLanguage(lang.code)"
        class="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center gap-2"
        :class="{ 'bg-blue-50 text-blue-600 font-semibold': locale === lang.code }"
      >
        <span class="text-blue-800">{{ lang.flag }}</span>
        <span class="text-blue-800">{{ lang.name }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Locale } from '~/composables/useLocale'

const { locale, setLocale } = useLocale()
const isOpen = ref(false)
const root = ref<HTMLElement | null>(null)

const languages = [
  { code: 'fr' as Locale, name: 'Français', flag: '🇫🇷' },
  { code: 'en' as Locale, name: 'English', flag: '🇬🇧' },
  { code: 'es' as Locale, name: 'Español', flag: '🇪🇸' }
]

const selectLanguage = (code: Locale) => {
  setLocale(code)
  isOpen.value = false
}

const onDocumentClick = (e: MouseEvent) => {
  const target = e.target as Node | null
  if (!root.value || !target) return
  if (!root.value.contains(target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  if (import.meta.client) {
    document.addEventListener('click', onDocumentClick)
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    document.removeEventListener('click', onDocumentClick)
  }
})
</script>
