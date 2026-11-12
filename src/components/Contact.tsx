import Carte from "@/components/Carte";
import Photo from "@/components/Photo";
import { ATELIER, telHref } from "@/data/atelier";
import styles from "./Contact.module.css";

const itineraire = `https://www.openstreetmap.org/search?query=${encodeURIComponent(`${ATELIER.street}, ${ATELIER.postalCode} ${ATELIER.city}`)}`;

export default function Contact() {
  return (
    <section id="contact" className={styles.contact} aria-labelledby="contact-titre">
      <div className={styles.infos}>
        <h2 id="contact-titre" className={styles.titre} tabIndex={-1}>
          Me joindre
        </h2>

        <div className={styles.moi}>
          <Photo
            src="/contact/portrait.webp"
            file="portrait-artisan.jpg"
            alt="L'artisan de l'Atelier Chêne & Fil, à l'établi, en tablier vert sapin."
            ratio="4 / 5"
            sizes="9rem"
            className={styles.portrait}
          />
          <div>
            <p className={styles.phrase}>C&apos;est moi qui décroche. Si je suis à la machine, je rappelle dans la journée.</p>
            <a href={telHref(ATELIER.phone)} className={`${styles.telephone} chiffres`}>
              {ATELIER.phone}
            </a>
          </div>
        </div>

        <dl className={styles.fiche}>
          <div>
            <dt>L&apos;atelier</dt>
            <dd>
              <address>
                {ATELIER.street}
                <br />
                {ATELIER.postalCode} {ATELIER.city}
              </address>
              <a href={itineraire} target="_blank" rel="noopener noreferrer" className={styles.lien}>
                Voir le chemin
              </a>
            </dd>
          </div>
          <div>
            <dt>Horaires</dt>
            <dd className="chiffres">
              Du lundi au vendredi
              <br />8 h – 12 h, 13 h 30 – 17 h 30
              <br />
              Le samedi matin sur rendez-vous
            </dd>
          </div>
          <div>
            <dt>Zone d&apos;intervention</dt>
            <dd>
              {ATELIER.zone.center} et {ATELIER.zone.radiusKm} km autour
            </dd>
          </div>
        </dl>
      </div>

      <div className={styles.cote}>
        <div className={styles.carte}>
          <Carte />
        </div>
        <Photo
          src="/contact/facade.webp"
          file="contact-facade.jpg"
          alt="La façade en bardage bois de l'atelier, grande porte ouverte sur la cour."
          ratio="3 / 2"
          sizes="(min-width: 760px) 55vw, 100vw"
          className={styles.facade}
        />
      </div>
    </section>
  );
}
