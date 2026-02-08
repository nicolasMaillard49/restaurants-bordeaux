export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxtjs/sitemap'],

  site: {
    url: 'https://restaurants-bordeaux.com'
  },

  devtools: { enabled: true },

  runtimeConfig: {
    // Variables côté serveur (SSR) - utilisées dans Docker
    apiBase: process.env.API_BASE_INTERNAL || 'http://backend:3000',

    public: {
      // Variables côté client (navigateur)
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
    }
  },

  app: {
    head: {
      title: 'Restaurants Bordeaux',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Découvrez les meilleurs restaurants de Bordeaux' }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap' }
      ]
    }
  },

  devServer: {
    host: '0.0.0.0',
    port: 3000
  },

  compatibilityDate: '2024-01-30'
})
