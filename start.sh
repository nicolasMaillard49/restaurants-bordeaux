#!/bin/bash

# Script de démarrage du projet Restaurants Bordeaux
# Usage: ./start.sh

set -e

echo "🍽️  Démarrage du projet Restaurants Bordeaux"
echo "=============================================="
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé. Création depuis .env.example..."
    cp .env.example .env
    echo "✅ Fichier .env créé. Veuillez le configurer avant de continuer."
    echo ""
    echo "📝 Actions requises :"
    echo "   1. Éditez le fichier .env"
    echo "   2. Changez API_SECRET_KEY et POSTGRES_PASSWORD"
    echo "   3. Relancez ce script"
    exit 0
fi

echo "📦 Arrêt des conteneurs existants (si présents)..."
docker-compose down 2>/dev/null || true

echo ""
echo "🏗️  Construction et démarrage des services..."
docker-compose up -d --build

echo ""
echo "⏳ Attente du démarrage des services (30s)..."
sleep 30

echo ""
echo "✅ Services démarrés !"
echo ""
echo "🌐 Accès aux services :"
echo "   - Frontend:  http://localhost:3001"
echo "   - Backend:   http://localhost:3000"
echo "   - n8n:       http://localhost:5678"
echo "   - Database:  localhost:5432"
echo ""
echo "📊 Vérification de l'état des services :"
docker-compose ps

echo ""
echo "🔍 Test de l'API backend..."
sleep 5
if curl -s http://localhost:3000/restaurants > /dev/null 2>&1; then
    echo "✅ L'API backend répond correctement"
else
    echo "⚠️  L'API backend ne répond pas encore (patientez quelques secondes)"
fi

echo ""
echo "📚 Prochaines étapes :"
echo "   1. Ouvrez http://localhost:5678 pour configurer n8n"
echo "   2. Créez votre workflow de scraping"
echo "   3. Configurez votre clé OpenAI dans n8n"
echo "   4. Lancez le scraping"
echo "   5. Visitez http://localhost:3001 pour voir les résultats"
echo ""
echo "📖 Pour plus d'infos, consultez le README.md"
echo ""
echo "🛠️  Commandes utiles :"
echo "   - Voir les logs:     docker-compose logs -f"
echo "   - Arrêter:           docker-compose down"
echo "   - Redémarrer:        docker-compose restart"
echo ""
