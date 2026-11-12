import Hero from "@/components/Hero";
import JsonLd from "@/components/JsonLd";
import MobileBar from "@/components/MobileBar";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        {/* Les sections suivantes arrivent une par une, après validation. Cet espace laisse voir la sortie
            du hero épinglé. */}
        <div style={{ height: "60vh" }} aria-hidden="true" />
      </main>
      <MobileBar />
    </>
  );
}
