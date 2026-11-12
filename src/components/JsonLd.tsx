import { ATELIER, SITE_URL } from "@/data/atelier";

// Les données structurées LocalBusiness : ce que Google lit pour la fiche locale (nom, adresse, horaires,
// zone d'intervention). La FAQ ajoutera plus tard son propre bloc FAQPage.
export default function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${SITE_URL}/#atelier`,
    name: ATELIER.name,
    description: `${ATELIER.metier} : cuisines, escaliers, dressings, bibliothèques et portes sur mesure, fabriqués à l'atelier.`,
    url: SITE_URL,
    telephone: `+33${ATELIER.phone.replace(/\s/g, "").slice(1)}`,
    image: `${SITE_URL}/hero/fin.webp`,
    foundingDate: String(ATELIER.foundedYear),
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: ATELIER.street,
      postalCode: ATELIER.postalCode,
      addressLocality: ATELIER.city,
      addressRegion: ATELIER.region,
      addressCountry: "FR",
    },
    geo: { "@type": "GeoCoordinates", latitude: ATELIER.geo.lat, longitude: ATELIER.geo.lng },
    areaServed: [
      {
        "@type": "GeoCircle",
        geoMidpoint: { "@type": "GeoCoordinates", latitude: ATELIER.geo.lat, longitude: ATELIER.geo.lng },
        geoRadius: ATELIER.zone.radiusKm * 1000,
      },
      ...ATELIER.villes.map((ville) => ({ "@type": "City", name: ville })),
    ],
    openingHoursSpecification: ATELIER.hours.map((slot) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
