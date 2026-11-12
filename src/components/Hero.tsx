"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Cta from "@/components/Cta";
import Photo from "@/components/Photo";
import { ATELIER, telHref } from "@/data/atelier";
import { FRAMES_END, HERO_COTES, HERO_SCROLL } from "@/data/hero";
import { HERO_SEQUENCE } from "@/data/media";
import { coteGeometry, placeInCover, type CoteGeometry } from "@/lib/cotes";
import { createFramePlayer } from "@/lib/frames";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const WIDE = "(min-width: 760px)";
// La série téléphone est une bande verticale 3:4 prise au centre de l'image 16:9.
const MOBILE_CROP = 3 / 4 / HERO_SEQUENCE.ratio;
const FINAL_COTE = HERO_COTES[HERO_COTES.length - 1].id;

// Les cotes, redessinées à chaque changement de taille du cadre pour rester sur l'objet mesuré.
function useCotes(box: React.RefObject<HTMLDivElement | null>) {
  const [cotes, setCotes] = useState<{ width: number; height: number; items: CoteGeometry[] } | null>(null);
  useEffect(() => {
    const element = box.current;
    if (!element) return;
    const measure = () => {
      const width = element.clientWidth;
      const height = element.clientHeight;
      if (!width || !height) return;
      const wide = window.matchMedia(WIDE).matches;
      const hasFrames = (wide ? HERO_SEQUENCE.count : HERO_SEQUENCE.mobileCount) > 0;
      const crop = wide || !hasFrames ? 1 : MOBILE_CROP;
      const place = (nx: number, ny: number) => placeInCover(nx, ny, { width, height }, HERO_SEQUENCE.ratio, crop);
      setCotes({ width, height, items: HERO_COTES.map((cote) => coteGeometry(cote, place)) });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [box]);
  return cotes;
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLDivElement>(null);
  const cotes = useCotes(box);
  const ready = cotes !== null;

  useGSAP(
    () => {
      if (!ready) return;
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      // Le repère du CSS suit la préférence, si le visiteur la change pendant sa visite.
      mm.add("(prefers-reduced-motion: reduce)", () => {
        delete document.documentElement.dataset.anim;
      });

      mm.add({ animate: "(prefers-reduced-motion: no-preference)", wide: WIDE }, (context) => {
        const { animate, wide } = context.conditions as { animate: boolean; wide: boolean };
        if (!animate) return;
        document.documentElement.dataset.anim = "1";

        const count = wide ? HERO_SEQUENCE.count : HERO_SEQUENCE.mobileCount;
        const [canvas] = q<HTMLCanvasElement>("[data-h=sequence]");
        const player = count && canvas ? createFramePlayer(canvas, `${HERO_SEQUENCE.folder}/${wide ? "desktop" : "mobile"}`, count) : null;
        const lastFrame = Math.max(count - 1, 1);
        const video = { frame: 0 };

        // En attendant la vraie vidéo, l'emplacement provisoire dit quel plan est à l'écran.
        const [planLabel] = q<HTMLElement>("[data-h=plan]");
        const [planBar] = q<HTMLElement>("[data-h=bar]");
        const plans = HERO_SEQUENCE.plans;
        const showPlan = (progress: number) => {
          if (!planLabel) return;
          let edge = 0;
          const index = Math.max(
            0,
            plans.findIndex((plan) => progress <= (edge += plan.share)),
          );
          const text = `Plan ${index + 1} sur ${plans.length} : ${plans[index].file}`;
          if (planLabel.textContent !== text) planLabel.textContent = text;
          planBar?.style.setProperty("--p", String(progress));
        };

        const tl = gsap
          .timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: HERO_SCROLL,
              pin: true,
              scrub: 0.4,
              invalidateOnRefresh: true,
            },
          })
          // La timeline couvre toujours toute l'échelle, pour que les instants de la partition restent justes.
          .to({}, { duration: 10 }, 0)
          .to(
            video,
            {
              frame: lastFrame,
              duration: FRAMES_END,
              onUpdate: () => {
                player?.draw(video.frame);
                showPlan(video.frame / lastFrame);
              },
            },
            0,
          );

        // Chaque cote se trace trait après trait, sa valeur apparaît, puis elle s'efface avant le plan suivant.
        for (const cote of HERO_COTES) {
          const [start, end] = cote.draw;
          const lines = q(`[data-cote=${cote.id}] [data-trait]`);
          const label = q(`[data-cote=${cote.id}] [data-valeur]`);
          const step = (end - start) / (lines.length + 1);
          tl.set(q(`[data-cote=${cote.id}]`), { autoAlpha: 1 }, start);
          lines.forEach((trait, i) => {
            tl.fromTo(
              trait.querySelectorAll("path"),
              { strokeDashoffset: 1 },
              { strokeDashoffset: 0, duration: step * 1.6, ease: "power1.inOut" },
              start + i * step * 0.8,
            );
          });
          tl.fromTo(label, { autoAlpha: 0, y: 4 }, { autoAlpha: 1, y: 0, duration: step * 2, ease: "power2.out" }, end - step * 2);
          if (cote.erase) {
            tl.to(q(`[data-cote=${cote.id}]`), { autoAlpha: 0, duration: cote.erase[1] - cote.erase[0] }, cote.erase[0]);
          }
        }

        return () => player?.destroy();
      });
    },
    { scope: root, dependencies: [ready] },
  );

  const hasFrames = HERO_SEQUENCE.count > 0;

  return (
    <section id="accueil" ref={root} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.stage}>
        <div className={styles.text}>
          <div>
            <h1 id="hero-title" className={styles.title}>
              <span className={styles.name}>{ATELIER.name}</span>
              <span className={styles.role}>
                {ATELIER.metier} à {ATELIER.city}
              </span>
            </h1>
            <p className={styles.lead}>Je dessine et je fabrique vos cuisines, escaliers et rangements au millimètre, dans mon atelier.</p>
          </div>

          <div className={styles.bottom}>
            {/* La zone d'intervention, posée comme une cote : la seule fois où le trait sert au texte. */}
            <p className={styles.zone}>
              <span className={styles.zoneTrait} aria-hidden="true" />
              <span>
                {ATELIER.zone.center} et {ATELIER.zone.radiusKm} km autour
              </span>
              <span className={styles.zoneTrait} aria-hidden="true" />
            </p>
            <div className={styles.actions}>
              <Cta />
              <a href={telHref(ATELIER.phone)} className={styles.phone}>
                ou appelez le <span className="chiffres">{ATELIER.phone}</span>
              </a>
            </div>
          </div>
        </div>

        <div className={styles.media} ref={box}>
          {/* L'affiche : le buffet fini. C'est elle qu'on voit sans animation ; avec, la séquence la recouvre. */}
          <Photo
            src={HERO_SEQUENCE.poster.src}
            file={HERO_SEQUENCE.poster.file}
            alt="Un buffet en chêne huilé, dans un salon éclairé par une grande fenêtre."
            sizes="(min-width: 760px) 60vw, 100vw"
            className={styles.poster}
            priority
          />
          {hasFrames ? (
            <canvas
              className={styles.canvas}
              data-h="sequence"
              role="img"
              aria-label="Des mains passent un rabot sur une planche de chêne, emboîtent une queue d'aronde, puis le buffet fini apparaît dans un salon."
            />
          ) : (
            <div className={styles.placeholder} aria-hidden="true">
              <span className={styles.placeholderPlan} data-h="plan">
                Plan 1 sur 3 : {HERO_SEQUENCE.plans[0].file}
              </span>
              <span className={styles.placeholderBar} data-h="bar" />
            </div>
          )}

          {cotes && (
            <svg className={styles.cotes} viewBox={`0 0 ${cotes.width} ${cotes.height}`} aria-hidden="true">
              {cotes.items.map((cote) => (
                <g key={cote.id} data-cote={cote.id} className={cote.id === FINAL_COTE ? styles.coteFinale : styles.cote}>
                  {cote.paths.map((d, i) => (
                    // Chaque trait est doublé d'un halo clair : il reste lisible sur le bois sombre comme sur le mur.
                    <g key={i} data-trait>
                      <path d={d} className={styles.halo} pathLength={1} />
                      <path d={d} className={styles.trait} pathLength={1} />
                    </g>
                  ))}
                  <text
                    x={cote.label.x}
                    y={cote.label.y}
                    textAnchor={cote.label.anchor}
                    dominantBaseline={cote.label.baseline}
                    className={styles.valeur}
                    data-valeur
                  >
                    <tspan className={styles.chiffre}>{cote.text}</tspan>
                    <tspan x={cote.label.x} dy="1.35em" className={styles.note}>
                      {cote.note}
                    </tspan>
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>
    </section>
  );
}
