# Commandes utiles - Restaurants Bordeaux

## Frontend (Nuxt 3 - Port 3001)

```bash
# Lancer en dev
cd frontend && npm run dev

# Build production
cd frontend && npm run build

# Nettoyer le cache Nuxt
cd frontend && npx nuxi cleanup

# Installer les dépendances
cd frontend && npm install
```

## Backend (NestJS - Port 3000)

```bash
# Lancer en dev (hot reload)
cd backend && npm run start:dev

# Build production
cd backend && npm run build

# Lancer en production
cd backend && npm run start:prod

# Installer les dépendances
cd backend && npm install
```

## Docker

```bash
# Lancer tous les services
docker compose up -d

# Lancer en production
docker compose -f docker-compose.prod.yml --env-file .env up -d

# Build + lancer en production
docker compose -f docker-compose.prod.yml --env-file .env up -d --build

# Arrêter tous les services
docker compose down

# Redémarrer un service
docker compose restart frontend
docker compose restart backend

# Redémarrer tout
docker compose down && docker compose up -d

# Voir les logs
docker compose logs -f              # Tous les services
docker compose logs -f backend      # Un seul service
docker compose logs -f frontend
docker compose logs --tail=50 backend   # Les 50 dernières lignes

# Rebuild un seul service
docker compose up -d --build frontend
docker compose up -d --build backend

# Voir les services en cours
docker compose ps

# Supprimer tout (containers + volumes)
docker compose down -v
```

## Base de données (PostgreSQL)

```bash
# Se connecter à PostgreSQL
docker compose exec postgres psql -U postgres -d restaurants

# Vider la table restaurants
docker compose exec postgres psql -U postgres -d restaurants -c "DELETE FROM restaurants;"

# Vider la table articles
docker compose exec postgres psql -U postgres -d restaurants -c "DELETE FROM articles;"

# Compter les restaurants
docker compose exec postgres psql -U postgres -d restaurants -c "SELECT COUNT(*) FROM restaurants;"

# Compter les articles
docker compose exec postgres psql -U postgres -d restaurants -c "SELECT COUNT(*) FROM articles;"

# Lister les restaurants
docker compose exec postgres psql -U postgres -d restaurants -c "SELECT id, name, rating FROM restaurants ORDER BY rating DESC;"

# Lister les articles
docker compose exec postgres psql -U postgres -d restaurants -c "SELECT id, title, category FROM articles ORDER BY created_at DESC;"

# Lister toutes les tables
docker compose exec postgres psql -U postgres -d restaurants -c "\dt"

# Voir la structure d'une table
docker compose exec postgres psql -U postgres -d restaurants -c "\d restaurants"
docker compose exec postgres psql -U postgres -d restaurants -c "\d articles"

# Backup de la BDD
docker compose exec postgres pg_dump -U postgres restaurants > backup.sql

# Restaurer un backup
docker compose exec -T postgres psql -U postgres -d restaurants < backup.sql
```

## Ports

```bash
# Lister les ports utilisés (Windows CMD)
netstat -ano | findstr LISTENING

# Chercher un port spécifique
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :5432
netstat -ano | findstr :5678

# Lister les ports (PowerShell)
Get-NetTCPConnection -State Listen | Sort-Object LocalPort
Get-NetTCPConnection -LocalPort 3000
```

## Kill processus

```bash
# Trouver le PID d'un port (Windows CMD)
netstat -ano | findstr :3000

# Tuer par PID (Windows CMD)
taskkill /PID 12345 /F

# Tuer node.js (Windows CMD)
taskkill /IM node.exe /F

# Tuer tout ce qui tourne sur le port 3000 (PowerShell)
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Tuer tout ce qui tourne sur le port 3001 (PowerShell)
Get-NetTCPConnection -LocalPort 3001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

## Ports du projet

| Port | Service         |
|------|-----------------|
| 3000 | Backend API     |
| 3001 | Frontend Nuxt   |
| 5432 | PostgreSQL      |
| 5678 | n8n automation  |
| 3002 | Playwright      |
