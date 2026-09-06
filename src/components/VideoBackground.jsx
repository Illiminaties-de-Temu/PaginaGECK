import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { localizedPath } from '../i18n/routes';

/* Logo de Geck Codex en ASCII — telón del hero (reemplaza al video).
 * Ondas de luz diagonales en bucle + iluminación que sigue al cursor. */
const RAW_ASCII = `                                                                      ..:--:.
                                                               ...:-*#%%%#%#*+-:.
                                                        .:-=+*##%%%%%%%=. :*@%%%#*+-
                                                    .-=++++++*%@%%%%%%%#=-*%%%%%%@#-
                                                 :=**=-=+++**%%#@%%%%%%%@@@%%%%%#*=
                                              .-+*#%#*##+**%@@%++#%@@@@@%%##+=-:.
                                            .=*++=+*=+*--=*#*+=-..:=+++=-:.
                                          .-#*-+=**=*%*==-:
                                         :**#:=*#*#@#=.
                                        .**%###%=+*:                               ........
                                        =%@#+**@*:   .:=+*##**+-:.            .-=*##%%%%%%##**+-:
                                      .+@@%-=*%+  .-+%@@@@@@@@@@%%*=:.      -*%%@@@@%%%%%%%@@@@%%*=:
                                     .+@@@%*%%:  =#@@@@@@@@@@@%%%%@@%#-   -#@@@%%%%@@@@@@@@@%%%%%@@*:
                                     +@@@@@@%: .+@@@@%##****#%%@@@%@%=. :#@@@%%@@@%#*++==+*#%@@@@#=.
                                    =@@@@@@%- .*@@#+-.       .:-*%@#:  +@@@@@@@%#=:.       .:=#%+.
                                   .#@@@@@@+  =@#-               .=.  *@@@@@@%*:              ..
                                   -%@@@@@%- .*=.                    *@@@@@@%-
                                   +@@@@@@#. :-                     -@@@@@@%:
                                   +@@@@@@#. .                      ....:-+-
                                   +@@@@@@%:          -***********++++++=-:.
                                   =@@@@@@@=          -@@@@@@@@@@@@@@@@@@@@%*-
                                   :%@@@@@@*.         -@@@@@@@@@@@@@@@@@@@@@@@*:
                                    *@@@@@@@=         -%%%%%%%%%%%%%%%@@@@@@@@@#:
                                    :#@@@@@@%=        ..........  ....:+%@@@@@@@+
                                     -%@@@@@@@+.                 .*%#*: .#@@@@@@*.
                                      -%@@@@@@@#-               -#@@@@@= :@@@@@@*.            :-
                                       :#@@@@@@@@#=:        .:=#@@@@@@@= .%@@@@@+ .:.     .:=#@@*:
                                        .=%@@@@@@@@@%#*+++*#%@@@@@@@@%=  =@@@@@#: +@%#####%@@@@@@%*:
                                          .+%@@@@@@@@@@@@@@@@@@@@@@%+.  -@@@@@%- -%@@@@@@@@@@@@@@@@*:
                                            .-*%@@@@@@@@@@@@@@@@@#=.  .+@@@@@%- :%@@@@@@@@@@@@@@%+-.
                                               .:=+#%%@@@@@@%%*=:   :*@@@@@@*.  -+*#%%%%%%##*+-:.
                                                     ..:::::..      :+#@@#=:         ...
                                                                       ::`;

/* Quita la sangría común (margen izquierdo uniforme) para que el dibujo
 * quede realmente centrado dentro de su caja, no desplazado a la derecha. */
const ASCII = (() => {
  const lines = RAW_ASCII.split('\n');
  const indents = lines
    .filter((l) => l.trim().length)
    .map((l) => l.length - l.trimStart().length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min)).join('\n');
})();

/* Azar determinista por posición (estable entre renders → no reinicia el
 * parpadeo). Devuelve un valor en [0,1). */
const rnd = (seed) => {
  const x = Math.sin(seed) * 43758.5453;
  return x - Math.floor(x);
};

/* Ruido de valor 2D: valores aleatorios en una rejilla gruesa, interpolados
 * suavemente. Da "manchas" orgánicas (vecinos parecidos) pero SIN dirección
 * global → cada región tiene un tiempo propio, no un orden secuencial. */
const smoothstep = (t) => t * t * (3 - 2 * t);
const lattice = (i, j) => rnd(i * 374761 + j * 668265 + 11);
const valueNoise = (x, y) => {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const sx = smoothstep(x - x0);
  const sy = smoothstep(y - y0);
  const a = lattice(x0, y0) + (lattice(x0 + 1, y0) - lattice(x0, y0)) * sx;
  const b = lattice(x0, y0 + 1) + (lattice(x0 + 1, y0 + 1) - lattice(x0, y0 + 1)) * sx;
  return a + (b - a) * sy; // [0,1)
};

/* Parte una frase en 'lead' (todo menos la última palabra, fino/tenue) + 'key'
 * (la última palabra, en peso display). Si es una sola palabra, va solo el key.
 * 'Lo que hacemos' → { lead: 'Lo que', key: 'hacemos' }. Funciona en es/en/pt. */
const splitDisplay = (text) => {
  const words = text.trim().split(/\s+/);
  if (words.length === 1) return { lead: '', key: words[0] };
  return { lead: words.slice(0, -1).join(' '), key: words[words.length - 1] };
};

export default function VideoBackground({ children, lang }) {
  const { t } = useLanguage(lang);
  const hero = t.heroAscii;

  /* ── ASCII carácter por carácter: cada carácter recibe una "fase" tomada de
   * un RUIDO DE VALOR (manchas orgánicas, vecinos parecidos pero sin dirección
   * global). Así una región del gecko se enciende junta, y distintas regiones
   * lo hacen en tiempos propios e impredecibles — nunca se siente un orden.
   * Como las fases cubren todo [0,1), siempre hay alguna zona encendida. */
  const asciiNodes = useMemo(() => {
    const D = 6;            // duración del ciclo (debe coincidir con la del CSS)
    const STEP = 0.25;      // cuantización del retardo, en segundos
    const cellsX = 3;       // nº de manchas a lo ancho
    const cellsY = 4;       // nº de manchas a lo alto
    const lines = ASCII.split('\n');
    const rowsN = lines.length;
    const colsN = Math.max(...lines.map((l) => l.length));

    const nodes = [];
    lines.forEach((line, r) => {
      const rn = r / Math.max(rowsN - 1, 1);
      /* Un <span> por carácter eran 1.121 elementos animando opacidad a la vez.
       * El ruido hace que los vecinos compartan casi la misma fase, así que se
       * cuantiza el retardo a pasos de STEP y los caracteres contiguos que caen
       * en el mismo paso viajan dentro de UN solo span. Los espacios no pintan
       * glifo, así que se pegan al tramo vivo en vez de partirlo. Mismo efecto
       * a la vista, ~3× menos nodos que animar y repintar. */
      let run = '';
      let runDelay = null;
      let key = 0;

      const flush = () => {
        if (!run) return;
        if (runDelay === null) {
          nodes.push(run);    // tramo de solo espacios: texto plano, sin span
        } else {
          nodes.push(
            <span
              key={`${r}-${key++}`}
              className="ascii-ch"
              style={{ animationDelay: `-${runDelay}s` }}
            >
              {run}
            </span>
          );
        }
        run = '';
        runDelay = null;
      };

      Array.from(line).forEach((chr, c) => {
        if (chr === ' ') { run += ' '; return; }
        const cn = c / Math.max(colsN - 1, 1);
        const phase = valueNoise(cn * cellsX, rn * cellsY);
        const delay = (Math.round((phase * D) / STEP) * STEP).toFixed(2);
        if (runDelay !== null && delay !== runDelay) flush();
        runDelay = delay;
        run += chr;
      });
      flush();
      nodes.push('\n');
    });
    return nodes;
  }, []);

  /* Lo que inflaba la home no era el dibujo (2,9 KB de texto) sino el millar de
   * <span style="animation-delay"> que lo envolvían. Así que se separan las dos
   * capas: el <pre> plano SÍ va en el HTML del servidor —el hero es el elemento
   * LCP y esperar a que React hidrate para pintarlo era la razón de que tardara
   * una eternidad en aparecer— y la capa animada carácter a carácter lo
   * sustituye en cuanto hay hidratación. */
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  /* ── Rotación sincronizada: frase (izq) y servicio (der), rodillos en
   * direcciones opuestas. Un solo contador alimenta ambos índices. ── */
  const reduce = useReducedMotion();
  const labels = hero.labels;
  const services = hero.services;
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, [reduce]);
  /* Reinicia al cambiar de idioma */
  useEffect(() => { setTick(0); }, [labels, services]);
  const labelIdx = tick % labels.length;
  const svcIdx = tick % services.length;
  const labelParts = splitDisplay(labels[labelIdx]);
  const svcParts = splitDisplay(services[svcIdx]);

  /* ── Cursor con inercia + foco de iluminación + parallax marcado ──
   * Un solo rAF suaviza todo: el anillo personalizado sigue el mouse con
   * easing y crece sobre los enlaces; un foco radial revela el ASCII brillante
   * bajo el cursor; y el ASCII/los textos se desplazan en sentidos opuestos. */
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const spotRef = useRef(null);
  const contentRef = useRef(null);
  const labelRef = useRef(null);
  const servicesRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    const spot = spotRef.current;
    const content = contentRef.current;
    const labelEl = labelRef.current;
    const svcEl = servicesRef.current;
    if (!section || !wrap || !spot) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lerp = (a, b, t) => a + (b - a) * t;
    const targ = { nx: 0, ny: 0, px: innerWidth / 2, py: innerHeight / 2, on: 0 };
    const cur = { ...targ };
    let raf = 0;

    /* Caja del logo SIN el parallax aplicado. Medirla dentro del bucle era leer
     * el layout justo después de escribirlo (thrashing): el navegador tenía que
     * recalcular la página entera en cada fotograma. Se mide aquí y el
     * desplazamiento del parallax, que ya conocemos, se suma a mano. */
    let box = { left: 0, top: 0, width: 1, height: 1 };
    let secBox = { left: 0, top: 0, width: 1, height: 1 };
    const measure = () => {
      const prev = wrap.style.transform;
      wrap.style.transform = 'none';
      const r = spot.getBoundingClientRect();
      const sr = section.getBoundingClientRect();
      wrap.style.transform = prev;
      if (r.width && r.height) box = { left: r.left, top: r.top, width: r.width, height: r.height };
      if (sr.width && sr.height) secBox = { left: sr.left, top: sr.top, width: sr.width, height: sr.height };
    };

    let visible = false;
    let running = false;
    const startLoop = () => {
      if (running || !visible) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => { running = false; cancelAnimationFrame(raf); };

    const frame = () => {
      cur.nx = lerp(cur.nx, targ.nx, 0.09);
      cur.ny = lerp(cur.ny, targ.ny, 0.09);
      cur.px = lerp(cur.px, targ.px, 0.2);
      cur.py = lerp(cur.py, targ.py, 0.2);
      cur.on = lerp(cur.on, targ.on, 0.12);

      const dx = -cur.nx * 55;
      const dy = -cur.ny * 45;

      /* Foco: posición relativa a la capa del logo (centrada) */
      wrap.style.setProperty('--mx', (((cur.px - (box.left + dx)) / box.width) * 100).toFixed(2) + '%');
      wrap.style.setProperty('--my', (((cur.py - (box.top + dy)) / box.height) * 100).toFixed(2) + '%');
      wrap.style.setProperty('--spotO', cur.on.toFixed(3));

      /* Hero ESTÁTICO: no hay salida por scroll. El gecko y los textos se quedan
       * fijos (solo parallax sutil del mouse). El hero ya no se desvanece ni se
       * desplaza al hacer scroll; simplemente se sale de pantalla con la página. */
      wrap.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
      if (content) content.style.transform = `translate(${(cur.nx * 26).toFixed(1)}px, ${(cur.ny * 20).toFixed(1)}px)`;

      /* Quieto = nada que animar. Sin esta salida el bucle seguía reescribiendo
       * la máscara radial 60 veces por segundo con el ratón parado, y cada
       * escritura obliga a repintar el logo entero. */
      const settled =
        Math.abs(cur.nx - targ.nx) < 0.001 && Math.abs(cur.ny - targ.ny) < 0.001 &&
        Math.abs(cur.px - targ.px) < 0.3   && Math.abs(cur.py - targ.py) < 0.3 &&
        Math.abs(cur.on - targ.on) < 0.002;
      if (settled) { running = false; return; }
      if (running) raf = requestAnimationFrame(frame);
    };

    /* Sin getBoundingClientRect aquí: el mousemove se dispara decenas de veces
     * por segundo y cada lectura forzaba un recálculo de layout completo. */
    const onMove = (e) => {
      targ.nx = ((e.clientX - secBox.left) / secBox.width) * 2 - 1;
      targ.ny = ((e.clientY - secBox.top) / secBox.height) * 2 - 1;
      targ.px = e.clientX;
      targ.py = e.clientY;
      targ.on = 1;
      startLoop();
    };
    const onLeave = () => { targ.on = 0; targ.nx = 0; targ.ny = 0; startLoop(); };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);

    // Una vez que el hero sale de pantalla no hay nada que animar → ni arranca.
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        if (visible) { measure(); startLoop(); } else stopLoop();
      },
      { rootMargin: '100px' }
    );
    io.observe(section);

    const onResize = () => { measure(); startLoop(); };
    addEventListener('resize', onResize);
    addEventListener('scroll', onResize, { passive: true });

    return () => {
      io.disconnect();
      removeEventListener('resize', onResize);
      removeEventListener('scroll', onResize);
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      wrap.style.transform = '';
      wrap.style.opacity = '';
      if (content) { content.style.transform = ''; content.style.opacity = ''; }
      if (labelEl) { labelEl.style.transform = ''; labelEl.style.opacity = ''; }
      if (svcEl) { svcEl.style.transform = ''; svcEl.style.opacity = ''; }
    };
    // `mounted`: el ASCII no existe en el primer render, así que el efecto debe
    // volver a correr cuando aparece (si no, `spot` sería null para siempre).
  }, [mounted]);

  return (
    <>
      <section ref={sectionRef} className="hero-section">
       <div className="hero-sticky">

        {/* ASCII de fondo — caracteres que se encienden al azar + foco del cursor */}
        <div ref={wrapRef} className="hero-ascii-wrapper">
          {/* Telón base: existe ya en la respuesta del servidor, así que el hero
              pinta sin esperar al bundle de React. Lo releva la capa animada. */}
          {!mounted && <pre className="hero-ascii hero-ascii--base" aria-hidden="true">{ASCII}</pre>}
          {mounted && (
            <>
              <div className="hero-ascii hero-ascii--chars" aria-hidden="true">{asciiNodes}</div>
              <pre ref={spotRef} className="hero-ascii hero-ascii--cursor" aria-hidden="true">{ASCII}</pre>
            </>
          )}
        </div>

        {/* 3 tercios: frase rotando (izq) · logo ASCII (medio) · servicio rotando (der) */}
        <div ref={contentRef} className="hero-content-wrapper">
          {/* Tercio 1 — rodillo INVERTIDO: entra desde abajo, sale por arriba.
              Es un <p>, no un <h1>: su texto rota ("Lo que hacemos", "Lo que
              creamos"…) y no describe la página. El H1 real de la home vive en
              index.astro, dentro del HTML estático, para que exista aunque
              React no se hidrate. */}
          <p ref={labelRef} className="hero-label">
            <span className="hero-rotator">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={labelIdx}
                  className="hero-rotator-word"
                  initial={reduce ? false : { y: '110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: '-110%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="hero-word-lead">{labelParts.lead || ' '}</span>
                  <span className="hero-word-key">{labelParts.key}</span>
                </motion.span>
              </AnimatePresence>
            </span>
          </p>

          {/* Tercio 3 — rodillo: entra desde arriba, sale por abajo */}
          <a ref={servicesRef} href={localizedPath("services", lang)} className="hero-services" aria-label={`${labels[labelIdx]}: ${services[svcIdx]}`}>
            <span className="hero-rotator">
              <AnimatePresence initial={false} mode="wait">
                <motion.span
                  key={svcIdx}
                  className="hero-rotator-word"
                  initial={reduce ? false : { y: '-110%', opacity: 0 }}
                  animate={{ y: '0%', opacity: 1 }}
                  exit={reduce ? { opacity: 0 } : { y: '110%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className="hero-word-lead">{svcParts.lead || ' '}</span>
                  <span className="hero-word-key">{svcParts.key}</span>
                </motion.span>
              </AnimatePresence>
            </span>
          </a>
          {children}
        </div>

       </div>
      </section>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          /* Hero estático: ocupa una pantalla. Sin recorrido de scrollytelling. */
          height: 100vh;
          background: var(--background);
          /* Color del ASCII según el modo: navy en claro, marfil en oscuro.
           * --ascii-glow = color de la CRESTA de la onda (más brillante que la tinta). */
          --ascii-ink: var(--navy-dark);
          --ascii-glow: #061224;
        }
        /* Capa fija: el gecko y las palabras se quedan en pantalla mientras
         * dura el recorrido del hero (sticky stack). */
        .hero-sticky {
          position: sticky;
          top: 0;
          height: 100vh;
          overflow: hidden;
        }
        :root[data-theme="dark"] .hero-section {
          --ascii-ink: var(--brand-ivory);
          --ascii-glow: #ffffff;
        }

        /* ── ASCII ── (centrado; el texto del titular va por encima) */
        .hero-ascii-wrapper {
          --mx: 50%;
          --my: 50%;
          --spotO: 0;
          --spot: clamp(120px, 14vw, 240px);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          will-change: transform;
        }

        .hero-ascii {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          margin: 0;
          font-family: 'Courier New', ui-monospace, monospace;
          font-size: clamp(4px, 1.32vw, 18px);
          line-height: 1.02;
          letter-spacing: 0;
          white-space: pre;
          color: var(--ascii-ink);
          pointer-events: none;
          user-select: none;
        }

        /* Cada carácter descansa en un piso tenue (--ascii-floor) para que el
         * logo siempre se intuya, y se ENCIENDE al máximo cuando lo alcanza el
         * pulso radial (el retardo por distancia al centro va inline). */
        /* El glow vive en la capa, no en cada tramo: heredado se ve igual y el
         * navegador no promueve cientos de elementos a capa propia (un will-change
         * por carácter creaba ~1.100 capas de composición y ahogaba la GPU). */
        .hero-ascii--chars { text-shadow: 0 0 6px var(--ascii-glow); }
        .ascii-ch {
          --ascii-floor: 0.18;
          opacity: var(--ascii-floor);
          animation: ascii-pulse 6s ease-in-out infinite;
        }
        /* Telón estático previo a la hidratación: el mismo piso de opacidad con
         * el que arrancan los tramos animados, para que el relevo no dé un salto. */
        .hero-ascii--base {
          opacity: 0.18;
          text-shadow: 0 0 6px var(--ascii-glow);
        }
        @keyframes ascii-pulse {
          0%   { opacity: var(--ascii-floor); }
          18%  { opacity: 1; }
          40%  { opacity: 1; }
          62%  { opacity: var(--ascii-floor); }
          100% { opacity: var(--ascii-floor); }
        }

        /* Capa CURSOR — copia del logo brillante revelada por un foco radial que
         * sigue al mouse → al pasar el cursor, el ASCII se ilumina debajo. */
        .hero-ascii--cursor {
          color: var(--ascii-glow);
          text-shadow: 0 0 8px var(--ascii-glow);
          opacity: var(--spotO, 0);
          -webkit-mask-image: radial-gradient(
            circle var(--spot) at var(--mx) var(--my),
            #000 0%, rgba(0,0,0,0.5) 46%, transparent 72%
          );
                  mask-image: radial-gradient(
            circle var(--spot) at var(--mx) var(--my),
            #000 0%, rgba(0,0,0,0.5) 46%, transparent 72%
          );
        }


        /* ── Contenido: 3 tercios (frase · ASCII en medio · servicio) ── */
        .hero-content-wrapper {
          position: absolute;
          inset: 0;
          z-index: 10;
          will-change: transform, opacity;
          display: grid;
          grid-template-columns: 1fr 1.25fr 1fr;
          align-items: center;
          column-gap: clamp(1rem, 3vw, 2.5rem);
          padding: 0 clamp(1.6rem, 3.5vw, 3rem);
          pointer-events: none;
        }

        /* Los dos textos laterales: tratamiento display a 2 líneas para que se
         * impongan junto al ASCII (el tamaño/peso vive en .hero-word-*). */
        .hero-label,
        .hero-services {
          min-width: 0;
          will-change: transform, opacity;
          animation: hero-copy-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes hero-copy-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Tercio 1: frase estática (centrada en su columna) */
        .hero-label {
          grid-column: 1;
          margin: 0;
          text-align: center;
          color: var(--text);
        }

        /* Tercio 3: servicio que rota — dorado en claro, marfil en oscuro */
        .hero-services {
          grid-column: 3;
          justify-self: center;
          text-align: center;
          pointer-events: auto;
          text-decoration: none;
          color: var(--accent-text);
        }
        :root[data-theme="dark"] .hero-services { color: var(--text); }

        /* Rodillo vertical: la caja recorta y cada palabra (2 líneas) entra/sale
         * en vertical. La comparten ambos tercios (la dirección la define el motion). */
        .hero-rotator {
          display: block;
          overflow: hidden;
          height: clamp(4rem, 8.5vw, 6.4rem);
          width: 100%;
        }
        .hero-rotator-word {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 0.1em;
          will-change: transform, opacity;
        }
        /* Línea fina/tenue (todo menos la última palabra) */
        .hero-word-lead {
          font-size: clamp(0.9rem, 1.6vw, 1.45rem);
          font-weight: 300;
          line-height: 1;
          letter-spacing: 0.005em;
          color: var(--text-muted);
          white-space: nowrap;
        }
        /* Palabra clave en peso display — eco luminoso al ASCII */
        .hero-word-key {
          font-size: clamp(1.9rem, 4vw, 3.3rem);
          font-weight: 900;
          line-height: 0.9;
          letter-spacing: -0.03em;
          text-transform: uppercase;
          white-space: nowrap;
          text-shadow: 0 1px 24px rgba(0, 0, 0, 0.18);
        }
        .hero-services:hover { opacity: 0.82; }

        /* ── Tablet/Mobile: se apila (frase arriba · ASCII medio · servicio abajo) ── */
        @media (max-width: 768px) {
          .hero-section { height: 100vh; }
          .hero-ascii {
            font-size: clamp(3px, 2.05vw, 9px);
          }
          .hero-content-wrapper {
            grid-template-columns: 1fr;
            align-content: space-between;
            padding: clamp(7rem, 14vh, 9rem) clamp(1.4rem, 5vw, 2rem) clamp(4rem, 10vh, 6rem);
          }
          .hero-label    { grid-column: 1; }
          .hero-services { grid-column: 1; justify-self: center; }
          .hero-rotator  { height: clamp(3.4rem, 17vw, 5rem); }
          .hero-word-key  { font-size: clamp(1.7rem, 8.5vw, 2.8rem); }
          .hero-word-lead { font-size: clamp(0.85rem, 3.6vw, 1.2rem); }
        }

        /* Sin movimiento: logo completamente visible y estático */
        @media (prefers-reduced-motion: reduce) {
          /* Sin scrollytelling: el hero vuelve a 100vh estático (sin hueco) */
          .hero-section { height: 100vh; }
          .hero-sticky { position: relative; }
          .hero-label, .hero-services { animation: none !important; }
          /* Sin parpadeo: el logo se muestra completo y estático */
          .ascii-ch {
            animation: none !important;
            opacity: 0.85;
            text-shadow: none;
          }
          /* Servicio: no rota (interval desactivado vía useReducedMotion) */
        }
      `}</style>
    </>
  );
}
