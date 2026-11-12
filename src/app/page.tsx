import Confiance from "@/components/Confiance";
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
        <Confiance />
        {/* Les sections suivantes arrivent une par une, après validation. */}
        <div style={{ height: "60vh" }} aria-hidden="true" />
      </main>
      <MobileBar />
    </>
  );
}
