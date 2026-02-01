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
  types: string[] | null
  reviews: Review[] | null
  images: string[]
  source: string
  last_update: string
  created_at: string
  updated_at: string
}

export const useRestaurants = () => {
  const config = useRuntimeConfig()
  // Utilise apiBase côté serveur (SSR), apiBase public côté client
  const apiBase = import.meta.server ? config.apiBase : config.public.apiBase

  /**
   * Récupère tous les restaurants
   */
  const getAll = async (): Promise<Restaurant[]> => {
    const { data, error } = await useFetch<Restaurant[]>(`${apiBase}/restaurants`)
    
    if (error.value) {
      console.error('Error fetching restaurants:', error.value)
      return []
    }
    
    return data.value || []
  }

  /**
   * Récupère un restaurant par ID
   */
  const getOne = async (id: string): Promise<Restaurant | null> => {
    const { data, error } = await useFetch<Restaurant>(`${apiBase}/restaurants/${id}`)
    
    if (error.value) {
      console.error('Error fetching restaurant:', error.value)
      return null
    }
    
    return data.value
  }

  return {
    getAll,
    getOne
  }
}
