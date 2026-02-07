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
      title: 'Découvrez les saveurs',
      subtitle: 'de Bordeaux',
      description: 'Une sélection des meilleurs restaurants de la ville, soigneusement choisis pour vous',
      searchPlaceholder: 'Rechercher un restaurant, une cuisine, un quartier...',
      discover: 'Découvrir'
    },
    stats: {
      restaurants: 'Restaurants',
      avgRating: 'Note moyenne',
      reviews: 'Avis',
      cities: 'Villes',
      verified: 'Vérifiés',
      topRated: 'Top notés'
    },
    filters: {
      all: 'Tous',
      openNow: 'Ouvert actuellement',
      topRated: 'Top notés (4.5+)',
      recent: 'Récents'
    },
    search: {
      placeholder: 'Rechercher...',
      noResults: 'Aucun restaurant trouvé',
      loading: 'Chargement...'
    },
    sort: {
      rating: 'Meilleures notes',
      name: 'Nom A-Z',
      recent: 'Plus récents'
    },
    ui: {
      verified: 'Vérifiés',
      discover: 'Découvrir',
      loadingRestaurants: 'Chargement des restaurants...',
      errorTitle: 'Oups, une erreur est survenue',
      errorDescription: 'Impossible de charger les restaurants',
      retry: 'Réessayer',
      notFoundTitle: 'Introuvable',
      notFoundDescription: 'Restaurant non trouvé',
      emptyTitle: 'Aucun restaurant trouvé',
      emptyDescription: 'Essayez de modifier vos filtres ou votre recherche',
      viewMore: 'Voir plus',
      footerTagline: 'Votre guide gastronomique bordelais',
      rights: 'Tous droits réservés',
      restaurantsCount: 'restaurant'
    },
    restaurant: {
      pageTitle: 'Restaurants Bordeaux',
      backToList: 'Retour à la liste',
      description: 'Description',
      address: 'Adresse',
      phone: 'Téléphone',
      website: 'Site web',
      visitWebsite: 'Visiter le site',
      viewOnMaps: 'Voir sur Google Maps',
      priceRange: 'Gamme de prix',
      openingHours: "Horaires d'ouverture",
      open: 'Ouvert',
      closed: 'Fermé',
      reviews: 'Avis clients',
      photos: 'Photos',
      source: 'Source',
      lastUpdate: 'Dernière mise à jour',
      cuisineOrigin: 'Origine de la cuisine',
      reservation: 'Réservation',
      bookTable: 'Réserver une table'
    },
    types: {
      restaurant: 'Restaurant',
      food: 'Nourriture',
      point_of_interest: "Point d'intérêt",
      establishment: 'Établissement',
      meal_takeaway: 'Plats à emporter',
      meal_delivery: 'Livraison de repas',
      bar: 'Bar',
      cafe: 'Café',
      bakery: 'Boulangerie',
      night_club: 'Boîte de nuit',
      store: 'Magasin',
      lodging: 'Hébergement',
      french_restaurant: 'Restaurant français',
      italian_restaurant: 'Restaurant italien',
      japanese_restaurant: 'Restaurant japonais',
      chinese_restaurant: 'Restaurant chinois',
      indian_restaurant: 'Restaurant indien',
      mexican_restaurant: 'Restaurant mexicain',
      seafood_restaurant: 'Restaurant de fruits de mer',
      steak_house: 'Steakhouse',
      sushi_restaurant: 'Restaurant de sushi',
      vegetarian_restaurant: 'Restaurant végétarien',
      vegan_restaurant: 'Restaurant végan',
      fast_food_restaurant: 'Fast-food',
      pizza_restaurant: 'Pizzeria',
      sandwich_shop: 'Sandwicherie',
      ice_cream_shop: 'Glacier',
      coffee_shop: 'Café'
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
      lastUpdate: 'Last update',
      cuisineOrigin: 'Cuisine origin',
      reservation: 'Reservation',
      bookTable: 'Book a table'
    },
    types: {
      restaurant: 'Restaurant',
      food: 'Food',
      point_of_interest: 'Point of interest',
      establishment: 'Establishment',
      meal_takeaway: 'Takeaway',
      meal_delivery: 'Meal delivery',
      bar: 'Bar',
      cafe: 'Cafe',
      bakery: 'Bakery',
      night_club: 'Night club',
      store: 'Store',
      lodging: 'Lodging',
      french_restaurant: 'French restaurant',
      italian_restaurant: 'Italian restaurant',
      japanese_restaurant: 'Japanese restaurant',
      chinese_restaurant: 'Chinese restaurant',
      indian_restaurant: 'Indian restaurant',
      mexican_restaurant: 'Mexican restaurant',
      seafood_restaurant: 'Seafood restaurant',
      steak_house: 'Steakhouse',
      sushi_restaurant: 'Sushi restaurant',
      vegetarian_restaurant: 'Vegetarian restaurant',
      vegan_restaurant: 'Vegan restaurant',
      fast_food_restaurant: 'Fast food',
      pizza_restaurant: 'Pizza restaurant',
      sandwich_shop: 'Sandwich shop',
      ice_cream_shop: 'Ice cream shop',
      coffee_shop: 'Coffee shop'
    }
  },
  es: {
    hero: {
      title: 'Descubre los sabores',
      subtitle: 'de Burdeos',
      description: 'Una selección de los mejores restaurantes de la ciudad, cuidadosamente elegidos para ti',
      searchPlaceholder: 'Buscar un restaurante, cocina, barrio...',
      discover: 'Descubrir'
    },
    stats: {
      restaurants: 'Restaurantes',
      avgRating: 'Calificación promedio',
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
      recent: 'Más recientes'
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
      emptyDescription: 'Prueba a ajustar tus filtros o búsqueda',
      viewMore: 'Ver más',
      footerTagline: 'Tu guía gastronómica de Burdeos',
      rights: 'Todos los derechos reservados',
      restaurantsCount: 'restaurante'
    },
    restaurant: {
      pageTitle: 'Restaurantes de Burdeos',
      backToList: 'Volver a la lista',
      description: 'Descripción',
      address: 'Dirección',
      phone: 'Teléfono',
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
      lastUpdate: 'Última actualización',
      cuisineOrigin: 'Origen de la cocina',
      reservation: 'Reserva',
      bookTable: 'Reservar una mesa'
    },
    types: {
      restaurant: 'Restaurante',
      food: 'Comida',
      point_of_interest: 'Punto de interés',
      establishment: 'Establecimiento',
      meal_takeaway: 'Para llevar',
      meal_delivery: 'Entrega a domicilio',
      bar: 'Bar',
      cafe: 'Café',
      bakery: 'Panadería',
      night_club: 'Club nocturno',
      store: 'Tienda',
      lodging: 'Alojamiento',
      french_restaurant: 'Restaurante francés',
      italian_restaurant: 'Restaurante italiano',
      japanese_restaurant: 'Restaurante japonés',
      chinese_restaurant: 'Restaurante chino',
      indian_restaurant: 'Restaurante indio',
      mexican_restaurant: 'Restaurante mexicano',
      seafood_restaurant: 'Restaurante de mariscos',
      steak_house: 'Asador',
      sushi_restaurant: 'Restaurante de sushi',
      vegetarian_restaurant: 'Restaurante vegetariano',
      vegan_restaurant: 'Restaurante vegano',
      fast_food_restaurant: 'Comida rápida',
      pizza_restaurant: 'Pizzería',
      sandwich_shop: 'Bocadillería',
      ice_cream_shop: 'Heladería',
      coffee_shop: 'Cafetería'
    }
  }
}

export const useTranslations = () => {
  const { locale } = useLocale()

  const t = computed(() => translations[locale.value])

  const translateType = (type: string): string => {
    // Nettoyer le type (enlever espaces, convertir en snake_case)
    const cleanType = type.toLowerCase().trim().replace(/\s+/g, '_')

    // Chercher dans les traductions
    const typeTranslations = translations[locale.value].types as Record<string, string>

    // Retourner la traduction ou le type formaté
    return typeTranslations[cleanType] || type.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  return { t, translateType }
}


