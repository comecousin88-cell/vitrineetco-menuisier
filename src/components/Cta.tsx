import type { ReactNode } from "react";
import styles from "./Cta.module.css";

// Le bouton « Demander un devis ». Le vert sapin lui est réservé : c'est la seule chose de ce vert sur la page.
export default function Cta({
  href = "#devis",
  children = "Demander un devis",
  tone = "sapin",
  className,
}: {
  href?: string;
  children?: ReactNode;
  tone?: "sapin" | "trait";
  className?: string;
}) {
  return (
    <a href={href} className={`${styles.cta} ${styles[tone]} ${className ?? ""}`}>
      {children}
    </a>
  );
}
