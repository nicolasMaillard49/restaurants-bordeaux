# Configuration n8n - Google Places API (Pas à Pas)

Guide visuel pour créer le workflow dans l'interface n8n.

## 📍 Ouvrir n8n

1. Ouvrez http://localhost:5678
2. Cliquez sur **"+ Add workflow"** (ou "New workflow")
3. Nommez le workflow : `Google Places - Import Restaurants`

---

## 🔧 Nœud 1 : Manual Trigger

**Où le trouver** : Il est déjà là par défaut quand vous créez un workflow

**Configuration** : Rien à faire, c'est le point de départ

**Renommer** : Double-cliquez sur le nom → "Start"

---

## 🔧 Nœud 2 : HTTP Request (Google Places)

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Start"
2. Cherchez **"HTTP Request"** dans la barre de recherche
3. Cliquez dessus

### Configuration

**Dans l'onglet "Parameters"** :

1. **Authentication** : None
2. **Request Method** : GET
3. **URL** :
   ```
   https://maps.googleapis.com/maps/api/place/textsearch/json
   ```

4. **Send Query Parameters** : Activez le toggle (ON)

5. Cliquez sur **"Add Parameter"** 4 fois et remplissez :

   | Name | Value |
   |------|-------|
   | `query` | `restaurant bordeaux` |
   | `key` | `AIzaSyBoOcs0Ob0MBKRDVZ37wVeIECTIsqsEBQ8` |
   | `language` | `fr` |
   | `type` | `restaurant` |

6. **Renommez le nœud** : "Google Places API"

7. Cliquez sur **"Execute Node"** pour tester

✅ **Résultat attendu** : Vous devriez voir un JSON avec `results: [...]` contenant ~20 restaurants

---

## 🔧 Nœud 3 : Code (Extract Results)

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Google Places API"
2. Cherchez **"Code"**
3. Cliquez dessus

### Configuration

1. **Mode** : Run Once for All Items
2. **Language** : JavaScript

3. **Copiez ce code** :

```javascript
// Récupérer la réponse de Google Places
const response = $input.all()[0].json;

// Vérifier s'il y a des résultats
if (!response.results || response.results.length === 0) {
  console.log('❌ Aucun restaurant trouvé');
  return [];
}

console.log(`✅ ${response.results.length} restaurants trouvés`);

// Retourner chaque restaurant comme un item séparé
return response.results.map(restaurant => ({
  json: restaurant
}));
```

4. **Renommez le nœud** : "Extract Results"

5. Cliquez sur **"Execute Node"**

✅ **Résultat attendu** : Vous devriez voir 20 items (restaurants) au lieu d'un seul

---

## 🔧 Nœud 4 : Split In Batches

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Extract Results"
2. Cherchez **"Split In Batches"**
3. Cliquez dessus

### Configuration

1. **Batch Size** : 1
2. **Options** :
   - ✅ Cochez "Reset" (sinon il garde les anciens items)

3. **Renommez le nœud** : "SplitInBatches" (SANS ESPACES, important!)

4. Cliquez sur **"Execute Node"**

✅ **Résultat attendu** : Vous devriez voir 1 seul restaurant à la fois

---

## 🔧 Nœud 5 : HTTP Request (Place Details)

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "SplitInBatches" (sur la sortie **"loop"**)
2. Cherchez **"HTTP Request"**
3. Cliquez dessus

### Configuration

**⚠️ IMPORTANT** : Ce nœud récupère les informations détaillées (website, téléphone, horaires, avis)

1. **Authentication** : None
2. **Request Method** : GET
3. **URL** :
   ```
   https://maps.googleapis.com/maps/api/place/details/json
   ```

4. **Send Query Parameters** : Activez le toggle (ON)

5. Cliquez sur **"Add Parameter"** 3 fois et remplissez :

   | Name | Value |
   |------|-------|
   | `place_id` | **Activez "="** puis : `{{ $json.place_id }}` |
   | `fields` | `name,formatted_address,rating,website,formatted_phone_number,opening_hours,price_level,reviews,url,types,user_ratings_total,business_status,photos` |
   | `key` | `AIzaSyBoOcs0Ob0MBKRDVZ37wVeIECTIsqsEBQ8` |

6. **Renommez le nœud** : "Place Details"

7. Cliquez sur **"Execute Node"**

✅ **Résultat attendu** : Un JSON avec `result: { website, formatted_phone_number, opening_hours, reviews... }`

---

## 🔧 Nœud 6 : Code (Format Data)

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Place Details"
2. Cherchez **"Code"**
3. Cliquez dessus

### Configuration

1. **Mode** : Run Once for Each Item
2. **Language** : JavaScript

3. **Copiez ce code** :

```javascript
// ⚠️ Place Details renvoie les données dans result, pas directement dans json
const restaurant = $input.item.json.result;

// Fonction pour extraire la ville de l'adresse
// Exemple : "46 Rue des Trois-Conils, 33000 Bordeaux, France" → "Bordeaux"
const extractCity = (address) => {
  if (!address) return 'Bordeaux';

  // Chercher le pattern : code postal (5 chiffres) + ville
  const match = address.match(/\d{5}\s+([^,]+)/);
  return match ? match[1].trim() : 'Bordeaux';
};

// Convertir les photos en URLs utilisables
const getPhotoUrls = (photos) => {
  if (!photos || photos.length === 0) return [];

  // Prendre les 5 premières photos
  return photos.slice(0, 5).map(photo => {
    return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${photo.photo_reference}&key=AIzaSyBoOcs0Ob0MBKRDVZ37wVeIECTIsqsEBQ8`;
  });
};

// Extraire les types/catégories lisibles
const getCategories = (types) => {
  if (!types) return [];

  // Filtrer les types génériques
  const excluded = ['establishment', 'point_of_interest', 'food'];
  return types.filter(t => !excluded.includes(t));
};

// Formater les données complètes
const formattedData = {
  name: restaurant.name || 'Restaurant sans nom',
  rating: restaurant.rating || 0,
  address: restaurant.formatted_address || '',
  city: extractCity(restaurant.formatted_address),
  business_status: restaurant.business_status || 'UNKNOWN',
  place_id: restaurant.place_id || '',
  user_ratings_total: restaurant.user_ratings_total || 0,

  // 🆕 Nouvelles données de Place Details
  website: restaurant.website || null,
  phone: restaurant.formatted_phone_number || null,
  opening_hours: restaurant.opening_hours?.weekday_text || [],
  price_level: restaurant.price_level || null,
  google_maps_url: restaurant.url || null,
  types: getCategories(restaurant.types),
  photos: getPhotoUrls(restaurant.photos),

  // Les 5 premiers avis (pour afficher sur le frontend)
  reviews: (restaurant.reviews || []).slice(0, 5).map(review => ({
    author: review.author_name,
    rating: review.rating,
    text: review.text,
    date: review.relative_time_description
  }))
};

console.log('📍 Restaurant formaté:', formattedData.name, '- Website:', formattedData.website);

return { json: formattedData };
```

4. **Renommez le nœud** : "Format Restaurant Data"

5. Cliquez sur **"Execute Node"**

✅ **Résultat attendu** : Un objet avec `name`, `rating`, `address`, `website`, `phone`, `opening_hours`, `reviews`...

---

## 🔧 Nœud 7 : HTTP Request (Groq AI)

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Format Restaurant Data"
2. Cherchez **"HTTP Request"**
3. Cliquez dessus

### Configuration

1. **Authentication** : None

2. **Request Method** : POST

3. **URL** :
   ```
   https://api.groq.com/openai/v1/chat/completions
   ```

4. **Send Headers** : Activez (ON)

5. Cliquez sur **"Add Parameter"** 2 fois :

   | Name | Value |
   |------|-------|
   | `Authorization` | `Bearer YOUR_GROQ_API_KEY` |
   | `Content-Type` | `application/json` |

6. **Send Body** : Activez (ON)

7. **Body Content Type** : JSON

8. **Specify Body** : Using Fields Below

9. **Cliquez sur l'icône "=" à côté de "JSON"** pour activer le mode Expression

10. **Copiez ce code** :

```javascript
={
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "user",
      "content": `Tu es un rédacteur web spécialisé en gastronomie. Crée une description professionnelle et engageante pour ce restaurant de Bordeaux (2-3 phrases maximum).

Nom : ${$json.name}
Note : ${$json.rating}/5 (${$json.user_ratings_total} avis)
Adresse : ${$json.address}

Retourne UNIQUEMENT la description, sans titre ni formatage.`
    }
  ],
  "temperature": 0.7,
  "max_tokens": 200
}
```

11. **Renommez le nœud** : "Groq - Generate Description"

12. Cliquez sur **"Execute Node"**

✅ **Résultat attendu** : Vous devriez voir `choices[0].message.content` avec une description

---

## 🔧 Nœud 8 : Set (Prepare JSON)

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Groq - Generate Description"
2. Cherchez **"Set"**
3. Cliquez dessus

### Configuration

1. **Mode** : Manual Mapping

2. Cliquez sur **"Add Value"** 14 fois et configurez :

   **⚠️ IMPORTANT** : Pour chaque valeur, cliquez sur l'icône **"="** pour activer le mode Expression quand indiqué

   | Name | Type | Cliquez "=" | Value |
   |------|------|-------------|-------|
   | `name` | String | ✅ OUI | `{{ $('Format Restaurant Data').item.json.name }}` |
   | `description` | String | ✅ OUI | `{{ $json.choices[0].message.content }}` |
   | `rating` | Number | ✅ OUI | `{{ $('Format Restaurant Data').item.json.rating }}` |
   | `address` | String | ✅ OUI | `{{ $('Format Restaurant Data').item.json.address }}` |
   | `city` | String | ✅ OUI | `{{ $('Format Restaurant Data').item.json.city }}` |
   | `website` | String | ✅ OUI | `{{ $('Format Restaurant Data').item.json.website }}` |
   | `phone` | String | ✅ OUI | `{{ $('Format Restaurant Data').item.json.phone }}` |
   | `opening_hours` | Array | ✅ OUI | `{{ $('Format Restaurant Data').item.json.opening_hours }}` |
   | `price_level` | Number | ✅ OUI | `{{ $('Format Restaurant Data').item.json.price_level }}` |
   | `google_maps_url` | String | ✅ OUI | `{{ $('Format Restaurant Data').item.json.google_maps_url }}` |
   | `types` | Array | ✅ OUI | `{{ $('Format Restaurant Data').item.json.types }}` |
   | `reviews` | Array | ✅ OUI | `{{ $('Format Restaurant Data').item.json.reviews }}` |
   | `images` | Array | ✅ OUI | `{{ $('Format Restaurant Data').item.json.photos }}` |
   | `source` | String | ❌ NON | `google_maps` |

3. **Renommez le nœud** : "Prepare JSON"

4. Cliquez sur **"Execute Node"**

✅ **Résultat attendu** : Un objet JSON propre avec tous les champs (website, phone, opening_hours, reviews...)

---

## 🔧 Nœud 9 : HTTP Request (Import to Backend)

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Prepare JSON"
2. Cherchez **"HTTP Request"**
3. Cliquez dessus

### Configuration

1. **Authentication** : None

2. **Request Method** : POST

3. **URL** :
   ```
   http://backend:3000/scraper/import
   ```

4. **Send Headers** : Activez (ON)

5. Cliquez sur **"Add Parameter"** 2 fois :

   | Name | Value |
   |------|-------|
   | `x-api-key` | `nicolas123` |
   | `Content-Type` | `application/json` |

6. **Send Body** : Activez (ON)

7. **Body Content Type** : JSON

8. **Specify Body** : **Send All** (TRÈS IMPORTANT!)

9. **Renommez le nœud** : "Import to API"

10. Cliquez sur **"Execute Node"**

✅ **Résultat attendu** : `{"success": true, "action": "created", "restaurant": {...}}`

---

## 🔧 Nœud 10 : Code (Log Results) - OPTIONNEL

### Ajouter le nœud

1. Cliquez sur le **+** à droite du nœud "Import to API"
2. Cherchez **"Code"**
3. Cliquez dessus

### Configuration

1. **Mode** : Run Once for Each Item
2. **Language** : JavaScript

3. **Copiez ce code** :

```javascript
const response = $input.item.json;

if (response.success) {
  console.log('✅ Restaurant importé:', response.restaurant.name);
} else {
  console.log('❌ Erreur:', response.message);
}

return { json: response };
```

4. **Renommez le nœud** : "Log Results"

---

## 🔗 Connecter les nœuds

Vérifiez que tous les nœuds sont connectés dans cet ordre :

```
Start
  → Google Places API
    → Extract Results
      → SplitInBatches
        → Place Details (connecté à la sortie "loop")
          → Format Restaurant Data
            → Groq - Generate Description
              → Prepare JSON
                → Import to API
                  → Log Results
```

**⚠️ IMPORTANT** : SplitInBatches a 2 sorties :
- **"loop"** → Connectez Place Details ici (traite chaque restaurant)
- **"done"** → Ne pas utiliser (s'exécute une seule fois à la fin)

---

## ▶️ Tester le workflow complet

1. Cliquez sur le nœud **"Start"**
2. En haut à droite, cliquez sur **"Execute Workflow"** (grand bouton play)
3. Regardez chaque nœud s'exécuter (ils deviennent verts ✅)

**Temps d'exécution** : ~2-3 minutes (20 restaurants × 5-8 secondes chacun)
- Google Text Search : 1 seconde
- Place Details (×20) : ~40 secondes
- Groq descriptions (×20) : ~60 secondes
- Import backend (×20) : ~20 secondes

---

## 🔍 Vérifier dans PostgreSQL

Après l'exécution, vérifiez que les restaurants sont bien importés :

```bash
docker exec -it restaurants-db psql -U admin -d restaurants
```

Puis dans PostgreSQL :

```sql
SELECT name, rating, city, source FROM restaurants WHERE source = 'google_maps' ORDER BY rating DESC LIMIT 10;
```

Sortie avec `\q`

---

## 🎯 Optimisations rapides

### Limiter le nombre de restaurants

Dans le nœud **"Extract Results"**, modifiez :

```javascript
// Garder seulement les 5 premiers restaurants (pour tester)
return response.results.slice(0, 5).map(restaurant => ({
  json: restaurant
}));
```

### Filtrer par note minimale

Dans le nœud **"Extract Results"**, modifiez :

```javascript
// Garder seulement rating >= 4.0
return response.results
  .filter(r => r.rating && r.rating >= 4.0)
  .map(restaurant => ({ json: restaurant }));
```

---

## ⏰ Automatiser (optionnel)

### Remplacer Manual Trigger par Schedule Trigger

1. **Supprimez** le nœud "Start"
2. Cliquez sur le **+** au début du workflow
3. Cherchez **"Schedule Trigger"**
4. Configuration :
   - **Trigger Interval** : Custom (Cron)
   - **Cron Expression** : `0 2 1 * *` (1er du mois à 2h)
   - **Timezone** : Europe/Paris

5. Connectez-le au nœud "Google Places API"

6. En haut à droite, **activez le workflow** (toggle "Active")

---

## 🚨 Problèmes courants

### ❌ "Referenced node doesn't exist"

**Dans le nœud "Prepare JSON"**, vérifiez :
- Le nœud s'appelle exactement `Format Restaurant Data` (avec espaces)
- Utilisez `$('Format Restaurant Data')` entre guillemets simples

### ❌ "Invalid API key" (Backend)

Vérifiez le header `x-api-key` = `nicolas123`

### ❌ "Authorization failed" (Groq)

Vérifiez le header `Authorization` = `Bearer gsk_...` (avec un espace après "Bearer")

### ❌ Nœud rouge après exécution

Cliquez sur le nœud rouge → Regardez l'onglet "Error" pour voir le message

---

## 📊 Tableau de bord n8n

Pour voir l'historique des exécutions :

1. Menu de gauche → **"Executions"**
2. Cliquez sur une exécution pour voir les détails
3. Vous pouvez re-exécuter une ancienne exécution

---

## 💡 Astuces

### Tester un seul nœud

Cliquez sur un nœud → **"Execute Node"** (bouton play sur le nœud)

### Voir les données

Cliquez sur un nœud → Les données s'affichent en dessous

### Copier le workflow

En haut à droite → **"..."** → **"Duplicate"**

### Sauvegarder automatiquement

n8n sauvegarde automatiquement chaque modification ✅

---

## 📊 Nouvelles données disponibles

Avec le nœud **Place Details**, vous récupérez maintenant :

| Donnée | Utilité frontend | Exemple |
|--------|------------------|---------|
| `website` | Lien "Site web" | https://restaurantlesdroles.fr/ |
| `phone` | Bouton "Appeler" | +33 5 56 48 13 69 |
| `opening_hours` | Afficher les horaires jour par jour | ["Monday: 7:00 – 10:30 PM", ...] |
| `price_level` | Badge prix (€, €€, €€€) | 2 → €€ |
| `google_maps_url` | Bouton "Voir sur Google Maps" | https://maps.google.com/?cid=... |
| `types` | Tags/catégories | ["restaurant", "bar"] |
| `photos` | Galerie photos | 5 URLs d'images Google |
| `reviews` | Avis clients avec texte + note | Tableau de 5 avis |

### Exemple d'affichage sur la page détails :

**Section Infos pratiques** :
- 📞 Téléphone : +33 5 56 48 13 69
- 🌐 Site web : restaurantlesdroles.fr
- 💰 Gamme de prix : €€ (Modéré)
- 🕒 Ouvert maintenant

**Section Horaires** :
```
Lundi : 19h00 – 22h30
Mardi : 19h00 – 22h30
...
```

**Section Avis** :
- Note moyenne : 4.7/5 (2206 avis)
- Les 5 derniers avis avec texte, note, auteur

**Section Photos** :
- Galerie de 5 photos issues de Google Maps

---

## 🎯 Coût par restaurant

Avec Place Details, chaque restaurant importé coûte **2 requêtes** :
1. **Text Search** : 0,032 $ / requête
2. **Place Details** : 0,017 $ / requête

**Total par restaurant** : ~0,049 $ (≈ 0,045 €)

**Pour 20 restaurants** : ~1 € / import

**Quota gratuit Google** :
- 500 requêtes gratuites/mois
- Permet d'importer ~250 restaurants/mois gratuitement

---

Voilà! Avec ces instructions, vous devriez pouvoir créer le workflow complet dans n8n en 15-20 minutes.

Dites-moi si vous bloquez sur un nœud spécifique!
