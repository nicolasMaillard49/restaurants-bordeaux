# 📦 Téléchargement et Extraction des Fichiers

Ce fichier explique comment télécharger et extraire tous les composants du projet.

## 🎯 Fichiers à Télécharger

Vous devez télécharger ces fichiers ZIP depuis l'interface Claude :

### Archives ZIP (dossiers compressés)
- ✅ **backend.zip** - Code du backend NestJS
- ✅ **frontend.zip** - Code du frontend Nuxt 3
- ✅ **database.zip** - Scripts SQL
- ✅ **docs.zip** - Documentation
- ✅ **examples.zip** - Exemples de code

### Fichiers individuels (racine du projet)
- ✅ **docker-compose.yml** - Configuration Docker
- ✅ **.env.example** - Template de configuration
- ✅ **start.sh** - Script de démarrage
- ✅ **import-test-data.sh** - Script d'import
- ✅ **install-all.sh** - Script d'installation
- ✅ **.gitignore** - Fichiers à ignorer par Git
- ✅ **README.md** - Documentation principale
- ✅ **QUICK-START.md** - Guide de démarrage rapide
- ✅ **PROJECT-SUMMARY.md** - Résumé du projet
- ✅ **INDEX.md** - Index de navigation
- ✅ **INSTALLATION-GUIDE.md** - Guide d'installation détaillé
- ✅ **n8n-workflow-template.json** - Template workflow n8n

## 📁 Structure Finale

Après extraction, votre dossier doit ressembler à ceci :

```
restaurants-bordeaux/
├── backend/                    ← Extrait de backend.zip
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── frontend/                   ← Extrait de frontend.zip
│   ├── pages/
│   ├── composables/
│   ├── Dockerfile
│   ├── package.json
│   └── ...
├── database/                   ← Extrait de database.zip
│   ├── migrations/
│   └── seeds/
├── docs/                       ← Extrait de docs.zip
│   ├── n8n-guide.md
│   └── deployment-guide.md
├── examples/                   ← Extrait de examples.zip
│   └── ...
├── docker-compose.yml          ← Fichier individuel
├── .env.example                ← Fichier individuel
├── start.sh                    ← Fichier individuel
├── import-test-data.sh         ← Fichier individuel
├── install-all.sh              ← Fichier individuel
├── .gitignore                  ← Fichier individuel
├── README.md                   ← Fichier individuel
├── QUICK-START.md              ← Fichier individuel
├── PROJECT-SUMMARY.md          ← Fichier individuel
├── INDEX.md                    ← Fichier individuel
├── INSTALLATION-GUIDE.md       ← Fichier individuel
└── n8n-workflow-template.json  ← Fichier individuel
```

## 🚀 Instructions d'Extraction

### Sur Windows

1. **Créer un dossier pour le projet**
   ```
   Nouveau dossier → Nommez-le "restaurants-bordeaux"
   ```

2. **Télécharger tous les fichiers**
   - Téléchargez tous les ZIP et fichiers listés ci-dessus
   - Placez-les TOUS dans le dossier `restaurants-bordeaux`

3. **Extraire les archives ZIP**
   - Clic droit sur `backend.zip` → "Extraire ici"
   - Clic droit sur `frontend.zip` → "Extraire ici"
   - Clic droit sur `database.zip` → "Extraire ici"
   - Clic droit sur `docs.zip` → "Extraire ici"
   - Clic droit sur `examples.zip` → "Extraire ici"

4. **Supprimer les ZIP (optionnel)**
   - Une fois extraits, vous pouvez supprimer les fichiers .zip

### Sur Mac

1. **Créer un dossier pour le projet**
   ```bash
   mkdir ~/restaurants-bordeaux
   cd ~/restaurants-bordeaux
   ```

2. **Télécharger tous les fichiers**
   - Téléchargez tous les ZIP et fichiers
   - Placez-les dans `~/restaurants-bordeaux`

3. **Extraire les archives**
   ```bash
   # Méthode 1 : Double-clic sur chaque .zip dans Finder
   
   # Méthode 2 : En ligne de commande
   unzip backend.zip
   unzip frontend.zip
   unzip database.zip
   unzip docs.zip
   unzip examples.zip
   
   # Supprimer les .zip (optionnel)
   rm *.zip
   ```

### Sur Linux

1. **Créer un dossier pour le projet**
   ```bash
   mkdir ~/restaurants-bordeaux
   cd ~/restaurants-bordeaux
   ```

2. **Télécharger tous les fichiers**
   - Placez tous les fichiers dans `~/restaurants-bordeaux`

3. **Extraire les archives**
   ```bash
   unzip backend.zip
   unzip frontend.zip
   unzip database.zip
   unzip docs.zip
   unzip examples.zip
   
   # Supprimer les .zip (optionnel)
   rm *.zip
   ```

## ✅ Vérification

Après extraction, vérifiez que vous avez bien :

```bash
# Sur Mac/Linux
ls -la

# Sur Windows (PowerShell)
dir
```

Vous devriez voir :
- ✅ Dossier `backend/`
- ✅ Dossier `frontend/`
- ✅ Dossier `database/`
- ✅ Dossier `docs/`
- ✅ Dossier `examples/`
- ✅ Fichier `docker-compose.yml`
- ✅ Fichier `.env.example`
- ✅ Fichier `start.sh`
- ✅ Et tous les autres fichiers .md

## 🎯 Prochaines Étapes

Une fois tous les fichiers extraits :

### Étape 1 : Lire la documentation
```bash
# Ouvrez INDEX.md pour commencer
```

### Étape 2 : Suivre le guide de démarrage rapide
```bash
# Ouvrez QUICK-START.md
```

### Étape 3 : Installer les dépendances
```bash
# Sur Mac/Linux
chmod +x install-all.sh
./install-all.sh

# Sur Windows
# Installez manuellement (voir INSTALLATION-GUIDE.md)
```

### Étape 4 : Démarrer le projet
```bash
cp .env.example .env
./start.sh
```

## ❓ Questions Fréquentes

### Q : Pourquoi des fichiers ZIP ?
**R** : L'interface Claude ne peut pas télécharger des dossiers directement, seulement des fichiers individuels. Les ZIP permettent de regrouper tous les fichiers d'un dossier.

### Q : Dois-je extraire dans un ordre spécifique ?
**R** : Non, l'ordre n'a pas d'importance. Assurez-vous juste que tous les fichiers sont dans le même dossier parent.

### Q : Puis-je supprimer les .zip après extraction ?
**R** : Oui, une fois extraits, vous n'en avez plus besoin.

### Q : J'ai oublié un fichier, que faire ?
**R** : Retournez sur Claude et téléchargez le fichier manquant, puis placez-le au bon endroit.

### Q : Les scripts .sh ne fonctionnent pas sur Windows
**R** : C'est normal. Sur Windows, soit :
- Installez Git Bash et utilisez : `bash start.sh`
- Ou suivez les instructions manuelles dans INSTALLATION-GUIDE.md

## 🆘 Problèmes d'Extraction

### "Impossible d'ouvrir le fichier ZIP"
- Le téléchargement est peut-être corrompu
- Re-téléchargez le fichier ZIP
- Essayez un autre logiciel d'extraction (7-Zip, WinRAR)

### "Permission refusée"
**Sur Mac/Linux :**
```bash
chmod +x *.sh
```

### "Structure de dossiers incorrecte"
- Assurez-vous d'extraire "ici" et non dans un sous-dossier
- Vérifiez que backend/, frontend/, etc. sont au même niveau que docker-compose.yml

## 💡 Conseil

Pour faciliter l'extraction sur Windows, vous pouvez :
1. Installer 7-Zip : https://www.7-zip.org/
2. Sélectionner tous les .zip
3. Clic droit → 7-Zip → "Extract Here"

Tous les dossiers seront extraits en une seule fois !

---

**Une fois l'extraction terminée, ouvrez INDEX.md pour continuer ! 🎉**
