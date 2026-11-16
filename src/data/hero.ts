// La partition du hero et ses cotes. Le temps est sur une échelle de 0 à 10, du haut du hero à sa sortie.
// Les positions sont en part de l'image source (0 = bord gauche ou haut, 1 = bord droit ou bas) : elles
// suivent l'image quel que soit l'écran.

export const HERO_SCROLL = "+=230%"; // la longueur de défilement pendant laquelle le hero reste épinglé
export const FRAMES_END = 9.2; // la dernière image est atteinte ici ; la fin reste à l'écran jusqu'à 10

type Window = { draw: [number, number]; erase?: [number, number] };

// Pour une cote posée pendant que la caméra bouge : le recul est un zoom arrière autour d'un centre fixe de
// l'image. À chaque instant de la séquence (en part de la séquence, 0 à 1), l'échelle de l'image par rapport à la
// première ; les points de la cote se rapprochent du centre d'autant, et la cote reste collée à l'objet.
export type Suivi = { centre: [number, number]; echelles: [number, number][] };

export type Cote =
  | ({
      kind: "lineaire";
      id: string;
      a: [number, number];
      b: [number, number];
      offset: number; // l'écart entre l'objet mesuré et le trait de cote, en pixels ; le signe choisit le côté
      labelInside?: boolean; // la valeur se pose côté objet, entre le trait et ce qu'il mesure
      offsetMobile?: number; // sur téléphone, l'écart (et donc le côté de la valeur) quand la bande 3:4 manque de place
      suivi?: Suivi;
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

// Deux plans : hero-1-plateau (la main glisse sur le chant du plateau, puis le recul), fondu, puis hero-3-buffet.
// Positions relevées sur les vraies images (passages gardés : voir scripts/prepare_media.py).
export const HERO_COTES: Cote[] = [
  {
    // L'épaisseur du plateau, mesurée sur son chant, juste à droite des doigts. La caméra recule déjà : la cote
    // suit le chant (centre du recul et échelles relevés image par image), puis s'efface avant que la main sorte.
    kind: "lineaire",
    id: "plateau",
    a: [0.69, 0.534],
    b: [0.69, 0.61],
    offset: 16,
    offsetMobile: -16,
    suivi: {
      centre: [0.39, 0.33],
      echelles: [
        [0, 1],
        [0.0506, 0.885],
        [0.1013, 0.79],
        [0.1519, 0.72],
        [0.2025, 0.655],
        [0.2532, 0.595],
        [0.3038, 0.535],
      ],
    },
    label: "30 mm",
    note: "le plateau, en chêne massif",
    draw: [0.3, 1.2],
    erase: [2.1, 2.5],
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
