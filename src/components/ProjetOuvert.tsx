"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { motion } from "motion/react";
import AvantApres from "@/components/AvantApres";
import Photo from "@/components/Photo";
import { ATELIER } from "@/data/atelier";
import { projetAvant, projetDetail, projetPhoto, type Projet } from "@/data/projets";
import styles from "./ProjetOuvert.module.css";

type Vue = "ensemble" | "detail" | "avant";
const EASE = [0.4, 0, 0.2, 1] as const;
const SIZES = "(min-width: 760px) 55vw, 100vw";

// Un projet en grand. La photo arrive de sa vignette (même layoutId) ; à droite, le cartouche, comme dans le
// coin d'un plan d'atelier : ouvrage, lieu, essence, dimensions, temps de fabrication et de pose.
export default function ProjetOuvert({
  projets,
  slug,
  shared,
  onNavigate,
  onClose,
}: {
  projets: Projet[];
  slug: string;
  shared: boolean;
  onNavigate: (slug: string) => void;
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDivElement>(null);
  const fermer = useRef<HTMLButtonElement>(null);
  // La vue choisie pour chaque projet : un projet avec avant/après s'ouvre sur la comparaison.
  const [vues, setVues] = useState<Record<string, Vue>>({});
  const index = Math.max(0, projets.findIndex((p) => p.slug === slug));
  const projet = projets[index];
  const vue = vues[slug] ?? (projet.avantApres ? "avant" : "ensemble");

  useEffect(() => {
    fermer.current?.focus({ preventScroll: true });
  }, []);

  const aller = (pas: number) => onNavigate(projets[(index + pas + projets.length) % projets.length].slug);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    // Les flèches changent de projet, sauf sur le curseur avant/après qui s'en sert lui-même.
    const surCurseur = event.target instanceof HTMLInputElement;
    if (!surCurseur && projets.length > 1 && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      aller(event.key === "ArrowRight" ? 1 : -1);
      return;
    }
    // Le focus reste dans la vue ouverte.
    if (event.key === "Tab" && dialog.current) {
      const focusables = dialog.current.querySelectorAll<HTMLElement>("button, a[href], input");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  const photo = projetPhoto(projet.slug);
  const detail = projetDetail(projet.slug);
  const avant = projetAvant(projet.slug);
  const alt = `${projet.titre}, ${projet.ville}`;

  const choix: { id: Vue; label: string }[] = [
    ...(projet.avantApres ? [{ id: "avant" as const, label: "Avant / après" }] : []),
    { id: "ensemble", label: "Ensemble" },
    { id: "detail", label: "Détail" },
  ];

  return (
    <motion.div
      ref={dialog}
      className={styles.fond}
      role="dialog"
      aria-modal="true"
      aria-labelledby="projet-titre"
      data-lenis-prevent
      onKeyDown={onKeyDown}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      <div className={styles.barre}>
        <p className={`${styles.compteur} chiffres`}>
          {index + 1} sur {projets.length}
        </p>
        <div className={styles.navigation}>
          {projets.length > 1 && (
            <>
              <button type="button" className={styles.bouton} onClick={() => aller(-1)}>
                Précédent
              </button>
              <button type="button" className={styles.bouton} onClick={() => aller(1)}>
                Suivant
              </button>
            </>
          )}
          <button type="button" className={`${styles.bouton} ${styles.fermer}`} onClick={onClose} ref={fermer}>
            Fermer
          </button>
        </div>
      </div>

      <div className={styles.corps}>
        <div className={styles.visuel}>
          <motion.div
            layoutId={shared ? `photo-${projet.slug}` : undefined}
            className={styles.image}
            transition={{ duration: 0.5, ease: EASE }}
          >
            {vue === "avant" && projet.avantApres ? (
              <AvantApres
                avant={{ ...avant, alt: `${alt}, avant les travaux` }}
                apres={{ ...photo, alt: `${alt}, après les travaux` }}
                sizes={SIZES}
              />
            ) : (
              <Photo
                key={vue}
                {...(vue === "detail" ? detail : photo)}
                alt={vue === "detail" ? `${alt}, détail` : alt}
                sizes={SIZES}
                className={styles.photo}
              />
            )}
          </motion.div>

          <div className={styles.vues} role="group" aria-label="Vues du projet">
            {choix.map((c) => (
              <button
                key={c.id}
                type="button"
                className={styles.vue}
                aria-pressed={vue === c.id}
                onClick={() => setVues((v) => ({ ...v, [projet.slug]: c.id }))}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          key={projet.slug}
          className={styles.infos}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: shared ? 0.2 : 0, ease: EASE }}
        >
          <h3 id="projet-titre" className={styles.titre}>
            {projet.titre}
          </h3>
          <p className={styles.phrase}>{projet.phrase}</p>

          <dl className={styles.cartouche}>
            <div>
              <dt>Lieu</dt>
              <dd>
                {projet.ville} ({ATELIER.postalCode.slice(0, 2)})
              </dd>
            </div>
            <div>
              <dt>Essence</dt>
              <dd>{projet.essence}</dd>
            </div>
            <div>
              <dt>Dimensions</dt>
              <dd className="chiffres">{projet.dimensions}</dd>
            </div>
            <div className={styles.moitie}>
              <dt>Fabrication</dt>
              <dd>{projet.fabrication}</dd>
            </div>
            <div className={styles.moitie}>
              <dt>Pose</dt>
              <dd>{projet.pose}</dd>
            </div>
          </dl>

          <a href="#devis" className={styles.cta} onClick={onClose}>
            Demander un devis pour un projet de ce type
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
