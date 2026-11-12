import photos from "./photos.json";
import sequences from "./sequences.json";

export const PHOTO_QUALITY = 82;

// Les photos déjà préparées dans public/ et leurs dimensions, écrites par le script de préparation.
// Une photo absente de cette liste s'affiche en emplacement provisoire, avec le nom du fichier attendu.
export const PHOTOS: Record<string, { width: number; height: number }> = photos;
export const isReady = (src: string) => src in PHOTOS;

// Une séquence d'images que le scroll fait avancer. Les nombres d'images viennent de sequences.json, écrit par
// scripts/prepare_media.py ; à 0, le site montre un emplacement provisoire qui dit quelle vidéo fournir.
export type Sequence = {
  folder: string;
  count: number;
  mobileCount: number; // la série plus légère, pour les téléphones
  // Le rapport largeur / hauteur des images : sert à placer les cotes au bon endroit de l'image.
  ratio: number;
  // Les plans qui la composent, dans l'ordre, et la part de la séquence que chacun occupe.
  plans: { file: string; share: number }[];
  poster: { src: string; file: string };
};

export const HERO_SEQUENCE: Sequence = {
  folder: "/hero",
  ...sequences.hero,
  ratio: 16 / 9,
  plans: [
    { file: "hero-1-rabot.mp4", share: 1 / 3 },
    { file: "hero-2-aronde.mp4", share: 1 / 3 },
    { file: "hero-3-buffet.mp4", share: 1 / 3 },
  ],
  poster: { src: "/hero/fin.webp", file: "hero-fin.jpg" },
};

// La traversée de l'atelier : la caméra avance de la porte jusqu'à l'établi. Chargée seulement à l'approche
// de la section, pour ne pas concurrencer le hero.
export const ATELIER_SEQUENCE: Sequence = {
  folder: "/atelier",
  ...sequences.atelier,
  ratio: 16 / 9,
  plans: [
    { file: "atelier-1-entree.mp4", share: 0.55 },
    { file: "atelier-2-etabli.mp4", share: 0.45 },
  ],
  poster: { src: "/atelier/fin.webp", file: "atelier-fin.jpg" },
};
