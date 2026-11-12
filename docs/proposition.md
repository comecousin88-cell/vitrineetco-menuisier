# Atelier Chêne & Fil — proposition

Menuisier-ébéniste fictif. Atelier à Montlouis-sur-Loire (adresse fictive : 14 chemin des Varennes, 37270),
intervention à Tours et 40 km autour. Téléphone fictif dans la plage réservée à la fiction par l'Arcep :
02 61 91 xx xx. Du lundi au vendredi 8 h–12 h / 13 h 30–17 h 30, samedi matin sur rendez-vous.

Pourquoi la Touraine : le chêne de la forêt de Loches est l'un des plus réputés de France. « Bois d'origine
locale » devient une phrase vraie et précise (« Le chêne vient de la forêt de Loches, à 30 km »), et la galerie
peut citer de vraies villes : Tours, Amboise, Loches, Chinon, Vouvray, Joué-lès-Tours, Azay-le-Rideau.

Les deux directions partagent la structure, les outils, les données et la liste de médias. Elles diffèrent par la
typographie, la mise en page et le moment fort.

---

## Direction A — « Cote et trait » (recommandée)

La précision rendue visible. Le menuisier dessine avant de couper : par-dessus les vraies photos, une fine couche
de dessin technique (traits de cote, flèches, mesures en millimètres) se trace au scroll, comme au crayon de
menuisier sur une planche. Tout le monde comprend « 0,2 mm de jeu » ; personne n'a besoin de connaître le métier.

**Couleurs**

| Nom | Hex | Rôle |
|---|---|---|
| Blanc plâtre | `#EDEDE7` | fond, neutre et légèrement gris, plus frais qu'un crème |
| Chêne clair | `#D9C4A1` | fonds de la galerie, curseur avant/après, filtres actifs |
| Noir mat | `#1E1E1C` | texte, barre fixe, boutons secondaires |
| Vert sapin | `#1F4A3A` | un seul usage : « Demander un devis » et l'étape active du formulaire |
| Graphite | `#7D7D76` | traits de cote, filets, légendes |
| Papier | `#F8F8F5` | champs de formulaire, panneau de projet ouvert |

**Typographie** : une seule famille, **Archivo** (variable en largeur et en graisse). Titres en largeur étroite
(62–75 %) et graisse 600, très serrés, comme gravés sur une règle ; texte en largeur normale ; cotes et prix en
chiffres tabulaires. La largeur variable fait le travail d'une deuxième police. Pas de capitales espacées, pas de
monospace.

**Mise en page** : grille stricte de 12 colonnes, tout aligné à gauche sur la même ligne de départ, comme une
feuille d'atelier. Les photos sont posées à la règle, pas en désordre. Les numéros n'apparaissent que là où il y a
une vraie suite : les 4 étapes de la méthode et les étapes du devis.

```
HERO (ordinateur, épinglé pendant ~300 % de hauteur)
┌────────────────────────────────────────────────────────────────┐
│ Chêne & Fil       Réalisations  Méthode  Atelier  Prix   02 61 91 … [Demander un devis] │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   canvas plein écran : rabot → queue d'aronde → buffet         │
│                                                                │
│  Je fabrique vos meubles                ├──── 0,2 mm ────┤     │
│  à la main, à Montlouis.         (la cote se trace sur         │
│  Cuisines, escaliers, dressings.   l'assemblage, puis          │
│  Tours et 40 km autour.            « 1 800 mm » sur le buffet) │
│  [Demander un devis]                                           │
└────────────────────────────────────────────────────────────────┘
 22 ans de métier   Assurance décennale   Fabriqué à l'atelier   Chêne de la forêt de Loches

RÉALISATIONS
┌────────────────────────────────────────────────────────────────┐
│ Ce que j'ai fabriqué                                            │
│ [Tout] [Cuisines] [Escaliers] [Dressings] [Bibliothèques] [Portes] │
│ ┌──────┐ ┌──────┐ ┌──────┐                                      │
│ │ 4:5  │ │ 4:5  │ │ ◀▶   │  ← curseur avant/après dans la carte │
│ └──────┘ └──────┘ └──────┘                                      │
│ Escalier en chêne   Cuisine en frêne   Porte d'entrée           │
│ Montlouis           Amboise            Tours                    │
└────────────────────────────────────────────────────────────────┘
```

**Moment fort** : les cotes. Dans le hero, pendant que la queue d'aronde glisse, un trait de cote se trace
(« 0,2 mm »), puis sur le buffet fini (« 1 800 mm »). Le même trait revient, discret, à l'ouverture d'un projet
(dimensions réelles du meuble) et dans le formulaire (dimensions approximatives). Ce sont des traits et des
chiffres en SVG, jamais un dessin de sujet réaliste.

**Repère de menuisier** : le triangle que les menuisiers tracent au crayon sur les pièces pour les remettre dans
l'ordre sert d'unique marqueur graphique (filtre actif, étape en cours). Un vrai signe du métier, pas une icône.

---

## Direction B — « Bois de fil »

La matière d'abord. Le site se lit comme un plateau fait de planches : chaque section est une large bande, avec un
joint fin entre elles ; certaines sont en bois véritable (texture photo plein cadre, fil horizontal), les autres en
blanc cassé. Plus chaleureux, plus sensuel, moins technique.

**Couleurs**

| Nom | Hex | Rôle |
|---|---|---|
| Blanc de lin | `#F0EDE6` | fond |
| Frêne | `#E5D6BB` | bandes claires, cartes |
| Chêne huilé | `#B48857` | filets, prix |
| Noir mat | `#222220` | texte |
| Vert sapin | `#2A4A3A` | « Demander un devis » |

**Typographie** : **Petrona** (titres, serif humaniste au dessin un peu taillé, graisse 500) + **Instrument Sans**
(texte, formulaires).

**Mise en page** : bandes horizontales pleine largeur, textes centrés sur les textures, galerie en mosaïque à deux
hauteurs.

```
┌──────────────────────────── texture chêne ──────────────────────┐
│                 Atelier Chêne & Fil                             │
│        Je fabrique vos meubles à la main.  [Demander un devis]  │
├─────────────────────────────── joint ───────────────────────────┤
│                  blanc de lin : réalisations                    │
├─────────────────────────────── joint ───────────────────────────┤
│                     texture noyer : méthode                     │
└─────────────────────────────────────────────────────────────────┘
```

**Moment fort** : au scroll, les bandes de bois glissent légèrement l'une contre l'autre, comme des planches qu'on
ajuste, puis s'emboîtent au joint.

---

## Mon avis

A. Elle répond directement à l'objectif « montrer un vrai savoir-faire compréhensible par tout le monde » : la
précision devient un chiffre qu'on voit se tracer. Elle se distingue aussi des quatre démos précédentes (le
fleuriste et le caviste reposent déjà sur la matière et la chaleur). B est plus douce mais ressemble davantage à un
site d'ébéniste « classique », et ses textures pleine bande pèsent sur le mobile. Elle reprendrait aussi les
textures de la section « Essences », qui perdrait son effet.

## Révision par rapport aux réflexes par défaut

- Le blanc cassé demandé tirait vers le crème habituel des sites générés : je l'ai passé en blanc plâtre légèrement
  gris (`#EDEDE7`), plus proche d'un mur d'atelier.
- J'avais d'abord une serif à fort contraste pour les titres (A) : remplacée par la seule Archivo étroite, plus
  proche de l'outil et de la règle graduée.
- Pas de numéros 01/02/03 décoratifs ni d'étiquettes au-dessus des titres : seules la méthode et le devis sont
  numérotés, parce que ce sont des suites.

## Commun aux deux directions

- **Barre fixe ordinateur** : nom à gauche, ancres, téléphone cliquable, « Demander un devis » (vert sapin).
  **Barre mobile en bas** : « Devis » et « Appeler », deux moitiés égales.
- **Bandeau concept** en haut de page : « Projet concept : atelier fictif, aucune prestation n'est vendue ».
- **Séquences lourdes** : seulement le hero et l'atelier, en canvas, WebP préchargés (≈ 80 images chacune sur
  ordinateur, ≈ 40 en plus petit sur mobile, image fixe si `prefers-reduced-motion` ou connexion lente).
- **Carte** : une vraie carte OpenStreetMap (MapLibre, sans clé) avec le cercle de 40 km autour de l'atelier.
- **Devis** : 7 étapes, données typées dans `src/lib/devis.ts`, envoi simulé derrière une seule fonction
  `envoyerDemande()` à remplacer plus tard (Formspree, Resend, CRM…).
- **Référencement** : `LocalBusiness` (sous-type `HomeAndConstructionBusiness`) avec `areaServed`, horaires,
  géolocalisation ; `FAQPage` ; titres et descriptions par page ; la FAQ est dans le HTML, ouverte ou fermée.
- **Pages** : accueil, mentions légales. Pages projet en option si on veut les indexer une par une.
