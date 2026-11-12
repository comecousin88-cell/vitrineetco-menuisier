"""Prépare les médias de source/ pour le site : photos en WebP et vidéos découpées en séquences d'images.

Installation, une fois :  pip install pillow numpy opencv-python-headless
Lancement :               python scripts/prepare_media.py
                          python scripts/prepare_media.py --photos      (les photos seulement)
                          python scripts/prepare_media.py --sequences   (les vidéos seulement)

Déposez les fichiers dans source/ sous les noms de docs/medias.md (photos en .jpg, .jpeg, .png ou .webp ;
vidéos en .mp4, .mov ou .webm), puis relancez le script : il traite tout ce qui est présent et ignore le reste.
Une nouvelle version d'un fichier ? La déposer sous le même nom et relancer.

Photos
1. Recadrage au centre au format attendu par le site (4:5 pour la galerie, 3:2 pour la méthode…), puis
   redimensionnement. Les photos « avant » et « après » sortent exactement à la même taille, pour le curseur.
2. Le même traitement léger pour toutes : un soupçon de contraste, couleurs à peine adoucies, netteté fine.
3. Export WebP qualité 82 dans public/, et la liste des photos prêtes dans src/data/photos.json. Une photo
   absente de cette liste s'affiche sur le site en emplacement provisoire, avec le nom du fichier attendu.
4. L'image de partage (public/partage.jpg, 1200×630) vient de source/partage.jpg, sinon de hero-fin.

Séquences (hero et traversée de l'atelier)
1. Les plans sont lus à la suite. Hero : fondu enchaîné entre le plan 1 et le plan 2, raccord direct entre le
   plan 2 et le plan 3. Atelier : raccord direct entre les deux plans.
2. On garde FRAMES images réparties régulièrement, recadrées en 16:9 :
   - desktop/ : 1920×1080, pour les ordinateurs ;
   - mobile/ : une image sur deux, bande verticale 3:4 prise au centre (810×1080), pour les téléphones.
3. Le nombre d'images est écrit dans src/data/sequences.json : le site passe alors de l'emplacement provisoire
   à la vraie séquence. Il manque un plan ? La séquence est laissée de côté et reste en emplacement provisoire.
Contrôle : une planche de 12 images de chaque séquence dans source/_controle/, pour vérifier d'un coup d'œil.
"""
import argparse
import json
import shutil
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "source"
CONTROL = SOURCE / "_controle"
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
    # Affiches des séquences (version sans animation)
    "hero-fin": ("hero/fin.webp", (2400, 1350)),
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

SEQUENCES = {
    "hero": {
        "plans": ["hero-1-rabot", "hero-2-aronde", "hero-3-buffet"],
        "fondus": {0: 0.6},  # fondu de 0,6 s entre le plan 1 et le plan 2 ; les autres en raccord direct
        "frames": 80,
    },
    "atelier": {
        "plans": ["atelier-1-entree", "atelier-2-etabli"],
        "fondus": {},
        "frames": 80,
    },
}
DESKTOP = (1920, 1080)
MOBILE = (810, 1080)


def find(name: str, extensions):
    for extension in extensions:
        for candidate in (SOURCE / f"{name}{extension}", SOURCE / f"{name}{extension.upper()}"):
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


def prepare_photos():
    manifest = {}
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


def read_video(path: Path):
    """Toutes les images d'une vidéo, en RVB, recadrées en 16:9 à la taille DESKTOP, et sa cadence."""
    capture = cv2.VideoCapture(str(path))
    fps = capture.get(cv2.CAP_PROP_FPS) or 24
    frames = []
    while True:
        ok, frame = capture.read()
        if not ok:
            break
        image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
        frames.append(np.asarray(cover(image, DESKTOP)))
    capture.release()
    if not frames:
        raise RuntimeError(f"{path.name} : aucune image lisible (format ou codec non pris en charge ?)")
    return frames, fps


def join_plans(plans, fondus):
    """Met les plans bout à bout ; là où un fondu est prévu, les images se recouvrent et se mélangent."""
    timeline = list(plans[0][0])
    for index in range(1, len(plans)):
        frames, fps = plans[index]
        duration = fondus.get(index - 1, 0)
        overlap = min(int(round(duration * fps)), len(timeline) - 1, len(frames) - 1)
        for k in range(overlap):
            alpha = (k + 1) / (overlap + 1)
            a = timeline[len(timeline) - overlap + k].astype(np.float32)
            b = frames[k].astype(np.float32)
            timeline[len(timeline) - overlap + k] = (a * (1 - alpha) + b * alpha).astype(np.uint8)
        timeline.extend(frames[overlap:])
    return timeline


def save_series(folder: Path, images, size, quality, crop_portrait=False):
    if folder.exists():
        shutil.rmtree(folder)
    folder.mkdir(parents=True)
    for i, array in enumerate(images):
        image = Image.fromarray(array)
        if crop_portrait:
            width = round(image.height * 3 / 4)
            left = (image.width - width) // 2
            image = image.crop((left, 0, left + width, image.height))
        if image.size != size:
            image = image.resize(size, Image.LANCZOS)
        image = image.filter(ImageFilter.UnsharpMask(radius=0.8, percent=25, threshold=3))
        image.save(folder / f"{i + 1:04d}.webp", "WEBP", quality=quality, method=6)


def contact_sheet(name, images):
    CONTROL.mkdir(parents=True, exist_ok=True)
    picks = [images[round(i * (len(images) - 1) / 11)] for i in range(12)]
    thumbs = [Image.fromarray(a).resize((480, 270), Image.LANCZOS) for a in picks]
    sheet = Image.new("RGB", (480 * 4, 270 * 3), "white")
    for i, thumb in enumerate(thumbs):
        sheet.paste(thumb, ((i % 4) * 480, (i // 4) * 270))
    sheet.save(CONTROL / f"{name}-planche.jpg", quality=85)


def prepare_sequences():
    counts = json.loads(SEQUENCES_JSON.read_text(encoding="utf-8")) if SEQUENCES_JSON.exists() else {}
    for name, spec in SEQUENCES.items():
        paths = [find(plan, VIDEO_EXT) for plan in spec["plans"]]
        absents = [plan for plan, path in zip(spec["plans"], paths) if path is None]
        if absents:
            print(f"Séquence {name} : en attente de {', '.join(p + '.mp4' for p in absents)}")
            counts[name] = {"count": 0, "mobileCount": 0}
            continue
        print(f"Séquence {name} : lecture de {', '.join(p.name for p in paths)}")
        plans = [read_video(path) for path in paths]
        for path, (frames, fps) in zip(paths, plans):
            print(f"  {path.name} : {len(frames)} images à {fps:.0f} i/s ({len(frames) / fps:.1f} s)")
        timeline = join_plans(plans, spec["fondus"])
        total = spec["frames"]
        picks = [timeline[round(i * (len(timeline) - 1) / (total - 1))] for i in range(total)]
        save_series(PUBLIC / name / "desktop", picks, DESKTOP, 80)
        mobile = picks[::2]
        if (total - 1) % 2:  # la dernière image, celle de fin, est toujours dans la série téléphone
            mobile.append(picks[-1])
        save_series(PUBLIC / name / "mobile", mobile, MOBILE, 78, crop_portrait=True)
        contact_sheet(name, picks)
        counts[name] = {"count": len(picks), "mobileCount": len(mobile)}
        print(f"  -> public/{name}/desktop ({len(picks)} images) et public/{name}/mobile ({len(mobile)} images)")
        print(f"  planche de contrôle : source/_controle/{name}-planche.jpg")

    SEQUENCES_JSON.write_text(json.dumps(counts, indent=2) + "\n", encoding="utf-8")
    print(f"Nombres d'images écrits dans {SEQUENCES_JSON.relative_to(ROOT)}")


def main():
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    parser.add_argument("--photos", action="store_true", help="les photos seulement")
    parser.add_argument("--sequences", action="store_true", help="les vidéos seulement")
    args = parser.parse_args()
    both = not args.photos and not args.sequences
    if not SOURCE.exists():
        raise SystemExit("Le dossier source/ est introuvable : créez-le et déposez-y les médias.")
    if both or args.photos:
        prepare_photos()
    if both or args.sequences:
        print()
        prepare_sequences()


if __name__ == "__main__":
    main()
