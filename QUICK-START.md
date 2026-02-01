# 🚀 DÉMARRAGE RAPIDE - 5 MINUTES

## Prérequis
- Docker et Docker Compose installés
- 2GB de RAM disponible
- Ports 3000, 3001, 5432, 5678 disponibles

## Installation en 5 étapes

### 1️⃣ Télécharger le projet
```bash
# Si vous avez récupéré les fichiers depuis Claude
cd chemin/vers/le/dossier

# OU depuis Git (une fois le repo créé)
git clone https://github.com/votre-repo/restaurants-bordeaux.git
cd restaurants-bordeaux
```

### 2️⃣ Configurer l'environnement
```bash
cp .env.example .env
```

Pour un démarrage rapide, vous pouvez garder les valeurs par défaut.

**⚠️ IMPORTANT pour la production** : Changez ces valeurs dans `.env` :
- `API_SECRET_KEY` : Générez une clé forte
- `POSTGRES_PASSWORD` : Utilisez un mot de passe fort

### 3️⃣ Démarrer l'application
```bash
# Méthode 1 : Script automatique (recommandé)
./start.sh

# Méthode 2 : Commande manuelle
docker-compose up -d
```

Attendez 30 secondes que tous les services démarrent.

### 4️⃣ Vérifier que tout fonctionne
```bash
# Vérifier l'état des services
docker-compose ps

# Tous les services doivent être "Up"
```

### 5️⃣ Importer des données de test
```bash
./import-test-data.sh
```

## ✅ C'est prêt !

Ouvrez votre navigateur :

- **Frontend** : http://localhost:3001
- **API** : http://localhost:3000/restaurants
- **n8n** : http://localhost:5678

## 🎯 Prochaines étapes

### Configuration de n8n (5 minutes)

1. Ouvrez http://localhost:5678
2. Créez votre compte utilisateur
3. Suivez le guide : `docs/n8n-guide.md`
4. Configurez votre clé OpenAI
5. Créez le workflow de scraping

### Test de l'API

```bash
# Lister les restaurants
curl http://localhost:3000/restaurants

# Ajouter un restaurant (avec votre API_SECRET_KEY)
curl -X POST http://localhost:3000/scraper/import \
  -H "Content-Type: application/json" \
  -H "x-api-key: change-me-in-production" \
  -d '{
    "name": "Test Restaurant",
    "description": "Un super restaurant de test",
    "rating": 4.5,
    "address": "1 rue de Test, Bordeaux",
    "images": [],
    "source": "manual"
  }'
```

## 🛠️ Commandes utiles

```bash
# Voir les logs
docker-compose logs -f

# Redémarrer tous les services
docker-compose restart

# Arrêter tous les services
docker-compose down

# Arrêter et supprimer les données
docker-compose down -v
```

## ❓ Problèmes courants

### Port déjà utilisé
```bash
# Vérifier quel processus utilise le port 3000
lsof -i :3000

# Modifier le port dans .env
BACKEND_PORT=3002
```

### Service ne démarre pas
```bash
# Voir les logs du service
docker-compose logs backend

# Reconstruire le service
docker-compose up -d --build backend
```

### Base de données vide
```bash
# Réimporter les données de test
./import-test-data.sh
```

## 📚 Documentation complète

- **README.md** : Documentation principale
- **PROJECT-SUMMARY.md** : Vue d'ensemble du projet
- **docs/n8n-guide.md** : Configuration n8n
- **docs/deployment-guide.md** : Déploiement production

## 🎓 Architecture du projet

```
Frontend (Nuxt)  →  Backend (NestJS)  →  PostgreSQL
                         ↑
                      n8n + Playwright + OpenAI
```

## 💡 Tips

1. **Développement** : Les fichiers sont montés en volumes, les modifications sont automatiquement prises en compte
2. **Production** : Suivez `docs/deployment-guide.md` pour un déploiement sécurisé
3. **Scraping** : Commencez par 5-10 restaurants pour tester avant de scraper massivement

## 🆘 Support

En cas de problème, vérifiez dans l'ordre :
1. Les logs : `docker-compose logs -f`
2. L'état des services : `docker-compose ps`
3. Le README.md pour plus de détails

## 🎉 Bon développement !
