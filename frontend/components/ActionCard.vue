<template>
  <a
    :href="href"
    :target="target"
    :rel="target === '_blank' ? 'noopener noreferrer' : undefined"
    :class="[
      'group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl shadow-lg shadow-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer min-w-[200px] sm:min-w-0 flex-1',
      variant === 'primary' ? 'bg-bordeaux-700' : 'bg-white'
    ]"
  >
    <div
      :class="[
        'w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center flex-shrink-0 justify-center transition-colors',
        variant === 'primary'
          ? 'bg-white/20 group-hover:bg-white/30'
          : variant === 'gold'
            ? 'bg-gold/15 group-hover:bg-gold'
            : 'bg-bordeaux-700/10 group-hover:bg-bordeaux-700'
      ]"
    >
      <UIcon
        :name="icon"
        :class="[
          'w-5 h-5 sm:w-6 sm:h-6 transition-colors',
          variant === 'primary'
            ? 'text-white'
            : variant === 'gold'
              ? 'text-gold group-hover:text-white'
              : 'text-bordeaux-700 group-hover:text-white'
        ]"
      />
    </div>
    <div class="min-w-0">
      <p :class="['text-xs sm:text-sm mb-0.5', variant === 'primary' ? 'text-white/70' : 'text-[#666]']">{{ label }}</p>
      <p :class="['font-semibold text-sm sm:text-base', variant === 'primary' ? 'text-white' : 'text-[#1A1A1A]']" class="truncate">{{ value }}</p>
    </div>
  </a>
</template>

<script setup lang="ts">
defineProps<{
  href: string
  icon: string
  label: string
  value: string
  target?: string
  variant?: 'default' | 'primary' | 'gold'
}>()
</script>
