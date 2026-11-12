import Atelier from "@/components/Atelier";
import Confiance from "@/components/Confiance";
import Contact from "@/components/Contact";
import Devis from "@/components/Devis";
import Essences from "@/components/Essences";
import Faq from "@/components/Faq";
import Galerie from "@/components/Galerie";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import Methode from "@/components/Methode";
import MobileBar from "@/components/MobileBar";
import Prix from "@/components/Prix";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Confiance />
        <Galerie />
        <Methode />
        <Atelier />
        <Essences />
        <Prix />
        <Devis />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <MobileBar />
    </>
  );
}
