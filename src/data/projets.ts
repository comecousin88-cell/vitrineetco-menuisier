// Les réalisations de la galerie. Toutes les photos sont au même format (4:5) pour que la grille reste
// parfaitement alignée. Les noms de fichiers suivent docs/medias.md.

export const CATEGORIES = [
  { id: "cuisines", label: "Cuisines" },
  { id: "escaliers", label: "Escaliers" },
  { id: "dressings", label: "Dressings" },
  { id: "bibliotheques", label: "Bibliothèques" },
  { id: "portes", label: "Portes" },
] as const;

export type CategorieId = (typeof CATEGORIES)[number]["id"];

export type Projet = {
  slug: string;
  categorie: CategorieId;
  titre: string;
  ville: string;
  phrase: string; // une phrase, à la première personne, sur ce qui fait ce projet
  essence: string;
  dimensions: string;
  fabrication: string;
  pose: string;
  avantApres?: boolean; // une photo « avant » au cadrage identique existe
};

export const PROJETS: Projet[] = [
  {
    slug: "cuisine-amboise",
    categorie: "cuisines",
    titre: "Cuisine en frêne",
    ville: "Amboise",
    phrase: "Pas une poignée : chaque façade s'ouvre par une gorge creusée dans le frêne.",
    essence: "Frêne massif, plan en pierre claire",
    dimensions: "4 200 mm de linéaire",
    fabrication: "5 semaines à l'atelier",
    pose: "3 jours",
    avantApres: true,
  },
  {
    slug: "escalier-montlouis",
    categorie: "escaliers",
    titre: "Escalier en chêne",
    ville: "Montlouis-sur-Loire",
    phrase: "J'ai gardé la trémie et changé tout le reste : deux volées, des marches de 45 mm et des barreaux fins.",
    essence: "Chêne de la forêt de Loches",
    dimensions: "Deux volées, 2 650 mm de hauteur",
    fabrication: "4 semaines à l'atelier",
    pose: "2 jours",
    avantApres: true,
  },
  {
    slug: "bibliotheque-chinon",
    categorie: "bibliotheques",
    titre: "Bibliothèque autour d'une fenêtre",
    ville: "Chinon",
    phrase: "La banquette cache le radiateur ; la chaleur passe par une grille en chêne.",
    essence: "Chêne, finition huilée",
    dimensions: "3 800 × 2 700 mm",
    fabrication: "3 semaines à l'atelier",
    pose: "2 jours",
    avantApres: true,
  },
  {
    slug: "cuisine-tours",
    categorie: "cuisines",
    titre: "Cuisine en chêne et noir",
    ville: "Tours",
    phrase: "Le chêne pour les tiroirs qu'on ouvre tous les jours, le noir mat pour le reste.",
    essence: "Chêne massif, caissons laqués noir mat",
    dimensions: "2 400 mm de linéaire",
    fabrication: "6 semaines à l'atelier",
    pose: "4 jours",
  },
  {
    slug: "escalier-loches",
    categorie: "escaliers",
    titre: "Escalier quart tournant",
    ville: "Loches",
    phrase: "Chaque marche balancée est tracée à part, en taille réelle, sur le sol de l'atelier.",
    essence: "Chêne, contremarches peintes",
    dimensions: "15 marches, quart tournant à gauche",
    fabrication: "5 semaines à l'atelier",
    pose: "3 jours",
  },
  {
    slug: "dressing-joue",
    categorie: "dressings",
    titre: "Dressing sous combles",
    ville: "Joué-lès-Tours",
    phrase: "La pente du toit décide de tout : aucune porte n'a la même hauteur.",
    essence: "Chêne clair",
    dimensions: "5 600 mm sous un rampant à 35°",
    fabrication: "3 semaines à l'atelier",
    pose: "2 jours",
  },
  {
    slug: "dressing-vouvray",
    categorie: "dressings",
    titre: "Dressing en noyer",
    ville: "Vouvray",
    phrase: "Tout le noyer vient du même arbre : le veinage se suit d'une étagère à l'autre.",
    essence: "Noyer massif",
    dimensions: "3 200 × 2 500 mm, banc compris",
    fabrication: "4 semaines à l'atelier",
    pose: "2 jours",
  },
  {
    slug: "bibliotheque-azay",
    categorie: "bibliotheques",
    titre: "Bibliothèque en noyer et pin",
    ville: "Azay-le-Rideau",
    phrase: "Des tablettes de 32 mm d'épaisseur : elles ne plieront pas sous les livres.",
    essence: "Noyer, montants en pin brut",
    dimensions: "4 600 × 2 900 mm",
    fabrication: "2 semaines à l'atelier",
    pose: "1 jour",
  },
  {
    slug: "porte-tours",
    categorie: "portes",
    titre: "Porte d'entrée en chêne",
    ville: "Tours",
    phrase: "Des lames verticales sur une âme isolante : elle ne bouge pas, été comme hiver.",
    essence: "Chêne massif, ferrures forgées",
    dimensions: "950 × 2 250 mm",
    fabrication: "3 semaines à l'atelier",
    pose: "1 jour",
  },
  {
    slug: "portes-saint-cyr",
    categorie: "portes",
    titre: "Portes de placard",
    ville: "Saint-Cyr-sur-Loire",
    phrase: "Cadre et panneau, assemblés à tenon et mortaise, comme les portes d'autrefois.",
    essence: "Chêne",
    dimensions: "4 portes de 2 500 mm de haut",
    fabrication: "2 semaines à l'atelier",
    pose: "1 jour",
  },
];

// Les chemins dans public/ et les originaux attendus dans source/.
export const projetPhoto = (slug: string) => ({ src: `/projets/${slug}.webp`, file: `projet-${slug}.jpg` });
export const projetDetail = (slug: string) => ({ src: `/projets/${slug}-detail.webp`, file: `detail-${slug}.jpg` });
export const projetAvant = (slug: string) => ({ src: `/projets/${slug}-avant.webp`, file: `avant-${slug}.jpg` });
