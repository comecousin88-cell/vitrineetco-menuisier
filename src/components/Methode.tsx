"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "motion/react";
import Photo from "@/components/Photo";
import Triangle from "@/components/Triangle";
import { ETAPES } from "@/data/methode";
import styles from "./Methode.module.css";

// Une étape : sa photo se découvre de gauche à droite à son arrivée, comme une planche qui sort du rabot.
function Etape({ etape, index }: { etape: (typeof ETAPES)[number]; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const vue = useInView(ref, { once: true, margin: "0px 0px -20% 0px" });
  return (
    <li ref={ref} id={`etape-${etape.slug}`} className={styles.etape} data-etape={index} data-vu={vue || undefined}>
      <Photo {...etape.photo} alt={etape.alt} ratio="3 / 2" sizes="(min-width: 760px) 55vw, 100vw" className={styles.photo} />
      <div className={styles.texte}>
        <span className={`${styles.numero} chiffres`} aria-hidden="true">
          {index + 1}
        </span>
        <div>
          <h3 className={styles.titreEtape}>{etape.titre}</h3>
          <p>{etape.texte}</p>
          <p className={styles.duree}>{etape.duree}</p>
        </div>
      </div>
    </li>
  );
}

// La méthode en 4 étapes. Sur ordinateur, la colonne de gauche reste en place et le triangle de menuisier
// marque l'étape en cours pendant que les étapes défilent à droite.
export default function Methode() {
  const liste = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const items = liste.current?.querySelectorAll<HTMLElement>("[data-etape]");
    if (!items) return;
    // L'étape en cours est celle qui traverse le milieu de l'écran.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.etape));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="methode" className={styles.methode} aria-labelledby="methode-titre">
      <div className={styles.colonne}>
        <div className={styles.fixe}>
          <h2 id="methode-titre" className={styles.titre} tabIndex={-1}>
            De la visite à la pose
          </h2>
          <p className={styles.intro}>C&apos;est moi qui viens mesurer, moi qui dessine, moi qui fabrique et moi qui pose.</p>
          <ol className={styles.sommaire} aria-hidden="true">
            {ETAPES.map((etape, i) => (
              <li key={etape.slug} className={styles.repere} data-actif={i === active || undefined}>
                <Triangle className={styles.triangle} filled />
                <span className="chiffres">{i + 1}</span>
                {etape.titre}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <ol ref={liste} className={styles.etapes}>
        {ETAPES.map((etape, i) => (
          <Etape key={etape.slug} etape={etape} index={i} />
        ))}
      </ol>
    </section>
  );
}
