import { ATELIER } from "@/data/atelier";

// La FAQ : le texte est dans la page, ouvert ou fermé, et repris tel quel dans les données structurées
// FAQPage pour Google.
export const FAQ = [
  {
    question: "Combien coûte un meuble sur mesure ?",
    reponse:
      "Cela dépend des dimensions, de l'essence et de la finition. Les prix « à partir de » donnent un ordre d'idée ; après la visite, je vous remets un prix ferme, sans surprise.",
  },
  {
    question: "Quels sont les délais ?",
    reponse:
      "Comptez une dizaine de jours pour le devis, puis 2 à 6 semaines de fabrication selon l'ouvrage. Je vous donne une date de pose dès la commande.",
  },
  {
    question: "Où intervenez-vous ?",
    reponse: `À ${ATELIER.zone.center} et dans un rayon de ${ATELIER.zone.radiusKm} km : Amboise, Loches, Chinon, Vouvray, Joué-lès-Tours, Azay-le-Rideau… Au-delà, appelez-moi, on en parle.`,
  },
  {
    question: "Comment entretenir un meuble en bois huilé ?",
    reponse:
      "Un chiffon sec au quotidien, jamais de produit ménager. Une fois par an, une fine couche d'huile passée au chiffon : le bois retrouve sa couleur.",
  },
  {
    question: "Le déplacement pour le devis est-il payant ?",
    reponse: "Non. La visite et le devis sont gratuits dans ma zone d'intervention.",
  },
] as const;
