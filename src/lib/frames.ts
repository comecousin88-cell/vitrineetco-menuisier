// Lit une séquence d'images comme une vidéo que le scroll fait avancer et reculer. Une vraie vidéo ne
// sait pas reculer image par image sans saccades, surtout sur téléphone : d'où cette méthode.

const pad = (index: number) => String(index + 1).padStart(4, "0");

// Sur une connexion lente, une image sur 6 d'abord : toute l'entrée est jouable très vite, puis le reste
// vient affiner le mouvement. En mode économie de données, on s'arrête à cette première série.
const KEYFRAME_STEP = 6;

// autoStart: false : rien n'est chargé avant l'appel à start(), pour une séquence plus bas dans la page.
export function createFramePlayer(canvas: HTMLCanvasElement, folder: string, count: number, { autoStart = true } = {}) {
  // alpha: false : le navigateur sait que l'image est opaque, ce qui allège chaque affichage.
  const context = canvas.getContext("2d", { alpha: false });
  const frames: (HTMLImageElement | undefined)[] = new Array(count);
  canvas.dataset.total = String(count);
  let wanted = 0;
  let shown = "";
  let stopped = false;

  function cover(frame: HTMLImageElement) {
    if (!context) return;
    // Remplit le cadre sans déformer l'image, comme object-fit: cover.
    const scale = Math.max(canvas.width / frame.naturalWidth, canvas.height / frame.naturalHeight);
    const width = frame.naturalWidth * scale;
    const height = frame.naturalHeight * scale;
    context.drawImage(frame, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
  }

  // La position peut tomber entre deux images : 12,4, c'est l'image 12 avec 40 % de la 13 par-dessus.
  function paint() {
    if (!context) return;
    const index = Math.floor(wanted);
    // Si l'image voulue n'est pas encore arrivée, on montre la plus proche déjà prête.
    let frame = frames[index];
    let source = index;
    for (let distance = 1; !frame && distance < count; distance++) {
      source = frames[index - distance] ? index - distance : index + distance;
      frame = frames[source];
    }
    if (!frame) return;
    const next = frames[index + 1];
    const mix = next && source === index ? Math.round((wanted - index) * 16) / 16 : 0;
    // Rien à redessiner si rien n'a changé : le scroll rapporte bien plus de positions que d'images.
    const state = `${source}:${mix}:${canvas.width}:${canvas.height}`;
    if (state === shown) return;
    shown = state;

    // Le canvas est opaque, donc noir tant qu'il est vide : le CSS l'attend grâce à ce repère.
    canvas.dataset.painted = "true";
    context.globalAlpha = 1;
    cover(frame);
    if (next && mix > 0) {
      context.globalAlpha = mix;
      cover(next);
      context.globalAlpha = 1;
    }
  }

  // Pendant le défilement, les images se fondent l'une dans l'autre : le mouvement reste continu. À l'arrêt,
  // l'image rejoint en douceur la plus proche (sans quoi un geste rapide, comme le maillet, resterait en double).
  // Le temps vient de requestAnimationFrame et de performance.now() : il suit l'horloge de la page.
  const REST = 120; // ms sans nouvelle position : le défilement est arrêté
  const SETTLE = 220; // ms pour rejoindre l'image la plus proche
  let lastDraw = 0;
  let settling = 0;
  let previous = 0;
  function settle(time: number) {
    settling = 0;
    if (stopped) return;
    const target = Math.round(wanted);
    if (time - lastDraw >= REST && wanted !== target) {
      const step = (Math.max(time - previous, 0) / SETTLE) || 0.08;
      wanted = Math.abs(target - wanted) <= step ? target : wanted + Math.sign(target - wanted) * step;
      paint();
    }
    previous = time;
    if (wanted !== Math.round(wanted) || time - lastDraw < REST) settling = requestAnimationFrame(settle);
  }

  function draw(position: number) {
    wanted = position;
    lastDraw = performance.now();
    paint();
    if (!settling) {
      previous = lastDraw;
      settling = requestAnimationFrame(settle);
    }
  }

  // Inutile de dessiner plus fin que les images : le canvas prend la taille de l'écran, plafonnée à la leur.
  let lastWidth = 0;
  let lastHeight = 0;
  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (!width || !height || (width === lastWidth && height === lastHeight)) return;
    lastWidth = width;
    lastHeight = height;
    const reference = frames.find(Boolean);
    const ratio = Math.min(window.devicePixelRatio, reference ? reference.naturalWidth / width : 1.5, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    shown = "";
    paint();
  }

  // On attend que l'image soit chargée, puis decode() la prépare à l'avance (sans quoi le navigateur la
  // décoderait en plein scroll). Certains navigateurs font traîner decode() : au-delà de 1,5 s, on passe outre
  // plutôt que de rester bloqué sur la première image.
  async function load(index: number) {
    const image = new Image();
    image.src = `${folder}/${pad(index)}.webp`;
    const loaded = await new Promise<boolean>((resolve) => {
      if (image.complete && image.naturalWidth) return resolve(true);
      image.onload = () => resolve(true);
      image.onerror = () => resolve(false);
    });
    if (!loaded) return;
    await Promise.race([image.decode().catch(() => undefined), new Promise((resolve) => setTimeout(resolve, 1500))]);
    if (stopped) return;
    frames[index] = image;
    // Le nombre d'images prêtes, lisible de l'extérieur (l'enregistrement de l'aperçu attend la séquence entière).
    canvas.dataset.frames = String(frames.filter(Boolean).length);
    shown = "";
    paint();
  }

  async function loadAll() {
    await load(0);
    lastWidth = 0;
    resize();

    const all = Array.from({ length: count }, (_, index) => index).slice(1);
    const keyframes = all.filter((index) => index % KEYFRAME_STEP === 0 || index === count - 1);
    const others = all.filter((index) => !keyframes.includes(index));

    const run = async (queue: number[], lanes: number) => {
      await Promise.all(
        Array.from({ length: lanes }, async () => {
          while (!stopped && queue.length) await load(queue.shift()!);
        }),
      );
    };

    await run(keyframes, 4);
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (!connection?.saveData) await run(others, 6);
  }

  let started = false;
  function start() {
    if (started) return;
    started = true;
    void loadAll();
  }

  resize();
  window.addEventListener("resize", resize);
  if (autoStart) start();

  return {
    draw,
    start,
    destroy() {
      stopped = true;
      cancelAnimationFrame(settling);
      window.removeEventListener("resize", resize);
    },
  };
}
