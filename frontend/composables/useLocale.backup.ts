export type Locale = 'fr' | 'en' | 'es'



export const useLocale = () => {

  const locale = useState<Locale>('locale', () => {

    // Detect browser language on first load

    if (import.meta.client) {

      const saved = localStorage.getItem('locale') as Locale

      if (saved && ['fr', 'en', 'es'].includes(saved)) {

        return saved

      }

      const browserLang = navigator.language.split('-')[0]

      if (browserLang === 'fr' || browserLang === 'en' || browserLang === 'es') {

        return browserLang as Locale

      }

    }

    return 'fr'

  })



  const setLocale = (newLocale: Locale) => {

    locale.value = newLocale

    if (import.meta.client) {

      localStorage.setItem('locale', newLocale)

    }

  }



  return {

    locale: readonly(locale),

    setLocale

  }

}



// Translations

export const translations = {

  fr: {

    hero: {

      title: 'DÃ©couvrez les saveurs',

      subtitle: 'de Bordeaux',

      description: 'Une sÃ©lection des meilleurs restaurants de la ville, soigneusement choisis pour vous',

      searchPlaceholder: 'Rechercher un restaurant, une cuisine, un quartier...',

      discover: 'DÃ©couvrir'

    },

    stats: {

      restaurants: 'Restaurants',

      avgRating: 'Note moyenne',

      reviews: 'Avis',

      cities: 'Villes',

      verified: 'VÃ©rifiÃ©s',

      topRated: 'Top noÃ©s'

    },

    filters: {

      all: 'Tous',

      openNow: 'Ouvert actuellement',

      topRated: 'Top not?s (4.5+)',

      recent: 'R?cents'

    },

    search: {

      placeholder: 'Rechercher...',

      noResults: 'Aucun restaurant trouv?',

      loading: 'Chargement...'

    },

    sort: {

      rating: 'Meilleures notes',

      name: 'Nom A-Z',

      recent: 'Plus r?cents'

    },

    ui: {

      verified: 'V?rifi?s',

      discover: 'D?couvrir',

      loadingRestaurants: 'Chargement des restaurants...',

      errorTitle: 'Oups, une erreur est survenue',

      errorDescription: 'Impossible de charger les restaurants',

      retry: 'R?essayer',

      notFoundTitle: 'Introuvable',

      notFoundDescription: 'Restaurant non trouv?',

      emptyTitle: 'Aucun restaurant trouv?',

      emptyDescription: 'Essayez de modifier vos filtres ou votre recherche',

      viewMore: 'Voir plus',

      footerTagline: 'Votre guide gastronomique bordelais',

      rights: 'Tous droits r?serv?s',

      restaurantsCount: 'restaurant'

    },

    restaurant: {

      pageTitle: 'Restaurants Bordeaux',

      backToList: 'Retour ? la liste',

      description: 'Description',

      address: 'Adresse',

      phone: 'T?l?phone',

      website: 'Site web',

      visitWebsite: 'Visiter le site',

      viewOnMaps: 'Voir sur Google Maps',

      priceRange: 'Gamme de prix',

      openingHours: "Horaires d'ouverture",

      open: 'Ouvert',

      closed: 'Ferm?',

      reviews: 'Avis clients',

      photos: 'Photos',

      source: 'Source',

      lastUpdate: 'Derni?re mise ? jour'

    }

  },

  en: {

    hero: {

      title: 'Discover the flavors',

      subtitle: 'of Bordeaux',

      description: 'A selection of the best restaurants in the city, carefully chosen for you',

      searchPlaceholder: 'Search for a restaurant, cuisine, neighborhood...',

      discover: 'Discover'

    },

    stats: {

      restaurants: 'Restaurants',

      avgRating: 'Average rating',

      reviews: 'Reviews',

      cities: 'Cities',

      verified: 'Verified',

      topRated: 'Top rated'

    },

    filters: {

      all: 'All',

      openNow: 'Open now',

      topRated: 'Top rated (4.5+)',

      recent: 'Recent'

    },

    search: {

      placeholder: 'Search...',

      noResults: 'No restaurants found',

      loading: 'Loading...'

    },

    sort: {

      rating: 'Top rated',

      name: 'Name A-Z',

      recent: 'Most recent'

    },

    ui: {

      verified: 'Verified',

      discover: 'Discover',

      loadingRestaurants: 'Loading restaurants...',

      errorTitle: 'Something went wrong',

      errorDescription: 'Unable to load restaurants',

      retry: 'Retry',

      notFoundTitle: 'Not found',

      notFoundDescription: 'Restaurant not found',

      emptyTitle: 'No restaurants found',

      emptyDescription: 'Try adjusting your filters or search',

      viewMore: 'View more',

      footerTagline: 'Your Bordeaux food guide',

      rights: 'All rights reserved',

      restaurantsCount: 'restaurant'

    },

    restaurant: {

      pageTitle: 'Bordeaux Restaurants',

      backToList: 'Back to list',

      description: 'Description',

      address: 'Address',

      phone: 'Phone',

      website: 'Website',

      visitWebsite: 'Visit website',

      viewOnMaps: 'View on Google Maps',

      priceRange: 'Price range',

      openingHours: 'Opening hours',

      open: 'Open',

      closed: 'Closed',

      reviews: 'Customer reviews',

      photos: 'Photos',

      source: 'Source',

      lastUpdate: 'Last update'

    }

  },

  es: {

    hero: {

      title: 'Descubre los sabores',

      subtitle: 'de Burdeos',

      description: 'Una selecci?n de los mejores restaurantes de la ciudad, cuidadosamente elegidos para ti',

      searchPlaceholder: 'Buscar un restaurante, cocina, barrio...',

      discover: 'Descubrir'

    },

    stats: {

      restaurants: 'Restaurantes',

      avgRating: 'Calificaci?n promedio',

      reviews: 'Opiniones',

      cities: 'Ciudades',

      verified: 'Verificados',

      topRated: 'Mejor valorados'

    },

    filters: {

      all: 'Todos',

      openNow: 'Abierto ahora',

      topRated: 'Mejor valorados (4.5+)',

      recent: 'Recientes'

    },

    search: {

      placeholder: 'Buscar...',

      noResults: 'No se encontraron restaurantes',

      loading: 'Cargando...'

    },

    sort: {

      rating: 'Mejor valorados',

      name: 'Nombre A-Z',

      recent: 'M?s recientes'

    },

    ui: {

      verified: 'Verificados',

      discover: 'Descubrir',

      loadingRestaurants: 'Cargando restaurantes...',

      errorTitle: 'Ha ocurrido un error',

      errorDescription: 'No se pudieron cargar los restaurantes',

      retry: 'Reintentar',

      notFoundTitle: 'No encontrado',

      notFoundDescription: 'Restaurante no encontrado',

      emptyTitle: 'No se encontraron restaurantes',

      emptyDescription: 'Prueba a ajustar tus filtros o b?squeda',

      viewMore: 'Ver m?s',

      footerTagline: 'Tu gu?a gastron?mica de Burdeos',

      rights: 'Todos los derechos reservados',

      restaurantsCount: 'restaurante'

    },

    restaurant: {

      pageTitle: 'Restaurantes de Burdeos',

      backToList: 'Volver a la lista',

      description: 'Descripci?n',

      address: 'Direcci?n',

      phone: 'Tel?fono',

      website: 'Sitio web',

      visitWebsite: 'Visitar sitio web',

      viewOnMaps: 'Ver en Google Maps',

      priceRange: 'Rango de precios',

      openingHours: 'Horarios de apertura',

      open: 'Abierto',

      closed: 'Cerrado',

      reviews: 'Opiniones de clientes',

      photos: 'Fotos',

      source: 'Fuente',

      lastUpdate: '?ltima actualizaci?n'

    }

  }

}



export const useTranslations = () => {

  const { locale } = useLocale()



  const t = computed(() => translations[locale.value])



  return { t }

}

