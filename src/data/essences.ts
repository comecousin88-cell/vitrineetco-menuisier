// Les quatre essences travaillées à l'atelier. Toutes poussent à moins de cent kilomètres.
export const ESSENCES = [
  {
    slug: "chene",
    nom: "Chêne",
    phrase: "Le plus solide de la région, et le plus beau quand il vieillit.",
    provenance: "Forêt de Loches, 30 km",
    usage: "Escaliers, cuisines, portes",
    photo: { src: "/essences/chene.webp", file: "essence-chene.jpg" },
  },
  {
    slug: "noyer",
    nom: "Noyer",
    phrase: "Brun chaud, veiné de sombre : je le garde pour les meubles qu'on regarde.",
    provenance: "Vergers du Lochois, 40 km",
    usage: "Dressings, bibliothèques, buffets",
    photo: { src: "/essences/noyer.webp", file: "essence-noyer.jpg" },
  },
  {
    slug: "frene",
    nom: "Frêne",
    phrase: "Très clair et souple : il ne craint ni les chocs ni la vapeur.",
    provenance: "Bords de Loire, 20 km",
    usage: "Cuisines, plans de travail, chaises",
    photo: { src: "/essences/frene.webp", file: "essence-frene.jpg" },
  },
  {
    slug: "pin",
    nom: "Pin",
    phrase: "Léger et abordable : le bon choix pour les grandes surfaces.",
    provenance: "Sologne, 80 km",
    usage: "Bibliothèques, placards, combles",
    photo: { src: "/essences/pin.webp", file: "essence-pin.jpg" },
  },
] as const;
