// La partition du hero et ses cotes. Le temps est sur une échelle de 0 à 10, du haut du hero à sa sortie.
// Les positions sont en part de l'image source (0 = bord gauche ou haut, 1 = bord droit ou bas) : elles
// suivent l'image quel que soit l'écran.

export const HERO_SCROLL = "+=230%"; // la longueur de défilement pendant laquelle le hero reste épinglé
export const FRAMES_END = 9.2; // la dernière image est atteinte ici ; la fin reste à l'écran jusqu'à 10

type Window = { draw: [number, number]; erase?: [number, number] };

export type Cote =
  | ({
      kind: "lineaire";
      id: string;
      a: [number, number];
      b: [number, number];
      offset: number; // l'écart entre l'objet mesuré et le trait de cote, en pixels ; le signe choisit le côté
      labelInside?: boolean; // la valeur se pose côté objet, entre le trait et ce qu'il mesure
      label: string;
      note: string;
    } & Window)
  | ({
      kind: "angle";
      id: string;
      center: [number, number];
      radius: number; // en pixels
      from: number; // en degrés, 0 = vers la droite, 90 = vers le bas
      to: number;
      label: string;
      note: string;
    } & Window);

// Deux plans : hero-2-aronde (de 0 à ~5,1 sur l'échelle, l'emboîtement vers 3,8–4,0), fondu, puis hero-3-buffet.
// Positions relevées sur les vraies images (passages gardés : voir scripts/prepare_media.py).
export const HERO_COTES: Cote[] = [
  {
    // La pièce est posée sur les queues d'aronde : on mesure la pente d'un flanc. La cote s'efface avant
    // l'emboîtement, qui déplace légèrement la pièce.
    kind: "angle",
    id: "aronde",
    center: [0.522, 0.565],
    radius: 70,
    from: -104,
    to: -90,
    label: "14°",
    note: "la pente, tracée à la main",
    draw: [0.6, 1.6],
    erase: [3.3, 3.65],
  },
  {
    // Le buffet fini, au bout du recul : on mesure sa longueur, sous les pieds. Cette cote reste, et c'est elle
    // qu'on voit sans animation. Sur téléphone, le buffet déborde du cadre : seul le centre de la cote se voit.
    kind: "lineaire",
    id: "buffet",
    a: [0.2, 0.852],
    b: [0.805, 0.852],
    offset: -14,
    // La valeur se pose au-dessus du trait, entre les pieds : en dessous, le bas du cadre la couperait.
    labelInside: true,
    label: "1 800 mm",
    note: "Buffet en chêne, Vouvray",
    draw: [8.2, 9.1],
  },
];
