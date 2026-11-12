import Cta from "@/components/Cta";
import Triangle from "@/components/Triangle";
import { ATELIER, telHref } from "@/data/atelier";
import styles from "./SiteHeader.module.css";

const NAV = [
  { href: "#realisations", label: "Réalisations" },
  { href: "#methode", label: "Méthode" },
  { href: "#atelier", label: "L'atelier" },
  { href: "#prix", label: "Prix et délais" },
  { href: "#contact", label: "Contact" },
];

// Le bandeau « projet concept » et la barre fixe. Sur ordinateur, le téléphone et « Demander un devis » sont
// toujours visibles ; sur téléphone, ils passent dans la barre du bas.
export default function SiteHeader() {
  return (
    <header className={styles.header}>
      <p className={styles.band}>Projet concept : atelier fictif, aucune prestation n&apos;est vendue.</p>
      <div className={styles.bar}>
        <a href="#accueil" className={styles.brand} aria-label={`${ATELIER.name}, retour en haut de page`}>
          <Triangle className={styles.mark} />
          <span>{ATELIER.shortName}</span>
        </a>
        <nav className={styles.nav} aria-label="Sections">
          {NAV.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <div className={styles.actions}>
          <a href={telHref(ATELIER.phone)} className={`${styles.phone} chiffres`}>
            {ATELIER.phone}
          </a>
          <Cta className={styles.cta} />
        </div>
      </div>
    </header>
  );
}
