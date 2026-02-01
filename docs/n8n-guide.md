# Guide de Configuration n8n

Ce guide explique comment créer le workflow n8n pour importer automatiquement des restaurants dans votre base de données avec descriptions générées par IA.

## Stack technique

- **n8n** : Workflow automation (inclus dans Docker)
- **Groq API** : IA gratuite pour générer les descriptions (llama-3.3-70b-versatile)
- **Backend API** : NestJS sur `http://backend:3000`
- **PostgreSQL** : Base de données
- **Limite Groq** : 14 400 requêtes/jour (gratuit)

## Accès à n8n

1. Démarrez les services : `docker-compose up -d`
2. Ouvrez http://localhost:5678
3. Créez votre compte utilisateur (première fois uniquement)

## Architecture du workflow

```
[Manual Trigger]
       ↓
[Code: Liste restaurants] ← Vous ajoutez manuellement les restaurants ici
       ↓
[Split In Batches] ← Traite chaque restaurant individuellement
       ↓
[HTTP Request: Groq] ← Génère une description avec IA (gratuit)
       ↓
[Set: Prepare JSON] ← Formate les données pour l'API
       ↓
[HTTP Request: API] ← Envoie au backend PostgreSQL
       ↓
[Code: Log] ← (Optionnel) Affiche les résultats
```

**Temps d'exécution** : ~2-3 secondes par restaurant

## Création du Workflow

### Étape 1 : Créer un nouveau workflow

1. Cliquez sur **"New workflow"**
2. Nommez-le : `Scraping Restaurants Bordeaux`

### Étape 2 : Ajouter le trigger

1. Ajoutez un nœud **"Manual Trigger"**
2. C'est le point de départ du workflow
3. Plus tard, vous pourrez le remplacer par un **"Cron"** pour automatiser

### Étape 3 : Source des données restaurants

#### Option A (recommandée pour MVP) : Liste manuelle + IA

Cette approche est celle **actuellement en production** dans votre workflow.

1. Ajoutez un nœud **"Code"**
2. Nommez-le : `Liste Restaurants`
3. Code :

```javascript
// Liste manuelle de restaurants à importer
const restaurants = [
  {
    name: "Le Bistrot Bordelais",
    rating: 4.5,
    address: "123 Rue Sainte-Catherine, 33000 Bordeaux",
    website: null
  },
  {
    name: "La Belle Époque",
    rating: 4.8,
    address: "45 Place de la Bourse, 33000 Bordeaux",
    website: "https://labelleepoque-bordeaux.fr"
  },
  {
    name: "Le Pressoir d'Argent",
    rating: 4.9,
    address: "2-5 Place de la Comédie, 33000 Bordeaux",
    website: "https://www.pressoir-dargent.com"
  }
  // Ajoutez plus de restaurants ici
];

return restaurants.map(r => ({ json: r }));
```

**Avantages** :
- ✅ Légal (pas de scraping)
- ✅ Fiable (pas de changement de DOM)
- ✅ Gratuit avec Groq (14 400 requêtes/jour)
- ✅ Contrôle total sur la qualité des données

#### Option B : Google Places API (recommandée pour production)

Pour récupérer automatiquement des restaurants depuis Google de manière **légale**.

1. Obtenez une clé API Google Places : https://console.cloud.google.com/
2. Ajoutez un nœud **"HTTP Request"**
3. Configuration :
   - Method: GET
   - URL: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+bordeaux&key=AIzaSyBoOcs0Ob0MBKRDVZ37wVeIECTIsqsEBQ8`

**Tarif** : 500 requêtes gratuites/mois, puis 0,032$/requête

#### Option C : Scraping avec Playwright (déconseillé)

⚠️ **ATTENTION** : Le scraping de Google Maps viole leurs Conditions d'Utilisation et peut entraîner un blocage IP.

Si vous souhaitez tout de même scraper un site (autre que Google Maps), voici la procédure :

**1. Créer un Dockerfile personnalisé pour n8n**

Créez le fichier `n8n/Dockerfile` :

```Dockerfile
FROM n8nio/n8n:latest

USER root

# Installation des dépendances système pour Chromium
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    nodejs \
    npm

# Installation de Playwright
RUN npm install -g playwright@1.40.0
RUN npx playwright install chromium --with-deps

# Variables d'environnement pour Chromium
ENV PLAYWRIGHT_BROWSERS_PATH=/usr/lib/chromium
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

USER node
```

**2. Modifier `docker-compose.yml`**

Remplacez la section n8n :

```yaml
n8n:
  build:
    context: ./n8n
    dockerfile: Dockerfile
  image: restaurants-n8n:latest
  container_name: restaurants-n8n
  restart: unless-stopped
  ports:
    - "${N8N_PORT:-5678}:5678"
  environment:
    - N8N_HOST=${N8N_HOST:-localhost}
    - N8N_PORT=5678
    - N8N_PROTOCOL=${N8N_PROTOCOL:-http}
    - WEBHOOK_URL=${WEBHOOK_URL:-http://localhost:5678}
    - GENERIC_TIMEZONE=${TIMEZONE:-Europe/Paris}
  volumes:
    - n8n_data:/home/node/.n8n
  networks:
    - restaurants-network
  # Ajout de permissions pour Chromium
  cap_add:
    - SYS_ADMIN
```

**3. Rebuild le container n8n**

```bash
docker-compose build n8n
docker-compose up -d n8n
```

**4. Code Playwright dans n8n**

Exemple de scraping d'un site (PAS Google Maps) :

```javascript
const { chromium } = require('playwright');

// Lancement du navigateur
const browser = await chromium.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage'
  ]
});

const page = await browser.newPage();

// Exemple : scraper un site d'avis (remplacez par votre URL)
await page.goto('https://www.exemple-site-avis.com/restaurants-bordeaux', {
  waitUntil: 'networkidle'
});

// Attendre que le contenu soit chargé
await page.waitForSelector('.restaurant-card', { timeout: 10000 });

// Extraire les données
const restaurants = await page.$$eval('.restaurant-card', (cards) => {
  return cards.map(card => ({
    name: card.querySelector('.name')?.textContent?.trim() || '',
    rating: parseFloat(card.querySelector('.rating')?.textContent) || 0,
    address: card.querySelector('.address')?.textContent?.trim() || '',
    website: card.querySelector('a')?.href || null
  }));
});

await browser.close();

// Retourner les résultats pour n8n
return restaurants.map(r => ({ json: r }));
```

**Notes importantes** :
- Remplacez les sélecteurs CSS (`.restaurant-card`, `.name`, etc.) par ceux du site cible
- Testez d'abord le code dans un fichier Node.js local
- Ajoutez des délais (`await page.waitForTimeout(2000)`) pour éviter les bans
- Vérifiez les conditions d'utilisation du site cible


### Étape 4 : Traiter les restaurants un par un

1. Ajoutez un nœud **"Split In Batches"**
2. Configuration :
   - Batch Size: 1
   - Cela permet de traiter chaque restaurant individuellement

### Étape 5 : Génération de descriptions avec Groq (IA gratuite)

**Groq** est une alternative gratuite à OpenAI avec 14 400 requêtes/jour.

1. Ajoutez un nœud **"HTTP Request"**
2. Nommez-le : `Groq AI - Generate Description`
3. Configuration :

**Authentication** : None (on utilise un header personnalisé)

**Request Method** : POST

**URL** : `https://api.groq.com/openai/v1/chat/completions`

**Send Headers** : Yes
- Header 1:
  - Name: `Authorization`
  - Value: `Bearer gsk_VOTRE_CLE_GROQ` (remplacez par votre clé depuis .env)
- Header 2:
  - Name: `Content-Type`
  - Value: `application/json`

**Send Body** : Yes

**Body Content Type** : JSON

**Specify Body** : Using Expression

**Activez le mode Expression** (cliquez sur l'icône `=` à côté du champ JSON)

**JSON Body** :

```javascript
={
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {
      "role": "user",
      "content": `Tu es un rédacteur web spécialisé en gastronomie. Crée une description professionnelle et engageante pour ce restaurant (2-3 phrases maximum).

Nom : ${$json.name}
Note : ${$json.rating}/5
Adresse : ${$json.address}

Retourne UNIQUEMENT la description.`
    }
  ],
  "temperature": 0.7
}
```

**Récupérer la clé Groq** :
1. Créez un compte gratuit sur https://console.groq.com
2. Allez dans "API Keys"
3. Créez une nouvelle clé (format : `gsk_...`)
4. Ajoutez-la dans votre fichier `.env` : `GROQ_API_KEY=gsk_...`

### Étape 6 : Formater les données

1. Ajoutez un nœud **"Set"**
2. Nommez-le : `Prepare JSON`
3. Configuration :

**Mode** : Manual Mapping

**Cliquez sur "Add Value"** pour chaque champ et configurez :

| Nom du champ | Type | Valeur (mode Expression activé avec `=`) |
|--------------|------|------------------------------------------|
| `name` | String | `={{ $('SplitInBatches').item.json["name"] }}` |
| `description` | String | `={{ $json.choices[0].message.content }}` |
| `rating` | Number | `={{ $('SplitInBatches').item.json["rating"] }}` |
| `address` | String | `={{ $('SplitInBatches').item.json["address"] }}` |
| `city` | String | `Bordeaux` |
| `website` | String | `={{ $('SplitInBatches').item.json["website"] }}` |
| `images` | Array | `[]` |
| `source` | String | `google_maps` |

**Important** :
- ⚠️ Activez le mode Expression (`=`) pour les champs avec `$(...)`
- Les valeurs entre `{{ }}` sont pour l'ancien format, utilisez `={{ }}` dans n8n
- `$('SplitInBatches')` référence les données du nœud SplitInBatches
- `$json` référence les données du nœud précédent (Groq)

### Étape 7 : Envoyer à l'API Backend

1. Ajoutez un nœud **"HTTP Request"**
2. Nommez-le : `Import to API`
3. Configuration :

**Authentication** : None (on utilise un header personnalisé)

**Request Method** : POST

**URL** : `http://backend:3000/scraper/import`

**Send Headers** : Yes
- Header 1:
  - Name: `x-api-key`
  - Value: `nicolas123` (ou la valeur de votre `API_SECRET_KEY` dans `.env`)
- Header 2:
  - Name: `Content-Type`
  - Value: `application/json`

**Send Body** : Yes

**Body Content Type** : JSON

**Specify Body** : Send All

⚠️ **Important** : Sélectionnez **"Send All"** au lieu de "Using JSON".
Cela envoie automatiquement tous les champs du nœud "Set" précédent.

Si vous voulez spécifier manuellement le JSON, activez le mode Expression et utilisez :

```javascript
={
  "name": $json.name,
  "description": $json.description,
  "rating": $json.rating,
  "address": $json.address,
  "city": $json.city,
  "website": $json.website,
  "images": $json.images,
  "source": $json.source
}
```

### Étape 8 : Logger le résultat

1. Ajoutez un nœud **"Code"**
2. Nommez-le : `Log Success`
3. Code :

```javascript
const response = $input.item.json;
console.log('Restaurant imported:', response);
return [{ json: response }];
```

## Test du Workflow

1. Cliquez sur **"Execute Workflow"** en haut à droite
2. Vérifiez que chaque nœud s'exécute sans erreur
3. Consultez les logs de chaque nœud
4. Vérifiez dans la base de données :

```bash
docker exec -it restaurants-db psql -U admin -d restaurants
SELECT * FROM restaurants;
```

## Configuration de la clé API Groq

Deux options pour gérer la clé API Groq :

### Option 1 : Directement dans le nœud HTTP Request (actuelle)

Copiez directement la clé dans le header Authorization du nœud HTTP Request :
```
Authorization: Bearer gsk_VOTRE_CLE_ICI
```

**Avantage** : Simple et rapide
**Inconvénient** : La clé est visible dans le workflow

### Option 2 : Utiliser les Credentials n8n (recommandé pour production)

1. Dans n8n, allez dans **Settings** → **Credentials**
2. Cliquez sur **"Create New Credential"**
3. Cherchez et sélectionnez **"Header Auth"**
4. Configuration :
   - **Name** : `Groq API Key`
   - **Header Name** : `Authorization`
   - **Header Value** : `Bearer gsk_VOTRE_CLE_GROQ`
5. Cliquez sur **"Save"**

6. Dans votre nœud HTTP Request (Groq) :
   - **Authentication** : Header Auth
   - **Credential for Header Auth** : Sélectionnez "Groq API Key"
   - Supprimez le header Authorization manuel

**Avantage** : Clé sécurisée et réutilisable
**Inconvénient** : Configuration initiale un peu plus longue

## Automatisation avec Cron

Pour exécuter le workflow automatiquement :

1. Remplacez le nœud "Manual Trigger" par un nœud **"Cron"**
2. Configuration :
   - Mode : Every Week
   - Weekday : Monday
   - Hour : 2
   - Minute : 0
3. Le workflow s'exécutera tous les lundis à 2h du matin

## Débogage

### Erreur "Invalid API key" (Backend)

**Symptôme** : `401 Unauthorized: Invalid API key`

**Solution** :
- Vérifiez que le header `x-api-key` contient la bonne valeur
- Vérifiez que la valeur correspond à `API_SECRET_KEY` dans le `.env`
- Valeur actuelle : `nicolas123`
- Redémarrez le backend après modification : `docker-compose restart backend`

### Erreur de connexion au backend

**Symptôme** : `ECONNREFUSED` ou `404 Not Found`

**Solution** :
- ✅ Utilisez `http://backend:3000` (nom du service Docker dans n8n)
- ❌ N'utilisez PAS `http://localhost:3000` (ne fonctionne pas entre containers)
- Vérifiez que le backend est démarré : `docker-compose ps`
- Vérifiez les logs : `docker-compose logs backend`

### Groq : "Authorization failed"

**Symptôme** : `401 Unauthorized` ou `Authorization failed - please check your credentials`

**Causes possibles** :
1. **Clé API invalide** :
   - Vérifiez sur https://console.groq.com/keys
   - La clé doit commencer par `gsk_`
   - Régénérez une nouvelle clé si nécessaire

2. **Format du header incorrect** :
   - ✅ Correct : `Bearer gsk_VotreCleIci` (avec un espace)
   - ❌ Incorrect : `Bearergsk_VotreCleIci` (pas d'espace)
   - ❌ Incorrect : `Bearer  gsk_VotreCleIci` (deux espaces)

3. **Clé dans le mauvais champ** :
   - La clé Groq va dans le header du nœud HTTP Request (Groq)
   - La clé `nicolas123` va dans le header du nœud HTTP Request (API Backend)

### Groq : "Rate limit exceeded"

**Symptôme** : `429 Too Many Requests`

**Limite gratuite** : 14 400 requêtes/jour (~10 requêtes/minute)

**Solutions** :
- Ajoutez un délai entre les requêtes (nœud "Wait" dans n8n)
- Réduisez le nombre de restaurants traités simultanément
- Passez à un compte payant Groq pour des limites plus élevées

### Erreur "Referenced node doesn't exist" (Set node)

**Symptôme** : Champs en rouge dans le nœud Set

**Solution** :
- Vérifiez que le nœud "SplitInBatches" existe et est connecté
- Vérifiez l'orthographe exacte : `$('SplitInBatches')` (sensible à la casse)
- Renommez le nœud "Split In Batches" en "SplitInBatches" (sans espaces)

### Erreur "JSON parameter needs to be valid JSON"

**Symptôme** : Erreur de parsing JSON dans le nœud HTTP Request

**Solution** :
- ✅ Activez le mode Expression (cliquez sur l'icône `=`)
- ✅ Utilisez des template literals avec backticks : `` `${$json.name}` ``
- ❌ N'utilisez PAS de guillemets dans les variables : `"${$json.name}"` (incorrect)

### Le frontend n'affiche pas les restaurants

**Symptôme** : Page vide ou erreur 404

**Solutions** :
1. Vérifiez que le backend retourne des données :
   ```bash
   curl http://localhost:3000/restaurants
   ```

2. Vérifiez la base de données :
   ```bash
   docker exec -it restaurants-db psql -U admin -d restaurants
   SELECT COUNT(*) FROM restaurants;
   ```

3. Redémarrez le frontend :
   ```bash
   docker-compose restart frontend
   ```

## Optimisations Futures

### 1. Passer à Google Places API (production)

**Pourquoi** : Source officielle, légale et fiable de données Google Maps

**Comment** :
1. Créez un projet sur https://console.cloud.google.com/
2. Activez l'API "Places API"
3. Créez une clé API
4. Remplacez le nœud "Code" par un nœud "HTTP Request" :
   ```
   GET https://maps.googleapis.com/maps/api/place/textsearch/json?query=restaurant+bordeaux&key=VOTRE_CLE
   ```

**Coût** : 500 requêtes gratuites/mois, puis 0,032$/requête

### 2. Ajouter un cache pour éviter les doublons

**Problème** : Le workflow peut créer des doublons si exécuté plusieurs fois

**Solution** :
1. Ajoutez un nœud "Code" avant "Import to API" :
   ```javascript
   // Vérifier si le restaurant existe déjà
   const response = await fetch(`http://backend:3000/restaurants?name=${$json.name}`);
   const existing = await response.json();

   if (existing.length > 0) {
     return []; // Skip ce restaurant
   }

   return [$json]; // Continuer
   ```

### 3. Gestion des erreurs avec IF node

**Ajoutez un nœud "IF"** après chaque HTTP Request :
- Si succès (status 200-299) → Continuer
- Si erreur (status 400+) → Envoyer une notification

**Exemple** :
```
IF: {{ $json.statusCode }} >= 400
  → True: Send Email (notification d'erreur)
  → False: Continue
```

### 4. Notifications par email

**En cas d'échec du workflow** :

1. Ajoutez un nœud **"Send Email"** (SMTP)
2. Configuration :
   - To: votre@email.com
   - Subject: `[n8n] Erreur import restaurants`
   - Body: `{{ $json.error }}`

**Alternative** : Utilisez Discord/Slack webhook pour des notifications instantanées

### 5. Statistiques et logs

**Ajoutez un nœud "Code" final** pour compter :
```javascript
const total = $input.all().length;
const succeeded = $input.all().filter(i => i.json.success).length;
const failed = total - succeeded;

console.log(`Import terminé: ${succeeded}/${total} restaurants importés`);

return [{
  json: {
    total,
    succeeded,
    failed,
    timestamp: new Date().toISOString()
  }
}];
```

### 6. Upload d'images vers un CDN

**Problème** : Les images sont actuellement vides (`images: []`)

**Solution** :
1. Récupérez les URLs d'images depuis Google Places API
2. Téléchargez les images localement avec un nœud HTTP Request
3. Uploadez vers Cloudinary/S3 avec un nœud dédié
4. Stockez les URLs finales dans `images: ["https://cdn.com/img1.jpg"]`

### 7. Améliorer les descriptions IA

**Variations de prompt Groq** :

Pour un ton plus marketing :
```javascript
content: `Rédige une description vendeuse et appétissante pour ce restaurant (style guide Michelin). Mets en avant l'expérience culinaire unique.`
```

Pour inclure des emojis :
```javascript
content: `Crée une description Instagram-friendly avec 2-3 emojis pertinents.`
```

Pour du SEO :
```javascript
content: `Rédige une meta description SEO (max 160 caractères) incluant les mots-clés: restaurant Bordeaux, ${$json.name}.`
```

### 8. Automatisation complète

**Remplacez "Manual Trigger" par "Schedule Trigger"** :

**Fréquence recommandée** :
- 🟢 **1x/semaine** (dimanche 2h du matin) : Idéal pour un MVP
- 🟡 **1x/jour** (3h du matin) : Pour une production active
- 🔴 **1x/heure** : Seulement si vous avez une API payante

**Configuration** :
- Mode: Custom (Cron)
- Cron Expression: `0 2 * * 0` (dimanche à 2h)
- Timezone: Europe/Paris

## Ressources

### Documentation
- [n8n Documentation](https://docs.n8n.io/)
- [Groq API Documentation](https://console.groq.com/docs)
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service)
- [Playwright Documentation](https://playwright.dev/)

### Outils utiles
- [Crontab Guru](https://crontab.guru/) - Générateur d'expressions cron
- [JSON Formatter](https://jsonformatter.org/) - Validation de JSON
- [Regex101](https://regex101.com/) - Test d'expressions régulières
- [Groq Playground](https://console.groq.com/playground) - Test des prompts IA

### Alternatives à Groq (IA gratuite)
- **Hugging Face API** : Modèles open-source gratuits
- **Cohere** : 100 requêtes/minute gratuites
- **Together AI** : Crédits gratuits mensuels

### Stack technique actuelle
```
Frontend : Nuxt 3 + Vue 3 + Tailwind CSS
Backend  : NestJS + TypeORM + PostgreSQL
Workflow : n8n
IA       : Groq (llama-3.3-70b-versatile)
Docker   : docker-compose
```
