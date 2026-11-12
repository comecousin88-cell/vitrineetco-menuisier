# Atelier Chêne & Fil — liste définitive des images et vidéos

Cette liste remplace la précédente. Tous les fichiers vont dans `source/` (jamais mis en ligne, jamais poussé sur
GitHub), **avec ces noms exacts** : ce sont ceux que le code attend. Tant qu'un fichier manque, le site affiche à
sa place un aplat uni avec son nom. Je m'occupe ensuite du recadrage, de l'étalonnage commun, du découpage des
vidéos en images et de l'export WebP dans `public/`.

Outils prévus : images fixes avec Gemini, vidéos avec Higgsfield en mode image vers vidéo (image de début et
image de fin imposées).

## Règles communes à tout le site

| Sujet | Règle |
|---|---|
| Lumière | Soleil bas du matin, entrant par une grande fenêtre **à gauche du cadre**, rasant, chaud sans être orange (balance des blancs vers 4800 K). Ombres nettes et longues qui révèlent le fil du bois. Jamais de flash, de projecteur ni de lumière de studio. Même lumière à l'atelier et chez les clients. |
| Palette | Murs blanc plâtre légèrement gris (proche de #EDEDE7), bois clairs, métal noir mat, quelques touches de vert sapin (#1F4A3A) : une plante, une poignée de serre-joint, un tablier. Aucune couleur vive. |
| Bois | Chêne clair à fil droit dans la majorité des images, finition huilée mate, jamais vernie brillante. |
| Cadrage | Appareil droit, verticales droites (pas de perspective qui penche), objectif équivalent 35 mm pour les pièces, 50 mm pour les gestes, 100 mm macro pour les textures. Pas de grand-angle déformant, pas d'effet « drone ». |
| Personnes | Des mains, des avant-bras, des silhouettes de dos. **Jamais de visage**, sauf `portrait-artisan.jpg`. Manches de chemise en toile écrue retroussées, pas de bijoux, pas de gants (sauf ponçage). Mains d'artisan : propres mais marquées, ongles courts. Toujours les mêmes mains d'une image à l'autre. |
| Interdits | **Aucun texte lisible** (étiquette, livre, plan coté, écran, règle aux chiffres nets : les graduations doivent être floues). **Aucun logo ni marque** (outils électriques gris ou noirs sans couleur de marque, rabots et ciseaux sans gravure, aucun emballage). Aucun visage hors portrait. Pas de flou artistique excessif, pas de filtre « vintage ». |
| Taille | Les tailles indiquées sont des minimums. Plus grand est toujours mieux. JPEG qualité maximale ou PNG. |

## Le décor commun de la galerie des réalisations

Les dix projets se trouvent chez dix clients différents, mais ils doivent avoir l'air photographiés par la même
personne, le même matin, avec le même appareil. À reproduire à l'identique sur chaque image de projet (`projet-…`),
d'avant (`avant-…`) et de détail (`detail-…`). Conseil : générer d'abord `projet-escalier-montlouis.jpg`, puis
s'en servir comme image de référence de style pour les neuf autres.

| Élément | Consigne |
|---|---|
| Format | 4:5 vertical, 2000×2500 minimum, pour toutes les images de la galerie sans exception. |
| Murs | Enduit lisse blanc plâtre légèrement gris (#EDEDE7), mat, sans tableau ni objet accroché. |
| Sol | Parquet en chêne clair à lames larges (18 cm), posé à l'anglaise, huilé mat. Sauf porte d'entrée (pavé de la rue). |
| Lumière | Fenêtre à gauche, hors champ ou au bord gauche du cadre. Rayons de soleil rasants visibles au sol. |
| Appareil | À 1,40 m du sol, droit, objectif 35 mm. L'ouvrage est entier dans le cadre et occupe environ 70 % de la hauteur. |
| Composition | Ouvrage centré, un peu d'air au-dessus et au-dessous. Le bas de l'image (15 %) reste calme : rien d'important n'y est coupé. |
| Accessoires | Au maximum deux par image, choisis parmi : une plante verte sombre en pot de grès, un vase en grès brut, une pile de linge écru. Jamais d'objet coloré. |
| Personnes | Personne. |

---

## Les vidéos

Chaque vidéo se fabrique en deux temps : je génère d'abord les **images fixes** de début, de raccord et de fin
(Gemini), puis Higgsfield anime de l'une à l'autre. Toutes en 16:9, 1920×1080 minimum (2560×1440 si possible),
24 images par seconde, **caméra sur rail ou sur pied, sans tremblement, sans zoom**. Le sujet reste dans le tiers
central du cadre : je recadre automatiquement en vertical pour le téléphone.

### Hero — « Du copeau au buffet » (3 plans, 15 s, environ 80 images au total)

| | Plan 1 : `hero-1-rabot.mp4` | Plan 2 : `hero-2-aronde.mp4` | Plan 3 : `hero-3-buffet.mp4` |
|---|---|---|---|
| Durée | 5 s | 5 s | 5 s |
| Caméra | Fixe, gros plan à hauteur d'établi, objectif 50 mm. | Fixe, très gros plan, objectif 50 mm macro. | Travelling arrière lent et continu sur rail, sans rotation, de 40 cm à 4 m du buffet. |
| Image de début | `hero-1-debut.jpg` | `hero-2-debut.jpg` | `hero-3-debut.jpg` |
| Image de fin | `hero-1-fin.jpg` | `hero-2-fin.jpg` | `hero-fin.jpg` |
| Enchaînement | Fondu enchaîné vers le plan 2 (je m'en charge). | **Raccord** vers le plan 3 : même assemblage, même angle, même taille à l'écran. | — |

**Plan 1, déroulé.** Les deux mains poussent le rabot lentement de gauche à droite sur toute la longueur de la
planche. Un long copeau fin, presque translucide, sort de la lumière du fer et s'enroule sur lui-même. Gestes
lents et réguliers.

- `hero-1-debut.jpg` : gros plan à hauteur d'établi. Une planche de chêne clair posée dans la longueur, fil
  horizontal. Un rabot à main en bois (sans marque) posé à plat à gauche de la planche, deux mains dessus (main
  gauche à l'avant sur le bouton, main droite sur la poignée). Lumière rasante de gauche, poussière légère dans le
  faisceau. Fond : l'atelier flou.
- `hero-1-fin.jpg` : même cadre. Le rabot et les mains sont sortis du cadre à droite. Au centre, sur la planche
  désormais lisse, un copeau entièrement enroulé, éclairé par derrière, presque doré.

**Plan 2, déroulé.** Les mains descendent lentement la pièce du haut, qui s'emboîte d'un seul geste, sans forcer.
Une main donne un dernier appui du plat de la paume. Immobile pendant la dernière seconde.

- `hero-2-debut.jpg` : sur le même établi, deux pièces de chêne à angle droit. En bas, une planche verticale dont
  le chant porte les queues d'aronde taillées, tournées vers le haut. Au-dessus, tenue par deux mains, la planche
  horizontale avec les logements correspondants, à 3 cm au-dessus de l'emboîtement. Assemblage centré dans le cadre.
- `hero-2-fin.jpg` : **image de raccord.** L'assemblage fermé, joints parfaitement serrés, aucun jour visible, les
  mains posées de chaque côté. Le motif de l'assemblage (nombre de queues, pente) doit être net et lisible.

**Plan 3, déroulé.** La caméra recule lentement et sans à-coup. On découvre le coin du buffet, puis le buffet
entier, puis le salon. Rien ne bouge dans le champ.

- `hero-3-debut.jpg` : très gros plan sur le coin supérieur gauche d'un buffet en chêne huilé fini. On y voit
  **le même assemblage en queue d'aronde que dans `hero-2-fin.jpg`** (même dessin, même angle, même taille à
  l'écran), maintenant poncé et huilé. Fond flou très clair.
- `hero-fin.jpg` : le buffet bas en chêne huilé (environ 1,80 m de long, deux portes et trois tiroirs, pieds fins)
  au centre, vu de face, légèrement de biais. Le salon : parquet chêne clair, mur blanc plâtre, grande fenêtre à
  gauche d'où vient la lumière, une plante verte sombre, un vase en grès sur le buffet. **Le pied du buffet est à
  80 % de la hauteur de l'image, ses deux extrémités vers 38 % et 62 % de la largeur** : la cote « 1 800 mm » du
  site se trace juste dessous. Sert aussi d'affiche, de version sans animation et d'image de partage.

### Atelier — « La traversée du matin » (2 plans enchaînés, 10 s, environ 80 images, section épinglée)

La caméra avance en ligne droite dans l'atelier, à hauteur d'homme (1,60 m), comme quelqu'un qui entre. Vitesse
constante, très lente, sans rotation. **Deux plans enchaînés** : le second démarre exactement sur la dernière
image du premier.

| | Plan 1 : `atelier-1-entree.mp4` | Plan 2 : `atelier-2-etabli.mp4` |
|---|---|---|
| Durée | 5 s | 5 s |
| Caméra | Avance lente en ligne droite, de l'extérieur jusqu'au milieu de l'atelier. | Même avance, du milieu de l'atelier jusqu'à l'établi, ralentit et s'arrête. |
| Image de début | `atelier-debut.jpg` | `atelier-raccord.jpg` |
| Image de fin | `atelier-raccord.jpg` | `atelier-fin.jpg` |

- `atelier-debut.jpg` : depuis la cour, une grande porte d'atelier en bois ouverte à deux battants, vue de face.
  L'intérieur est en contre-jour doux ; de grands rayons de soleil entrent par des fenêtres hautes à gauche et
  traversent la poussière de bois en suspension. On devine l'établi au fond.
- `atelier-raccord.jpg` : **image de raccord.** La caméra est à mi-chemin. À droite, un mur d'outils à main
  suspendus et bien rangés (scies, ciseaux à bois, rabots, équerres, maillets), sans marque. À gauche, des racks de
  planches rangées sur chant (chêne, frêne, noyer), fil visible. L'établi au fond, dans la lumière.
- `atelier-fin.jpg` : vue en légère plongée sur un grand établi en hêtre usé. Deux mains (une silhouette de dos
  en partie visible, épaules hors champ) ajustent un tenon dans une mortaise avec un maillet en bois ; copeaux et
  un ciseau posé à côté. Rayons de lumière de gauche. Sert aussi d'image sans animation.

---

## 1. Indispensables pour les vidéos

Les 5 vidéos et leurs 9 images fixes. Ordre de génération conseillé : l'atelier d'abord, parce qu'il fixe
l'établi, les mains et la lumière que le hero reprend.

| Ordre | Fichier | Rôle | Générer à partir de | Format, taille min. |
|---|---|---|---|---|
| 1 | `atelier-debut.jpg` | Début, atelier plan 1 | — (image de départ de tout l'univers atelier) | 16:9, 2560×1440 |
| 2 | `atelier-raccord.jpg` | Raccord, atelier plans 1 et 2 | `atelier-debut.jpg` (même atelier, même lumière) | 16:9, 2560×1440 |
| 3 | `atelier-fin.jpg` | Fin, atelier plan 2 | `atelier-raccord.jpg` (même établi au fond) | 16:9, 2560×1440 |
| 4 | `hero-1-debut.jpg` | Début, hero plan 1 | `atelier-fin.jpg` (même établi, mêmes mains, même lumière) | 16:9, 2560×1440 |
| 5 | `hero-1-fin.jpg` | Fin, hero plan 1 | `hero-1-debut.jpg` (même cadre exact) | 16:9, 2560×1440 |
| 6 | `hero-2-debut.jpg` | Début, hero plan 2 | `hero-1-debut.jpg` (même établi, mêmes mains) | 16:9, 2560×1440 |
| 7 | `hero-2-fin.jpg` | Fin, hero plan 2, raccord vers le plan 3 | `hero-2-debut.jpg` (même cadre exact) | 16:9, 2560×1440 |
| 8 | `hero-3-debut.jpg` | Début, hero plan 3 | `hero-2-fin.jpg` (même assemblage, même angle, même taille) | 16:9, 2560×1440 |
| 9 | `hero-fin.jpg` | Fin, hero plan 3, affiche et partage | `hero-3-debut.jpg` (même buffet, même finition) | 16:9, 2560×1440 |
| — | `atelier-1-entree.mp4` | Vidéo | `atelier-debut.jpg` → `atelier-raccord.jpg` | 16:9, 1920×1080, 24 i/s, 5 s |
| — | `atelier-2-etabli.mp4` | Vidéo | `atelier-raccord.jpg` → `atelier-fin.jpg` | 16:9, 1920×1080, 24 i/s, 5 s |
| — | `hero-1-rabot.mp4` | Vidéo | `hero-1-debut.jpg` → `hero-1-fin.jpg` | 16:9, 1920×1080, 24 i/s, 5 s |
| — | `hero-2-aronde.mp4` | Vidéo | `hero-2-debut.jpg` → `hero-2-fin.jpg` | 16:9, 1920×1080, 24 i/s, 5 s |
| — | `hero-3-buffet.mp4` | Vidéo | `hero-3-debut.jpg` → `hero-fin.jpg` | 16:9, 1920×1080, 24 i/s, 5 s |

## 2. Indispensables pour le reste du site

### Réalisations (galerie) — décor commun ci-dessus, 4:5, 2000×2500

| Fichier | Projet | Sujet et cadrage | Générer à partir de |
|---|---|---|---|
| `projet-escalier-montlouis.jpg` | Escalier en chêne, Montlouis-sur-Loire | Escalier droit à limon central en chêne, marches épaisses, garde-corps à barreaux fins en chêne. Vu de côté, depuis le bas. | — (référence de style de la galerie) |
| `projet-cuisine-amboise.jpg` | Cuisine en frêne, Amboise | Cuisine linéaire en frêne clair, façades sans poignée (gorges), plan de travail en pierre claire, une étagère ouverte. Vue de trois quarts. | `projet-escalier-montlouis.jpg` (style) |
| `projet-cuisine-tours.jpg` | Cuisine en chêne et noir, Tours | Îlot : caissons noir mat, plan et façades en chêne clair. Vue de face sur l'îlot. | `projet-escalier-montlouis.jpg` (style) |
| `projet-escalier-loches.jpg` | Escalier quart tournant, Loches | Escalier quart tournant en chêne contre un mur de pierre claire, contremarches blanches. Vu depuis le palier bas. | `projet-escalier-montlouis.jpg` (style) |
| `projet-dressing-joue.jpg` | Dressing sous combles, Joué-lès-Tours | Dressing en chêne clair épousant un rampant de toit, portes de hauteurs différentes. Quelques vêtements écrus. | `projet-escalier-montlouis.jpg` (style) |
| `projet-dressing-vouvray.jpg` | Dressing en noyer, Vouvray | Dressing ouvert en noyer, étagères, penderie, tiroirs à façade pleine, banc central. | `projet-escalier-montlouis.jpg` (style) |
| `projet-bibliotheque-chinon.jpg` | Bibliothèque autour d'une fenêtre, Chinon | Bibliothèque en chêne encadrant une fenêtre, banquette sous la fenêtre avec une grille en chêne. Livres aux dos unis, sans titre. | `projet-escalier-montlouis.jpg` (style) |
| `projet-bibliotheque-azay.jpg` | Bibliothèque en pin, Azay-le-Rideau | Bibliothèque murale en pin clair, montants épais, toute la hauteur d'un mur. Livres aux dos unis. | `projet-escalier-montlouis.jpg` (style) |
| `projet-porte-tours.jpg` | Porte d'entrée en chêne, Tours | Porte d'entrée pleine en chêne à lames verticales, sur une façade en tuffeau. Vue de face depuis la rue. Pas de numéro. | `projet-escalier-montlouis.jpg` (style) |
| `projet-portes-saint-cyr.jpg` | Portes de placard, Saint-Cyr-sur-Loire | Six portes de placard en chêne, cadre et panneau, toute hauteur, dans un couloir blanc. | `projet-escalier-montlouis.jpg` (style) |

### Avant / après — 4:5, 2000×2500, cadrage strictement identique à l'« après »

Le curseur superpose les deux images : **même position d'appareil, même objectif, même lumière, même heure**.
Générer à partir de la photo « après » (image vers image), en ne changeant que l'ouvrage.

| Fichier | Sujet | Générer à partir de |
|---|---|---|
| `avant-escalier-montlouis.jpg` | Le même escalier avant travaux : vieil escalier droit en sapin, marches usées couvertes de moquette beige râpée, rampe métallique fine. | `projet-escalier-montlouis.jpg` |
| `avant-cuisine-amboise.jpg` | La même pièce avant : cuisine stratifiée blanche défraîchie, crédence carrelée datée, plan imitation bois. | `projet-cuisine-amboise.jpg` |
| `avant-bibliotheque-chinon.jpg` | Le même mur avant : fenêtre seule sur un mur nu, un radiateur dessous, deux cartons au sol. | `projet-bibliotheque-chinon.jpg` |

### La méthode — 3:2, 2400×1600, mains seulement

| Fichier | Étape | Sujet et cadrage | Générer à partir de |
|---|---|---|---|
| `methode-1-visite.jpg` | Visite et mesures | Deux mains tendent un mètre ruban contre un mur, dans une pièce vide aux murs blanc plâtre. Graduations floues. | — |
| `methode-2-plan.jpg` | Plan | Vue de dessus sur une table : un croquis de meuble au crayon (traits seulement, aucun chiffre), une équerre, un crayon de menuisier plat, un échantillon de chêne. Une main tient le crayon. | — |
| `methode-3-fabrication.jpg` | Fabrication à l'atelier | À l'établi, deux mains serrent un serre-joint (poignée vert sapin) sur un panneau de chêne collé. Copeaux, lumière rasante. | `atelier-fin.jpg` (même établi, mêmes mains) |
| `methode-4-pose.jpg` | Pose | Chez le client, deux mains vérifient l'aplomb d'une façade de l'îlot avec un niveau à bulle sans marque. Silhouette de dos possible, de la taille aux épaules. | `projet-cuisine-tours.jpg` (la même cuisine, en cours de pose) |

### Les essences de bois — 16:9, 3000×1688

Macro de la surface, **fil horizontal**, finition huilée mate, lumière rasante de gauche qui fait ressortir le
relief. Aucun bord de planche : la texture remplit tout le cadre. Je les recadre aussi en carré et en vertical.

| Fichier | Essence | Générer à partir de |
|---|---|---|
| `essence-chene.jpg` | Chêne clair sur dosse, quelques maillures. | — (référence des quatre) |
| `essence-noyer.jpg` | Noyer, brun chaud, veines plus sombres. | `essence-chene.jpg` (même lumière, même échelle) |
| `essence-frene.jpg` | Frêne très clair, veinage marqué et régulier. | `essence-chene.jpg` (même lumière, même échelle) |
| `essence-pin.jpg` | Pin blond, deux ou trois nœuds sains. | `essence-chene.jpg` (même lumière, même échelle) |

### Contact

| Fichier | Sujet et cadrage | Générer à partir de | Format, taille min. |
|---|---|---|---|
| `portrait-artisan.jpg` | **Le seul visage du site.** L'artisan (la quarantaine) à l'établi, de trois quarts, lumière de la fenêtre à gauche, tablier en toile vert sapin, regard vers la pièce qu'il tient, pas vers l'objectif. Fond flou : racks de planches. Cadré à la taille. | `atelier-fin.jpg` (même atelier, même établi) | 4:5, 2000×2500 |

## 3. Secondaires

Ils enrichissent le site ; sans eux, l'emplacement reste neutre ou je réutilise une image principale.

| Fichier | Section | Sujet et cadrage | Générer à partir de | Format, taille min. |
|---|---|---|---|---|
| `detail-escalier-montlouis.jpg` | Projet ouvert | Le nez de marche et l'assemblage d'un barreau dans la main courante. | `projet-escalier-montlouis.jpg` | 4:5, 2000×2500 |
| `detail-cuisine-amboise.jpg` | Projet ouvert | La gorge d'une façade en frêne et le chant du plan de travail. | `projet-cuisine-amboise.jpg` | 4:5, 2000×2500 |
| `detail-cuisine-tours.jpg` | Projet ouvert | Le coin de l'îlot où le chêne rencontre le noir mat. | `projet-cuisine-tours.jpg` | 4:5, 2000×2500 |
| `detail-escalier-loches.jpg` | Projet ouvert | Les marches balancées du quart tournant, vues de dessus. | `projet-escalier-loches.jpg` | 4:5, 2000×2500 |
| `detail-dressing-joue.jpg` | Projet ouvert | Un tiroir entrouvert montrant l'assemblage en queue d'aronde. | `projet-dressing-joue.jpg` | 4:5, 2000×2500 |
| `detail-dressing-vouvray.jpg` | Projet ouvert | La tranche d'une étagère en noyer, fil visible. | `projet-dressing-vouvray.jpg` | 4:5, 2000×2500 |
| `detail-bibliotheque-chinon.jpg` | Projet ouvert | La grille en chêne de la banquette et l'angle de la bibliothèque. | `projet-bibliotheque-chinon.jpg` | 4:5, 2000×2500 |
| `detail-bibliotheque-azay.jpg` | Projet ouvert | Un montant et une tablette, assemblage visible. | `projet-bibliotheque-azay.jpg` | 4:5, 2000×2500 |
| `detail-porte-tours.jpg` | Projet ouvert | La poignée en fer forgé noir sur le chêne, sans serrure de marque. | `projet-porte-tours.jpg` | 4:5, 2000×2500 |
| `detail-portes-saint-cyr.jpg` | Projet ouvert | L'assemblage cadre et panneau d'une porte, en lumière rasante. | `projet-portes-saint-cyr.jpg` | 4:5, 2000×2500 |
| `atelier-mobile.jpg` | Atelier, téléphone | Vue verticale de l'établi dans les rayons de lumière. Remplace la séquence sur téléphone si je ne peux pas en tirer une version verticale propre. | `atelier-fin.jpg` | 9:16, 1440×2560 |
| `contact-facade.jpg` | Contact | La façade de l'atelier vue de la cour : bardage bois, grande porte ouverte, matin. Aucune enseigne. | `atelier-debut.jpg` (la même porte, reculée) | 3:2, 2400×1600 |
| `copeaux.jpg` | Devis, confirmation | Copeaux de chêne enroulés sur un établi, vue de dessus, beaucoup d'espace vide à droite. | `atelier-fin.jpg` (même établi) | 16:9, 2560×1440 |
| `partage.jpg` | Image de partage (réseaux) | Le buffet fini, recadré large. Sans ce fichier, je recadre `hero-fin.jpg`. | `hero-fin.jpg` | 1200×630 |

## Ce qui n'est pas une image

- **La carte** de la zone d'intervention : une vraie carte OpenStreetMap.
- **Les traits de cote**, la règle de l'atelier et le triangle de menuisier : traits et chiffres en SVG ou en CSS,
  jamais un dessin de sujet réaliste.
- **Le téléversement de photos** du formulaire de devis : ce sont les photos du visiteur, rien à fournir.

## Récapitulatif

| Groupe | Vidéos | Images |
|---|---|---|
| 1. Indispensables pour les vidéos | 5 | 9 |
| 2. Indispensables pour le reste du site | 0 | 22 (10 projets, 3 avant, 4 méthode, 4 essences, 1 portrait) |
| 3. Secondaires | 0 | 14 (10 détails, atelier mobile, façade, copeaux, partage) |
| **Total** | **5** | **45** |
