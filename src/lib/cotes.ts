import type { Cote } from "@/data/hero";

type Point = { x: number; y: number };

// Où tombe un point de l'image source une fois l'image posée dans un cadre en « cover » (remplie, centrée,
// sans déformation) : la même règle que le canvas, pour que les cotes restent sur l'objet mesuré.
// crop : la part de la largeur source gardée par la série d'images (1 = toute l'image, 0,42 = une bande
// verticale centrée, pour les téléphones).
export function placeInCover(nx: number, ny: number, box: { width: number; height: number }, ratio: number, crop = 1) {
  const cx = (nx - (1 - crop) / 2) / crop;
  const imageRatio = ratio * crop;
  const scale = Math.max(box.width / imageRatio, box.height);
  const width = imageRatio * scale;
  const height = scale;
  return { x: (box.width - width) / 2 + cx * width, y: (box.height - height) / 2 + ny * height };
}

const fmt = (n: number) => Math.round(n * 10) / 10;
const line = (a: Point, b: Point) => `M${fmt(a.x)} ${fmt(a.y)}L${fmt(b.x)} ${fmt(b.y)}`;
const add = (a: Point, b: Point, k = 1) => ({ x: a.x + b.x * k, y: a.y + b.y * k });

export type CoteGeometry = {
  id: string;
  paths: string[]; // tracés dans l'ordre : lignes d'attache, trait de cote, petits traits obliques
  label: { x: number; y: number; anchor: "start" | "middle" | "end"; baseline: "auto" | "middle" | "hanging" };
  text: string;
  note: string;
};

// Le dessin d'une cote à la manière d'un plan d'atelier : deux lignes d'attache, le trait de cote qui les
// dépasse un peu, et un petit trait oblique à chaque extrémité (plutôt que des flèches, trop « logiciel »).
export function coteGeometry(cote: Cote, place: (nx: number, ny: number) => Point): CoteGeometry {
  if (cote.kind === "lineaire") {
    const a = place(...cote.a);
    const b = place(...cote.b);
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    const u = { x: (b.x - a.x) / length, y: (b.y - a.y) / length };
    const n = { x: u.y, y: -u.x }; // perpendiculaire au trait mesuré
    const d = cote.offset;
    const side = Math.sign(d) || 1;
    const da = add(a, n, d);
    const db = add(b, n, d);
    const tick = { x: (u.x + n.x) * 5, y: (u.y + n.y) * 5 };
    const paths = [
      line(add(a, n, side * 4), add(a, n, d + side * 7)),
      line(add(b, n, side * 4), add(b, n, d + side * 7)),
      line(add(da, u, -9), add(db, u, 9)),
      line(add(da, tick, -1), add(da, tick, 1)),
      line(add(db, tick, -1), add(db, tick, 1)),
    ];
    // La valeur s'éloigne de l'objet, ou s'en rapproche (labelInside) : alors elle remonte de ses deux lignes.
    const away = cote.labelInside ? { x: -n.x * side, y: -n.y * side } : { x: n.x * side, y: n.y * side };
    const mid = add({ x: (da.x + db.x) / 2, y: (da.y + db.y) / 2 }, away, cote.labelInside ? 40 : 12);
    const horizontal = Math.abs(away.x) > Math.abs(away.y);
    return {
      id: cote.id,
      paths,
      label: {
        ...mid,
        anchor: horizontal ? (away.x > 0 ? "start" : "end") : "middle",
        baseline: horizontal ? "middle" : away.y > 0 || cote.labelInside ? "hanging" : "auto",
      },
      text: cote.label,
      note: cote.note,
    };
  }

  const c = place(...cote.center);
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const at = (deg: number, r: number) => ({ x: c.x + Math.cos(rad(deg)) * r, y: c.y + Math.sin(rad(deg)) * r });
  const r = cote.radius;
  const start = at(cote.from, r);
  const end = at(cote.to, r);
  const sweep = cote.to > cote.from ? 1 : 0;
  // La valeur se pose au bout du second trait, un peu à l'écart, pour ne pas toucher l'arc.
  const tip = at(cote.to, r + 14);
  const labelPoint = { x: tip.x + 8, y: tip.y };
  return {
    id: cote.id,
    paths: [
      line(c, at(cote.from, r + 14)),
      line(c, at(cote.to, r + 14)),
      `M${fmt(start.x)} ${fmt(start.y)}A${r} ${r} 0 0 ${sweep} ${fmt(end.x)} ${fmt(end.y)}`,
    ],
    label: { ...labelPoint, anchor: "start", baseline: "middle" },
    text: cote.label,
    note: cote.note,
  };
}

// La cote à un instant de la séquence (progress, de 0 à 1) : si elle suit un recul de caméra, ses points se
// rapprochent du centre du recul selon l'échelle, interpolée entre les relevés. Sinon, elle ne bouge pas.
export function coteAt(cote: Cote, progress: number, mobile: boolean): Cote {
  if (cote.kind !== "lineaire") return cote;
  const offset = mobile && cote.offsetMobile !== undefined ? cote.offsetMobile : cote.offset;
  if (!cote.suivi) return { ...cote, offset };
  const { centre, echelles } = cote.suivi;
  let scale = echelles[echelles.length - 1][1];
  for (let i = 0; i < echelles.length - 1; i++) {
    const [p0, s0] = echelles[i];
    const [p1, s1] = echelles[i + 1];
    if (progress <= p1) {
      scale = progress <= p0 ? s0 : s0 + ((progress - p0) / (p1 - p0)) * (s1 - s0);
      break;
    }
  }
  const move = ([x, y]: [number, number]): [number, number] => [
    centre[0] + (x - centre[0]) * scale,
    centre[1] + (y - centre[1]) * scale,
  ];
  return { ...cote, offset, a: move(cote.a), b: move(cote.b) };
}
