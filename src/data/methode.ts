// Les quatre étapes, dans l'ordre. Les durées sont indicatives et cohérentes avec la section « Prix et délais ».
export const ETAPES = [
  {
    slug: "visite",
    titre: "Visite et mesures",
    texte: "Je viens chez vous, je mesure tout et j'écoute ce que vous voulez en faire. La visite est gratuite dans ma zone.",
    duree: "1 heure chez vous",
    photo: { src: "/methode/1-visite.webp", file: "methode-1-visite.jpg" },
    alt: "Deux mains tendent un mètre ruban contre un mur, dans une pièce vide.",
  },
  {
    slug: "plan",
    titre: "Plan",
    texte: "Je dessine le meuble à l'échelle, avec l'essence choisie et un prix ferme. Rien ne commence sans votre accord.",
    duree: "Devis sous 10 jours",
    photo: { src: "/methode/2-plan.webp", file: "methode-2-plan.jpg" },
    alt: "Une main tient un crayon de menuisier au-dessus d'un croquis de meuble, à côté d'une équerre.",
  },
  {
    slug: "fabrication",
    titre: "Fabrication à l'atelier",
    texte: "Je débite, j'assemble et je finis chaque pièce à Montlouis. Vous pouvez passer voir où ça en est.",
    duree: "3 à 10 semaines selon l'ouvrage, pose comprise",
    photo: { src: "/methode/3-fabrication.webp", file: "methode-3-fabrication.jpg" },
    alt: "Deux mains serrent un serre-joint sur un panneau de chêne collé, sur l'établi.",
  },
  {
    slug: "pose",
    titre: "Pose",
    texte: "J'installe moi-même, je règle chaque porte et je repars avec mes copeaux.",
    duree: "1 à 4 jours",
    photo: { src: "/methode/4-pose.webp", file: "methode-4-pose.jpg" },
    alt: "Deux mains vérifient l'aplomb d'une façade de meuble avec un niveau à bulle.",
  },
] as const;
