// Les prix et délais indicatifs. Les valeurs sont volontairement vides : à compléter avec de vrais chiffres
// (null s'affiche « [À COMPLÉTER] », bien visible). Le type sert aussi au formulaire de devis.

export const A_COMPLETER = "[À COMPLÉTER]";

export const TYPES_PROJET = [
  { id: "cuisine", label: "Cuisine sur mesure", unite: "le mètre linéaire posé" },
  { id: "escalier", label: "Escalier", unite: "posé" },
  { id: "dressing", label: "Dressing", unite: "le mètre linéaire posé" },
  { id: "bibliotheque", label: "Bibliothèque", unite: "le mètre linéaire posé" },
  { id: "porte", label: "Porte d'entrée", unite: "posée" },
  { id: "placard", label: "Portes de placard", unite: "la porte posée" },
] as const;

export type TypeProjetId = (typeof TYPES_PROJET)[number]["id"];

export const PRIX: Record<TypeProjetId, { aPartirDe: number | null; delaiSemaines: string | null }> = {
  cuisine: { aPartirDe: null, delaiSemaines: null },
  escalier: { aPartirDe: null, delaiSemaines: null },
  dressing: { aPartirDe: null, delaiSemaines: null },
  bibliotheque: { aPartirDe: null, delaiSemaines: null },
  porte: { aPartirDe: null, delaiSemaines: null },
  placard: { aPartirDe: null, delaiSemaines: null },
};

// Le type de projet correspondant à une catégorie de la galerie, pour préremplir le devis.
export const TYPE_PAR_CATEGORIE: Record<string, TypeProjetId> = {
  cuisines: "cuisine",
  escaliers: "escalier",
  dressings: "dressing",
  bibliotheques: "bibliotheque",
  portes: "porte",
};
