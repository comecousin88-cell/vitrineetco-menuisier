"""Prépare les médias de source/ pour le site : photos en WebP et vidéos découpées en séquences d'images.

Installation, une fois :  pip install pillow numpy opencv-python-headless
                          et Real-ESRGAN (realesrgan-ncnn-vulkan, modèle realesrgan-x4plus) quelque part sur le disque
Lancement :               python scripts/prepare_media.py --esrgan chemin/realesrgan-ncnn-vulkan.exe
                          python scripts/prepare_media.py --photos      (les photos seulement)
                          python scripts/prepare_media.py --sequences   (les vidéos seulement)
Sans --esrgan (ni variable d'environnement REALESRGAN), les vidéos sont agrandies classiquement, pour dépanner.

Déposez les fichiers dans source/ sous les noms de docs/medias.md (photos en .jpg, .jpeg, .png ou .webp ;
vidéos en .mp4, .mov ou .webm ; une double extension comme « .mp4.mp4 » est acceptée), puis relancez le
script : il traite tout ce qui est présent et ignore le reste.

Photos
1. Recadrage au centre au format attendu par le site (4:5 pour la galerie, 3:2 pour la méthode…), puis
   redimensionnement. Les photos « avant » et « après » sortent exactement à la même taille, pour le curseur.
2. Le même traitement léger pour toutes : un soupçon de contraste, couleurs à peine adoucies, netteté fine.
3. Export WebP qualité 82 dans public/, et la liste des photos prêtes dans src/data/photos.json. Une photo
   absente de cette liste s'affiche sur le site en emplacement provisoire, avec le nom du fichier attendu.
4. L'image de partage (public/partage.jpg, 1200×630) vient de source/partage.jpg, sinon de hero-fin.

Séquences (hero et traversée de l'atelier), réglées dans SEQUENCES ci-dessous
1. De chaque vidéo, on ne garde que le passage propre choisi (debut → fin, en secondes). Les plans se suivent ;
   entre deux plans, un fondu enchaîné court si les images ne se raccordent pas exactement, sinon un raccord
   direct. Pour ajouter un plan au début du hero plus tard, il suffit d'ajouter une ligne en tête de sa liste.
2. Les couleurs sont rapprochées d'un plan à l'autre (balance des blancs), d'une correction constante par
   plan : rien ne scintille.
3. On garde FRAMES images réparties régulièrement dans le temps. Real-ESRGAN les agrandit ; on n'en garde que le
   détail ajouté, lissé d'une image à l'autre par flux optique (sans quoi le bois et la poussière
   « grésilleraient » au défilement), puis une légère netteté :
   - desktop/ : 1920×1080, pour les ordinateurs ;
   - mobile/ : une image sur deux, bande verticale 3:4 prise au centre (810×1080), pour les téléphones.
4. Contrôle automatique : images en double, sauts, flou, bandes noires. Le rapport s'affiche à la fin.
5. Le nombre d'images est écrit dans src/data/sequences.json : le site passe alors de l'emplacement provisoire
   à la vraie séquence. Il manque un plan ? La séquence reste en emplacement provisoire.
Contrôle visuel dans source/_controle/ : une planche de 8 images par passage gardé, et une planche de 12 images
par séquence finale.
"""
import argparse
import json
import os
import shutil
import subprocess
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "source"
CONTROL = SOURCE / "_controle"
WORK = SOURCE / "_travail"
PUBLIC = ROOT / "public"
PHOTOS_JSON = ROOT / "src" / "data" / "photos.json"
SEQUENCES_JSON = ROOT / "src" / "data" / "sequences.json"
QUALITY = 82

IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp")
VIDEO_EXT = (".mp4", ".mov", ".webm")

PROJETS = (
    "escalier-montlouis", "cuisine-amboise", "cuisine-tours", "escalier-loches", "dressing-joue",
    "dressing-vouvray", "bibliotheque-chinon", "bibliotheque-azay", "porte-tours", "portes-saint-cyr",
)

# Nom de l'original dans source/ (sans extension) -> chemin dans public/, taille de sortie (largeur, hauteur).
# La taille fixe le format : l'image est recadrée au centre pour s'y ajuster.
PHOTOS = {
    # Affiche de l'atelier (version sans animation). Celle du hero est la dernière image de sa séquence,
    # écrite par prepare_sequence : les cotes y tombent exactement au même endroit qu'en fin d'animation.
    "atelier-fin": ("atelier/fin.webp", (2400, 1350)),
    "atelier-mobile": ("atelier/mobile.webp", (1080, 1920)),
    # Galerie : projets, détails et « avant », tous en 4:5 à la même taille
    **{f"projet-{s}": (f"projets/{s}.webp", (1600, 2000)) for s in PROJETS},
    **{f"detail-{s}": (f"projets/{s}-detail.webp", (1600, 2000)) for s in PROJETS},
    **{f"avant-{s}": (f"projets/{s}-avant.webp", (1600, 2000)) for s in ("escalier-montlouis", "cuisine-amboise", "bibliotheque-chinon")},
    # Méthode
    "methode-1-visite": ("methode/1-visite.webp", (1800, 1200)),
    "methode-2-plan": ("methode/2-plan.webp", (1800, 1200)),
    "methode-3-fabrication": ("methode/3-fabrication.webp", (1800, 1200)),
    "methode-4-pose": ("methode/4-pose.webp", (1800, 1200)),
    # Essences : 16:9, le site les recadre en bande plus large
    **{f"essence-{s}": (f"essences/{s}.webp", (2400, 1350)) for s in ("chene", "noyer", "frene", "pin")},
    # Contact et devis
    "portrait-artisan": ("contact/portrait.webp", (800, 1000)),
    "contact-facade": ("contact/facade.webp", (1800, 1200)),
    "copeaux": ("devis/copeaux.webp", (1920, 1080)),
}

# Les séquences : pour chaque plan, le passage gardé (en secondes) et, entre deux plans, la durée du fondu
# (0 = raccord direct). Passages choisis après analyse image par image (voir l'historique Git).
SEQUENCES = {
    "hero": {
        "plans": [
            # Un plan d'ouverture pourra s'ajouter ici, par exemple :
            # {"nom": "hero-1-rabot", "debut": 0.0, "fin": 5.0, "fondu": 0.5},
            # hero-2-aronde : la pièce posée sur les queues, puis l'emboîtement (5,1–5,4 s) et l'assemblage fermé.
            # Écarté : la main droite qui se lève et se replace (saut à 7 s), puis l'image figée de la fin.
            {"nom": "hero-2-aronde", "debut": 1.0, "fin": 6.5},
            # hero-3-buffet : le recul lent et net jusqu'au buffet entier dans le salon. Écartés : le recul flou
            # (1–3 s), puis le buffet qui change de forme et ses queues d'aronde qui disparaissent (3,0–3,6 s).
            # Le début ne raccorde donc plus sur l'assemblage : fondu enchaîné.
            {"nom": "hero-3-buffet", "debut": 3.5, "fin": 8.0, "fondu": 0.6},
        ],
        "frames": 80,
        "affiche": True,  # la dernière image devient l'affiche (public/hero/fin.webp)
    },
    "atelier": {
        "plans": [
            # atelier-1-entree : le franchissement de la porte et l'avance dans l'atelier. Écartés : un panneau
            # d'outils qui apparaît en transparence sur le mur de droite (dès 4,0 s), puis un panneau au premier
            # plan qui disparaît (8,5–9,9 s).
            {"nom": "atelier-1-entree", "debut": 0.0, "fin": 3.8},
            # Le plan 2 (arrivée à l'établi) se rajoutera ici, généré à partir de la dernière image gardée du
            # plan 1 (source/_controle/atelier-1-entree-derniere.png) :
            # {"nom": "atelier-2-etabli", "debut": 0.0, "fin": 5.0, "fondu": 0},
        ],
        "frames": 80,
    },
}
DESKTOP = (1920, 1080)
MOBILE = (810, 1080)
DETAIL = 0.85  # la part du détail de Real-ESRGAN gardée : assez pour la netteté, sans effet « peint »
DETAIL_MEMORY = 0.45  # la part du détail reprise de l'image précédente : c'est ce qui évite le scintillement
SHARPEN = 0.22
COLOR_MATCH = 0.6  # la part de l'écart de balance des blancs corrigée entre les plans


def find(name: str, extensions):
    for extension in extensions:
        for candidate in (
            SOURCE / f"{name}{extension}",
            SOURCE / f"{name}{extension.upper()}",
            SOURCE / f"{name}{extension}{extension}",  # « hero-2-aronde.mp4.mp4 »
        ):
            if candidate.exists():
                return candidate
    return None


def cover(image: Image.Image, size) -> Image.Image:
    """Recadre au centre au format de size, puis redimensionne exactement à size."""
    return ImageOps.fit(image, size, Image.LANCZOS, centering=(0.5, 0.5))


def treat(image: Image.Image) -> Image.Image:
    image = ImageEnhance.Contrast(image).enhance(1.03)
    image = ImageEnhance.Color(image).enhance(0.97)
    return image.filter(ImageFilter.UnsharpMask(radius=1.0, percent=35, threshold=3))


# ---------------------------------------------------------------- photos


def poster_entries():
    """Les affiches écrites par les séquences : à garder quand on réécrit la liste des photos."""
    if not PHOTOS_JSON.exists():
        return {}
    current = json.loads(PHOTOS_JSON.read_text(encoding="utf-8"))
    keys = {f"/{name}/fin.webp" for name, spec in SEQUENCES.items() if spec.get("affiche")}
    return {k: v for k, v in current.items() if k in keys and (PUBLIC / k.lstrip("/")).exists()}


def prepare_photos():
    manifest = poster_entries()
    missing = []
    for name, (target, size) in PHOTOS.items():
        original = find(name, IMAGE_EXT)
        if original is None:
            missing.append(name)
            continue
        with Image.open(original) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            if image.width < size[0] * 0.75 or image.height < size[1] * 0.75:
                print(f"  attention : {original.name} est petit ({image.width}×{image.height}) pour {size[0]}×{size[1]}")
            result = treat(cover(image, size))
        out = PUBLIC / target
        out.parent.mkdir(parents=True, exist_ok=True)
        result.save(out, "WEBP", quality=QUALITY, method=6)
        manifest[f"/{target}"] = {"width": result.width, "height": result.height}
        print(f"{original.name:36s} -> public/{target}  {result.width}×{result.height}  {out.stat().st_size // 1024} Ko")

    PHOTOS_JSON.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n", encoding="utf-8")
    print(f"\n{len(manifest)} photos prêtes, liste écrite dans {PHOTOS_JSON.relative_to(ROOT)}")
    if missing:
        print(f"{len(missing)} encore manquantes (emplacements provisoires) : {', '.join(missing)}")
    prepare_partage()


def prepare_partage():
    original = find("partage", IMAGE_EXT) or find("hero-fin", IMAGE_EXT)
    out = PUBLIC / "partage.jpg"
    if original is None:
        print("Image de partage : en attente de partage.jpg ou de hero-fin.jpg")
        return
    with Image.open(original) as image:
        result = treat(cover(ImageOps.exif_transpose(image).convert("RGB"), (1200, 630)))
    result.save(out, "JPEG", quality=85, optimize=True, progressive=True)
    print(f"Image de partage : {original.name} -> public/partage.jpg")


# ---------------------------------------------------------------- séquences


def read_passage(path: Path, debut: float, fin: float):
    """Les images du passage gardé, en BGR à la taille de la vidéo, et sa cadence."""
    capture = cv2.VideoCapture(str(path))
    fps = capture.get(cv2.CAP_PROP_FPS) or 24
    first, last = int(round(debut * fps)), int(round(fin * fps))
    frames, index = [], 0
    while True:
        ok, frame = capture.read()
        if not ok or index > last:
            break
        if index >= first:
            frames.append(frame)
        index += 1
    capture.release()
    if not frames:
        raise SystemExit(f"{path.name} : aucune image lisible entre {debut} et {fin} s")
    return frames, fps


def sheet(images, labels, path: Path, columns=4, size=(480, 270)):
    rows = (len(images) + columns - 1) // columns
    board = Image.new("RGB", (size[0] * columns, size[1] * rows), "white")
    draw = ImageDraw.Draw(board)
    for k, (image, label) in enumerate(zip(images, labels)):
        x, y = (k % columns) * size[0], (k // columns) * size[1]
        board.paste(Image.fromarray(cv2.cvtColor(cv2.resize(image, size, interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2RGB)), (x, y))
        draw.rectangle([x, y, x + 64, y + 18], fill="black")
        draw.text((x + 4, y + 3), label, fill="white")
    path.parent.mkdir(parents=True, exist_ok=True)
    board.save(path, quality=88)


def white_balance(plans):
    """Rapproche la balance des blancs des plans (canaux a et b du Lab), d'une correction constante par plan."""
    if len(plans) < 2:
        return plans
    means = []
    for frames in plans:
        sample = frames[:: max(1, len(frames) // 12)]
        lab = np.concatenate([cv2.cvtColor(f, cv2.COLOR_BGR2LAB).reshape(-1, 3)[::16] for f in sample]).astype(np.float32)
        means.append(lab[:, 1:].mean(axis=0))
    target = np.mean(means, axis=0)
    result = []
    for frames, mean in zip(plans, means):
        shift = COLOR_MATCH * (target - mean)
        print(f"  balance des blancs : a {shift[0]:+.1f}, b {shift[1]:+.1f}")
        corrected = []
        for f in frames:
            lab = cv2.cvtColor(f, cv2.COLOR_BGR2LAB).astype(np.float32)
            lab[..., 1:] += shift
            corrected.append(cv2.cvtColor(np.clip(lab, 0, 255).astype(np.uint8), cv2.COLOR_LAB2BGR))
        result.append(corrected)
    return result


def build_timeline(plans, fondus):
    """La séquence comme une suite de recettes : (plan, image) ou, pendant un fondu, deux images et un dosage."""
    timeline = [[(0, j, None)] for j in range(len(plans[0][0]))]
    for p in range(1, len(plans)):
        frames, fps = plans[p]
        overlap = min(int(round(fondus[p] * fps)), len(timeline) - 1, len(frames) - 1)
        for k in range(overlap):
            alpha = (k + 1) / (overlap + 1)
            previous = timeline[len(timeline) - overlap + k]
            timeline[len(timeline) - overlap + k] = [(i, j, (1 - alpha) * (w if w is not None else 1)) for i, j, w in previous] + [(p, k, alpha)]
        timeline.extend([[(p, j, None)] for j in range(overlap, len(frames))])
    return timeline


def pace(timeline, plans, total):
    """Les images gardées, réparties moitié selon le temps, moitié selon le mouvement visible : un plan rapide
    reçoit plus d'images, un plan presque immobile moins, et le défilement avance à vitesse régulière."""
    def small(recipe):
        mix = sum(cv2.resize(plans[p][0][j], (320, 180), interpolation=cv2.INTER_AREA).astype(np.float32) * (1 if w is None else w) for p, j, w in recipe)
        return cv2.cvtColor(np.clip(mix, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY).astype(np.float32)
    frames = [small(recipe) for recipe in timeline]
    motion = np.array([0.0] + [float(np.abs(frames[i] - frames[i - 1]).mean()) for i in range(1, len(frames))])
    step = 0.5 / (len(timeline) - 1) + 0.5 * motion / max(motion.sum(), 1e-6)
    step[0] = 0
    cumulative = np.cumsum(step)
    cumulative /= cumulative[-1]
    picks = [int(np.searchsorted(cumulative, k / (total - 1), side="left")) for k in range(total)]
    # Jamais deux fois la même image : là où le mouvement est très fort, on prend la suivante.
    for k in range(1, total):
        picks[k] = max(picks[k], picks[k - 1] + 1)
    for k in range(total - 2, -1, -1):
        picks[k] = min(picks[k], picks[k + 1] - 1)
    return picks


def upscale(frames, esrgan: Path | None, label: str):
    """Real-ESRGAN ×4 sur les images demandées. Sans outil, None : l'agrandissement reste classique."""
    if esrgan is None:
        return None
    raw, big = WORK / label / "brut", WORK / label / "agrandi"
    for folder in (raw, big):
        shutil.rmtree(folder, ignore_errors=True)
        folder.mkdir(parents=True)
    for number, frame in enumerate(frames, start=1):
        cv2.imwrite(str(raw / f"{number:04d}.png"), frame)
    print(f"  Real-ESRGAN : {len(frames)} images de {frames[0].shape[1]}×{frames[0].shape[0]} à agrandir…")
    subprocess.run(
        # Tuiles de 128 px : avec de plus grandes, une carte graphique intégrée manque de mémoire et rend du noir.
        [str(esrgan), "-i", str(raw), "-o", str(big), "-n", "realesrgan-x4plus", "-s", "4", "-t", "128", "-f", "png"],
        check=True,
        capture_output=True,
        cwd=esrgan.parent,
    )
    large = [cv2.imread(str(big / f"{number:04d}.png")) for number in range(1, len(frames) + 1)]
    if any(image is None or float(image.mean()) < 5 for image in large):
        raise SystemExit("Real-ESRGAN a rendu des images vides ou noires : réduire la taille des tuiles (-t).")
    return large


def enhance(frames, large):
    """L'image agrandie classiquement, plus le détail de Real-ESRGAN lissé dans le temps, plus une légère netteté."""
    width, height = DESKTOP
    y, x = np.mgrid[0:height, 0:width].astype(np.float32)
    dis = cv2.DISOpticalFlow_create(cv2.DISOPTICAL_FLOW_PRESET_MEDIUM)
    previous_detail = previous_gray = None
    raw_flicker, kept_flicker, result = [], [], []
    for index, frame in enumerate(frames):
        base = cv2.resize(frame, DESKTOP, interpolation=cv2.INTER_LANCZOS4).astype(np.float32)
        out = base
        if large is not None:
            detail = cv2.resize(large[index], DESKTOP, interpolation=cv2.INTER_AREA).astype(np.float32) - base
            gray = cv2.cvtColor(np.clip(base, 0, 255).astype(np.uint8), cv2.COLOR_BGR2GRAY)
            if previous_detail is not None:
                flow = dis.calc(gray, previous_gray, None)
                carried = cv2.remap(previous_detail, x + flow[..., 0], y + flow[..., 1], cv2.INTER_LINEAR, borderMode=cv2.BORDER_REPLICATE)
                raw_flicker.append(float(np.abs(detail - carried).mean()))
                detail = (1 - DETAIL_MEMORY) * detail + DETAIL_MEMORY * carried
                kept_flicker.append(float(np.abs(detail - carried).mean()))
            previous_detail, previous_gray = detail, gray
            out = base + DETAIL * detail
        blurred = cv2.GaussianBlur(out, (0, 0), 1.2)
        result.append(np.clip(out + SHARPEN * (out - blurred), 0, 255).astype(np.uint8))
    if raw_flicker:
        print(f"  scintillement du détail : {np.mean(raw_flicker):.2f} sans lissage, {np.mean(kept_flicker):.2f} avec")
    return result


def check(name, frames, fondu_indices):
    """Images en double, sauts, flou, bandes noires : le rapport du contrôle automatique."""
    small = [cv2.cvtColor(cv2.resize(f, (480, 270), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.float32) for f in frames]
    diffs = [float(np.abs(small[i] - small[i - 1]).mean()) for i in range(1, len(small))]
    median = float(np.median(diffs))
    sharp = [cv2.Laplacian(cv2.cvtColor(f, cv2.COLOR_BGR2GRAY), cv2.CV_64F).var() for f in frames]
    sharp_median = float(np.median(sharp))
    problems = []
    for i, d in enumerate(diffs, start=1):
        if d < 0.15:
            problems.append(f"image {i + 1} : identique à la précédente")
        if d > max(4 * median, median + 6) and i not in fondu_indices:
            problems.append(f"image {i + 1} : saut ({d:.1f} contre {median:.1f} en moyenne)")
    for i, s in enumerate(sharp, start=1):
        if s < 0.35 * sharp_median:
            problems.append(f"image {i} : floue ({s:.0f} contre {sharp_median:.0f})")
    for i, f in enumerate(frames, start=1):
        gray = cv2.cvtColor(f, cv2.COLOR_BGR2GRAY)
        edges = {"haut": gray[:6].mean(), "bas": gray[-6:].mean(), "gauche": gray[:, :6].mean(), "droite": gray[:, -6:].mean()}
        dark = [side for side, value in edges.items() if value < 8]
        if dark:
            problems.append(f"image {i} : bande noire ({', '.join(dark)})")
    print(f"  contrôle de {name} : écart moyen entre images {median:.2f}, netteté médiane {sharp_median:.0f}")
    print("  " + ("\n  ".join(problems) if problems else "aucune image en double, aucun saut, aucun flou, aucune bande noire"))
    return problems


def save_series(folder: Path, images, size, quality, crop_portrait=False):
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True)
    total = 0
    for i, array in enumerate(images):
        image = Image.fromarray(cv2.cvtColor(array, cv2.COLOR_BGR2RGB))
        if crop_portrait:
            width = round(image.height * 3 / 4)
            left = (image.width - width) // 2
            image = image.crop((left, 0, left + width, image.height))
        if image.size != size:
            image = image.resize(size, Image.LANCZOS)
        path = folder / f"{i + 1:04d}.webp"
        image.save(path, "WEBP", quality=quality, method=6)
        total += path.stat().st_size
    return total


def prepare_sequence(name, spec, esrgan):
    paths = [find(plan["nom"], VIDEO_EXT) for plan in spec["plans"]]
    absents = [plan["nom"] for plan, path in zip(spec["plans"], paths) if path is None]
    if absents:
        print(f"Séquence {name} : en attente de {', '.join(p + '.mp4' for p in absents)}")
        return {"count": 0, "mobileCount": 0}

    print(f"Séquence {name}")
    plans = []
    for plan, path in zip(spec["plans"], paths):
        frames, fps = read_passage(path, plan["debut"], plan["fin"])
        plans.append((frames, fps))
        print(f"  {path.name} : {plan['debut']:.2f} → {plan['fin']:.2f} s, {len(frames)} images")
        # La planche du passage gardé, 8 images, et sa dernière image pour générer le plan suivant.
        picks = [round(i * (len(frames) - 1) / 7) for i in range(8)]
        sheet([frames[i] for i in picks], [f"{plan['debut'] + i / fps:.2f}s" for i in picks], CONTROL / f"{plan['nom']}-passage.jpg")
        cv2.imwrite(str(CONTROL / f"{plan['nom']}-derniere.png"), frames[-1])

    balanced = white_balance([frames for frames, _ in plans])
    plans = [(frames, fps) for frames, (_, fps) in zip(balanced, plans)]
    fondus = [plan.get("fondu", 0) for plan in spec["plans"]]
    timeline = build_timeline(plans, fondus)

    total = spec["frames"]
    recipes = [timeline[i] for i in pace(timeline, plans, total)]
    # Les images sources nécessaires, plan par plan, dans l'ordre : le lissage du détail suit le mouvement.
    needed = sorted({(p, j) for recipe in recipes for p, j, _ in recipe})
    enhanced = {}
    for p in sorted({p for p, _ in needed}):
        indices = [j for q, j in needed if q == p]
        sources = [plans[p][0][j] for j in indices]
        large = upscale(sources, esrgan, f"{name}-{p}")
        for j, image in zip(indices, enhance(sources, large)):
            enhanced[(p, j)] = image
    final = []
    fondu_indices = set()
    for n, recipe in enumerate(recipes):
        if len(recipe) == 1:
            final.append(enhanced[(recipe[0][0], recipe[0][1])])
            continue
        fondu_indices.update({n, n + 1})
        mix = sum(enhanced[(p, j)].astype(np.float32) * w for p, j, w in recipe)
        final.append(np.clip(mix, 0, 255).astype(np.uint8))

    check(name, final, fondu_indices)
    size_desktop = save_series(PUBLIC / name / "desktop", final, DESKTOP, 80)
    mobile = final[::2]
    if (total - 1) % 2:  # la dernière image, celle de fin, est toujours dans la série téléphone
        mobile.append(final[-1])
    size_mobile = save_series(PUBLIC / name / "mobile", mobile, MOBILE, 78, crop_portrait=True)
    if spec.get("affiche"):
        poster = PUBLIC / name / "fin.webp"
        Image.fromarray(cv2.cvtColor(final[-1], cv2.COLOR_BGR2RGB)).save(poster, "WEBP", quality=QUALITY, method=6)
        manifest = json.loads(PHOTOS_JSON.read_text(encoding="utf-8")) if PHOTOS_JSON.exists() else {}
        manifest[f"/{name}/fin.webp"] = {"width": DESKTOP[0], "height": DESKTOP[1]}
        PHOTOS_JSON.write_text(json.dumps(dict(sorted(manifest.items())), indent=2) + "\n", encoding="utf-8")
        print(f"  affiche : public/{name}/fin.webp (dernière image)")
    picks = [round(i * (len(final) - 1) / 11) for i in range(12)]
    sheet([final[i] for i in picks], [f"{i + 1}" for i in picks], CONTROL / f"{name}-planche.jpg")
    print(f"  -> public/{name}/desktop : {len(final)} images, {size_desktop / 1e6:.1f} Mo")
    print(f"  -> public/{name}/mobile : {len(mobile)} images, {size_mobile / 1e6:.1f} Mo")
    print(f"  planches : source/_controle/{name}-planche.jpg et les passages *-passage.jpg")
    return {"count": len(final), "mobileCount": len(mobile)}


def prepare_sequences(esrgan: Path | None, only=None):
    counts = json.loads(SEQUENCES_JSON.read_text(encoding="utf-8")) if SEQUENCES_JSON.exists() else {}
    if esrgan is None:
        print("Sans Real-ESRGAN : agrandissement classique (passer --esrgan pour un meilleur détail).")
    for name, spec in SEQUENCES.items():
        if only and name != only:
            continue
        counts[name] = prepare_sequence(name, spec, esrgan)
    SEQUENCES_JSON.write_text(json.dumps(counts, indent=2) + "\n", encoding="utf-8")
    print(f"Nombres d'images écrits dans {SEQUENCES_JSON.relative_to(ROOT)}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--photos", action="store_true", help="les photos seulement")
    parser.add_argument("--sequences", action="store_true", help="les vidéos seulement")
    parser.add_argument("--only", choices=list(SEQUENCES), help="une seule séquence")
    parser.add_argument("--esrgan", type=Path, default=os.environ.get("REALESRGAN"), help="chemin de realesrgan-ncnn-vulkan.exe")
    args = parser.parse_args()
    both = not args.photos and not args.sequences
    if not SOURCE.exists():
        raise SystemExit("Le dossier source/ est introuvable : créez-le et déposez-y les médias.")
    esrgan = Path(args.esrgan) if args.esrgan else None
    if esrgan is not None and not esrgan.exists():
        raise SystemExit(f"Real-ESRGAN introuvable : {esrgan}")
    if both or args.photos:
        prepare_photos()
    if both or args.sequences:
        print()
        prepare_sequences(esrgan, args.only)


if __name__ == "__main__":
    main()
