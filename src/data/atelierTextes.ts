// La partition de la traversée de l'atelier, sur une échelle de 0 à 10. Chaque texte entre, reste, puis
// laisse la place au suivant ; le dernier reste jusqu'à la fin.

export const ATELIER_SCROLL = "+=300%";
export const ATELIER_LONGUEUR_M = 18; // de la porte à l'établi : la règle du bas compte les mètres parcourus

export const ATELIER_TEXTES = [
  {
    titre: "J'ouvre à 7 h 30",
    texte: "La lumière du matin entre de biais : c'est elle qui montre le moindre défaut du bois.",
    entree: 1.8,
    sortie: 3.9,
  },
  {
    titre: "Le bois attend son tour",
    texte: "Les planches sèchent ici plusieurs années avant de devenir un meuble.",
    entree: 4.5,
    sortie: 6.7,
  },
  {
    titre: "Tout finit à l'établi",
    texte: "Même avec les machines, le dernier ajustement se fait à la main.",
    entree: 7.3,
    sortie: null,
  },
] as const;
