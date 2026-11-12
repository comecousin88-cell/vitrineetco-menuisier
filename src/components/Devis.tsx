"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { motion } from "motion/react";
import Triangle from "@/components/Triangle";
import { ATELIER, telHref } from "@/data/atelier";
import { TYPES_PROJET } from "@/data/prix";
import {
  BUDGETS,
  CONTACT_PREFERE,
  DELAIS,
  DEMANDE_VIDE,
  MAX_PHOTO_MO,
  MAX_PHOTOS,
  PREREMPLIR,
  envoyerDemande,
  valider,
  type Demande,
  type Erreurs,
  type TypeDemande,
} from "@/lib/devis";
import { scrollToY } from "@/lib/lenis";
import styles from "./Devis.module.css";

const ETAPES = ["Projet", "Dimensions", "Photos", "Budget", "Délai", "Coordonnées"];
const TYPES: { id: TypeDemande; label: string }[] = [...TYPES_PROJET.map(({ id, label }) => ({ id, label })), { id: "autre", label: "Autre ouvrage" }];
const EASE = [0.4, 0, 0.2, 1] as const;

const libelle = <T extends { id: string; label: string }>(liste: readonly T[], id: string) => liste.find((x) => x.id === id)?.label ?? "";

// Un choix parmi plusieurs, présenté comme une case à cocher large. Le vrai bouton radio reste dans la page :
// clavier et lecteurs d'écran fonctionnent sans rien ajouter.
function Choix({
  name,
  value,
  checked,
  onChange,
  champ,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: (v: string) => void;
  champ?: string; // repère du premier choix d'un groupe : le focus y va si le groupe est à corriger
  children: ReactNode;
}) {
  return (
    <label className={styles.choix} data-coche={checked || undefined}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} className={styles.radio} data-champ={champ} />
      <Triangle className={styles.choixRepere} filled />
      <span>{children}</span>
    </label>
  );
}

function Champ({
  id,
  label,
  erreur,
  aide,
  children,
  className,
}: {
  id: string;
  label: string;
  erreur?: string;
  aide?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${styles.champ} ${className ?? ""}`}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {children}
      {aide && !erreur && (
        <p id={`${id}-aide`} className={styles.aide}>
          {aide}
        </p>
      )}
      {erreur && (
        <p id={`${id}-erreur`} className={styles.erreur}>
          {erreur}
        </p>
      )}
    </div>
  );
}

export default function Devis() {
  const [etape, setEtape] = useState(0);
  const [demande, setDemande] = useState<Demande>(DEMANDE_VIDE);
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [envoi, setEnvoi] = useState<"idle" | "envoi" | "fait">("idle");
  const [reference, setReference] = useState("");
  const [photoErreur, setPhotoErreur] = useState("");
  const formulaire = useRef<HTMLDivElement>(null);
  const titreEtape = useRef<HTMLLegendElement>(null);
  const titreConfirmation = useRef<HTMLHeadingElement>(null);
  const premierAffichage = useRef(true);

  // Un projet ouvert dans la galerie peut préremplir le type.
  useEffect(() => {
    const onPreremplir = (event: Event) => {
      const type = (event as CustomEvent<TypeDemande>).detail;
      setDemande((d) => ({ ...d, type }));
      setEtape(0);
      setEnvoi("idle");
    };
    window.addEventListener(PREREMPLIR, onPreremplir);
    return () => window.removeEventListener(PREREMPLIR, onPreremplir);
  }, []);

  // À chaque étape, le focus va sur sa question, et le haut du formulaire revient à l'écran s'il en est sorti.
  useEffect(() => {
    if (premierAffichage.current) {
      premierAffichage.current = false;
      return;
    }
    const cible = envoi === "fait" ? titreConfirmation.current : titreEtape.current;
    cible?.focus({ preventScroll: true });
    const haut = formulaire.current?.getBoundingClientRect().top ?? 0;
    const barre = document.querySelector("header")?.offsetHeight ?? 0;
    if (haut < barre) scrollToY(window.scrollY + haut - barre - 16, 0.6);
  }, [etape, envoi]);

  const maj = (partiel: Partial<Demande>) => setDemande((d) => ({ ...d, ...partiel }));
  const majDims = (partiel: Partial<Demande["dimensions"]>) => setDemande((d) => ({ ...d, dimensions: { ...d.dimensions, ...partiel } }));
  const majCoord = (partiel: Partial<Demande["coordonnees"]>) => setDemande((d) => ({ ...d, coordonnees: { ...d.coordonnees, ...partiel } }));

  const ajouterPhotos = (event: ChangeEvent<HTMLInputElement>) => {
    const fichiers = Array.from(event.target.files ?? []);
    event.target.value = "";
    const images = fichiers.filter((f) => f.type.startsWith("image/"));
    const tropLourdes = images.filter((f) => f.size > MAX_PHOTO_MO * 1024 * 1024);
    const retenues = images.filter((f) => f.size <= MAX_PHOTO_MO * 1024 * 1024).slice(0, MAX_PHOTOS - demande.photos.length);
    const messages = [];
    if (images.length < fichiers.length) messages.push("Seules les images sont acceptées.");
    if (tropLourdes.length) messages.push(`Une photo dépasse ${MAX_PHOTO_MO} Mo : réduisez-la ou choisissez-en une autre.`);
    if (images.length - tropLourdes.length > retenues.length) messages.push(`${MAX_PHOTOS} photos au maximum.`);
    setPhotoErreur(messages.join(" "));
    maj({ photos: [...demande.photos, ...retenues.map((f) => ({ name: f.name, size: f.size, url: URL.createObjectURL(f) }))] });
  };

  const retirerPhoto = (url: string) => {
    URL.revokeObjectURL(url);
    maj({ photos: demande.photos.filter((p) => p.url !== url) });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const e = valider(etape, demande);
    setErreurs(e);
    if (Object.keys(e).length) {
      // Le focus va sur le premier champ à corriger.
      const premier = Object.keys(e)[0];
      setTimeout(() => document.querySelector<HTMLElement>(`[data-champ="${premier}"]`)?.focus(), 0);
      return;
    }
    if (etape < ETAPES.length - 1) {
      setEtape(etape + 1);
      return;
    }
    setEnvoi("envoi");
    const { reference } = await envoyerDemande(demande);
    setReference(reference);
    setEnvoi("fait");
  };

  const recommencer = () => {
    demande.photos.forEach((p) => URL.revokeObjectURL(p.url));
    setDemande(DEMANDE_VIDE);
    setErreurs({});
    setEtape(0);
    setEnvoi("idle");
  };

  const err = (cle: string) => erreurs[cle];
  const decrit = (id: string) => (erreurs[id] ? `devis-${id}-erreur` : undefined);

  const d = demande;
  const dims = [d.dimensions.largeur, d.dimensions.hauteur, d.dimensions.profondeur].filter(Boolean);

  return (
    <section id="devis" className={styles.devis} aria-labelledby="devis-titre">
      <div className={styles.entete}>
        <h2 id="devis-titre" className={styles.titre} tabIndex={-1}>
          Demander un devis
        </h2>
        <p className={styles.intro}>
          Six questions, deux minutes. Je vous rappelle sous 48 heures pour fixer la visite. Vous préférez parler ?{" "}
          <a href={telHref(ATELIER.phone)} className={`${styles.lienTel} chiffres`}>
            {ATELIER.phone}
          </a>
        </p>
      </div>

      <div ref={formulaire} className={styles.cadre}>
        {envoi === "fait" ? (
          <motion.div
            className={styles.confirmation}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            role="status"
          >
            <h3 ref={titreConfirmation} tabIndex={-1} className={styles.confirmationTitre}>
              Demande envoyée
            </h3>
            <p>
              Merci {d.coordonnees.nom.trim().split(" ")[0]}. Je vous {d.coordonnees.contact === "email" ? "écris" : "rappelle"} sous 48 heures pour fixer la
              visite.
            </p>
            <dl className={styles.recap}>
              <div>
                <dt>Référence</dt>
                <dd className="chiffres">{reference}</dd>
              </div>
              <div>
                <dt>Projet</dt>
                <dd>{libelle(TYPES, d.type)}</dd>
              </div>
              <div>
                <dt>Dimensions</dt>
                <dd className="chiffres">{d.dimensions.inconnues || dims.length === 0 ? "À mesurer ensemble" : `${dims.join(" × ")} cm`}</dd>
              </div>
              <div>
                <dt>Photos</dt>
                <dd>{d.photos.length === 0 ? "Aucune" : `${d.photos.length} photo${d.photos.length > 1 ? "s" : ""}`}</dd>
              </div>
              <div>
                <dt>Budget</dt>
                <dd>{libelle(BUDGETS, d.budget)}</dd>
              </div>
              <div>
                <dt>Délai</dt>
                <dd>{libelle(DELAIS, d.delai)}</dd>
              </div>
              <div>
                <dt>Commune</dt>
                <dd>{d.coordonnees.commune}</dd>
              </div>
            </dl>
            <p className={styles.concept}>Projet concept : cette demande n&apos;a été envoyée à personne.</p>
            <button type="button" className={styles.secondaire} onClick={recommencer}>
              Faire une autre demande
            </button>
          </motion.div>
        ) : (
          <form onSubmit={onSubmit} noValidate className={styles.form}>
            {/* Les étapes, comme une cotation en chaîne : la cote en cours en vert sapin. */}
            <ol className={styles.chaine} aria-label="Étapes de la demande">
              {ETAPES.map((nom, i) => (
                <li
                  key={nom}
                  className={styles.segment}
                  data-etat={i < etape ? "fait" : i === etape ? "encours" : "avenir"}
                  aria-current={i === etape ? "step" : undefined}
                >
                  <span className={styles.segmentNom}>
                    <span className="chiffres">{i + 1}</span> {nom}
                  </span>
                  <span className={styles.segmentTrait} aria-hidden="true" />
                </li>
              ))}
            </ol>
            <p className={`${styles.compteur} chiffres`}>
              Étape {etape + 1} sur {ETAPES.length} : {ETAPES[etape]}
            </p>

            {/* Chaque étape entre en glissant légèrement. Pas d'animation de sortie : la nouvelle question
                s'affiche tout de suite, même si l'on clique vite. */}
            <motion.fieldset
              key={etape}
              className={styles.etape}
              initial={etape === 0 ? false : { opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              {etape === 0 && (
                <>
                  <legend ref={titreEtape} tabIndex={-1} className={styles.question}>
                    Quel est votre projet ?
                  </legend>
                  <div className={styles.grilleChoix} role="radiogroup" aria-describedby={decrit("type")}>
                    {TYPES.map((t, i) => (
                      <Choix
                        key={t.id}
                        name="type"
                        value={t.id}
                        checked={d.type === t.id}
                        onChange={(v) => maj({ type: v as TypeDemande })}
                        champ={i === 0 ? "type" : undefined}
                      >
                        {t.label}
                      </Choix>
                    ))}
                  </div>
                  {err("type") && (
                    <p id="devis-type-erreur" className={styles.erreur}>
                      {err("type")}
                    </p>
                  )}
                </>
              )}

              {etape === 1 && (
                <>
                  <legend ref={titreEtape} tabIndex={-1} className={styles.question}>
                    Quelles dimensions, à peu près ?
                  </legend>
                  <div className={styles.grilleDims}>
                    {(["largeur", "hauteur", "profondeur"] as const).map((cote) => (
                      <Champ key={cote} id={`devis-${cote}`} label={cote[0].toUpperCase() + cote.slice(1)} erreur={err(cote)}>
                        <div className={styles.unite}>
                          <input
                            id={`devis-${cote}`}
                            data-champ={cote}
                            className={styles.input}
                            inputMode="numeric"
                            autoComplete="off"
                            value={d.dimensions[cote]}
                            disabled={d.dimensions.inconnues}
                            onChange={(e) => majDims({ [cote]: e.target.value })}
                            aria-invalid={!!err(cote) || undefined}
                            aria-describedby={err(cote) ? `devis-${cote}-erreur` : undefined}
                          />
                          <span aria-hidden="true">cm</span>
                        </div>
                      </Champ>
                    ))}
                  </div>
                  <label className={styles.case}>
                    <input type="checkbox" checked={d.dimensions.inconnues} onChange={(e) => majDims({ inconnues: e.target.checked })} />
                    Je ne connais pas les dimensions : on mesurera ensemble.
                  </label>
                  <Champ id="devis-description" label="Quelques mots sur le projet (facultatif)" className={styles.pleine}>
                    <textarea
                      id="devis-description"
                      className={`${styles.input} ${styles.textarea}`}
                      rows={3}
                      value={d.description}
                      onChange={(e) => maj({ description: e.target.value })}
                    />
                  </Champ>
                </>
              )}

              {etape === 2 && (
                <>
                  <legend ref={titreEtape} tabIndex={-1} className={styles.question}>
                    Des photos de l&apos;existant ?
                  </legend>
                  <p className={styles.consigne}>La pièce, le mur ou le vieil ouvrage : ça m&apos;aide à préparer la visite. Facultatif.</p>
                  <label className={styles.depot} data-plein={d.photos.length >= MAX_PHOTOS || undefined}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="visually-hidden"
                      onChange={ajouterPhotos}
                      disabled={d.photos.length >= MAX_PHOTOS}
                      aria-describedby="devis-photos-aide"
                    />
                    <span className={styles.depotTitre}>{d.photos.length >= MAX_PHOTOS ? `${MAX_PHOTOS} photos ajoutées` : "Ajouter des photos"}</span>
                    <span id="devis-photos-aide" className={styles.aide}>
                      Jusqu&apos;à {MAX_PHOTOS} images de {MAX_PHOTO_MO} Mo. Dans cette démo, elles restent sur votre appareil.
                    </span>
                  </label>
                  {photoErreur && <p className={styles.erreur}>{photoErreur}</p>}
                  {d.photos.length > 0 && (
                    <ul className={styles.vignettes}>
                      {d.photos.map((p) => (
                        <li key={p.url} className={styles.vignette}>
                          {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local d'un fichier du visiteur */}
                          <img src={p.url} alt={p.name} />
                          <button type="button" onClick={() => retirerPhoto(p.url)} className={styles.retirer} aria-label={`Retirer ${p.name}`}>
                            Retirer
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {etape === 3 && (
                <>
                  <legend ref={titreEtape} tabIndex={-1} className={styles.question}>
                    Quel budget envisagez-vous ?
                  </legend>
                  <div className={styles.listeChoix} role="radiogroup" aria-describedby={decrit("budget")}>
                    {BUDGETS.map((b, i) => (
                      <Choix
                        key={b.id}
                        name="budget"
                        value={b.id}
                        checked={d.budget === b.id}
                        onChange={(v) => maj({ budget: v as Demande["budget"] })}
                        champ={i === 0 ? "budget" : undefined}
                      >
                        <span className="chiffres">{b.label}</span>
                      </Choix>
                    ))}
                  </div>
                  {err("budget") && (
                    <p id="devis-budget-erreur" className={styles.erreur}>
                      {err("budget")}
                    </p>
                  )}
                </>
              )}

              {etape === 4 && (
                <>
                  <legend ref={titreEtape} tabIndex={-1} className={styles.question}>
                    Pour quand ?
                  </legend>
                  <div className={styles.listeChoix} role="radiogroup" aria-describedby={decrit("delai")}>
                    {DELAIS.map((x, i) => (
                      <Choix
                        key={x.id}
                        name="delai"
                        value={x.id}
                        checked={d.delai === x.id}
                        onChange={(v) => maj({ delai: v as Demande["delai"] })}
                        champ={i === 0 ? "delai" : undefined}
                      >
                        {x.label}
                      </Choix>
                    ))}
                  </div>
                  {err("delai") && (
                    <p id="devis-delai-erreur" className={styles.erreur}>
                      {err("delai")}
                    </p>
                  )}
                  <p className={styles.consigne}>Aujourd&apos;hui, je fabrique avec 2 à 6 semaines d&apos;avance.</p>
                </>
              )}

              {etape === 5 && (
                <>
                  <legend ref={titreEtape} tabIndex={-1} className={styles.question}>
                    Comment vous joindre ?
                  </legend>
                  <div className={styles.grilleCoord}>
                    <Champ id="devis-nom" label="Nom" erreur={err("nom")}>
                      <input
                        id="devis-nom"
                        data-champ="nom"
                        className={styles.input}
                        autoComplete="name"
                        value={d.coordonnees.nom}
                        onChange={(e) => majCoord({ nom: e.target.value })}
                        aria-invalid={!!err("nom") || undefined}
                        aria-describedby={decrit("nom")}
                      />
                    </Champ>
                    <Champ id="devis-commune" label="Commune du chantier" erreur={err("commune")}>
                      <input
                        id="devis-commune"
                        data-champ="commune"
                        className={styles.input}
                        autoComplete="address-level2"
                        value={d.coordonnees.commune}
                        onChange={(e) => majCoord({ commune: e.target.value })}
                        aria-invalid={!!err("commune") || undefined}
                        aria-describedby={decrit("commune")}
                      />
                    </Champ>
                    <Champ id="devis-telephone" label="Téléphone" erreur={err("telephone")}>
                      <input
                        id="devis-telephone"
                        data-champ="telephone"
                        className={styles.input}
                        type="tel"
                        autoComplete="tel"
                        value={d.coordonnees.telephone}
                        onChange={(e) => majCoord({ telephone: e.target.value })}
                        aria-invalid={!!err("telephone") || undefined}
                        aria-describedby={decrit("telephone")}
                      />
                    </Champ>
                    <Champ id="devis-email" label="E-mail" erreur={err("email")}>
                      <input
                        id="devis-email"
                        data-champ="email"
                        className={styles.input}
                        type="email"
                        autoComplete="email"
                        value={d.coordonnees.email}
                        onChange={(e) => majCoord({ email: e.target.value })}
                        aria-invalid={!!err("email") || undefined}
                        aria-describedby={decrit("email")}
                      />
                    </Champ>
                  </div>
                  <div className={styles.preference} role="radiogroup" aria-label="Je vous recontacte">
                    <span className={styles.label}>Je vous recontacte</span>
                    <div className={styles.listeChoixLigne}>
                      {CONTACT_PREFERE.map((c) => (
                        <Choix
                          key={c.id}
                          name="contact"
                          value={c.id}
                          checked={d.coordonnees.contact === c.id}
                          onChange={(v) => majCoord({ contact: v as Demande["coordonnees"]["contact"] })}
                        >
                          {c.label}
                        </Choix>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.fieldset>

            <div className={styles.actions}>
              {etape > 0 && (
                <button
                  type="button"
                  className={styles.secondaire}
                  onClick={() => {
                    setErreurs({});
                    setEtape(etape - 1);
                  }}
                >
                  Retour
                </button>
              )}
              <button type="submit" className={styles.principal} disabled={envoi === "envoi"}>
                {etape < ETAPES.length - 1 ? "Continuer" : envoi === "envoi" ? "Envoi en cours" : "Envoyer ma demande"}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
