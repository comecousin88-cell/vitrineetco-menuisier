"use client";

import { useRef, type CSSProperties } from "react";
import { useInView } from "motion/react";
import { ATELIER, yearsOfTrade } from "@/data/atelier";
import styles from "./Confiance.module.css";

// Les quatre raisons de faire confiance, posées comme une cotation en chaîne sur un plan : un seul trait
// continu, coupé en quatre segments. Au-dessus du trait, ce que c'est ; en dessous, la précision.
const ITEMS = [
  { valeur: `${yearsOfTrade()} ans de métier`, note: `l'atelier depuis ${ATELIER.foundedYear}` },
  { valeur: "Assurance décennale", note: "attestation jointe au devis" },
  { valeur: "Fabriqué à l'atelier", note: "rien n'est sous-traité" },
  { valeur: "Chêne de Loches", note: "une forêt à 30 km d'ici" },
];

export default function Confiance() {
  const list = useRef<HTMLUListElement>(null);
  // Le trait se tire une seule fois, de gauche à droite, quand la ligne arrive à l'écran.
  const drawn = useInView(list, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <section className={styles.confiance} aria-label="Garanties">
      <ul ref={list} className={styles.chaine} data-drawn={drawn || undefined}>
        {ITEMS.map((item, i) => (
          <li key={item.valeur} className={styles.segment} style={{ "--i": i } as CSSProperties}>
            <span className={styles.valeur}>{item.valeur}</span>
            <span className={styles.trait} aria-hidden="true">
              <i className={styles.tick} />
              <i className={`${styles.tick} ${styles.tickEnd}`} />
            </span>
            <span className={styles.note}>{item.note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
