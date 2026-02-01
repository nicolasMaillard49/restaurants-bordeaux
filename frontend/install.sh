#!/bin/bash

# Script d'installation du Frontend Nuxt 3
# Ce script installe toutes les dépendances nécessaires

set -e

echo "🎨 Installation du Frontend Nuxt 3"
echo "==================================="
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé."
    echo "   Téléchargez-le sur : https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version : $(node --version)"
echo "✅ npm version : $(npm --version)"
echo ""

# Se placer dans le dossier frontend
cd "$(dirname "$0")"

# Vérifier que package.json existe
if [ ! -f "package.json" ]; then
    echo "❌ Fichier package.json non trouvé"
    exit 1
fi

echo "📦 Installation des dépendances npm..."
echo ""

# Nettoyer si nécessaire
if [ -d "node_modules" ]; then
    echo "🗑️  Suppression de l'ancien dossier node_modules..."
    rm -rf node_modules
fi

if [ -d ".nuxt" ]; then
    echo "🗑️  Suppression du cache .nuxt..."
    rm -rf .nuxt
fi

if [ -f "package-lock.json" ]; then
    echo "🗑️  Suppression de package-lock.json..."
    rm -f package-lock.json
fi

# Installation des dépendances
npm install

echo ""
echo "✅ Installation du frontend terminée !"
echo ""
echo "📝 Fichiers créés :"
ls -la node_modules 2>/dev/null | head -5
echo "   ..."
echo ""
echo "🚀 Pour démarrer le frontend (hors Docker) :"
echo "   cd frontend"
echo "   npm run dev"
echo "   Puis ouvrez http://localhost:3000"
echo ""
echo "🐳 Avec Docker (recommandé) :"
echo "   Utilisez docker-compose up -d depuis la racine du projet"
echo ""
