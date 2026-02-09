<template>
  <a
    :href="article.url"
    target="_blank"
    rel="noopener noreferrer"
    class="group flex-shrink-0 w-[280px] sm:w-[300px] rounded-2xl overflow-hidden snap-start cursor-pointer bg-white/5 border border-white/10 hover:border-[#C9A962]/30 transition-all duration-300"
  >
    <!-- Article Image -->
    <div class="relative h-44 sm:h-48 overflow-hidden">
      <img
        v-if="article.image"
        :src="article.image"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        loading="lazy"
      />
      <div v-else class="w-full h-full bg-gradient-to-br from-bordeaux-700/30 to-[#C9A962]/20 flex items-center justify-center">
        <UIcon name="i-heroicons-newspaper" class="w-10 h-10 text-white/20" />
      </div>
      <!-- Gradient overlay -->
      <div class="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-transparent to-transparent opacity-60"></div>
      <!-- Category Badge -->
      <div class="absolute top-3 left-3">
        <span class="px-2.5 py-1 bg-bordeaux-700/90 backdrop-blur-sm text-white text-xs font-medium rounded-full capitalize">
          {{ article.category }}
        </span>
      </div>
    </div>

    <!-- Article Content -->
    <div class="p-4 sm:p-5">
      <h3 class="font-serif text-base sm:text-lg font-semibold text-white mb-2 line-clamp-2 group-hover:text-[#C9A962] transition-colors duration-300">
        {{ article.title }}
      </h3>
      <p v-if="article.excerpt" class="text-white/40 text-sm line-clamp-2 mb-4 leading-relaxed">
        {{ article.excerpt }}
      </p>
      <div class="flex items-center justify-between pt-3 border-t border-white/10">
        <span v-if="article.published_date" class="text-xs text-white/30">
          {{ formatArticleDate(article.published_date) }}
        </span>
        <span v-else class="text-xs text-white/30">{{ article.source }}</span>
        <span class="flex items-center gap-1.5 text-[#C9A962] text-xs font-medium group-hover:gap-2.5 transition-all duration-300">
          {{ t.articles.readArticle }}
          <UIcon name="i-heroicons-arrow-right" class="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  </a>
</template>

<script setup lang="ts">
import type { Article } from '~/composables/useRestaurants'

defineProps<{
  article: Article
}>()

const { t } = useTranslations()

function formatArticleDate(dateStr: string | null): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}
</script>
