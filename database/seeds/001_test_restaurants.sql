-- Données de test pour la table restaurants
-- Ces données permettent de tester l'application sans scraping

INSERT INTO restaurants (name, description, rating, address, city, website, images, source) VALUES
(
    'Le Bistrot du Quai',
    'Situé au bord de la Garonne, Le Bistrot du Quai offre une cuisine française authentique dans un cadre chaleureux. Spécialisé dans les produits frais du marché, le restaurant propose une carte qui varie au fil des saisons. L''ambiance conviviale et la vue imprenable sur le fleuve en font une adresse incontournable pour les amateurs de bonne cuisine bordelaise.',
    4.6,
    '12 Quai des Chartrons, 33000 Bordeaux',
    'Bordeaux',
    NULL,
    '[]'::jsonb,
    'test_data'
),
(
    'La Table de Bacchus',
    'Restaurant gastronomique réputé pour sa cave exceptionnelle et ses accords mets-vins. Le chef propose une cuisine raffinée qui met en valeur les produits du terroir aquitain. Chaque plat est une création unique qui ravira les palais les plus exigeants. L''atmosphère élégante et le service irréprochable complètent une expérience culinaire mémorable.',
    4.8,
    '28 Rue du Pas-Saint-Georges, 33000 Bordeaux',
    'Bordeaux',
    NULL,
    '[]'::jsonb,
    'test_data'
),
(
    'Chez Marcel',
    'Institution bordelaise depuis 1952, Chez Marcel perpétue la tradition de la cuisine régionale. Les spécialités de la maison incluent l''entrecôte à la bordelaise et le cannelé maison. L''ambiance familiale et les recettes transmises de génération en génération font de ce restaurant un lieu authentique où l''on se sent comme à la maison.',
    4.4,
    '67 Rue Sainte-Catherine, 33000 Bordeaux',
    'Bordeaux',
    NULL,
    '[]'::jsonb,
    'test_data'
),
(
    'Le Jardin Secret',
    'Niché dans une cour intérieure verdoyante, Le Jardin Secret propose une cuisine créative et végétarienne. Le cadre bucolique en plein cœur de la ville offre une parenthèse de calme et de fraîcheur. La carte bio et de saison privilégie les circuits courts et les producteurs locaux. Une adresse idéale pour les amateurs de cuisine saine et inventive.',
    4.5,
    '15 Place du Palais, 33000 Bordeaux',
    'Bordeaux',
    NULL,
    '[]'::jsonb,
    'test_data'
),
(
    'L''Atelier des Saveurs',
    'Restaurant moderne qui allie tradition et innovation culinaire. Le chef, formé dans les plus grandes maisons, propose une carte qui revisite les classiques de la gastronomie française. Les présentations soignées et les saveurs audacieuses séduisent une clientèle exigeante. L''espace contemporain et lumineux complète une expérience gastronomique de haut niveau.',
    4.7,
    '89 Cours Victor Hugo, 33000 Bordeaux',
    'Bordeaux',
    NULL,
    '[]'::jsonb,
    'test_data'
);

-- Vérification des données insérées
SELECT 
    name, 
    rating, 
    LEFT(description, 80) as description_preview,
    source
FROM 
    restaurants
WHERE 
    source = 'test_data'
ORDER BY 
    rating DESC;
