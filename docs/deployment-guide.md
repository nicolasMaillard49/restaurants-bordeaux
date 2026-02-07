# Guide de Déploiement Production

Ce guide explique comment déployer l'application sur un VPS Hostinger.

## Prérequis

- VPS Hostinger avec au minimum 2GB RAM
- Nom de domaine configuré (ex: restaurants-bordeaux.com)
- Accès SSH au serveur
- Ubuntu 22.04 ou supérieur

## 1. Préparation du Serveur

### Connexion SSH

```bash
ssh root@votre-ip-serveur
```

### Installation de Docker

```bash
# Mise à jour du système
apt update && apt upgrade -y

# Installation des dépendances
apt install -y apt-transport-https ca-certificates curl software-properties-common

# Ajout de la clé GPG Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Ajout du dépôt Docker
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Installation de Docker
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Vérification
docker --version
docker compose version
```

### Installation de Git

```bash
apt install -y git
```

## 2. Configuration du Domaine

### DNS

Configurez les enregistrements DNS chez votre registrar :

```
Type  Name                  Value
A     restaurants-bordeaux.com    XXX.XXX.XXX.XXX (IP de votre VPS)
A     www                   XXX.XXX.XXX.XXX
```

Attendez la propagation DNS (5-30 minutes).

## 3. Déploiement de l'Application

### Cloner le projet

```bash
cd /opt
git clone https://github.com/votre-repo/restaurants-bordeaux.git
cd restaurants-bordeaux
```

### Configuration de l'environnement

```bash
cp .env.example .env
nano .env
```

Modifiez les valeurs suivantes :

```env
# PRODUCTION VALUES
NODE_ENV=production
POSTGRES_PASSWORD=un-mot-de-passe-tres-fort-genere-aleatoirement
API_SECRET_KEY=une-cle-secrete-tres-forte-generee-aleatoirement

# URLs de production
FRONTEND_PORT=3001
BACKEND_PORT=3000
NUXT_PUBLIC_API_BASE=https://api.restaurants-bordeaux.com

# n8n
N8N_HOST=n8n.restaurants-bordeaux.com
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.restaurants-bordeaux.com
```

### Démarrer les services

```bash
docker compose up -d
```

## 4. Configuration NGINX

### Installation de NGINX

```bash
apt install -y nginx
```

### Configuration pour le frontend

```bash
nano /etc/nginx/sites-available/restaurants-bordeaux
```

Contenu :

```nginx
server {
    listen 80;
    server_name restaurants-bordeaux.com www.restaurants-bordeaux.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Configuration pour l'API

```bash
nano /etc/nginx/sites-available/api-restaurants-bordeaux
```

Contenu :

```nginx
server {
    listen 80;
    server_name api.restaurants-bordeaux.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'DNT,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Range,x-api-key' always;
    }
}
```

### Configuration pour n8n

```bash
nano /etc/nginx/sites-available/n8n-restaurants-bordeaux
```

Contenu :

```nginx
server {
    listen 80;
    server_name n8n.restaurants-bordeaux.com;

    location / {
        proxy_pass http://localhost:5678;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Activer les sites

```bash
ln -s /etc/nginx/sites-available/restaurants-bordeaux /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/api-restaurants-bordeaux /etc/nginx/sites-enabled/
ln -s /etc/nginx/sites-available/n8n-restaurants-bordeaux /etc/nginx/sites-enabled/

# Vérifier la configuration
nginx -t

# Redémarrer NGINX
systemctl restart nginx
```

## 5. Configuration HTTPS avec Let's Encrypt

### Installation de Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### Obtenir les certificats SSL

```bash
# Pour le frontend
certbot --nginx -d restaurants-bordeaux.com -d www.restaurants-bordeaux.com

# Pour l'API
certbot --nginx -d api.restaurants-bordeaux.com

# Pour n8n
certbot --nginx -d n8n.restaurants-bordeaux.com
```

Suivez les instructions et acceptez les redirections HTTPS automatiques.

### Renouvellement automatique

```bash
# Tester le renouvellement
certbot renew --dry-run

# Le renouvellement automatique est configuré via un cronjob
systemctl status certbot.timer
```

## 6. Sécurisation

### Firewall UFW

```bash
# Installer UFW
apt install -y ufw

# Autoriser SSH
ufw allow 22/tcp

# Autoriser HTTP et HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Activer le firewall
ufw enable

# Vérifier
ufw status
```

### Mise à jour des mots de passe

Générez des mots de passe forts :

```bash
# Générer un mot de passe aléatoire
openssl rand -base64 32
```

Utilisez ces valeurs dans `.env` pour :
- `POSTGRES_PASSWORD`
- `API_SECRET_KEY`

### Sauvegarde de la base de données

```bash
# Créer un script de backup
nano /opt/backup-db.sh
```

Contenu :

```bash
#!/bin/bash
BACKUP_DIR="/opt/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

docker exec restaurants-db pg_dump -U postgres restaurants > $BACKUP_DIR/restaurants_$DATE.sql

# Garder seulement les 30 derniers backups
ls -t $BACKUP_DIR/restaurants_*.sql | tail -n +31 | xargs -r rm

echo "Backup created: restaurants_$DATE.sql"
```

```bash
chmod +x /opt/backup-db.sh
```

Ajouter au crontab :

```bash
crontab -e
```

Ajouter :

```
0 2 * * * /opt/backup-db.sh >> /var/log/backup-db.log 2>&1
```

## 7. Monitoring

### Logs

```bash
# Logs de tous les services
cd /opt/restaurants-bordeaux
docker compose logs -f

# Logs NGINX
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Santé des services

```bash
# Statut des containers
docker compose ps

# Ressources utilisées
docker stats
```

## 8. Mise à jour de l'application

Procédure à suivre après chaque modification du code (développement en local → commit → push) pour appliquer les changements en production.

```bash
cd /opt/restaurants-bordeaux

# Récupérer les dernières modifications
git pull

# Reconstruire et redémarrer tous les services
docker compose down
docker compose up -d --build

# Vérifier que les conteneurs tournent
docker compose ps

# Surveiller les logs en cas de problème
docker compose logs -f
```

**Cas particuliers :**

- **Un seul service modifié** (ex. frontend) : `docker compose up -d --build frontend` pour ne reconstruire que ce service.
- **Variables d'environnement modifiées** (fichier `.env`) : après édition, `docker compose up -d`. Si la variable est utilisée au build du frontend (ex. `NUXT_PUBLIC_API_BASE`), faire aussi `docker compose up -d --build frontend`.
- **Nouvelles migrations de base de données** : après le `git pull`, exécuter les migrations (ex. `docker compose exec backend npm run typeorm migration:run` si configuré).
- **Retour en arrière** : `git checkout <commit-précédent>` puis `docker compose up -d --build`.

## 9. Résolution de problèmes

### Les services ne démarrent pas

```bash
# Vérifier les logs
docker compose logs

# Redémarrer un service spécifique
docker compose restart backend
```

### NGINX retourne 502 Bad Gateway

```bash
# Vérifier que les services Docker sont démarrés
docker compose ps

# Vérifier les ports
netstat -tulpn | grep -E '3000|3001|5678'
```

### Certificat SSL expiré

```bash
# Renouveler manuellement
certbot renew --force-renewal

# Redémarrer NGINX
systemctl restart nginx
```

## 10. Checklist finale

- [ ] DNS configuré correctement
- [ ] Services Docker démarrés
- [ ] NGINX configuré et redémarré
- [ ] Certificats SSL actifs
- [ ] Firewall configuré
- [ ] Mots de passe changés et forts
- [ ] Backup automatique configuré
- [ ] Application accessible via HTTPS
- [ ] n8n sécurisé (accès restreint)

## URLs de production

- **Site web** : https://restaurants-bordeaux.com
- **API** : https://api.restaurants-bordeaux.com
- **n8n** : https://n8n.restaurants-bordeaux.com (accès restreint)

## Coûts mensuels estimés

- VPS Hostinger 2GB : ~5€/mois
- Domaine : ~12€/an (~1€/mois)
- OpenAI API : ~2-5€/mois
- **Total : ~8-11€/mois**
