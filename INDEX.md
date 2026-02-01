# 📂 INDEX DU PROJET RESTAURANTS BORDEAUX

Bienvenue ! Ce dossier contient tout le code et la documentation pour démarrer le projet.

## 🎯 PAR OÙ COMMENCER ?

### Option 1 : Démarrage rapide (recommandé)
1. Lisez **QUICK-START.md** (5 minutes)
2. Suivez les instructions pas à pas
3. Votre application sera opérationnelle en 5 minutes

### Option 2 : Comprendre le projet en détail
1. Lisez **PROJECT-SUMMARY.md** pour une vue d'ensemble
2. Consultez **README.md** pour la documentation complète
3. Explorez le code dans les dossiers backend/ et frontend/

## 📁 STRUCTURE DU PROJET

```
.
├── QUICK-START.md              ⭐ COMMENCEZ ICI
├── PROJECT-SUMMARY.md          📊 Vue d'ensemble complète
├── README.md                   📖 Documentation principale
│
├── docker-compose.yml          🐳 Orchestration Docker
├── .env.example                ⚙️  Template de configuration
├── start.sh                    🚀 Script de démarrage
├── import-test-data.sh         📊 Import données de test
│
├── backend/                    💻 Code Backend (NestJS)
│   ├── src/
│   │   ├── main.ts
│   │   ├── app.module.ts
│   │   ├── entities/           (Restaurant entity)
│   │   ├── controllers/        (API endpoints)
│   │   ├── services/           (Business logic)
│   │   ├── dto/                (Data Transfer Objects)
│   │   └── guards/             (Security)
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── nest-cli.json
│
├── frontend/                   🎨 Code Frontend (Nuxt 3)
│   ├── pages/
│   │   ├── index.vue           (Liste des restaurants)
│   │   └── restaurants/[id].vue (Page détail)
│   ├── composables/
│   │   └── useRestaurants.ts   (API calls)
│   ├── app.vue
│   ├── nuxt.config.ts
│   ├── Dockerfile
│   └── package.json
│
├── database/                   🗄️  Scripts SQL
│   ├── migrations/
│   │   └── 001_create_restaurants_table.sql
│   └── seeds/
│       └── 001_test_restaurants.sql
│
├── docs/                       📚 Documentation
│   ├── n8n-guide.md            (Configuration n8n)
│   └── deployment-guide.md     (Déploiement production)
│
├── examples/                   💡 Exemples de code
│   ├── playwright-google-maps.js
│   └── playwright-extract-website.js
│
└── n8n-workflow-template.json  🤖 Template workflow n8n
```

## 📖 GUIDES PAR BESOIN

### Je veux démarrer rapidement
→ **QUICK-START.md**

### Je veux comprendre l'architecture
→ **PROJECT-SUMMARY.md**

### Je veux configurer n8n
→ **docs/n8n-guide.md**

### Je veux déployer en production
→ **docs/deployment-guide.md**

### Je veux voir le code backend
→ **backend/src/**

### Je veux voir le code frontend
→ **frontend/pages/** et **frontend/composables/**

### Je cherche des exemples de scraping
→ **examples/**

## 🚀 DÉMARRAGE EN 3 COMMANDES

```bash
# 1. Copier la configuration
cp .env.example .env

# 2. Démarrer les services
./start.sh

# 3. Importer les données de test
./import-test-data.sh
```

**C'est tout !** Rendez-vous sur http://localhost:3001

## 🎓 TECHNOLOGIES UTILISÉES

- **Frontend** : Nuxt 3 + Nuxt UI + Vue 3
- **Backend** : NestJS + TypeORM + PostgreSQL
- **Automatisation** : n8n + Playwright + OpenAI
- **Infrastructure** : Docker + Docker Compose
- **Production** : NGINX + Let's Encrypt

## 📊 ENDPOINTS API

- `GET /restaurants` - Liste tous les restaurants
- `GET /restaurants/:id` - Détails d'un restaurant
- `POST /scraper/import` - Import (protégé par API key)

## 🔧 COMMANDES DOCKER

```bash
# Démarrer
docker-compose up -d

# Arrêter
docker-compose down

# Voir les logs
docker-compose logs -f

# Redémarrer un service
docker-compose restart backend
```

## 🌐 URLS

### Développement
- Frontend : http://localhost:3001
- Backend : http://localhost:3000
- n8n : http://localhost:5678
- PostgreSQL : localhost:5432

## 💰 COÛTS ESTIMÉS

- VPS Hostinger : ~5€/mois
- OpenAI API : ~2-5€/mois
- Domaine : ~1€/mois
- **Total : ~8-11€/mois**

## 📞 SUPPORT

- Documentation : Tous les fichiers .md
- Exemples : Dossier examples/
- Issues : À créer sur votre repo Git

## ✅ CHECKLIST PREMIÈRE INSTALLATION

- [ ] Lire QUICK-START.md
- [ ] Copier .env.example vers .env
- [ ] Démarrer avec ./start.sh
- [ ] Vérifier http://localhost:3001
- [ ] Importer les données de test
- [ ] Configurer n8n (http://localhost:5678)
- [ ] Tester l'API backend
- [ ] Explorer le code

## 🎉 PRÊT À DÉMARRER ?

Ouvrez **QUICK-START.md** et suivez les instructions !

---

**Version** : 1.0.0
**Date** : Janvier 2026
**License** : MIT
