# 🍽️ Projet Restaurants Bordeaux - Résumé Complet

## Vue d'ensemble

Application web automatisée listant les meilleurs restaurants de Bordeaux avec collecte automatique des données via scraping et IA.

## Architecture Technique

```
┌─────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │   Frontend (Nuxt 3)  │
              │   - Pages liste      │
              │   - Page détail      │
              │   - Nuxt UI          │
              └──────────┬───────────┘
                         │ HTTP GET
                         ▼
              ┌──────────────────────┐
              │  Backend (NestJS)    │
              │  - API REST          │
              │  - TypeORM           │
              └──────────┬───────────┘
                         │
                         ▼
              ┌──────────────────────┐
              │  PostgreSQL          │
              │  - Table restaurants │
              └──────────────────────┘
                         ▲
                         │ POST (import)
              ┌──────────┴───────────┐
              │   n8n Automation     │
              │   1. Playwright      │
              │   2. OpenAI          │
              │   3. HTTP Request    │
              └──────────────────────┘
```

## Stack Technique

### Frontend
- **Framework** : Nuxt 3
- **UI** : Nuxt UI (composants + styling)
- **Rôle** : Affichage uniquement
- **Pages** : Liste + Détail
- **Port** : 3001

### Backend
- **Framework** : NestJS
- **Base de données** : PostgreSQL
- **ORM** : TypeORM
- **Rôle** : API + Stockage
- **Port** : 3000

### Automatisation
- **Outil** : n8n
- **Scraping** : Playwright
- **IA** : OpenAI API
- **Port** : 5678

### Infrastructure
- **Docker** : Orchestration des services
- **NGINX** : Reverse proxy (prod)
- **Let's Encrypt** : Certificats SSL (prod)

## Flux de Données

```
Google Maps
    │
    ▼ (Playwright scraping)
   n8n
    │
    ▼ (Extraction données)
Nom, Note, Adresse, Site
    │
    ▼ (Visite site officiel)
Description, Images
    │
    ▼ (OpenAI reformulation)
Description nettoyée
    │
    ▼ (POST /scraper/import)
Backend API
    │
    ▼ (Stockage)
PostgreSQL
    │
    ▼ (GET /restaurants)
Frontend Nuxt
    │
    ▼
Utilisateur
```

## Endpoints API

### Publics
- `GET /restaurants` - Liste tous les restaurants
- `GET /restaurants/:id` - Détails d'un restaurant

### Privé (n8n uniquement)
- `POST /scraper/import` - Import d'un restaurant
  - Header : `x-api-key: <secret>`

## Structure Base de Données

### Table : restaurants

| Colonne       | Type         | Description                    |
|---------------|--------------|--------------------------------|
| id            | UUID         | Identifiant unique (PK)        |
| name          | VARCHAR(255) | Nom du restaurant              |
| description   | TEXT         | Description détaillée          |
| rating        | DECIMAL(3,2) | Note sur 5                     |
| address       | VARCHAR(500) | Adresse complète               |
| city          | VARCHAR(100) | Ville (Bordeaux)               |
| website       | VARCHAR(500) | URL site web (nullable)        |
| images        | JSONB        | Tableau d'URLs d'images        |
| source        | VARCHAR(100) | Source (google_maps, etc.)     |
| last_update   | TIMESTAMP    | Dernière mise à jour           |
| created_at    | TIMESTAMP    | Date de création               |
| updated_at    | TIMESTAMP    | Date de modification           |

**Index unique** : (name, address) pour éviter les doublons

## Workflow n8n

1. **Trigger** : Manuel ou Cron (1x/semaine)
2. **Scraping Google Maps** : Recherche "restaurants Bordeaux"
3. **Loop** : Traiter chaque restaurant
4. **Extraction** : Nom, note, adresse, site web
5. **Visite site** : Récupération description + images
6. **OpenAI** : Reformulation SEO de la description
7. **Format JSON** : Préparation des données
8. **Import API** : POST vers /scraper/import
9. **Log** : Enregistrement succès/erreur

## Commandes Utiles

### Démarrage
```bash
# Premier lancement
cp .env.example .env
# Éditer .env avec vos valeurs
docker-compose up -d
```

### Développement
```bash
# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend

# Arrêter tout
docker-compose down
```

### Base de données
```bash
# Connexion PostgreSQL
docker exec -it restaurants-db psql -U postgres -d restaurants

# Import données de test
./import-test-data.sh

# Backup
docker exec restaurants-db pg_dump -U postgres restaurants > backup.sql
```

### Production
```bash
# Déploiement
git pull
docker-compose down
docker-compose up -d --build
```

## Sécurité

### Développement
- CORS ouvert à tous
- Credentials par défaut

### Production
- CORS restreint au domaine
- Mots de passe forts générés aléatoirement
- HTTPS obligatoire
- Firewall UFW configuré
- Backups quotidiens

## Fichiers Importants

```
.
├── docker-compose.yml          # Orchestration Docker
├── .env.example                # Template environnement
├── .env                        # Config (non versionné)
├── start.sh                    # Script démarrage
├── import-test-data.sh         # Import données test
│
├── backend/
│   ├── src/
│   │   ├── main.ts             # Point d'entrée
│   │   ├── app.module.ts       # Module principal
│   │   ├── entities/           # Entités TypeORM
│   │   ├── controllers/        # Contrôleurs API
│   │   ├── services/           # Logique métier
│   │   ├── dto/                # Data Transfer Objects
│   │   └── guards/             # Gardes de sécurité
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── pages/
│   │   ├── index.vue           # Page liste
│   │   └── restaurants/[id].vue # Page détail
│   ├── composables/
│   │   └── useRestaurants.ts   # Logique API
│   ├── app.vue                 # App racine
│   ├── nuxt.config.ts          # Config Nuxt
│   ├── Dockerfile
│   └── package.json
│
├── database/
│   ├── migrations/             # Scripts SQL
│   └── seeds/                  # Données de test
│
├── examples/
│   ├── playwright-google-maps.js    # Exemple scraping
│   └── playwright-extract-website.js # Exemple extraction
│
├── docs/
│   ├── n8n-guide.md            # Guide n8n
│   └── deployment-guide.md     # Guide déploiement
│
└── README.md                   # Documentation
```

## URLs

### Développement
- Frontend : http://localhost:3001
- Backend : http://localhost:3000
- n8n : http://localhost:5678
- PostgreSQL : localhost:5432

### Production
- Frontend : https://restaurants-bordeaux.com
- Backend : https://api.restaurants-bordeaux.com
- n8n : https://n8n.restaurants-bordeaux.com

## Coûts Mensuels

| Service        | Coût           |
|----------------|----------------|
| VPS Hostinger  | ~5€/mois       |
| Domaine        | ~1€/mois       |
| OpenAI API     | ~2-5€/mois     |
| **TOTAL**      | **~8-11€/mois**|

## Timeline de Développement

### Phase 1 : Infrastructure (✅ Terminé)
- Docker Compose
- Backend NestJS
- Frontend Nuxt 3
- Base de données PostgreSQL

### Phase 2 : n8n (En cours)
- Configuration n8n
- Workflow de scraping
- Intégration OpenAI
- Import automatique

### Phase 3 : Stabilisation
- Tests
- Nettoyage du code
- Documentation
- Données de test

### Phase 4 : Production
- Configuration VPS
- NGINX + HTTPS
- Déploiement
- Monitoring

## Prochaines Étapes

1. ✅ Infrastructure Docker opérationnelle
2. ✅ Backend API fonctionnel
3. ✅ Frontend avec pages liste + détail
4. ⏳ Configuration workflow n8n
5. ⏳ Scraping et import de 20-30 restaurants
6. ⏳ Tests et stabilisation
7. ⏳ Déploiement en production

## Support

- **Documentation** : README.md
- **Guides** : docs/
- **Exemples** : examples/
- **Issues** : À créer sur le repo Git

## License

MIT
