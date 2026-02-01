#!/bin/bash

# Script pour importer les données de test dans PostgreSQL
# Usage: ./import-test-data.sh

set -e

echo "🗄️  Import des données de test"
echo "=============================="
echo ""

# Vérifier que le container PostgreSQL est démarré
if ! docker ps | grep -q restaurants-db; then
    echo "❌ Le container PostgreSQL n'est pas démarré."
    echo "   Lancez d'abord: docker-compose up -d"
    exit 1
fi

echo "📊 Connexion à la base de données..."
echo ""

# Importer les données de test
docker exec -i restaurants-db psql -U postgres -d restaurants < database/seeds/001_test_restaurants.sql

echo ""
echo "✅ Données de test importées avec succès !"
echo ""
echo "🔍 Vérification :"

# Compter les restaurants
RESTAURANT_COUNT=$(docker exec restaurants-db psql -U postgres -d restaurants -t -c "SELECT COUNT(*) FROM restaurants WHERE source = 'test_data';")

echo "   - Nombre de restaurants de test : $RESTAURANT_COUNT"
echo ""
echo "📱 Vous pouvez maintenant tester le frontend : http://localhost:3001"
echo ""
