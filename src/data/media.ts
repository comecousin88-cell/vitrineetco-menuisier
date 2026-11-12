import photos from "./photos.json";

export const PHOTO_QUALITY = 82;

// Les photos déjà préparées dans public/ et leurs dimensions, écrites par le script de préparation.
// Une photo absente de cette liste s'affiche en emplacement provisoire, avec le nom du fichier attendu.
export const PHOTOS: Record<string, { width: number; height: number }> = photos;
export const isReady = (src: string) => src in PHOTOS;

// Une séquence d'images que le scroll fait avancer. count reste à 0 tant que les images ne sont pas
// préparées : le site montre alors un emplacement provisoire qui dit quelle vidéo fournir.
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
  count: 0,
  mobileCount: 0,
  ratio: 16 / 9,
  plans: [
    { file: "hero-1-rabot.mp4", share: 0.34 },
    { file: "hero-2-aronde.mp4", share: 0.26 },
    { file: "hero-3-buffet.mp4", share: 0.4 },
  ],
  poster: { src: "/hero/fin.webp", file: "hero-fin.jpg" },
};
