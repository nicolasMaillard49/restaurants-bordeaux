<template>
  <div ref="root" class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/20 transition-all border border-white/20"
    >
      <UIcon name="i-heroicons-language" class="w-5 h-5 text-[#C9A962]" />
      <span class="font-medium uppercase">{{ locale }}</span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="w-4 h-4 transition-transform text-[#C9A962]"
        :class="{ 'rotate-180': isOpen }"
      />
    </button>

    <!-- Dropdown -->
    <div
      v-show="isOpen"
      class="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-xl overflow-hidden z-[9999] border border-gray-100"
    >
      <button
        v-for="lang in languages"
        :key="lang.code"
        @click="selectLanguage(lang.code)"
        class="w-full px-4 py-2.5 text-left hover:bg-[#722F37]/5 transition-colors flex items-center gap-2"
        :class="{ 'bg-[#722F37]/10 font-semibold': locale === lang.code }"
      >
        <span>{{ lang.flag }}</span>
        <span class="text-[#1A1A1A]">{{ lang.name }}</span>
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
