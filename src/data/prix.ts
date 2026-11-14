// Les prix et délais indicatifs, par type d'ouvrage. Le délai court de la commande à la pose. Le type sert aussi
// au formulaire de devis et au bouton « Demander un devis pour un projet de ce type » de la galerie.

export const TYPES_PROJET = [
  { id: "escalier", label: "Escalier en chêne", aPartirDe: 3500, delai: "6 à 8 semaines" },
  { id: "cuisine", label: "Cuisine sur mesure", aPartirDe: 8000, delai: "8 à 10 semaines" },
  { id: "dressing", label: "Dressing", aPartirDe: 3000, delai: "5 à 7 semaines" },
  { id: "bibliotheque", label: "Bibliothèque", aPartirDe: 2000, delai: "4 à 6 semaines" },
  { id: "portes", label: "Portes et placards", aPartirDe: 1000, delai: "3 à 5 semaines" },
] as const;

export type TypeProjetId = (typeof TYPES_PROJET)[number]["id"];

// Le délai le plus court et le plus long, pour les textes qui résument (FAQ, méthode, devis).
export const DELAI_MIN_SEMAINES = 3;
export const DELAI_MAX_SEMAINES = 10;

export const NOTE_PRIX = "Prix indicatifs, hors pose particulière. Devis gratuit et détaillé après visite.";

// Le type de projet correspondant à une catégorie de la galerie, pour préremplir le devis.
export const TYPE_PAR_CATEGORIE: Record<string, TypeProjetId> = {
  cuisines: "cuisine",
  escaliers: "escalier",
  dressings: "dressing",
  bibliotheques: "bibliotheque",
  portes: "portes",
};
