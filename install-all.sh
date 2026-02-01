#!/bin/bash

# Script d'installation complète du projet Restaurants Bordeaux
# Ce script installe les dépendances du backend ET du frontend

set -e

echo "🍽️  Installation complète du projet Restaurants Bordeaux"
echo "=========================================================="
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé."
    echo ""
    echo "📥 Installation de Node.js requise :"
    echo "   1. Rendez-vous sur https://nodejs.org/"
    echo "   2. Téléchargez la version LTS (20.x ou supérieur)"
    echo "   3. Installez Node.js"
    echo "   4. Relancez ce script"
    echo ""
    exit 1
fi

echo "✅ Node.js version : $(node --version)"
echo "✅ npm version : $(npm --version)"
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker n'est pas installé."
    echo "   Pour utiliser Docker (recommandé), installez-le depuis https://docker.com"
    echo ""
else
    echo "✅ Docker version : $(docker --version)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Installation du Backend
echo "📦 ÉTAPE 1/2 : Installation du Backend NestJS"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d "backend" ]; then
    cd backend
    
    # Nettoyer
    rm -rf node_modules package-lock.json 2>/dev/null || true
    
    echo "📥 Installation des dépendances du backend..."
    npm install
    
    echo ""
    echo "✅ Backend installé avec succès !"
    echo "   📂 $(ls node_modules 2>/dev/null | wc -l) packages installés"
    
    cd ..
else
    echo "❌ Dossier backend/ non trouvé"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Installation du Frontend
echo "📦 ÉTAPE 2/2 : Installation du Frontend Nuxt 3"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -d "frontend" ]; then
    cd frontend
    
    # Nettoyer
    rm -rf node_modules .nuxt package-lock.json 2>/dev/null || true
    
    echo "📥 Installation des dépendances du frontend..."
    npm install
    
    echo ""
    echo "✅ Frontend installé avec succès !"
    echo "   📂 $(ls node_modules 2>/dev/null | wc -l) packages installés"
    
    cd ..
else
    echo "❌ Dossier frontend/ non trouvé"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "🎉 INSTALLATION TERMINÉE AVEC SUCCÈS !"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Résumé :"
echo "   ✅ Backend NestJS installé"
echo "   ✅ Frontend Nuxt 3 installé"
echo ""
echo "🚀 PROCHAINES ÉTAPES :"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "OPTION 1 : Utiliser Docker (RECOMMANDÉ - Plus simple)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Copiez le fichier de configuration :"
echo "   cp .env.example .env"
echo ""
echo "2. Démarrez tous les services :"
echo "   ./start.sh"
echo "   (ou : docker-compose up -d)"
echo ""
echo "3. Importez les données de test :"
echo "   ./import-test-data.sh"
echo ""
echo "4. Ouvrez votre navigateur :"
echo "   Frontend : http://localhost:3001"
echo "   Backend  : http://localhost:3000"
echo "   n8n      : http://localhost:5678"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "OPTION 2 : Démarrage manuel (développement)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Vous devez démarrer chaque service manuellement :"
echo ""
echo "Terminal 1 - PostgreSQL :"
echo "   docker run -d --name postgres-restaurants -p 5432:5432 \\"
echo "     -e POSTGRES_DB=restaurants \\"
echo "     -e POSTGRES_PASSWORD=postgres \\"
echo "     postgres:15-alpine"
echo ""
echo "Terminal 2 - Backend :"
echo "   cd backend"
echo "   npm run start:dev"
echo ""
echo "Terminal 3 - Frontend :"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 CONSEIL : Utilisez Docker (Option 1) pour une installation simple !"
echo ""
