"use client";

import { useState, type CSSProperties } from "react";
import Photo from "@/components/Photo";
import Triangle from "@/components/Triangle";
import styles from "./AvantApres.module.css";

type Image = { src: string; file: string; alt: string };

// Le curseur avant/après : les deux photos ont exactement le même cadrage. Un vrai curseur (input range)
// fait le travail : il se manipule à la souris, au doigt et au clavier, et il est annoncé aux lecteurs d'écran.
export default function AvantApres({ avant, apres, sizes }: { avant: Image; apres: Image; sizes: string }) {
  const [position, setPosition] = useState(50);

  return (
    <div className={styles.cadre} style={{ "--pos": `${position}%` } as CSSProperties}>
      <Photo {...apres} sizes={sizes} className={styles.photo} />
      <div className={styles.avant}>
        <Photo {...avant} sizes={sizes} className={styles.photo} />
      </div>

      <span className={`${styles.etiquette} ${styles.etiquetteAvant}`} aria-hidden="true">
        Avant
      </span>
      <span className={`${styles.etiquette} ${styles.etiquetteApres}`} aria-hidden="true">
        Après
      </span>

      <div className={styles.ligne} aria-hidden="true">
        <span className={styles.poignee}>
          <Triangle className={styles.flecheGauche} filled />
          <Triangle className={styles.flecheDroite} filled />
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className={styles.curseur}
        aria-label="Glisser pour comparer avant et après les travaux"
        aria-valuetext={`${position} % de la photo d'avant visible`}
      />
    </div>
  );
}
