import Cta from "@/components/Cta";
import { NOTE_PRIX, TYPES_PROJET } from "@/data/prix";
import styles from "./Prix.module.css";

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

// Les prix et délais, présentés comme une nomenclature d'atelier : une ligne par ouvrage, les chiffres
// alignés en colonne.
export default function Prix() {
  return (
    <section id="prix" className={styles.prix} aria-labelledby="prix-titre">
      <div className={styles.entete}>
        <h2 id="prix-titre" className={styles.titre} tabIndex={-1}>
          Prix et délais
        </h2>
        <p className={styles.intro}>Des ordres de grandeur. Après la visite, je vous donne un prix ferme, qui ne bouge plus.</p>
      </div>

      <table className={styles.table}>
        <caption className="visually-hidden">Prix indicatifs et délais moyens par type d&apos;ouvrage</caption>
        <thead>
          <tr>
            <th scope="col">Ouvrage</th>
            <th scope="col" className={styles.nombre}>
              À partir de
            </th>
            <th scope="col" className={styles.nombre}>
              Délai moyen
            </th>
          </tr>
        </thead>
        <tbody>
          {TYPES_PROJET.map((type) => (
            <tr key={type.id}>
              <th scope="row">{type.label}</th>
              <td className={`${styles.nombre} chiffres`}>{euros(type.aPartirDe)}</td>
              <td className={`${styles.nombre} chiffres`}>{type.delai}</td>
            </tr>
          ))}
          <tr>
            <th scope="row">Déplacement pour le devis</th>
            <td className={styles.nombre} colSpan={2}>
              Gratuit dans la zone d&apos;intervention
            </td>
          </tr>
        </tbody>
      </table>

      <div className={styles.pied}>
        <p className={styles.note}>{NOTE_PRIX}</p>
        <Cta />
      </div>
    </section>
  );
}
