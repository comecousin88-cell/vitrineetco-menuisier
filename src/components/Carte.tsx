"use client";

import { useEffect, useRef } from "react";
import { ATELIER } from "@/data/atelier";
import "leaflet/dist/leaflet.css";
import styles from "./Carte.module.css";

// Une vraie carte OpenStreetMap (Leaflet) : le cercle de la zone d'intervention et le point de l'atelier.
// La molette ne zoome pas la carte, pour ne jamais bloquer le défilement de la page.
export default function Carte() {
  const conteneur = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let detruire: (() => void) | undefined;
    let annule = false;
    (async () => {
      const L = await import("leaflet");
      if (annule || !conteneur.current) return;
      const carte = L.map(conteneur.current, {
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 18,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">les contributeurs d’OpenStreetMap</a>',
      }).addTo(carte);

      L.circle([ATELIER.zone.lat, ATELIER.zone.lng], {
        radius: ATELIER.zone.radiusKm * 1000,
        color: "#1F4A3A",
        weight: 1.5,
        dashArray: "6 5",
        fillColor: "#1F4A3A",
        fillOpacity: 0.07,
      }).addTo(carte);
      L.circleMarker([ATELIER.geo.lat, ATELIER.geo.lng], {
        radius: 7,
        color: "#F8F8F5",
        weight: 2,
        fillColor: "#1E1E1C",
        fillOpacity: 1,
      })
        .bindTooltip(`L'atelier, ${ATELIER.city}`, { direction: "top", offset: [0, -8] })
        .addTo(carte);

      // Le cadre se calcule depuis le centre et le rayon : le cercle, lui, n'a de bornes qu'une fois la carte placée.
      const bornes = L.latLng(ATELIER.zone.lat, ATELIER.zone.lng).toBounds(ATELIER.zone.radiusKm * 2000);
      const cadrer = () => carte.fitBounds(bornes, { padding: [16, 16] });
      cadrer();
      const observer = new ResizeObserver(() => {
        carte.invalidateSize();
        cadrer();
      });
      observer.observe(conteneur.current);
      detruire = () => {
        observer.disconnect();
        carte.remove();
      };
    })();
    return () => {
      annule = true;
      detruire?.();
    };
  }, []);

  return (
    <div
      ref={conteneur}
      className={styles.carte}
      role="region"
      aria-label={`Carte de la zone d'intervention : ${ATELIER.zone.radiusKm} km autour de ${ATELIER.zone.center}, atelier à ${ATELIER.city}`}
    />
  );
}
