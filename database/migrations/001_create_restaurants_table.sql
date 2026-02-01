-- Migration SQL pour la table restaurants
-- Normalement, TypeORM crée automatiquement la table en mode development
-- Ce fichier est fourni à titre de référence ou pour une création manuelle

-- Supprimer la table si elle existe (ATTENTION en production)
-- DROP TABLE IF EXISTS restaurants;

-- Créer la table restaurants
CREATE TABLE IF NOT EXISTS restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    rating DECIMAL(3, 2) DEFAULT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) DEFAULT 'Bordeaux',
    website VARCHAR(500) DEFAULT NULL,
    images JSONB DEFAULT NULL,
    source VARCHAR(100) DEFAULT 'google_maps',
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index unique pour détecter les doublons (name + address)
CREATE UNIQUE INDEX IF NOT EXISTS idx_restaurants_unique 
ON restaurants(name, address);

-- Créer des index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_restaurants_rating 
ON restaurants(rating DESC);

CREATE INDEX IF NOT EXISTS idx_restaurants_city 
ON restaurants(city);

CREATE INDEX IF NOT EXISTS idx_restaurants_created_at 
ON restaurants(created_at DESC);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_restaurants_updated_at 
BEFORE UPDATE ON restaurants 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

-- Vérification
SELECT 
    table_name, 
    column_name, 
    data_type, 
    is_nullable
FROM 
    information_schema.columns
WHERE 
    table_name = 'restaurants'
ORDER BY 
    ordinal_position;
