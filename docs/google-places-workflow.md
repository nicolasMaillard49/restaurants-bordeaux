# Workflow n8n avec Google Places API

Ce guide explique comment créer un workflow n8n qui récupère automatiquement des restaurants depuis Google Places API.

## Prérequis

- Clé API Google Places configurée
- Votre clé actuelle : `AIzaSyBoOcs0Ob0MBKRDVZ37wVeIECTIsqsEBQ8`

## Structure de la réponse Google Places

```json
{
  "name": "suzzi",
  "formatted_address": "46 Rue des Trois-Conils, 33000 Bordeaux, France",
  "rating": 4.5,
  "user_ratings_total": 125,
  "business_status": "OPERATIONAL",
  "opening_hours": {
    "open_now": true
  },
  "photos": [
    {
      "photo_reference": "AcnlKN0Hq0x3X6T9...",
      "width": 1500,
      "height": 1500
    }
  ],
  "geometry": {
    "location": {
      "lat": 44.838534,
      "lng": -0.576953
    }
  }
}
```

## Architecture du workflow

```
[Manual Trigger]
       ↓
[HTTP Request: Google Places] ← Récupère les restaurants
       ↓
[Code: Extract Results] ← Extrait les restaurants du JSON
       ↓
[Split In Batches] ← Traite chaque restaurant
       ↓
[Code: Format Data] ← Extrait ville de l'adresse
       ↓
[HTTP Request: Groq] ← Génère description IA
       ↓
[Set: Prepare JSON] ← Formate pour l'API
       ↓
[HTTP Request: API Backend] ← Envoie à PostgreSQL
```

## Configuration étape par étape

### Étape 1 : HTTP Request - Google Places API

**Nœud** : HTTP Request
**Nom** : `Google Places Search`

**Configuration** :
- **Method** : GET
- **URL** : `https://maps.googleapis.com/maps/api/place/textsearch/json`
- **Send Query Parameters** : Yes

**Query Parameters** :
| Name | Value |
|------|-------|
| `query` | `restaurant bordeaux` |
| `key` | `AIzaSyBoOcs0Ob0MBKRDVZ37wVeIECTIsqsEBQ8` |
| `language` | `fr` |
| `type` | `restaurant` |

**Options avancées** (optionnel) :
- `location` : `44.837789,-0.57918` (coordonnées de Bordeaux)
- `radius` : `5000` (5 km autour du centre)

### Étape 2 : Code - Extract Results

**Nœud** : Code
**Nom** : `Extract Results`

```javascript
// Google Places retourne un objet avec results[]
const response = $input.all()[0].json;

// Vérifier s'il y a des résultats
if (!response.results || response.results.length === 0) {
  console.log('Aucun restaurant trouvé');
  return [];
}

// Retourner chaque restaurant comme un item séparé
return response.results.map(restaurant => ({
  json: restaurant
}));
```

### Étape 3 : Split In Batches

**Configuration** :
- **Batch Size** : 1
- **Options** : Reset

### Étape 4 : Code - Format Data

**Nœud** : Code
**Nom** : `Format Restaurant Data`

```javascript
const restaurant = $input.all()[0].json;

// Extraire la ville de formatted_address
// Format : "46 Rue des Trois-Conils, 33000 Bordeaux, France"
const extractCity = (address) => {
  if (!address) return 'Bordeaux';

  // Chercher le code postal français (5 chiffres)
  const match = address.match(/\d{5}\s+([^,]+)/);
  return match ? match[1].trim() : 'Bordeaux';
};

// Formater les données pour le workflow
const formattedData = {
  name: restaurant.name || 'Restaurant sans nom',
  rating: restaurant.rating || 0,
  address: restaurant.formatted_address || '',
  city: extractCity(restaurant.formatted_address),
  business_status: restaurant.business_status || 'UNKNOWN',
  place_id: restaurant.place_id || '',
  photos: restaurant.photos || [],
  location: restaurant.geometry?.location || null
};

return [{ json: formattedData }];
```

### Étape 5 : HTTP Request - Groq AI

**Nœud** : HTTP Request
**Nom** : `Groq - Generate Description`

**Configuration** :
- **Method** : POST
- **URL** : `https://api.groq.com/openai/v1/chat/completions`

**Headers** :
| Name | Value |
|------|-------|
| `Authorization` | `Bearer YOUR_GROQ_API_KEY` |
| `Content-Type` | `application/json` |

**Body** (mode Expression activé avec `=`) :

```javascript
={
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "user",
      "content": `Tu es un rédacteur web spécialisé en gastronomie. Crée une description professionnelle et engageante pour ce restaurant de Bordeaux (2-3 phrases maximum).

Nom : ${$json.name}
Note : ${$json.rating}/5
Adresse : ${$json.address}
Statut : ${$json.business_status === 'OPERATIONAL' ? 'Ouvert' : 'Fermé'}

Retourne UNIQUEMENT la description, sans titre ni formatage.`
    }
  ],
  "temperature": 0.7,
  "max_tokens": 200
}
```

### Étape 6 : Set - Prepare JSON for API

**Nœud** : Set
**Nom** : `Prepare JSON for API`

**Configuration** (mode Manual Mapping) :

| Champ | Type | Valeur (Expression) |
|-------|------|---------------------|
| `name` | String | `={{ $('Format Restaurant Data').item.json.name }}` |
| `description` | String | `={{ $json.choices[0].message.content }}` |
| `rating` | Number | `={{ $('Format Restaurant Data').item.json.rating }}` |
| `address` | String | `={{ $('Format Restaurant Data').item.json.address }}` |
| `city` | String | `={{ $('Format Restaurant Data').item.json.city }}` |
| `website` | String | `null` |
| `images` | Array | `[]` |
| `source` | String | `google_maps` |

**Note** : Les photos Google Places nécessitent une API séparée, on les laisse vides pour l'instant.

### Étape 7 : HTTP Request - Import to Backend

**Nœud** : HTTP Request
**Nom** : `Import to API`

**Configuration** :
- **Method** : POST
- **URL** : `http://backend:3000/scraper/import`

**Headers** :
| Name | Value |
|------|-------|
| `x-api-key` | `nicolas123` |
| `Content-Type` | `application/json` |

**Body** : **Send All**

### Étape 8 : Code - Log Success

**Nœud** : Code
**Nom** : `Log Results`

```javascript
const response = $input.all()[0].json;

console.log('✅ Restaurant importé:', {
  name: response.restaurant?.name,
  action: response.action,
  id: response.restaurant?.id
});

return [{ json: response }];
```

## Gestion des photos Google Places (optionnel)

Pour récupérer les vraies photos, ajoutez un nœud entre "Format Restaurant Data" et "Groq" :

**Nœud** : HTTP Request
**Nom** : `Get Photo URL`

```javascript
// Dans le nœud "Code: Format Restaurant Data", ajoutez :
const photoReference = restaurant.photos?.[0]?.photo_reference;

const photoUrl = photoReference
  ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photoReference}&key=AIzaSyBoOcs0Ob0MBKRDVZ37wVeIECTIsqsEBQ8`
  : null;

// Modifiez le nœud Set pour inclure :
images: photoUrl ? [photoUrl] : []
```

**⚠️ Attention** : Chaque récupération de photo compte comme une requête API.

## Limites et quotas

### Google Places API
- **Gratuit** : 500 requêtes/mois ($200 de crédits gratuits)
- **Prix après quota** : 0,032$/requête (Text Search)
- **Photos** : 0,007$/requête

### Groq API
- **Gratuit** : 14 400 requêtes/jour
- **Limite** : ~10 requêtes/minute

## Optimisations recommandées

### 1. Filtrer les résultats par note minimale

Dans le nœud "Extract Results", ajoutez :

```javascript
// Garder seulement les restaurants avec note >= 4.0
return response.results
  .filter(r => r.rating && r.rating >= 4.0)
  .map(restaurant => ({ json: restaurant }));
```

### 2. Éviter les doublons

Avant "Import to API", ajoutez un nœud **Code** :

```javascript
// Vérifier si le restaurant existe déjà
const name = $json.name;
const address = $json.address;

try {
  const response = await fetch(
    `http://backend:3000/restaurants?name=${encodeURIComponent(name)}`
  );
  const existing = await response.json();

  if (existing.length > 0) {
    console.log(`⏭️  Restaurant "${name}" déjà existant, ignoré`);
    return []; // Skip
  }

  return [$input.all()[0]]; // Continuer

} catch (error) {
  console.error('Erreur vérification doublon:', error);
  return [$input.all()[0]]; // Continuer en cas d'erreur
}
```

### 3. Pagination des résultats

Google Places retourne max 20 résultats par requête. Pour récupérer plus :

```javascript
// Dans "Extract Results"
const response = $input.all()[0].json;
const nextPageToken = response.next_page_token;

// Stocker le token pour la prochaine requête
// Utilisez un nœud "Wait" (2 secondes) + "HTTP Request" avec le token
```

## Test du workflow

1. Cliquez sur **"Execute Workflow"**
2. Vérifiez les résultats à chaque étape :
   - Google Places : ~20 restaurants
   - Extract Results : Array de restaurants
   - Split : 1 restaurant traité à la fois
   - Groq : Description générée
   - API : Restaurant créé

3. Vérifiez dans PostgreSQL :
```bash
docker exec -it restaurants-db psql -U admin -d restaurants
SELECT name, rating, city, source FROM restaurants WHERE source = 'google_maps';
```

## Automatisation

Remplacez "Manual Trigger" par **"Schedule Trigger"** :

**Fréquence recommandée** :
- 🟢 **1x/mois** : Économise les quotas Google (500 requêtes gratuites)
- 🟡 **1x/semaine** : Données fraîches
- 🔴 **1x/jour** : Nécessite un plan payant Google

**Configuration Cron** :
```
0 2 1 * *  (Premier jour de chaque mois à 2h du matin)
```

## Débogage

### Erreur "REQUEST_DENIED"
**Cause** : Clé API invalide ou API non activée

**Solution** :
1. Vérifiez sur https://console.cloud.google.com/
2. Activez "Places API"
3. Vérifiez les restrictions de la clé (IP, domaine)

### Erreur "ZERO_RESULTS"
**Cause** : Aucun restaurant trouvé pour la recherche

**Solution** :
- Modifiez le paramètre `query` : `restaurant bordeaux centre`
- Ajoutez `location` et `radius`

### Erreur "OVER_QUERY_LIMIT"
**Cause** : Quota Google dépassé (500 requêtes/mois)

**Solution** :
- Activez la facturation sur Google Cloud
- Ou attendez le mois suivant
- Ou passez à la liste manuelle

### Groq "Rate limit exceeded"
**Solution** :
- Ajoutez un nœud "Wait" (1 seconde) entre chaque restaurant
- Réduisez le nombre de résultats traités

## Comparaison des approches

| Méthode | Avantages | Inconvénients | Coût |
|---------|-----------|---------------|------|
| **Liste manuelle** | ✅ Gratuit<br>✅ Contrôle total | ❌ Pas automatique | 0€ |
| **Google Places** | ✅ Automatique<br>✅ Données officielles<br>✅ Photos | ❌ Limité à 500/mois<br>❌ Payant après | 0-10€/mois |
| **Scraping** | ✅ Gratuit<br>✅ Illimité | ❌ Illégal (Google Maps)<br>❌ Fragile | 0€ |

**Recommandation** :
- **MVP/Test** : Liste manuelle + Groq
- **Production** : Google Places API + Groq

## Ressources

- [Google Places API Documentation](https://developers.google.com/maps/documentation/places/web-service/search-text)
- [Google Places Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)
- [Tester votre clé API](https://developers.google.com/maps/documentation/places/web-service/search-text#try-it)
