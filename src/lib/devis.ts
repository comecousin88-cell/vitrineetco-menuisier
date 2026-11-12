// La demande de devis : sa forme, sa validation et son envoi. L'envoi est simulé ; pour le brancher à un vrai
// outil (Formspree, Resend, un CRM…), il suffit de remplacer le corps de envoyerDemande(). Le reste du
// formulaire ne change pas.

import type { TypeProjetId } from "@/data/prix";

export type TypeDemande = TypeProjetId | "autre";

export const BUDGETS = [
  { id: "moins-3000", label: "Moins de 3 000 €" },
  { id: "3000-8000", label: "3 000 à 8 000 €" },
  { id: "8000-15000", label: "8 000 à 15 000 €" },
  { id: "plus-15000", label: "Plus de 15 000 €" },
  { id: "ne-sait-pas", label: "Je ne sais pas encore" },
] as const;

export const DELAIS = [
  { id: "vite", label: "Dès que possible" },
  { id: "3-mois", label: "D'ici 3 mois" },
  { id: "6-mois", label: "D'ici 6 mois" },
  { id: "pas-presse", label: "Rien ne presse" },
] as const;

export const CONTACT_PREFERE = [
  { id: "telephone", label: "Par téléphone" },
  { id: "email", label: "Par e-mail" },
] as const;

export type Demande = {
  type: TypeDemande | "";
  dimensions: { largeur: string; hauteur: string; profondeur: string; inconnues: boolean };
  description: string;
  photos: { name: string; size: number; url: string }[]; // url : aperçu local, jamais envoyé dans la simulation
  budget: (typeof BUDGETS)[number]["id"] | "";
  delai: (typeof DELAIS)[number]["id"] | "";
  coordonnees: {
    nom: string;
    telephone: string;
    email: string;
    commune: string;
    contact: (typeof CONTACT_PREFERE)[number]["id"];
  };
};

export const DEMANDE_VIDE: Demande = {
  type: "",
  dimensions: { largeur: "", hauteur: "", profondeur: "", inconnues: false },
  description: "",
  photos: [],
  budget: "",
  delai: "",
  coordonnees: { nom: "", telephone: "", email: "", commune: "", contact: "telephone" },
};

export const MAX_PHOTOS = 6;
export const MAX_PHOTO_MO = 10;

export type Erreurs = Partial<Record<string, string>>;

const telephoneValide = (v: string) => /^(?:\+33\s?|0)[1-9](?:[\s.-]?\d{2}){4}$/.test(v.trim());
const emailValide = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());
const cmValide = (v: string) => v.trim() === "" || (/^\d{1,4}$/.test(v.trim()) && Number(v) > 0);

// La validation d'une étape. Les messages disent quoi corriger, sans s'excuser.
export function valider(etape: number, d: Demande): Erreurs {
  const e: Erreurs = {};
  if (etape === 0 && !d.type) e.type = "Choisissez un type de projet.";
  if (etape === 1) {
    for (const cote of ["largeur", "hauteur", "profondeur"] as const) {
      if (!cmValide(d.dimensions[cote])) e[cote] = "En centimètres, sans virgule : par exemple 240.";
    }
  }
  if (etape === 3 && !d.budget) e.budget = "Choisissez une fourchette, ou « Je ne sais pas encore ».";
  if (etape === 4 && !d.delai) e.delai = "Choisissez un délai.";
  if (etape === 5) {
    const c = d.coordonnees;
    if (!c.nom.trim()) e.nom = "Indiquez votre nom.";
    if (!c.commune.trim()) e.commune = "Indiquez la commune du chantier.";
    if (!c.telephone.trim() && !c.email.trim()) e.telephone = "Indiquez un téléphone ou un e-mail pour que je vous recontacte.";
    if (c.telephone.trim() && !telephoneValide(c.telephone)) e.telephone = "Un numéro à 10 chiffres, par exemple 06 12 34 56 78.";
    if (c.email.trim() && !emailValide(c.email)) e.email = "Une adresse complète, par exemple nom@exemple.fr.";
    if (c.contact === "telephone" && !c.telephone.trim() && c.email.trim()) e.telephone = "Indiquez un téléphone, ou choisissez « Par e-mail ».";
    if (c.contact === "email" && !c.email.trim() && c.telephone.trim()) e.email = "Indiquez un e-mail, ou choisissez « Par téléphone ».";
  }
  return e;
}

// Ce qui partirait vers l'outil de réception : les photos ne sont décrites que par leur nom et leur poids.
export function versEnvoi(d: Demande) {
  return {
    ...d,
    photos: d.photos.map(({ name, size }) => ({ name, size })),
    envoyeeLe: new Date().toISOString(),
  };
}

// L'envoi simulé : un court délai, puis une référence. Projet concept, rien ne part.
export async function envoyerDemande(d: Demande): Promise<{ reference: string }> {
  const charge = versEnvoi(d);
  void charge; // à envoyer ici : await fetch("/api/devis", { method: "POST", body: JSON.stringify(charge) })
  await new Promise((resolve) => setTimeout(resolve, 900));
  const n = Math.floor(1000 + Math.random() * 9000);
  return { reference: `CF-${new Date().getFullYear()}-${n}` };
}

// Préremplir le type de projet depuis un autre endroit de la page (un projet ouvert dans la galerie).
export const PREREMPLIR = "devis:preremplir";
export function preremplirDevis(type: TypeDemande) {
  window.dispatchEvent(new CustomEvent<TypeDemande>(PREREMPLIR, { detail: type }));
}
