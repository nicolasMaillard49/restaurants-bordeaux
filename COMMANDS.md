# Commandes utiles - Restaurants Bordeaux

## Frontend (Nuxt 3 - Port 3001)
//mise en prod
docker compose -f docker-compose.prod.yml --env-file .env up -d --build frontend backend

ssh deploy@51.255.200.169

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

---

## Commandes Linux de base

### Navigation & fichiers

```bash
# Se déplacer
cd /chemin/du/dossier       # Aller dans un dossier
cd ..                        # Remonter d'un niveau
cd ~                         # Aller au home
cd -                         # Revenir au dossier précédent
pwd                          # Afficher le chemin actuel

# Lister les fichiers
ls                           # Liste simple
ls -la                       # Liste détaillée + fichiers cachés
ls -lah                      # Idem + tailles lisibles (Ko, Mo)
ls -lt                       # Trié par date de modification

# Créer / supprimer
mkdir mon-dossier            # Créer un dossier
mkdir -p a/b/c               # Créer des dossiers imbriqués
touch fichier.txt            # Créer un fichier vide
rm fichier.txt               # Supprimer un fichier
rm -rf dossier/              # Supprimer un dossier + contenu
cp source.txt dest.txt       # Copier un fichier
cp -r dossier/ copie/        # Copier un dossier
mv ancien.txt nouveau.txt    # Renommer / déplacer
```

### Lire & chercher dans les fichiers

```bash
# Lire un fichier
cat fichier.txt              # Afficher tout le contenu
head -20 fichier.txt         # Les 20 premières lignes
tail -20 fichier.txt         # Les 20 dernières lignes
tail -f fichier.log          # Suivre un fichier en temps réel (logs)
less fichier.txt             # Naviguer dans un fichier (q pour quitter)

# Chercher du texte
grep "motif" fichier.txt             # Chercher dans un fichier
grep -r "motif" .                    # Chercher récursivement dans le dossier
grep -rn "motif" .                   # Idem + numéros de ligne
grep -ri "motif" .                   # Idem + ignorer la casse
grep -rl "motif" .                   # Lister seulement les fichiers qui contiennent

# Chercher des fichiers
find . -name "*.vue"                 # Trouver par nom
find . -name "*.log" -delete         # Trouver et supprimer
find . -type f -mmin -30             # Fichiers modifiés il y a moins de 30 min
find . -type f -size +10M            # Fichiers de plus de 10 Mo
```

### Disque & espace

```bash
df -h                        # Espace disque par partition
du -sh *                     # Taille de chaque dossier
du -sh .                     # Taille du dossier courant
du -sh * | sort -rh | head   # Les plus gros dossiers en premier
```

### Processus & système

```bash
# Processus
ps aux                       # Lister tous les processus
ps aux | grep node           # Chercher un processus
top                          # Moniteur temps réel (q pour quitter)
htop                         # Moniteur amélioré (si installé)
kill 12345                   # Tuer un processus par PID
kill -9 12345                # Forcer l'arrêt
killall node                 # Tuer tous les processus node

# Ports
lsof -i :3000                # Qui utilise le port 3000
ss -tlnp                     # Tous les ports en écoute
```

### Réseau

```bash
# Tester la connectivité
ping google.com              # Ping (Ctrl+C pour arrêter)
curl -I https://example.com  # Headers HTTP d'une URL
curl -s https://example.com  # Contenu d'une URL
wget https://example.com/f   # Télécharger un fichier

# Infos réseau
ip a                         # Adresses IP
ifconfig                     # Adresses IP (ancien)
```

### Permissions & propriétaires

```bash
chmod +x script.sh           # Rendre exécutable
chmod 755 script.sh          # rwx r-x r-x
chmod 644 fichier.txt        # rw- r-- r--
chown user:group fichier     # Changer le propriétaire
```

### Compression & archives

```bash
# tar.gz
tar -czf archive.tar.gz dossier/    # Compresser
tar -xzf archive.tar.gz             # Extraire
tar -tzf archive.tar.gz             # Lister le contenu

# zip
zip -r archive.zip dossier/         # Compresser
unzip archive.zip                    # Extraire
```

### SSH & transfert

```bash
ssh deploy@51.255.200.169               # Se connecter
ssh -p 2222 user@serveur             # Port personnalisé
scp fichier.txt user@serveur:/dest/  # Copier vers serveur
scp user@serveur:/chemin/f.txt .     # Copier depuis serveur
scp -r dossier/ user@serveur:/dest/  # Copier un dossier
```

### Raccourcis utiles

```bash
# Historique & raccourcis
history                      # Historique des commandes
!!                           # Relancer la dernière commande
sudo !!                      # Relancer la dernière commande en sudo
Ctrl+R                       # Rechercher dans l'historique
Ctrl+C                       # Arrêter la commande en cours
Ctrl+L                       # Effacer le terminal (ou: clear)

# Chaîner des commandes
cmd1 && cmd2                 # cmd2 seulement si cmd1 réussit
cmd1 || cmd2                 # cmd2 seulement si cmd1 échoue
cmd1 ; cmd2                  # cmd2 dans tous les cas
cmd1 | cmd2                  # Pipe : sortie de cmd1 → entrée de cmd2

# Redirections
cmd > fichier.txt            # Écraser la sortie dans un fichier
cmd >> fichier.txt           # Ajouter à la fin du fichier
cmd 2>&1                     # Rediriger les erreurs vers la sortie standard
cmd > /dev/null 2>&1         # Ignorer toute la sortie
```

### Systemd (services)

```bash
sudo systemctl start nginx       # Démarrer un service
sudo systemctl stop nginx        # Arrêter
sudo systemctl restart nginx     # Redémarrer
sudo systemctl status nginx      # Voir le statut
sudo systemctl enable nginx      # Activer au démarrage
sudo journalctl -u nginx -f      # Voir les logs d'un service en temps réel
```
