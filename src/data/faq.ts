import { ATELIER } from "@/data/atelier";

// La FAQ : le texte est dans la page, ouvert ou fermé, et repris tel quel dans les données structurées
// FAQPage pour Google.
export const FAQ = [
  {
    question: "Combien coûte un meuble sur mesure ?",
    reponse:
      "Cela dépend des dimensions, de l'essence et de la finition. Comptez à partir de 1 000 € pour des portes ou des placards, 2 000 € pour une bibliothèque, 3 000 € pour un dressing, 3 500 € pour un escalier en chêne et 8 000 € pour une cuisine. Après la visite, je vous remets un prix ferme, sans surprise.",
  },
  {
    question: "Quels sont les délais ?",
    reponse:
      "Comptez une dizaine de jours pour le devis, puis de 3 à 5 semaines pour des portes ou des placards jusqu'à 8 à 10 semaines pour une cuisine, de la commande à la pose. Je vous donne une date de pose dès la commande.",
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
