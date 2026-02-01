# Résumé de la session - Configuration du projet Restaurants Bordeaux

**Date** : 30 janvier 2026
**Durée** : ~2 heures

---

## 🎯 Objectifs accomplis

✅ Configuration complète de l'environnement Docker
✅ Configuration du workflow n8n avec Groq (gratuit)
✅ Import automatique de restaurants dans la base de données
✅ Résolution des problèmes de connexion frontend/backend
✅ Connexion à la base de données PostgreSQL

---

## 📋 Étapes réalisées

### 1. Démarrage du projet Docker

**Problème initial** : Base de données PostgreSQL corrompue
- Erreur : `FATAL: role "postgres" does not exist`

**Solution** :
```bash
docker-compose down -v
docker-compose up -d --build
```

**Résultat** : ✅ Tous les services démarrés (PostgreSQL, Backend, Frontend, n8n)

---

### 2. Configuration de n8n

**Objectif** : Créer un workflow pour générer des descriptions de restaurants avec IA

#### 2.1 Choix de l'API IA

**Initialement** : OpenAI (payant, erreur "too many requests")

**Solution adoptée** : **Groq API**
- ✅ Gratuit (14 400 requêtes/jour)
- ✅ Très rapide
- ✅ Modèle : llama-3.3-70b-versatile
- ✅ Compatible OpenAI API

**Clé API Groq** : `gsk_...` (masquée)

#### 2.2 Configuration du workflow n8n

**Ordre des nœuds** :
1. **Manual Trigger** → Point de départ manuel (peut être remplacé par Schedule Trigger)
2. **Code** → Liste des restaurants en dur
3. **Split In Batches** → Traite chaque restaurant individuellement
4. **HTTP Request (Groq)** → Génère la description avec IA
5. **Set (Prepare JSON)** → Reformate les données
6. **HTTP Request (API Backend)** → Envoie à l'API
7. **Code (Log)** → Optionnel, pour logger les résultats

#### 2.3 Configuration du nœud HTTP Request (Groq)

**URL** : `https://api.groq.com/openai/v1/chat/completions`

**Headers** :
- `Authorization`: `Bearer gsk_...` (masquée)
- `Content-Type`: `application/json`

**Body (mode Expression activé)** :
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

#### 2.4 Configuration du nœud Set (Prepare JSON)

**Objectif** : Reformater les données pour l'API backend

**Configuration** :
| Champ | Type | Valeur |
|-------|------|--------|
| name | String | `={{ $('SplitInBatches').item.json["name"] }}` |
| description | String | `={{ $json.choices[0].message.content }}` |
| rating | Number | `={{ $('SplitInBatches').item.json["rating"] }}` |
| address | String | `={{ $('SplitInBatches').item.json["address"] }}` |
| city | String | `Bordeaux` |
| website | String | `={{ $('SplitInBatches').item.json["website"] }}` |
| images | Array | `[]` |
| source | String | `google_maps` |

#### 2.5 Configuration du nœud HTTP Request (Import to API)

**URL** : `http://backend:3000/scraper/import`
**Method** : POST

**Headers** :
- `Content-Type`: `application/json`
- `x-api-key`: `nicolas123`

**Body** : Send All (envoie automatiquement tous les champs du nœud Set)

---

### 3. Configuration de l'API Secret Key

**Problème** : Confusion entre la clé Groq et l'API secret key

**Fichier `.env` corrigé** :
```bash
API_SECRET_KEY=nicolas123        # Clé pour sécuriser l'API backend
GROQ_API_KEY=gsk_...             # Clé pour appeler Groq
```

**Commande** : Redémarrage du backend
```bash
docker-compose restart backend
```

---

### 4. Résolution du problème Frontend 404

**Erreur** : `Error fetching restaurants: [GET] "http://localhost:3000/restaurants": 404`

**Cause** : Le frontend dans Docker ne peut pas accéder au backend via `localhost` lors du SSR (Server-Side Rendering)

**Solution** : Configuration de deux URLs différentes

#### 4.1 Modification de `nuxt.config.ts`

```typescript
runtimeConfig: {
  // Variables côté serveur (SSR) - utilisées dans Docker
  apiBase: process.env.API_BASE_INTERNAL || 'http://backend:3000',

  public: {
    // Variables côté client (navigateur)
    apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000'
  }
}
```

#### 4.2 Modification de `composables/useRestaurants.ts`

```typescript
export const useRestaurants = () => {
  const config = useRuntimeConfig()
  // Utilise apiBase côté serveur (SSR), apiBase public côté client
  const apiBase = import.meta.server ? config.apiBase : config.public.apiBase
  // ...
}
```

#### 4.3 Modification de `docker-compose.yml`

```yaml
frontend:
  environment:
    NODE_ENV: ${NODE_ENV:-development}
    NUXT_PUBLIC_API_BASE: ${NUXT_PUBLIC_API_BASE:-http://localhost:3000}
    API_BASE_INTERNAL: http://backend:3000  # ← Nouvelle variable
```

**Redémarrage** :
```bash
docker-compose restart frontend
```

**Résultat** : ✅ L'erreur 404 a disparu !

---

### 5. Connexion à PostgreSQL

**Informations de connexion** :
```
Host:     localhost
Port:     5432
Database: restaurants
User:     admin
Password: postgres
```

**Utilisation avec un client PostgreSQL** : pgAdmin, DBeaver, TablePlus, ou extension VS Code

---

## 🎉 Résultats finaux

### Workflow n8n fonctionnel

**Test réussi** : Restaurant "La Belle Époque" créé avec succès

**Réponse de l'API** :
```json
{
  "success": true,
  "restaurant": {
    "name": "La Belle Époque\n",
    "description": "Découvrez l'élégance et la raffinement de La Belle Époque...",
    "rating": 4.8,
    "address": "45 Place de la Bourse, 33000 Bordeaux\n",
    "city": "Bordeaux",
    "website": "https://labelleepoque-bordeaux.fr",
    "images": [],
    "source": "google_maps",
    "id": "0baf5cf1-b397-4409-88f1-45e3683e21b6",
    "created_at": "2026-01-30T20:46:35.991Z"
  },
  "action": "created"
}
```

### Services actifs

✅ **PostgreSQL** : http://localhost:5432
✅ **Backend API** : http://localhost:3000
✅ **Frontend** : http://localhost:3001
✅ **n8n** : http://localhost:5678

---

## ⚠️ Problèmes restants

### 1. Rating retourné comme string

**Erreur frontend** : `restaurant.rating.toFixed is not a function`

**Cause** : L'API retourne `"4.80"` (string) au lieu de `4.8` (number)

**Solution à implémenter** : Modifier l'entité Restaurant dans le backend pour transformer le DECIMAL en number

### 2. Erreur PostgreSQL sporadique

**Erreur** : `FATAL: role "postgres" does not exist`

**Quand** : Apparaît parfois dans les logs

**Cause** : Un composant (souvent le healthcheck) tente de se connecter avec l’utilisateur `postgres`, alors que la base est créée avec `POSTGRES_USER=admin`. Le rôle `postgres` n’existe donc pas.

**Correction** : Modifier le healthcheck Postgres pour utiliser le bon utilisateur :
```yaml
healthcheck:
  test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
```

Puis recréer le conteneur Postgres :
```bash
docker-compose up -d --force-recreate postgres
```

**Impact** : Minime, le système fonctionne

---

## 📚 Prochaines étapes recommandées

1. **Corriger le type rating** dans le backend (DECIMAL → number)
2. **Ajouter plus de restaurants** dans le nœud Code de n8n
3. **Automatiser le workflow** avec Schedule Trigger (ex: tous les lundis à 2h)
4. **Tester le frontend** : http://localhost:3001
5. **Scraping réel** (optionnel) : Installer Playwright dans n8n pour scraper Google Maps

---

## 🛠️ Commandes utiles

### Docker

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v
```

### n8n

- **Activer le workflow** : Bouton "Active" en haut à droite
- **Tester manuellement** : Bouton "Test workflow"
- **Voir les executions** : Menu "Executions"

### PostgreSQL

```bash
# Se connecter à la base
docker exec -it restaurants-db psql -U admin -d restaurants

# Lister les restaurants
SELECT name, rating, city FROM restaurants;
```

---

## 💡 Astuces et bonnes pratiques

1. **Groq gratuit** : 14 400 requêtes/jour, largement suffisant pour un MVP
2. **Fréquence de scraping** : 1x/semaine recommandé (tous les lundis à 2h)
3. **Cache Docker** : La 2ème construction est beaucoup plus rapide grâce au cache
4. **Sécurité** : Changer `API_SECRET_KEY` en production
5. **n8n credentials** : Utiliser "Header Auth" pour stocker la clé Groq de manière sécurisée

---

## 🔗 Liens utiles

- Documentation n8n : https://docs.n8n.io/
- Documentation Groq : https://console.groq.com/docs
- Documentation Nuxt : https://nuxt.com/
- Docker Compose : https://docs.docker.com/compose/

---

**Fin de la session** ✨
