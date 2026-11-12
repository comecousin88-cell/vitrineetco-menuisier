"use client";

import { useRef, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import Photo from "@/components/Photo";
import ProjetOuvert from "@/components/ProjetOuvert";
import Triangle from "@/components/Triangle";
import { CATEGORIES, PROJETS, projetPhoto, type CategorieId } from "@/data/projets";
import { lockScroll } from "@/lib/lenis";
import styles from "./Galerie.module.css";

type Filtre = CategorieId | "tout";
// navigated : le visiteur est passé à un autre projet depuis la vue ouverte. La photo ne fait alors plus le
// trajet depuis sa vignette (qui est cachée sous la vue), elle change simplement.
type Ouvert = { slug: string; navigated: boolean };

const FILTRES: { id: Filtre; label: string; count: number }[] = [
  { id: "tout", label: "Tout", count: PROJETS.length },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, count: PROJETS.filter((p) => p.categorie === c.id).length })),
];

export default function Galerie() {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [ouvert, setOuvert] = useState<Ouvert | null>(null);
  const boutons = useRef(new Map<string, HTMLButtonElement>());
  const visibles = filtre === "tout" ? PROJETS : PROJETS.filter((p) => p.categorie === filtre);

  const ouvrir = (slug: string) => {
    lockScroll(true);
    setOuvert({ slug, navigated: false });
  };

  const fermer = () => {
    const slug = ouvert?.slug;
    setOuvert(null);
    lockScroll(false);
    // Le focus revient sur la vignette du dernier projet vu.
    if (slug) requestAnimationFrame(() => boutons.current.get(slug)?.focus({ preventScroll: true }));
  };

  return (
    <section id="realisations" className={styles.galerie} aria-labelledby="realisations-titre">
      <div className={styles.entete}>
        <h2 id="realisations-titre" className={styles.titre} tabIndex={-1}>
          Ce que j&apos;ai fabriqué
        </h2>
        <p className={styles.intro}>Des chantiers récents, tous fabriqués à l&apos;atelier et posés par moi, entre Tours et Chinon.</p>
      </div>

      <div className={styles.filtres} role="group" aria-label="Filtrer par type de projet">
        {FILTRES.map((f) => (
          <button
            key={f.id}
            type="button"
            className={styles.filtre}
            aria-pressed={filtre === f.id}
            onClick={() => setFiltre(f.id)}
          >
            <Triangle className={styles.repere} filled />
            {f.label}
            <span className={`${styles.nombre} chiffres`}>{f.count}</span>
          </button>
        ))}
      </div>

      <LayoutGroup>
        <ul className={styles.grille}>
          <AnimatePresence mode="popLayout" initial={false}>
            {visibles.map((projet) => {
              const photo = projetPhoto(projet.slug);
              const cachee = ouvert?.slug === projet.slug && !ouvert.navigated;
              return (
                <motion.li
                  key={projet.slug}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className={styles.carte}
                >
                  <article>
                    <div className={styles.cadre}>
                      {/* Pendant que le projet est ouvert, sa photo est dans la vue ouverte : la vignette garde sa place. */}
                      {!cachee && (
                        <motion.div layoutId={`photo-${projet.slug}`} className={styles.photo} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}>
                          <Photo
                            src={photo.src}
                            file={photo.file}
                            alt=""
                            sizes="(min-width: 1000px) 30vw, 50vw"
                            className={styles.photoImage}
                          />
                        </motion.div>
                      )}
                      {projet.avantApres && <span className={styles.badge}>Avant / après</span>}
                    </div>
                    <h3 className={styles.nom}>
                      <button
                        type="button"
                        className={styles.ouvrir}
                        onClick={() => ouvrir(projet.slug)}
                        ref={(el) => {
                          if (el) boutons.current.set(projet.slug, el);
                          else boutons.current.delete(projet.slug);
                        }}
                      >
                        {projet.titre}, <span className={styles.ville}>{projet.ville}</span>
                      </button>
                    </h3>
                  </article>
                </motion.li>
              );
            })}
          </AnimatePresence>
        </ul>

        <AnimatePresence>
          {ouvert && (
            <ProjetOuvert
              projets={visibles}
              slug={ouvert.slug}
              shared={!ouvert.navigated}
              onNavigate={(slug) => setOuvert({ slug, navigated: true })}
              onClose={fermer}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>
    </section>
  );
}
