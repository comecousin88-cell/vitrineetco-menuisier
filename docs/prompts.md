# Atelier Chêne & Fil — ce qu'il reste à produire, avec les prompts

État au 16 novembre 2026. Les prompts sont en anglais : Gemini et Higgsfield les suivent plus fidèlement. Tous les
fichiers vont dans `source/`, avec ces noms exacts. Les images de référence citées sont déjà dans `source/` ou dans
`source/_controle/`.

Règles valables pour tous les prompts (déjà incluses ci-dessous, à ne pas retirer) : lumière du matin venant de la
gauche, aucun texte lisible, aucune marque, aucun visage, mains d'artisan propres mais marquées, chêne huilé mat.

## Récapitulatif

| Ordre | Fichier | Type | Remplace | Priorité |
|---|---|---|---|---|
| 1 | `hero-1-plateau-debut.jpg` | image | (nouveau) | indispensable |
| 2 | `hero-1-plateau.mp4` | vidéo | `hero-2-aronde.mp4` dans le hero | indispensable |
| 3 | `atelier-2-raccord.mp4` | vidéo | le fondu actuel de l'atelier | indispensable |
| 4 | `methode-1-visite.jpg` | image | l'actuelle (mètre de marque) | à refaire |
| 5 | `essence-chene.jpg`, `essence-noyer.jpg`, `essence-frene.jpg`, `essence-pin.jpg` | images | les actuelles | à refaire |
| 6 | `projet-bibliotheque-azay.jpg` | image | l'actuelle (pas en pin) | à refaire |
| 7 | 10 × `detail-….jpg`, `contact-facade.jpg`, `copeaux.jpg` | images | emplacements vides | secondaire |

Total : **2 vidéos et 19 images** (1 + 6 à refaire + 12 secondaires). `atelier-mobile.jpg` n'est plus nécessaire :
la traversée a sa série téléphone.

---

## 1–2. Le nouveau hero : « La main sur le chêne »

**L'idée.** Plus de queue d'aronde : les générateurs n'arrivent pas à dessiner un assemblage cohérent (dans la
version actuelle, 2 logements en haut pour 4 queues en bas, et des queues qui s'évasent à l'envers). On ouvre
sur ce qui se comprend tout de suite et qu'un générateur réussit : une main qui glisse sur le plateau du buffet,
en lumière rasante. Puis la caméra recule et on découvre le buffet. Ce plan **finit exactement sur l'image où
commence le recul gardé de `hero-3-buffet`** : le raccord est invisible, sans fondu. La cote du hero devient
« 30 mm », l'épaisseur du plateau en chêne massif, à la place du « 14° ».

**Structure du hero après coup :** `hero-1-plateau` (nouveau, ~5 s) → `hero-3-buffet` (3,5 → 8,0 s, déjà prêt).

### 1. Image de début : `hero-1-plateau-debut.jpg` (Gemini)

- Référence à joindre : `source/_controle/hero-3-buffet-debut-passage.png` (le même buffet, la même lumière).
- Format : 16:9, 2560×1440 minimum.

```
Use the attached image as the exact reference for the sideboard, its oak, its finish, the room and the light.
Extreme close-up of the front right corner of the top of this same oak sideboard. The solid oak top is 30 mm
thick: its front edge is clearly visible, sharp and square, with the end grain showing on the side. The top is
oiled, matte, light oak with straight grain running left to right.
A craftsman's right hand rests flat on the top, fingertips near the front edge, as if feeling the surface.
Clean but working hands, short nails, no rings, no watch, rolled-up raw linen shirt sleeve at the edge of the
frame. No face, no body beyond the forearm.
Low morning sunlight from a large window on the left, raking across the surface so the grain and pores catch the
light, long soft shadow of the hand to the right. Warm but not orange, around 4800 K.
Camera at the height of the top, slightly above, 50 mm lens, shallow depth of field: the corner and the hand are
sharp, the white plaster wall and the room behind are softly blurred.
Photorealistic, natural colours, no text, no logo, no brand, no extra objects on the top.
```

### 2. Vidéo : `hero-1-plateau.mp4` (Higgsfield, image vers vidéo)

- Image de début : `hero-1-plateau-debut.jpg`.
- **Image de fin : `source/_controle/hero-3-buffet-debut-passage.png`** (c'est elle qui garantit le raccord).
- 16:9, 1080p si possible, 24 i/s, 5 s.

```
The hand slowly slides along the oiled oak top, following the grain from right to left, then lifts gently and
leaves the frame to the left. As soon as the hand starts moving, the camera pulls back smoothly on a dolly in a
straight line, without any rotation or tilt, revealing the whole sideboard: the plant and the stone jug on the
top, the doors, the three drawers, the white wall and the window behind.
The camera move is slow, constant and steady from start to finish: no acceleration, no shake, no zoom.
The sideboard keeps exactly the same shape, wood and number of doors and drawers throughout.
The light stays the same: low morning sun from the left, raking shadows on the front.
No person appears, no face, no text, no logo. Ends exactly on the provided last frame.
```

**Ce qui fait échouer ce plan** (à vérifier avant de m'envoyer la vidéo) : la main qui se déforme en glissant, le
buffet qui change de nombre de tiroirs pendant le recul, un recul qui accélère d'un coup. Si le recul est raté
mais que les 2 premières secondes sont belles, envoie-la quand même : je peux ne garder que le début et finir
par un fondu.

---

## 3. Le raccord de l'atelier : `atelier-2-raccord.mp4` (Higgsfield, image vers vidéo)

- Image de début : **`source/_controle/atelier-2-avant-coupure.png`** (l'allée, l'artisan au fond, à 5,0 s).
- Image de fin : **`source/atelier-fin.jpeg`** (le gros plan sur l'établi, sans visage).
- 16:9, 1080p si possible, 24 i/s, 4 à 5 s.

```
The camera keeps moving forward down the central aisle of the workshop, at the same slow, constant speed, toward
the far workbench where the craftsman is working. As it gets closer, the camera gradually tilts down toward the
workbench top, so that the craftsman's head leaves the frame through the top edge long before his face could be
recognized: only his chest, rolled-up linen sleeves, forearms and hands remain visible.
The camera slows down and stops on the provided last frame: his hands fitting a tenon into a mortise with a
wooden mallet, oak shavings and a chisel on the workbench.
Same workshop, same morning light from the tall windows on the left, same dust in the light beams throughout.
No cut, no dissolve, no change of scene, no face visible at any moment, no text, no logo, no brand.
```

**Ce qui fait échouer ce plan :** une nouvelle coupure ou un fondu (comme dans la version actuelle), le visage qui
passe dans le cadre, l'établi du fond qui ne correspond pas à celui de l'image de fin. Je garde de toute façon le
meilleur passage et je raccorde au reste.

---

## 4. `methode-1-visite.jpg` (Gemini) — 3:2, 2400×1600

Problème actuel : un mètre jaune et noir (habillage de marque) et des chiffres presque lisibles.

```
Close-up of two craftsman's hands stretching a plain tape measure horizontally against a bare white plaster wall
in an empty room, as if measuring for a built-in piece of furniture.
The tape measure case is plain matte black, completely unbranded, no colour accents, no logo, no label.
The tape blade is pale ivory with fine tick marks only and no numbers at all; the end of the tape is out of focus.
Rolled-up raw linen shirt sleeves, clean but working hands, short nails, no rings, no watch. No face.
Low morning sunlight from a window on the left, raking across the wall, light oak wide-plank floor at the bottom
of the frame. 50 mm lens, shallow depth of field. Photorealistic, natural colours, no text anywhere.
```

---

## 5. Les essences (Gemini) — 16:9, 3000×1688, à générer l'une après l'autre

Problème actuel : chêne, frêne et pin se ressemblent trop et la lumière n'est pas rasante. Générer d'abord le
chêne, puis les trois autres **avec le chêne en référence de lumière et d'échelle seulement**, en insistant sur
les différences de couleur et de veinage.

Bloc commun, à mettre à la fin de chaque prompt :

```
Macro photograph of a flat, planed and oiled board surface filling the entire frame, grain running perfectly
horizontal, no edge of the board visible. Matte oil finish, no varnish, no gloss. Strong raking light from the
left at a very low angle, so every pore and fibre casts a tiny shadow and the surface relief is clearly visible.
100 mm macro lens, everything in focus. Photorealistic, no text, no logo, no other object.
```

- **`essence-chene.jpg`** : `Wood species: European white oak, flat-sawn. Warm light honey-beige colour, open pores, pronounced cathedral grain and a few silvery medullary ray flecks.` + bloc commun.
- **`essence-noyer.jpg`** : `Wood species: European walnut. Deep chocolate and coffee brown with darker, almost black streaks and subtle purple-grey tones, fine and wavy grain.` + bloc commun.
- **`essence-frene.jpg`** : `Wood species: European ash. Very pale creamy white, almost white, with strong, regular, clearly contrasted darker grain lines, coarse open texture.` + bloc commun.
- **`essence-pin.jpg`** : `Wood species: Scots pine. Warm yellow-orange blond with clearly visible reddish-brown growth rings, a high resin sheen in the latewood and two or three small round healthy dark knots.` + bloc commun.

---

## 6. `projet-bibliotheque-azay.jpg` (Gemini) — 4:5, 2000×2500

- Référence de style à joindre : `source/projet-escalier-montlouis.jpg` (le décor commun de la galerie).

```
Use the attached image only as a reference for the room style, the light, the camera height and the framing.
A full-height built-in bookcase entirely made of solid Scots pine: pale blond wood with visible growth rings and
a few small knots, natural matte oil finish. Thick vertical uprights, deep shelves 32 mm thick, covering a whole
white plaster wall from floor to ceiling. The whole bookcase is pine, no dark wood, no stain, no paint.
Books with plain, unmarked spines in off-white, beige and soft grey, no titles. One dark green plant in a raw
stoneware pot on the floor to the left.
Light oak wide-plank floor, low morning sun from a window on the left casting long soft shadows across the floor.
Camera at 1.4 m height, straight, 35 mm lens, vertical lines perfectly vertical, the bookcase centred and entirely
in frame. Nobody in the room. Photorealistic, no text, no logo.
```

---

## 7. Secondaires (Gemini)

### Les 10 détails de projet — 4:5, 2000×2500

Pour chacun, joindre **la photo du projet correspondant** comme référence (même ouvrage, même bois, même
lumière), puis utiliser ce prompt en remplaçant `[SUJET]` :

```
Use the attached photo as the exact reference for the piece of furniture, its wood, its finish and the light.
Close-up detail of this same piece: [SUJET].
Low morning sunlight from the left, raking across the wood so the grain is visible. 50 mm lens, shallow depth of
field. No person, no face, no text, no logo. Photorealistic, natural colours.
```

| Fichier | Référence | `[SUJET]` |
|---|---|---|
| `detail-escalier-montlouis.jpg` | `projet-escalier-montlouis.jpg` | the rounded nosing of an oak stair tread and the joint where a thin baluster meets the handrail |
| `detail-escalier-loches.jpg` | `projet-escalier-loches.jpg` | the winder steps of the quarter turn seen from above, light oak treads and white risers |
| `detail-cuisine-amboise.jpg` | `projet-cuisine-amboise.jpg` | the routed finger-pull groove at the top of a pale ash drawer front and the edge of the light stone worktop |
| `detail-cuisine-tours.jpg` | `projet-cuisine-tours.jpg` | the corner where a light oak drawer front meets a matte black cabinet door |
| `detail-dressing-joue.jpg` | `projet-dressing-joue.jpg` | a half-open light oak drawer showing a clean hand-cut dovetail joint at its corner, three dovetails, tight joints |
| `detail-dressing-vouvray.jpg` | `projet-dressing-vouvray.jpg` | the front edge of a solid walnut shelf with folded linen shirts on it |
| `detail-bibliotheque-chinon.jpg` | `projet-bibliotheque-chinon.jpg` | the oak lattice radiator grille under the window seat and the white linen cushion |
| `detail-bibliotheque-azay.jpg` | le nouveau `projet-bibliotheque-azay.jpg` | a thick pine upright and a 32 mm shelf with plain unmarked book spines |
| `detail-porte-tours.jpg` | `projet-porte-tours.jpg` | a hand-forged black iron lever handle on the vertical oak boards of the front door, no lock brand, no number |
| `detail-portes-saint-cyr.jpg` | `projet-portes-saint-cyr.jpg` | the frame-and-panel joint at the corner of a light oak cupboard door, raking light on the moulding |

### `contact-facade.jpg` — 3:2, 2400×1600

- Référence à joindre : `source/atelier-debut.jpg` (la même porte d'atelier).

```
Use the attached image as the exact reference for the workshop door, its wood and the light.
The same workshop seen from the courtyard, further back: a simple rural building with vertical oak cladding,
the large double wooden door wide open, gravel courtyard in front, a few planks leaning against the wall.
Morning sun from the left. No sign, no lettering, no number, no car, no person. 35 mm lens, straight verticals.
Photorealistic, natural colours.
```

### `copeaux.jpg` — 16:9, 2560×1440

- Référence à joindre : `source/atelier-fin.jpeg` (le même établi).

```
Use the attached image as the reference for the workbench and the light.
Top-down view of the same old beech workbench top, covered on the left third with curled light oak shavings,
the rest of the surface empty and clean. Low morning light from the left making the shavings glow at their
edges and cast small shadows. No tool, no hand, no person, no text. Photorealistic, natural colours.
```

---

## Ce que je fais quand tu déposes les fichiers

- **`hero-1-plateau.mp4`** : je choisis le passage propre, je vérifie le raccord avec `hero-3-buffet` (3,5 s), je
  remplace `hero-2-aronde` dans le hero, je pose la cote « 30 mm » sur le chant du plateau, puis Real-ESRGAN
  (environ 45 min).
- **`atelier-2-raccord.mp4`** : je l'insère entre l'allée et le gros plan à la place du fondu, je vérifie les deux
  raccords, puis Real-ESRGAN sur toute la traversée (environ 1 h 15).
- **Les images** : `python scripts/prepare_media.py --photos`, contrôle des règles, puis intégration.
- Puis test en production sur ordinateur et téléphone, et commit.

Pendant les passages Real-ESRGAN, l'ordinateur ne doit pas se mettre en veille (écran ouvert, branché).
