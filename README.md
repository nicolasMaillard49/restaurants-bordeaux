# 🍽️ Restaurants Bordeaux - Application Web Automatisée

Application web complète pour lister les meilleurs restaurants de Bordeaux avec collecte automatique des données.

## 📋 Stack Technique

- **Frontend** : Nuxt 3 + Nuxt UI
- **Backend** : NestJS + TypeORM + PostgreSQL
- **Automatisation** : n8n + Playwright
- **IA** : OpenAI API (via n8n)
- **Infrastructure** : Docker + Docker Compose

## 🚀 Démarrage Rapide

### Prérequis

- Docker et Docker Compose installés
- Node.js 20+ (pour développement local optionnel)

### 1. Configuration

Copiez le fichier d'environnement et configurez vos variables :

```bash
cp .env.example .env
```

Éditez `.env` et modifiez au minimum :
```env
API_SECRET_KEY=votre-cle-secrete-forte
POSTGRES_PASSWORD=un-mot-de-passe-fort
```

### 2. Démarrage des services

```bash
# Démarrer tous les services
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down
```

### 3. Accès aux services

Une fois démarrés, les services sont accessibles sur :

- **Frontend** : http://localhost:3001
- **Backend API** : http://localhost:3000
- **n8n** : http://localhost:5678
- **PostgreSQL** : localhost:5432

### 4. Vérification

Testez l'API backend :
```bash
# Liste des restaurants
curl http://localhost:3000/restaurants

# Santé de l'API
curl http://localhost:3000
```

## 📡 API Endpoints

### Endpoints Publics

- `GET /restaurants` - Liste tous les restaurants
- `GET /restaurants/:id` - Détails d'un restaurant

### Endpoint Privé (n8n)

- `POST /scraper/import` - Import d'un restaurant
  - Header requis : `x-api-key: <votre-cle-secrete>`

Exemple :
```bash
curl -X POST http://localhost:3000/scraper/import \
  -H "Content-Type: application/json" \
  -H "x-api-key: votre-cle-secrete" \
  -d '{
    "name": "Le Bistrot Bordelais",
    "description": "Cuisine française traditionnelle",
    "rating": 4.5,
    "address": "123 Rue Sainte-Catherine, Bordeaux",
    "website": "https://example.com",
    "images": ["https://example.com/image.jpg"],
    "source": "google_maps"
  }'
```

## 🤖 Configuration n8n

### Première connexion

1. Ouvrez http://localhost:5678
2. Créez votre compte utilisateur
3. Vous êtes prêt à créer des workflows

### Workflow de scraping recommandé

Le workflow n8n doit suivre cette logique :

```
1. [Trigger Manuel ou Cron]
   ↓
2. [Playwright - Recherche Google Maps "restaurants Bordeaux"]
   ↓
3. [Loop sur les résultats]
   ↓
4. [Playwright - Extraction données restaurant]
   ↓
5. [HTTP Request - Site officiel du restaurant]
   ↓
6. [Playwright - Extraction description + images]
   ↓
7. [OpenAI API - Reformulation description]
   ↓
8. [HTTP Request - POST vers /scraper/import]
   ↓
9. [Log succès/erreur]
```

### Configuration OpenAI dans n8n

1. Dans n8n, allez dans **Settings > Credentials**
2. Ajoutez **OpenAI**
3. Entrez votre clé API OpenAI
4. Utilisez cette credential dans votre workflow

### Headers requis pour l'import

Configurez le nœud HTTP Request vers `/scraper/import` :

```
Method: POST
URL: http://backend:3000/scraper/import
Headers:
  x-api-key: <valeur de API_SECRET_KEY du .env>
  Content-Type: application/json
Body: JSON avec les données du restaurant
```

## 🗄️ Base de Données

### Schéma

Table `restaurants` :
- `id` (uuid, PK)
- `name` (varchar)
- `description` (text)
- `rating` (decimal)
- `address` (varchar)
- `city` (varchar)
- `website` (varchar, nullable)
- `images` (jsonb)
- `source` (varchar)
- `last_update` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Accès direct

```bash
# Connexion à PostgreSQL
docker exec -it restaurants-db psql -U postgres -d restaurants

# Requêtes utiles
SELECT * FROM restaurants;
SELECT COUNT(*) FROM restaurants;
SELECT name, rating FROM restaurants ORDER BY rating DESC;
```

## 🛠️ Développement

### Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

### Frontend (Nuxt)

```bash
cd frontend
npm install
npm run dev
```

### Structure du projet

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/     # RestaurantsController, ScraperController
│   │   ├── services/        # RestaurantsService
│   │   ├── entities/        # Restaurant entity
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── guards/          # ApiKeyGuard
│   │   ├── modules/         # RestaurantsModule
│   │   ├── app.module.ts    # Module principal
│   │   └── main.ts          # Point d'entrée
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── pages/
│   │   ├── index.vue        # Liste des restaurants
│   │   └── restaurants/
│   │       └── [id].vue     # Page détail
│   ├── composables/
│   │   └── useRestaurants.ts
│   ├── app.vue
│   ├── nuxt.config.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🔒 Sécurité

### En développement

- L'API accepte les requêtes de toutes origines (CORS *)
- La base utilise des credentials par défaut

### En production

1. Changez TOUS les mots de passe dans `.env`
2. Définissez `API_SECRET_KEY` avec une valeur forte
3. Configurez CORS pour accepter uniquement votre domaine
4. Utilisez HTTPS (Let's Encrypt + NGINX)
5. Limitez l'accès à PostgreSQL

## 📊 Monitoring et logs

```bash
# Logs de tous les services
docker-compose logs -f

# Logs d'un service spécifique
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f n8n

# Statut des containers
docker-compose ps
```

## 🐛 Troubleshooting

### Le backend ne démarre pas

```bash
# Vérifier que PostgreSQL est démarré
docker-compose ps postgres

# Vérifier les logs
docker-compose logs postgres
docker-compose logs backend
```

### Le frontend ne se connecte pas à l'API

Vérifiez que `NUXT_PUBLIC_API_BASE` dans `.env` pointe vers le bon endpoint :
- En dev local : `http://localhost:3000`
- En production : `https://votre-domaine.com`

### Erreur "Invalid API key" lors de l'import

Vérifiez que :
1. `API_SECRET_KEY` est identique dans `.env` et dans n8n
2. Le header `x-api-key` est bien envoyé dans la requête

## 🚢 Déploiement Production (VPS Hostinger)

### Prérequis

- VPS avec Docker installé
- Nom de domaine configuré
- Accès SSH au serveur

### Étapes

1. Clonez le projet sur le VPS
2. Créez `.env` avec les bonnes valeurs de production
3. Lancez avec `docker-compose up -d`
4. Configurez NGINX comme reverse proxy
5. Activez HTTPS avec Let's Encrypt

Configuration NGINX recommandée (à venir dans la V2).

## 📝 Roadmap V1

- [x] Infrastructure Docker
- [x] Backend API fonctionnel
- [x] Frontend avec liste + détail
- [ ] Workflow n8n complet
- [ ] Import automatique de 20-30 restaurants
- [ ] Tests et stabilisation
- [ ] Déploiement VPS

## 💰 Coûts estimés

- **VPS Hostinger** : ~5€/mois
- **OpenAI API** : ~2-5€/mois (usage limité)
- **Total** : < 10€/mois

## 🤝 Contribution

Ce projet est en développement actif. Les contributions sont bienvenues !

## 📄 License

MIT
