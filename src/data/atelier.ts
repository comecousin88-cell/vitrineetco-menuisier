// Tout ce qui décrit l'atelier, à un seul endroit : le site, la barre fixe, les données structurées et la
// page de contact lisent ces valeurs. L'atelier est fictif : adresse inventée, numéro dans la plage que
// l'Arcep réserve à la fiction (02 61 91 xx xx).

export const ATELIER = {
  name: "Atelier Chêne & Fil",
  shortName: "Chêne & Fil",
  metier: "Menuisier-ébéniste",
  street: "14 chemin des Varennes",
  postalCode: "37270",
  city: "Montlouis-sur-Loire",
  region: "Indre-et-Loire",
  phone: "02 61 91 37 14",
  email: "contact@chene-et-fil.example",
  // Le point de l'atelier sur la carte, au cœur de Montlouis-sur-Loire.
  geo: { lat: 47.3886, lng: 0.8275 },
  // La zone d'intervention : un cercle de 40 km autour de Tours.
  zone: { center: "Tours", radiusKm: 40, lat: 47.3941, lng: 0.6848 },
  foundedYear: 2004,
  // Les horaires de l'atelier, au format des données structurées (jours en anglais, heures sur 24 h).
  hours: [
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "12:00" },
    { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "13:30", closes: "17:30" },
  ],
  // Les villes citées dans la galerie : elles nourrissent aussi areaServed.
  villes: [
    "Tours",
    "Montlouis-sur-Loire",
    "Amboise",
    "Loches",
    "Chinon",
    "Vouvray",
    "Joué-lès-Tours",
    "Saint-Cyr-sur-Loire",
    "Azay-le-Rideau",
  ],
} as const;

export const telHref = (phone: string) => `tel:+33${phone.replace(/\s/g, "").slice(1)}`;

export const yearsOfTrade = (now = new Date()) => now.getFullYear() - ATELIER.foundedYear;

// L'adresse du site une fois en ligne : sert aux liens canoniques et aux données structurées.
export const SITE_URL = "https://demo-menuisier.vercel.app";
