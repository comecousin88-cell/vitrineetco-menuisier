import Cta from "@/components/Cta";
import { A_COMPLETER, PRIX, TYPES_PROJET } from "@/data/prix";
import styles from "./Prix.module.css";

const euros = (n: number) => `${n.toLocaleString("fr-FR")} €`;

// Les prix et délais, présentés comme une nomenclature d'atelier : une ligne par ouvrage, les chiffres
// alignés en colonne. Tant qu'une valeur manque, « [À COMPLÉTER] » s'affiche, bien visible.
export default function Prix() {
  return (
    <section id="prix" className={styles.prix} aria-labelledby="prix-titre">
      <div className={styles.entete}>
        <h2 id="prix-titre" className={styles.titre} tabIndex={-1}>
          Prix et délais
        </h2>
        <p className={styles.intro}>
          Des ordres de grandeur, pose comprise. Après la visite, je vous donne un prix ferme, qui ne bouge plus.
        </p>
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
          {TYPES_PROJET.map((type) => {
            const { aPartirDe, delaiSemaines } = PRIX[type.id];
            return (
              <tr key={type.id}>
                <th scope="row">{type.label}</th>
                <td className={styles.nombre}>
                  {aPartirDe === null ? (
                    <span className={styles.aCompleter}>{A_COMPLETER}</span>
                  ) : (
                    <span className="chiffres">{euros(aPartirDe)}</span>
                  )}
                  <span className={styles.unite}>{type.unite}</span>
                </td>
                <td className={styles.nombre}>
                  {delaiSemaines === null ? (
                    <span className={styles.aCompleter}>{A_COMPLETER}</span>
                  ) : (
                    <span className="chiffres">{delaiSemaines} semaines</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className={styles.pied}>
        <p className={styles.note}>Prix TTC indicatifs. La visite et le devis sont gratuits dans ma zone d&apos;intervention.</p>
        <Cta />
      </div>
    </section>
  );
}
