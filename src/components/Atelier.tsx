"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Photo from "@/components/Photo";
import { ATELIER } from "@/data/atelier";
import { ATELIER_LONGUEUR_M, ATELIER_SCROLL, ATELIER_TEXTES } from "@/data/atelierTextes";
import { ATELIER_SEQUENCE } from "@/data/media";
import { createFramePlayer } from "@/lib/frames";
import styles from "./Atelier.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WIDE = "(min-width: 760px)";
const hasFrames = ATELIER_SEQUENCE.count > 0;
const MOBILE_STILL = { src: "/atelier/mobile.webp", file: "atelier-mobile.jpg" };

// La traversée de l'atelier : section épinglée, la caméra avance de la porte à l'établi au rythme du scroll.
// En bas, une règle compte les mètres parcourus ; trois courts textes se succèdent.
export default function Atelier() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add({ animate: "(prefers-reduced-motion: no-preference)", wide: WIDE }, (context) => {
        const { animate, wide } = context.conditions as { animate: boolean; wide: boolean };
        if (!animate) return;

        // Sur téléphone, la série légère si elle existe ; sinon l'image fixe, et seuls les textes bougent.
        const count = wide ? ATELIER_SEQUENCE.count : ATELIER_SEQUENCE.mobileCount;
        const [canvas] = q<HTMLCanvasElement>("[data-a=sequence]");
        const player =
          count && canvas
            ? createFramePlayer(canvas, `${ATELIER_SEQUENCE.folder}/${wide ? "desktop" : "mobile"}`, count, { autoStart: false })
            : null;
        // Les images ne se chargent qu'à l'approche : le hero garde toute la bande passante au départ.
        if (player) {
          ScrollTrigger.create({ trigger: root.current, start: "top bottom+=100%", once: true, onEnter: () => player.start() });
        }
        const lastFrame = Math.max(count - 1, 1);
        const video = { frame: 0 };

        const [metres] = q<HTMLElement>("[data-a=metres]");
        const [regle] = q<HTMLElement>("[data-a=regle]");
        const [planLabel] = q<HTMLElement>("[data-a=plan]");
        const plans = ATELIER_SEQUENCE.plans;
        const avancer = (progress: number) => {
          regle?.style.setProperty("--p", String(progress));
          if (metres) {
            const text = `${Math.round(progress * ATELIER_LONGUEUR_M)} m`;
            if (metres.textContent !== text) metres.textContent = text;
          }
          if (planLabel) {
            let edge = 0;
            const index = Math.max(0, plans.findIndex((plan) => progress <= (edge += plan.share)));
            const text = `Plan ${index + 1} sur ${plans.length} : ${plans[index].file}`;
            if (planLabel.textContent !== text) planLabel.textContent = text;
          }
        };

        const tl = gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: ATELIER_SCROLL,
              pin: true,
              scrub: 0.5,
              invalidateOnRefresh: true,
            },
          })
          .to({}, { duration: 10 }, 0)
          .to(
            video,
            {
              frame: lastFrame,
              duration: 10,
              onUpdate: () => {
                player?.draw(video.frame);
                avancer(video.frame / lastFrame);
              },
            },
            0,
          )
          // Le titre de la section s'efface quand on franchit le seuil.
          .to(q("[data-a=entete]"), { autoAlpha: 0, y: -12, duration: 0.6 }, 1.1);

        q<HTMLElement>("[data-a=texte]").forEach((el, i) => {
          const { entree, sortie } = ATELIER_TEXTES[i];
          tl.fromTo(el, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, entree);
          if (sortie !== null) tl.to(el, { autoAlpha: 0, y: -10, duration: 0.5, ease: "power1.in" }, sortie);
        });

        return () => player?.destroy();
      });
    },
    { scope: root },
  );

  return (
    <section id="atelier" ref={root} className={styles.atelier} aria-labelledby="atelier-titre">
      <div className={styles.stage}>
        <div className={styles.media}>
          {/* Sans animation : l'établi, l'image de fin de la traversée. */}
          <Photo
            src={ATELIER_SEQUENCE.poster.src}
            file={ATELIER_SEQUENCE.poster.file}
            alt="L'établi de l'atelier dans la lumière du matin : deux mains ajustent un tenon dans une mortaise."
            sizes="100vw"
            className={styles.poster}
          />
          {hasFrames ? (
            <>
              <canvas
                className={styles.canvas}
                data-a="sequence"
                role="img"
                aria-label="On entre dans l'atelier par la grande porte, on passe devant le mur d'outils et les planches, jusqu'à l'établi."
              />
              {ATELIER_SEQUENCE.mobileCount === 0 && (
                <Photo {...MOBILE_STILL} alt="" sizes="100vw" className={styles.mobileStill} />
              )}
            </>
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              <span data-a="plan">
                Plan 1 sur {ATELIER_SEQUENCE.plans.length} : {ATELIER_SEQUENCE.plans[0].file}
              </span>
            </div>
          )}
          <div className={styles.voile} />
        </div>

        <div className={styles.entete} data-a="entete">
          <h2 id="atelier-titre" className={styles.titre} tabIndex={-1}>
            L&apos;atelier
          </h2>
          <p className={styles.adresse}>
            {ATELIER.street}, {ATELIER.city}
          </p>
        </div>

        <ol className={styles.textes}>
          {ATELIER_TEXTES.map((t) => (
            <li key={t.titre} className={styles.texte} data-a="texte">
              <h3 className={styles.titreTexte}>{t.titre}</h3>
              <p>{t.texte}</p>
            </li>
          ))}
        </ol>

        {/* La règle : de la porte (0 m) à l'établi, la distance parcourue dans l'atelier. */}
        <div className={styles.regle} data-a="regle" aria-hidden="true">
          <span className={styles.graduations} />
          <span className={styles.parcouru} />
          <span className={`${styles.metres} chiffres`} data-a="metres">
            0 m
          </span>
          <span className={`${styles.total} chiffres`}>{ATELIER_LONGUEUR_M} m</span>
        </div>
      </div>
    </section>
  );
}
