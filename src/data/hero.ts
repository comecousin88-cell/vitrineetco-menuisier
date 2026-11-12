// La partition du hero et ses cotes. Le temps est sur une échelle de 0 à 10, du haut du hero à sa sortie.
// Les positions sont en part de l'image source (0 = bord gauche ou haut, 1 = bord droit ou bas) : elles
// suivent l'image quel que soit l'écran.
// À recaler sur la vraie vidéo quand elle arrive : ce sont des emplacements prévus d'après le cahier des médias.

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

export const HERO_COTES: Cote[] = [
  {
    // Plan 1 : le copeau enroulé sort du rabot. On mesure son épaisseur.
    kind: "lineaire",
    id: "copeau",
    a: [0.6, 0.47],
    b: [0.6, 0.485],
    offset: -64, // la cote part vers la gauche : à droite, l'image est rognée sur les écrans étroits
    label: "0,1 mm",
    note: "l'épaisseur d'un copeau",
    draw: [0.9, 2.1],
    erase: [2.9, 3.3],
  },
  {
    // Plan 2 : la queue d'aronde descend dans son logement. On mesure la pente de son flanc.
    kind: "angle",
    id: "aronde",
    center: [0.5, 0.62],
    radius: 92,
    from: -90,
    to: -76,
    label: "14°",
    note: "la pente, tracée à la main",
    draw: [4.0, 5.0],
    erase: [5.8, 6.1],
  },
  {
    // Plan 3 : le buffet fini. On mesure sa longueur. Cette cote reste, et c'est elle qu'on voit sans animation.
    kind: "lineaire",
    id: "buffet",
    a: [0.385, 0.8],
    b: [0.615, 0.8],
    offset: -34,
    label: "1 800 mm",
    note: "Buffet en chêne, Vouvray",
    draw: [8.3, 9.3],
  },
];
