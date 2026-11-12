import Atelier from "@/components/Atelier";
import Confiance from "@/components/Confiance";
import Galerie from "@/components/Galerie";
import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import Methode from "@/components/Methode";
import MobileBar from "@/components/MobileBar";
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
        {/* Les sections suivantes arrivent une par une, après validation. */}
        <div style={{ height: "60vh" }} aria-hidden="true" />
      </main>
      <MobileBar />
    </>
  );
}
