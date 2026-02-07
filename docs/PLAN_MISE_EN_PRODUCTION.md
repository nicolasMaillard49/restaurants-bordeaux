# Plan de mise en production — Restaurants Bordeaux

> Document de référence pour déployer le projet de A à Z sur un serveur de production.

---

## Table des matières

1. [Choix de l'hébergement](#1-choix-de-lhébergement)
2. [Préparer le serveur](#2-préparer-le-serveur)
3. [Nom de domaine et DNS](#3-nom-de-domaine-et-dns)
4. [Sécuriser les secrets](#4-sécuriser-les-secrets)
5. [Adapter les Dockerfiles pour la production](#5-adapter-les-dockerfiles-pour-la-production)
6. [Créer le docker-compose de production](#6-créer-le-docker-compose-de-production)
7. [Configurer Nginx en reverse proxy](#7-configurer-nginx-en-reverse-proxy)
8. [Certificat SSL avec Let's Encrypt](#8-certificat-ssl-avec-lets-encrypt)
9. [Configurer le fichier .env de production](#9-configurer-le-fichier-env-de-production)
10. [Migrations de base de données](#10-migrations-de-base-de-données)
11. [Déployer sur le serveur](#11-déployer-sur-le-serveur)
12. [Vérifications post-déploiement](#12-vérifications-post-déploiement)
13. [Sauvegardes automatiques](#13-sauvegardes-automatiques)
14. [Monitoring et logs](#14-monitoring-et-logs)
15. [CI/CD (déploiement automatique)](#15-cicd-déploiement-automatique)
16. [Checklist finale](#16-checklist-finale)

---

## 1. Choix de l'hébergement

Le projet tourne avec Docker, donc n'importe quel VPS Linux convient.

### Options recommandées

| Fournisseur | Offre conseillée | Prix/mois | Pourquoi |
|-------------|-----------------|-----------|----------|
| **Hetzner** (recommandé) | CX22 (2 vCPU, 4 Go RAM) | ~4,50€ | Excellent rapport qualité/prix, datacenter EU |
| **OVH** | VPS Starter (2 vCPU, 4 Go RAM) | ~6€ | Hébergeur français, bon support |
| **DigitalOcean** | Droplet Regular (2 vCPU, 4 Go RAM) | ~24$ | Interface simple, bonne doc |
| **Contabo** | VPS S (4 vCPU, 8 Go RAM) | ~6€ | Le moins cher pour plus de puissance |

### Ressources minimales requises

- **CPU** : 2 vCPU
- **RAM** : 4 Go minimum (PostgreSQL + NestJS + Nuxt SSR + Playwright + n8n)
- **Disque** : 40 Go SSD minimum
- **OS** : Ubuntu 22.04 LTS ou Debian 12
- **Réseau** : IPv4 fixe

> **Note** : Playwright (headless Chromium) est gourmand en RAM. Si le budget le permet, prendre 8 Go.

---

## 2. Préparer le serveur

### 2.1 Connexion initiale

```bash
# Se connecter au serveur (remplacer par ton IP)
ssh root@IP_DU_SERVEUR
```

### 2.2 Créer un utilisateur non-root

```bash
# Créer un utilisateur dédié
adduser deploy
usermod -aG sudo deploy

# Configurer l'accès SSH par clé (plus sécurisé que mot de passe)
mkdir -p /home/deploy/.ssh
cp ~/.ssh/authorized_keys /home/deploy/.ssh/
sudo chown -R deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh
sudo chmod 600 /home/deploy/.ssh/authorized_keys

# Désactiver l'accès root par SSH
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo sed -i 's/#PasswordAuthentication yes/PasswordAuthentication no/' /etc/ssh/sshd_config
sudo systemctl restart sshd
```

### 2.3 Firewall (UFW)

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp      # SSH
sudo ufw allow 80/tcp      # HTTP
sudo ufw allow 443/tcp     # HTTPS
sudo ufw enable
```

> **Important** : ne PAS ouvrir les ports 3000, 3001, 3002, 5432, 5678 au public. Tout passe par Nginx.

### 2.4 Installer Docker et Docker Compose

```bash
# Installer Docker
sudo curl -fsSL https://get.docker.com | sh

# Ajouter l'utilisateur deploy au groupe docker
sudo usermod -aG docker deploy

# Vérifier
docker --version
docker compose version
```

### 2.5 Installer Git

```bash
sudo apt update && sudo apt install -y git
```

---

## 3. Nom de domaine et DNS

### 3.1 Acheter un domaine

Exemples de registrars : OVH, Namecheap, Gandi, Cloudflare Registrar.

Exemple de domaine : `restaurants-bordeaux.fr`

### 3.2 Configurer les DNS

Ajouter ces enregistrements DNS chez ton registrar :

| Type | Nom | Valeur | TTL |
|------|-----|--------|-----|
| A | `@` | `IP_DU_SERVEUR` | 3600 |
| A | `www` | `IP_DU_SERVEUR` | 3600 |
| A | `n8n` | `IP_DU_SERVEUR` | 3600 |
| A | `api` | `IP_DU_SERVEUR` | 3600 |

Résultat :
- `restaurants-bordeaux.fr` → Frontend
- `api.restaurants-bordeaux.fr` → Backend API
- `n8n.restaurants-bordeaux.fr` → Interface n8n (optionnel, peut rester privé)

### 3.3 Vérifier la propagation DNS

```bash
# Depuis ton PC ou le serveur
dig restaurants-bordeaux.fr +short
# Doit retourner l'IP du serveur
```

---

## 4. Sécuriser les secrets

### Ce qui DOIT changer par rapport au dev

| Variable | Valeur dev (actuelle) | Action pour la prod |
|----------|-----------------------|---------------------|
| `POSTGRES_PASSWORD` | `postgres` | Générer un mot de passe fort (32+ caractères) |
| `API_SECRET_KEY` | vide ou `nicolas123` | Générer une clé API forte (64 caractères) |
| `GROQ_API_KEY` | Clé en clair dans .env | Vérifier qu'elle n'est pas dans le repo git |
| Clé Google Maps | En dur dans le workflow n8n | Restreindre par IP serveur dans la console Google |
| Clé Groq | En dur dans le workflow n8n | Idem, utiliser les credentials n8n |
| `CORS origin` | `*` (tout le monde) | Restreindre au domaine exact |

### Générer des secrets forts

```bash
# Mot de passe PostgreSQL
openssl rand -base64 32

# Clé API backend
openssl rand -hex 32
```

### Fichier .env : JAMAIS dans le dépôt Git

Le `.gitignore` contient déjà `.env` — c'est correct. Sur le serveur, le `.env` sera créé manuellement.

---

## 5. Adapter les Dockerfiles pour la production

### 5.1 Backend — `backend/Dockerfile.prod`

Le Dockerfile actuel utilise `npm run start:dev` (hot reload). En prod, il faut builder et exécuter le JS compilé.

```dockerfile
# --- Étape 1 : Build ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && cp -R node_modules /prod_modules
RUN npm ci

COPY . .
RUN npm run build

# --- Étape 2 : Production ---
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /prod_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

EXPOSE 3000

# Exécute le JS compilé (pas de ts-node, pas de watch)
CMD ["node", "dist/main"]
```

**Pourquoi multi-stage ?** L'image finale ne contient ni le code source TypeScript, ni les devDependencies, ni le compilateur. Image plus légère et plus sécurisée.

### 5.2 Frontend — `frontend/Dockerfile.prod`

Le Dockerfile actuel utilise `npm run dev`. En prod, Nuxt doit être buildé puis servi en mode SSR.

```dockerfile
# --- Étape 1 : Build ---
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Étape 2 : Production ---
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/.output ./.output
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production

EXPOSE 3000

# Nuxt 3 produit un serveur Node autonome dans .output
CMD ["node", ".output/server/index.mjs"]
```

### 5.3 Playwright — `playwright-service/Dockerfile` (pas de changement)

Le Dockerfile actuel est déjà correct pour la production. Le service est simple (Express + Playwright).

### 5.4 n8n — `n8n/Dockerfile` (pas de changement)

Utilise l'image officielle, rien à modifier.

---

## 6. Créer le docker-compose de production

Créer un fichier `docker-compose.prod.yml` à la racine :

```yaml
services:
  # Base de données PostgreSQL
  postgres:
    image: postgres:15-alpine
    container_name: prod-restaurants-db
    restart: always
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - internal
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend NestJS
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
    container_name: prod-restaurants-backend
    restart: always
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_HOST: postgres
      DATABASE_PORT: 5432
      DATABASE_USER: ${POSTGRES_USER}
      DATABASE_PASSWORD: ${POSTGRES_PASSWORD}
      DATABASE_NAME: ${POSTGRES_DB}
      API_SECRET_KEY: ${API_SECRET_KEY}
      FRONTEND_URL: https://${DOMAIN}
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - internal

  # Frontend Nuxt 3 (SSR)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.prod
      args:
        NUXT_PUBLIC_API_BASE: https://api.${DOMAIN}
        API_BASE_INTERNAL: http://backend:3000
    container_name: prod-restaurants-frontend
    restart: always
    environment:
      NODE_ENV: production
      NUXT_PUBLIC_API_BASE: https://api.${DOMAIN}
      API_BASE_INTERNAL: http://backend:3000
    depends_on:
      - backend
    networks:
      - internal

  # Playwright (scraping)
  playwright:
    build:
      context: ./playwright-service
      dockerfile: Dockerfile
    container_name: prod-restaurants-playwright
    restart: always
    environment:
      PORT: 3002
    networks:
      - internal

  # n8n (automatisation)
  n8n:
    build:
      context: ./n8n
      dockerfile: Dockerfile
    container_name: prod-restaurants-n8n
    restart: always
    environment:
      - N8N_HOST=n8n.${DOMAIN}
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - WEBHOOK_URL=https://n8n.${DOMAIN}
      - GENERIC_TIMEZONE=Europe/Paris
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=${N8N_USER}
      - N8N_BASIC_AUTH_PASSWORD=${N8N_PASSWORD}
    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - internal

  # Nginx Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: prod-restaurants-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - ./certbot/conf:/etc/letsencrypt:ro
      - ./certbot/www:/var/www/certbot:ro
    depends_on:
      - frontend
      - backend
      - n8n
    networks:
      - internal

  # Certbot (SSL)
  certbot:
    image: certbot/certbot
    container_name: prod-restaurants-certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot

networks:
  internal:
    driver: bridge

volumes:
  postgres_data:
  n8n_data:
```

### Différences clés avec le docker-compose de dev

| Aspect | Dev | Prod |
|--------|-----|------|
| Ports exposés | Tous (3000, 3001, 3002, 5432, 5678) | Seuls 80 et 443 via Nginx |
| Volumes code source | Montés (hot reload) | Aucun (code copié dans l'image) |
| Dockerfiles | Mode dev (watch, devtools) | Mode prod (build, optimisé) |
| Nginx | Absent | Reverse proxy + SSL |
| restart | `unless-stopped` | `always` |

---

## 7. Configurer Nginx en reverse proxy

### 7.1 Créer l'arborescence

```bash
mkdir -p nginx/conf.d
```

### 7.2 `nginx/nginx.conf`

```nginx
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Logs
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # Performance
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml;
    gzip_min_length 1000;

    # Sécurité
    server_tokens off;

    # Taille max des requêtes (pour l'import de restaurants)
    client_max_body_size 10M;

    include /etc/nginx/conf.d/*.conf;
}
```

### 7.3 `nginx/conf.d/default.conf`

> Remplacer `restaurants-bordeaux.fr` par ton domaine réel.

```nginx
# Redirection HTTP → HTTPS
server {
    listen 80;
    server_name restaurants-bordeaux.fr www.restaurants-bordeaux.fr api.restaurants-bordeaux.fr n8n.restaurants-bordeaux.fr;

    # Certbot challenge
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Frontend (site principal)
server {
    listen 443 ssl;
    server_name restaurants-bordeaux.fr www.restaurants-bordeaux.fr;

    ssl_certificate /etc/letsencrypt/live/restaurants-bordeaux.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/restaurants-bordeaux.fr/privkey.pem;

    # Headers de sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://frontend:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 443 ssl;
    server_name api.restaurants-bordeaux.fr;

    ssl_certificate /etc/letsencrypt/live/restaurants-bordeaux.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/restaurants-bordeaux.fr/privkey.pem;

    # Bloquer l'accès public à l'endpoint d'import (seulement n8n interne)
    location /scraper/import {
        # Autoriser seulement le réseau Docker interne
        allow 172.16.0.0/12;
        deny all;
        proxy_pass http://backend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location / {
        proxy_pass http://backend:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# n8n (interface d'administration)
server {
    listen 443 ssl;
    server_name n8n.restaurants-bordeaux.fr;

    ssl_certificate /etc/letsencrypt/live/restaurants-bordeaux.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/restaurants-bordeaux.fr/privkey.pem;

    location / {
        proxy_pass http://n8n:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## 8. Certificat SSL avec Let's Encrypt

### 8.1 Obtenir le certificat initial

La première fois, il faut démarrer Nginx sans SSL, puis générer le certificat :

```bash
# 1. Commenter temporairement les blocs "listen 443" dans nginx conf
# et lancer Nginx en HTTP uniquement pour le challenge Certbot

# 2. Démarrer seulement Nginx
docker compose -f docker-compose.prod.yml up -d nginx

# 3. Lancer Certbot pour obtenir le certificat
docker compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  -d restaurants-bordeaux.fr \
  -d www.restaurants-bordeaux.fr \
  -d api.restaurants-bordeaux.fr \
  -d n8n.restaurants-bordeaux.fr \
  --email ton@email.com \
  --agree-tos \
  --no-eff-email

# 4. Remettre la config Nginx complète (décommenter les blocs 443)
# 5. Redémarrer Nginx
docker compose -f docker-compose.prod.yml restart nginx
```

### 8.2 Renouvellement automatique

Let's Encrypt expire tous les 90 jours. Ajouter un cron :

```bash
# Éditer le crontab
crontab -e

# Ajouter cette ligne (renouvellement tous les jours à 3h du matin)
0 3 * * * cd /home/deploy/restaurants-bordeaux && docker compose -f docker-compose.prod.yml run --rm certbot renew && docker compose -f docker-compose.prod.yml restart nginx >> /var/log/certbot-renew.log 2>&1
```

---

## 9. Configurer le fichier .env de production

Créer le fichier `.env` directement sur le serveur (JAMAIS commité dans git) :

```bash
nano /home/deploy/restaurants-bordeaux/.env
```

```env
# ===========================================
# PRODUCTION - restaurants-bordeaux.fr
# ===========================================

# Domaine
DOMAIN=restaurants-bordeaux.fr

# Base de données PostgreSQL
POSTGRES_DB=restaurants
POSTGRES_USER=restaurants_admin
POSTGRES_PASSWORD=GENERER_AVEC_openssl_rand_base64_32

# Backend
NODE_ENV=production
BACKEND_PORT=3000
API_SECRET_KEY=GENERER_AVEC_openssl_rand_hex_32
FRONTEND_URL=https://restaurants-bordeaux.fr

# Frontend
FRONTEND_PORT=3000
NUXT_PUBLIC_API_BASE=https://api.restaurants-bordeaux.fr

# n8n
N8N_HOST=n8n.restaurants-bordeaux.fr
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.restaurants-bordeaux.fr
TIMEZONE=Europe/Paris
N8N_USER=admin
N8N_PASSWORD=GENERER_UN_MOT_DE_PASSE_FORT

# Clés API (à migrer dans les credentials n8n en prod)
GROQ_API_KEY=gsk_...
```

---

## 10. Migrations de base de données

### Situation actuelle

En dev, `synchronize: true` crée/modifie automatiquement les tables. Le code dans `app.module.ts` est déjà correct :

```typescript
synchronize: configService.get('NODE_ENV') === 'development',
```

En production (`NODE_ENV=production`), `synchronize` sera `false` automatiquement.

### Générer et exécuter les migrations

```bash
# 1. Sur ta machine de dev, générer une migration initiale
cd backend
npx typeorm migration:generate src/migrations/InitialSchema -d src/data-source.ts

# 2. Ou alternative simple : laisser synchronize:true pour le PREMIER démarrage
#    puis le passer à false immédiatement après.
```

### Approche recommandée pour ce projet

Comme le projet est jeune et que tu es le seul développeur :

1. **Premier déploiement** : Laisser `synchronize: true` temporairement pour créer les tables
2. **Dès que ça tourne** : Changer la condition pour toujours `false` en prod
3. **Évolutions futures** : Utiliser les migrations TypeORM (`migration:generate` + `migration:run`)

---

## 11. Déployer sur le serveur

### 11.1 Cloner le projet

```bash
# Se connecter au serveur
ssh deploy@IP_DU_SERVEUR

# Cloner le repo
cd /home/deploy
git clone https://github.com/nicolasMaillard49/restaurants-bordeaux.git
cd restaurants-bordeaux
```

### 11.2 Créer le .env de production

(Voir section 9 ci-dessus)

### 11.3 Créer les fichiers de prod

Copier les Dockerfiles de prod et la config Nginx comme décrit aux sections 5, 6 et 7.

### 11.4 Build et lancement

```bash
# Builder toutes les images
docker compose -f docker-compose.prod.yml build

# Lancer en arrière-plan
docker compose -f docker-compose.prod.yml up -d

# Vérifier que tout tourne
docker compose -f docker-compose.prod.yml ps

# Voir les logs en temps réel
docker compose -f docker-compose.prod.yml logs -f
```

### 11.5 Importer les données

Si tu as des données de test à importer :

```bash
# Depuis ta machine locale, exporter la BDD de dev
pg_dump -h localhost -U admin -d restaurants --data-only > dump.sql

# Copier vers le serveur
scp dump.sql deploy@IP_DU_SERVEUR:/home/deploy/

# Sur le serveur, importer dans PostgreSQL
docker exec -i prod-restaurants-db psql -U restaurants_admin -d restaurants < /home/deploy/dump.sql
```

Ou simplement relancer le workflow n8n en production pour scraper les restaurants.

---

## 12. Vérifications post-déploiement

### Checklist de test

```bash
# 1. Le frontend répond
curl -I https://restaurants-bordeaux.fr
# Attendu : HTTP/2 200

# 2. L'API répond
curl https://api.restaurants-bordeaux.fr/restaurants
# Attendu : JSON avec la liste des restaurants

# 3. Le SSL est valide
curl -vI https://restaurants-bordeaux.fr 2>&1 | grep "SSL certificate"
# Attendu : certificat Let's Encrypt valide

# 4. La redirection HTTP → HTTPS fonctionne
curl -I http://restaurants-bordeaux.fr
# Attendu : 301 vers https://

# 5. n8n est accessible
curl -I https://n8n.restaurants-bordeaux.fr
# Attendu : 200 (ou 401 si basic auth actif)

# 6. L'endpoint scraper est bloqué depuis l'extérieur
curl -X POST https://api.restaurants-bordeaux.fr/scraper/import
# Attendu : 403 Forbidden

# 7. Les headers de sécurité sont présents
curl -I https://restaurants-bordeaux.fr 2>&1 | grep -E "X-Frame|X-Content|Strict-Transport"
```

### Test mobile

Ouvrir `https://restaurants-bordeaux.fr` sur ton téléphone et vérifier :
- Le chargement de la page d'accueil
- La navigation vers un restaurant
- Le bouton de réservation
- Le scroll horizontal des action cards
- Les images se chargent correctement

---

## 13. Sauvegardes automatiques

### 13.1 Script de backup PostgreSQL

Créer `/home/deploy/backup.sh` :

```bash
#!/bin/bash
BACKUP_DIR="/home/deploy/backups"
DATE=$(date +%Y-%m-%d_%H-%M)
RETENTION_DAYS=30

mkdir -p $BACKUP_DIR

# Dump de la base
docker exec prod-restaurants-db pg_dump -U restaurants_admin -d restaurants | gzip > "$BACKUP_DIR/restaurants_$DATE.sql.gz"

# Supprimer les backups de plus de 30 jours
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "$(date): Backup terminé → restaurants_$DATE.sql.gz" >> $BACKUP_DIR/backup.log
```

```bash
chmod +x /home/deploy/backup.sh
```

### 13.2 Cron de sauvegarde

```bash
crontab -e

# Backup quotidien à 2h du matin
0 2 * * * /home/deploy/backup.sh
```

### 13.3 Backup distant (optionnel mais recommandé)

Envoyer les backups vers un stockage externe (S3, Backblaze B2, rsync vers un autre serveur) :

```bash
# Exemple avec rsync vers un autre serveur
rsync -avz /home/deploy/backups/ backup-user@autre-serveur:/backups/restaurants/
```

---

## 14. Monitoring et logs

### 14.1 Voir les logs

```bash
# Tous les services
docker compose -f docker-compose.prod.yml logs -f

# Un service spécifique
docker compose -f docker-compose.prod.yml logs -f backend
docker compose -f docker-compose.prod.yml logs -f frontend
docker compose -f docker-compose.prod.yml logs -f nginx
```

### 14.2 Monitoring basique avec docker stats

```bash
# Voir la consommation CPU/RAM en temps réel
docker stats
```

### 14.3 Alertes simples (optionnel)

Créer un script de healthcheck `/home/deploy/healthcheck.sh` :

```bash
#!/bin/bash
URL="https://restaurants-bordeaux.fr"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $URL)

if [ "$STATUS" != "200" ]; then
    echo "$(date): ALERTE - Le site répond $STATUS au lieu de 200" >> /home/deploy/alerts.log
    # Optionnel : envoyer un email ou une notification
    # curl -X POST https://hooks.slack.com/services/... -d '{"text":"Site down!"}'
fi
```

```bash
chmod +x /home/deploy/healthcheck.sh

# Vérifier toutes les 5 minutes
crontab -e
*/5 * * * * /home/deploy/healthcheck.sh
```

### 14.4 Monitoring avancé (optionnel)

Pour un monitoring plus complet, des outils gratuits :
- **Uptime Kuma** : Dashboard de monitoring auto-hébergé (Docker)
- **Beszel** : Monitoring système léger

---

## 15. CI/CD (déploiement automatique)

### Option simple : script de déploiement manuel

Créer `/home/deploy/restaurants-bordeaux/deploy.sh` :

```bash
#!/bin/bash
set -e

echo "=== Déploiement en cours ==="

# Récupérer les dernières modifications
git pull origin main

# Rebuilder les images
docker compose -f docker-compose.prod.yml build

# Redémarrer les services (avec zero-downtime pour le frontend)
docker compose -f docker-compose.prod.yml up -d

# Nettoyer les anciennes images
docker image prune -f

echo "=== Déploiement terminé ==="
```

Usage :
```bash
ssh deploy@IP_DU_SERVEUR "cd /home/deploy/restaurants-bordeaux && ./deploy.sh"
```

### Option avancée : GitHub Actions

Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy via SSH
        uses: appleboy/ssh-action@v1
        with:
          host: ${{ secrets.SERVER_IP }}
          username: deploy
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/deploy/restaurants-bordeaux
            git pull origin main
            docker compose -f docker-compose.prod.yml build
            docker compose -f docker-compose.prod.yml up -d
            docker image prune -f
```

Ajouter dans les **Settings > Secrets** du repo GitHub :
- `SERVER_IP` : L'IP du serveur
- `SSH_PRIVATE_KEY` : La clé SSH privée de l'utilisateur `deploy`

---

## 16. Checklist finale

### Avant le déploiement

- [ ] Acheter un VPS (4 Go RAM minimum)
- [ ] Acheter un nom de domaine
- [ ] Configurer les DNS (A records)
- [ ] Attendre la propagation DNS (jusqu'à 48h, souvent 30min)

### Configuration serveur

- [ ] Créer l'utilisateur `deploy`
- [ ] Configurer le SSH par clé (désactiver le mot de passe)
- [ ] Installer Docker + Docker Compose
- [ ] Configurer le firewall UFW (22, 80, 443 uniquement)

### Fichiers de production

- [ ] Créer `backend/Dockerfile.prod` (multi-stage build)
- [ ] Créer `frontend/Dockerfile.prod` (multi-stage build)
- [ ] Créer `docker-compose.prod.yml`
- [ ] Créer `nginx/nginx.conf` + `nginx/conf.d/default.conf`
- [ ] Créer le `.env` de production sur le serveur (avec des vrais secrets)

### Déploiement

- [ ] Cloner le repo sur le serveur
- [ ] Obtenir le certificat SSL via Certbot
- [ ] Lancer `docker compose -f docker-compose.prod.yml up -d`
- [ ] Vérifier que tous les containers tournent (`docker ps`)
- [ ] Tester le frontend : `https://restaurants-bordeaux.fr`
- [ ] Tester l'API : `https://api.restaurants-bordeaux.fr/restaurants`
- [ ] Tester sur mobile
- [ ] Relancer le workflow n8n pour peupler la base

### Maintenance

- [ ] Mettre en place le backup quotidien PostgreSQL
- [ ] Mettre en place le renouvellement SSL automatique
- [ ] Mettre en place le healthcheck
- [ ] (Optionnel) Configurer le CI/CD GitHub Actions

### Sécurité

- [ ] CORS restreint au domaine exact
- [ ] Endpoint `/scraper/import` bloqué depuis l'extérieur
- [ ] n8n protégé par basic auth
- [ ] Aucun secret en clair dans le code/git
- [ ] Clés Google Maps restreintes par IP serveur
- [ ] PostgreSQL non exposé publiquement

---

## Résumé du flux en production

```
Utilisateur
    │
    ▼
https://restaurants-bordeaux.fr
    │
    ▼
┌─────────┐     ┌───────────┐     ┌──────────┐     ┌────────────┐
│  Nginx  │────▶│ Frontend  │────▶│ Backend  │────▶│ PostgreSQL │
│ :80/443 │     │ Nuxt SSR  │     │ NestJS   │     │  :5432     │
│  SSL    │     │ :3000     │     │ :3000    │     │            │
└─────────┘     └───────────┘     └──────────┘     └────────────┘
    │                                   ▲
    │    ┌──────────┐     ┌─────────────┘
    └───▶│   n8n    │────▶│ Playwright
         │  :5678   │     │  :3002
         └──────────┘     └──────────
         (scraping périodique)
```

> **Temps estimé pour tout mettre en place** : une après-midi si tu as déjà le VPS et le domaine.
