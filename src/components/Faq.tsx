import { SITE_URL } from "@/data/atelier";
import { FAQ } from "@/data/faq";
import styles from "./Faq.module.css";

// Un accordéon sur <details> : sans JavaScript, il fonctionne, et Google lit toutes les réponses.
export default function Faq() {
  const donnees = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.reponse },
    })),
  };

  return (
    <section id="faq" className={styles.faq} aria-labelledby="faq-titre">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(donnees) }} />
      <h2 id="faq-titre" className={styles.titre}>
        Vos questions
      </h2>
      <div className={styles.liste}>
        {FAQ.map((item) => (
          <details key={item.question} className={styles.item} name="faq">
            <summary className={styles.question}>
              <span>{item.question}</span>
              <span className={styles.signe} aria-hidden="true" />
            </summary>
            <p className={styles.reponse}>{item.reponse}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
