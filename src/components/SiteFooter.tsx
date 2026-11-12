import Triangle from "@/components/Triangle";
import { ATELIER, telHref } from "@/data/atelier";
import styles from "./SiteFooter.module.css";

export default function SiteFooter({ base = "" }: { base?: string }) {
  return (
    <footer className={styles.pied}>
      <div className={styles.grille}>
        <div>
          <p className={styles.marque}>
            <Triangle className={styles.triangle} />
            {ATELIER.name}
          </p>
          <p className={styles.texte}>
            {ATELIER.metier} à {ATELIER.city}. {ATELIER.zone.center} et {ATELIER.zone.radiusKm} km autour.
          </p>
        </div>
        <div className={styles.texte}>
          <address>
            {ATELIER.street}, {ATELIER.postalCode} {ATELIER.city}
          </address>
          <a href={telHref(ATELIER.phone)} className="chiffres">
            {ATELIER.phone}
          </a>
        </div>
        <nav aria-label="Pied de page" className={styles.liens}>
          <a href={`${base}#realisations`}>Réalisations</a>
          <a href={`${base}#devis`}>Demander un devis</a>
          <a href="/mentions-legales">Mentions légales</a>
        </nav>
      </div>
      <p className={styles.concept}>
        Projet concept réalisé par Vitrine &amp; Co. L&apos;atelier, l&apos;adresse, le téléphone et les réalisations sont fictifs ; aucune
        prestation n&apos;est vendue.
      </p>
    </footer>
  );
}
