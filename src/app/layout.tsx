import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import MotionRoot from "@/components/MotionRoot";
import SmoothScroll from "@/components/SmoothScroll";
import { ATELIER, SITE_URL } from "@/data/atelier";
import "lenis/dist/lenis.css";
import "./globals.css";

// Une seule famille, Archivo, avec son axe de largeur : étroite pour les titres, normale pour le texte.
const archivo = Archivo({ subsets: ["latin", "latin-ext"], axes: ["wdth"], variable: "--font-archivo" });

const description = `${ATELIER.metier} à ${ATELIER.city} : cuisines, escaliers, dressings, bibliothèques et portes sur mesure, fabriqués à l'atelier en chêne local. Tours et ${ATELIER.zone.radiusKm} km autour. Projet concept.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${ATELIER.name}, ${ATELIER.metier.toLowerCase()} à ${ATELIER.city} (projet concept)`,
    template: `%s, ${ATELIER.name}`,
  },
  description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: ATELIER.name,
    title: `${ATELIER.name}, ${ATELIER.metier.toLowerCase()} à ${ATELIER.city}`,
    description,
  },
};

export const viewport: Viewport = {
  themeColor: "#EDEDE7",
};

// Lu avant le premier affichage : le hero animé démarre directement dans son état initial, sans saut.
// Sans JavaScript ou avec moins d'animations, ce repère est absent et le buffet fini s'affiche tel quel.
const animCheck = `try{if(!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.anim="1"}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning : le script ci-dessus ajoute un attribut à <html> avant React.
    <html lang="fr" className={archivo.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: animCheck }} />
      </head>
      <body>
        <MotionRoot>
          <SmoothScroll />
          {children}
        </MotionRoot>
      </body>
    </html>
  );
}
