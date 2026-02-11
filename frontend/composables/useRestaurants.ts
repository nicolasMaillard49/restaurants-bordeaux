export interface Review {
  author: string
  rating: number
  text: string
  date: string
}

export interface Restaurant {
  id: string
  name: string
  description: string
  rating: number
  address: string
  city: string
  website: string | null
  phone: string | null
  opening_hours: string[] | null
  price_level: number | null
  google_maps_url: string | null
  reservation_url: string | null
  menu_url: string | null
  types: string[] | null
  cuisine_origin: string | null
  reviews: Review[] | null
  images: string[]
  source: string
  last_update: string
  created_at: string
  updated_at: string
}

export interface Article {
  id: string
  slug: string
  title: string
  url: string
  excerpt: string | null
  image: string | null
  published_date: string | null
  category: string
  restaurant_names: string[] | null
  source: string
  created_at: string
}

export const useArticles = () => {
  const config = useRuntimeConfig()
  const apiBase = import.meta.server ? config.apiBase : config.public.apiBase

  const getAll = async (): Promise<Article[]> => {
    try {
      return await $fetch<Article[]>(`${apiBase}/articles`)
    } catch (e) {
      console.error('Error fetching articles:', e)
      return []
    }
  }

  return { getAll }
}

export const useRestaurants = () => {
  const config = useRuntimeConfig()
  // Utilise apiBase côté serveur (SSR), apiBase public côté client
  const apiBase = import.meta.server ? config.apiBase : config.public.apiBase

  /**
   * Récupère tous les restaurants
   */
  const getAll = async (): Promise<Restaurant[]> => {
    try {
      return await $fetch<Restaurant[]>(`${apiBase}/restaurants`)
    } catch (e) {
      console.error('Error fetching restaurants:', e)
      return []
    }
  }

  /**
   * Récupère un restaurant par ID
   */
  const getOne = async (id: string): Promise<Restaurant | null> => {
    try {
      return await $fetch<Restaurant>(`${apiBase}/restaurants/${id}`)
    } catch (e) {
      console.error('Error fetching restaurant:', e)
      return null
    }
  }

  return {
    getAll,
    getOne
  }
}
