"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Photo from "@/components/Photo";
import { ESSENCES } from "@/data/essences";
import styles from "./Essences.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Les essences : de grandes bandes de bois, fil horizontal. La texture glisse un peu moins vite que la page
// (parallaxe légère), comme une planche qu'on fait passer sous la lumière.
export default function Essences() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-photo-layer]", root.current).forEach((layer) => {
          gsap.fromTo(
            layer,
            { yPercent: -8 },
            {
              yPercent: 8,
              ease: "none",
              scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="essences" ref={root} className={styles.essences} aria-labelledby="essences-titre">
      <div className={styles.entete}>
        <h2 id="essences-titre" className={styles.titre}>
          Le bois que j&apos;utilise
        </h2>
        <p className={styles.intro}>Je n&apos;achète que des bois qui ont poussé à moins de cent kilomètres de l&apos;atelier.</p>
      </div>

      <ul className={styles.liste}>
        {ESSENCES.map((essence) => (
          <li key={essence.slug} className={styles.essence}>
            <Photo
              {...essence.photo}
              alt={`Texture du ${essence.nom.toLowerCase()} huilé, fil horizontal, en lumière rasante.`}
              sizes="(min-width: 760px) 60vw, 100vw"
              className={styles.texture}
              layerClassName={styles.couche}
            />
            <div className={styles.texte}>
              <h3 className={styles.nom}>{essence.nom}</h3>
              <p className={styles.phrase}>{essence.phrase}</p>
              <dl className={styles.fiche}>
                <div>
                  <dt>Provenance</dt>
                  <dd>{essence.provenance}</dd>
                </div>
                <div>
                  <dt>Je l&apos;emploie pour</dt>
                  <dd>{essence.usage}</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
