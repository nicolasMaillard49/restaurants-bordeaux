// Cache global des traductions (persistant entre les appels)
const globalTranslationCache: Record<string, string> = {}

// Composable pour la traduction automatique du contenu
export const useTranslate = () => {
    const { locale } = useLocale()

    const translateText = async (text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> => {
        if (!text || !targetLang) return text

        // Si la langue cible est la même que la langue source, retourner le texte original
        if (targetLang === sourceLang) return text

        // Vérifier le cache global
        const cacheKey = `${text.substring(0, 100)}_${sourceLang}_${targetLang}`
        if (globalTranslationCache[cacheKey]) {
            return globalTranslationCache[cacheKey]
        }

        try {
            // Utiliser l'API MyMemory (gratuite, 1000 requêtes/jour)
            const response = await fetch(
                `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}`
            )
            const data = await response.json()

            if (data.responseStatus === 200 && data.responseData?.translatedText) {
                const translated = data.responseData.translatedText
                // Mettre en cache global
                globalTranslationCache[cacheKey] = translated
                return translated
            }
        } catch (error) {
            console.error('Translation error:', error)
        }

        return text // Retourner le texte original en cas d'erreur
    }

    const translateRestaurant = async (restaurant: any, targetLang?: string) => {
        if (!restaurant) return restaurant

        const lang = targetLang || locale.value
        console.log('Translating restaurant to:', lang)

        // Créer une copie pour éviter de modifier l'original
        const translated = { ...restaurant }

        // La description est stockée en FRANÇAIS dans la BDD
        // Traduire vers EN/ES si nécessaire
        if (restaurant.description && lang !== 'fr') {
            console.log('Translating description from FR to', lang)
            translated.description = await translateText(restaurant.description, lang, 'fr')
            console.log('Description translated:', translated.description.substring(0, 50))
        }

        // Les avis sont stockés en ANGLAIS dans la BDD
        // Traduire vers FR/ES si nécessaire
        if (restaurant.reviews && Array.isArray(restaurant.reviews) && lang !== 'en') {
            console.log('Translating', restaurant.reviews.length, 'reviews from EN to', lang)
            translated.reviews = await Promise.all(
                restaurant.reviews.map(async (review: any) => {
                    if (review.text) {
                        const translatedText = await translateText(review.text, lang, 'en')
                        return {
                            ...review,
                            text: translatedText
                        }
                    }
                    return review
                })
            )
        }

        return translated
    }

    return {
        translateText,
        translateRestaurant
    }
}
