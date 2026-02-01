# 🔧 Guide d'Installation Détaillé

Ce guide vous aide à installer le projet étape par étape, avec des solutions aux problèmes courants.

## 📋 Prérequis

### Requis
- **Node.js 20+** : https://nodejs.org/ (version LTS recommandée)
- **npm** (installé automatiquement avec Node.js)

### Recommandé
- **Docker Desktop** : https://www.docker.com/products/docker-desktop/
- **Git** : https://git-scm.com/downloads

## 🚀 Méthode 1 : Installation Automatique (Recommandée)

### Étape 1 : Vérifier Node.js

Ouvrez un terminal et tapez :

```bash
node --version
npm --version
```

**Si cela fonctionne** : Passez à l'étape 2
**Si erreur** : Installez Node.js depuis https://nodejs.org/

### Étape 2 : Lancer le script d'installation

**Sur Mac/Linux :**
```bash
chmod +x install-all.sh
./install-all.sh
```

**Sur Windows (PowerShell) :**
```powershell
# Si vous avez Git Bash :
bash install-all.sh

# Sinon, installez manuellement (voir Méthode 2)
```

Le script va :
1. ✅ Vérifier que Node.js est installé
2. ✅ Installer toutes les dépendances du backend
3. ✅ Installer toutes les dépendances du frontend
4. ✅ Afficher les instructions suivantes

**Durée** : 2-5 minutes (selon votre connexion internet)

### Étape 3 : Configuration

```bash
cp .env.example .env
```

Vous pouvez garder les valeurs par défaut pour le développement.

### Étape 4 : Démarrage avec Docker

```bash
docker-compose up -d
```

**OU** utilisez le script :

```bash
./start.sh
```

### Étape 5 : Importer les données de test

```bash
./import-test-data.sh
```

### ✅ C'est prêt !

Ouvrez http://localhost:3001 dans votre navigateur.

---

## 🛠️ Méthode 2 : Installation Manuelle

Si le script automatique ne fonctionne pas, suivez ces étapes :

### Backend

```bash
# Aller dans le dossier backend
cd backend

# Installer les dépendances
npm install

# Vérifier que ça fonctionne
npm run build
```

**Problème courant** : Si `npm install` échoue, essayez :
```bash
# Nettoyer et réessayer
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Frontend

```bash
# Aller dans le dossier frontend
cd frontend

# Installer les dépendances
npm install

# Vérifier que ça fonctionne
npm run build
```

**Problème courant** : Si `npm install` échoue, essayez :
```bash
# Nettoyer et réessayer
rm -rf node_modules .nuxt package-lock.json
npm cache clean --force
npm install
```

---

## ❌ Résolution des Problèmes Courants

### Problème 1 : "node: command not found"

**Cause** : Node.js n'est pas installé ou pas dans le PATH

**Solution** :
1. Téléchargez Node.js depuis https://nodejs.org/
2. Installez la version LTS (20.x)
3. Redémarrez votre terminal
4. Vérifiez : `node --version`

### Problème 2 : "npm ERR! EACCES: permission denied"

**Cause** : Problème de permissions npm

**Solution Mac/Linux** :
```bash
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER .
```

**Solution Windows** :
Lancez le terminal en tant qu'administrateur

### Problème 3 : "npm ERR! network timeout"

**Cause** : Connexion internet lente ou problème de proxy

**Solution** :
```bash
# Augmenter le timeout
npm config set fetch-timeout 60000

# Réessayer
npm install
```

### Problème 4 : Installation très lente

**Cause** : Le téléchargement des packages peut prendre du temps

**Solution** :
- Soyez patient (première installation : 5-10 minutes)
- Vérifiez votre connexion internet
- Essayez avec un autre réseau

### Problème 5 : "gyp ERR! stack Error: not found: python"

**Cause** : Certains packages nécessitent Python pour compiler

**Solution Mac/Linux** :
```bash
# Installer Python
sudo apt install python3  # Ubuntu/Debian
brew install python3      # Mac
```

**Solution Windows** :
- Téléchargez Python depuis https://python.org/
- Cochez "Add Python to PATH" pendant l'installation

### Problème 6 : Port déjà utilisé

**Erreur** : "Port 3000 is already in use"

**Solution** :
```bash
# Trouver quel processus utilise le port
# Mac/Linux :
lsof -i :3000

# Windows :
netstat -ano | findstr :3000

# Arrêter le processus ou changer le port dans .env
```

### Problème 7 : Docker ne démarre pas

**Solution** :
```bash
# Vérifier l'état de Docker
docker ps

# Si erreur, redémarrer Docker Desktop
# Puis :
docker-compose down
docker-compose up -d
```

---

## 📊 Vérification de l'Installation

### Backend

```bash
cd backend
npm run build
```

**Résultat attendu** : Compilation réussie, création du dossier `dist/`

### Frontend

```bash
cd frontend
npm run build
```

**Résultat attendu** : Compilation réussie, création du dossier `.output/`

---

## 🐳 Installation avec Docker uniquement

Si vous ne voulez pas installer Node.js localement, vous pouvez tout faire avec Docker :

### Prérequis
- Docker Desktop installé
- Aucune installation locale nécessaire

### Commandes

```bash
# 1. Configuration
cp .env.example .env

# 2. Démarrage (Docker va tout compiler)
docker-compose up -d --build

# 3. Attendre que tout démarre (2-3 minutes)
docker-compose logs -f
```

**Avantage** : Pas besoin de Node.js local
**Inconvénient** : Première compilation plus lente (3-5 minutes)

---

## 🔍 Vérifier que tout fonctionne

### Test du Backend

```bash
# Si avec Docker :
curl http://localhost:3000/restaurants

# Si en local :
cd backend
npm run start:dev
# Dans un autre terminal :
curl http://localhost:3000/restaurants
```

**Résultat attendu** : `[]` (liste vide) ou JSON avec restaurants

### Test du Frontend

Ouvrez votre navigateur : http://localhost:3001

**Résultat attendu** : Page "Restaurants de Bordeaux" s'affiche

---

## 📝 Structure après Installation

```
restaurants-bordeaux/
├── backend/
│   ├── node_modules/        ← Créé après installation
│   ├── dist/                ← Créé après compilation
│   └── ...
├── frontend/
│   ├── node_modules/        ← Créé après installation
│   ├── .nuxt/               ← Créé après compilation
│   └── ...
└── ...
```

---

## ⏱️ Temps d'Installation Estimé

| Étape                | Temps      |
|---------------------|------------|
| Installation Node.js | 2-5 min    |
| Script install-all   | 3-7 min    |
| Docker build         | 2-5 min    |
| **TOTAL**           | **7-17 min**|

---

## 💡 Conseils

1. **Première fois** : Suivez la méthode automatique avec Docker
2. **Développeur** : Installez en local pour plus de flexibilité
3. **Débutant** : Utilisez uniquement Docker (plus simple)

---

## 🆘 Besoin d'Aide ?

Si rien ne fonctionne :

1. Vérifiez que vous avez bien **Node.js 20+** : `node --version`
2. Vérifiez que vous avez **Docker** : `docker --version`
3. Relisez les messages d'erreur attentivement
4. Cherchez l'erreur spécifique dans ce guide
5. Essayez l'option Docker uniquement (plus fiable)

---

## ✅ Checklist Finale

Avant de continuer, assurez-vous que :

- [ ] Node.js est installé (`node --version` fonctionne)
- [ ] Backend installé (`backend/node_modules/` existe)
- [ ] Frontend installé (`frontend/node_modules/` existe)
- [ ] Docker Desktop est lancé (si vous utilisez Docker)
- [ ] Fichier `.env` existe à la racine
- [ ] `docker-compose up -d` fonctionne
- [ ] http://localhost:3001 s'affiche dans le navigateur

**Si tous les points sont validés : Vous êtes prêt ! 🎉**

Passez à la suite : configuration de n8n (voir `docs/n8n-guide.md`)
