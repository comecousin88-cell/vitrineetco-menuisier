import type { Metadata } from "next";
import MobileBar from "@/components/MobileBar";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { ATELIER } from "@/data/atelier";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false },
};

// Les mentions de ce site de démonstration. Coordonnées de l'hébergeur reprises des démos précédentes
// (relevées sur vercel.com/legal). Pour un vrai client, ce contenu est à remplacer et à faire valider par un
// professionnel du droit.
export default function MentionsLegales() {
  return (
    <>
      <SiteHeader base="/" />
      <main className={styles.legal}>
        <h1 className={styles.titre}>Mentions légales</h1>

        <h2>Projet concept</h2>
        <p>
          Ce site est une démonstration. {ATELIER.name} n&apos;existe pas : l&apos;atelier, l&apos;artisan, ses réalisations, ses prix, son
          adresse et son téléphone sont inventés. Aucune prestation n&apos;est vendue et aucune demande de devis n&apos;est transmise.
        </p>

        <h2>Éditeur</h2>
        <p>
          Côme Cousin – Vitrine &amp; Co, particulier, également responsable de la publication.
          <br />
          Contact : <a href="mailto:vitrineetco@gmail.com">vitrineetco@gmail.com</a>
        </p>

        <h2>Hébergeur</h2>
        <p>
          Vercel Inc.
          <br />
          440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis
          <br />
          Contact :{" "}
          <a href="https://vercel.com/help" target="_blank" rel="noopener noreferrer">
            vercel.com/help
          </a>
        </p>

        <h2>Données personnelles</h2>
        <p>
          Le formulaire de devis est simulé : rien de ce que vous saisissez n&apos;est envoyé ni enregistré, et les photos ajoutées ne
          quittent pas votre appareil. Ce site ne dépose aucun cookie publicitaire.
        </p>
        <p>La carte est fournie par OpenStreetMap, dont les serveurs reçoivent la demande d&apos;affichage des tuiles.</p>

        <h2>Images</h2>
        <p>Les photos et vidéos du site ont été créées pour cette démonstration. Les personnes et les lieux représentés sont fictifs.</p>
      </main>
      <SiteFooter base="/" />
      <MobileBar base="/" />
    </>
  );
}
