import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';

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

export default function VideoBackground({ children }) {
  const { t } = useLanguage();
  const hero = t.heroAscii;

  /* ── ASCII carácter por carácter: cada carácter recibe una "fase" tomada de
   * un RUIDO DE VALOR (manchas orgánicas, vecinos parecidos pero sin dirección
   * global). Así una región del gecko se enciende junta, y distintas regiones
   * lo hacen en tiempos propios e impredecibles — nunca se siente un orden.
   * Como las fases cubren todo [0,1), siempre hay alguna zona encendida. */
  const asciiNodes = useMemo(() => {
    const D = 6;            // duración del ciclo (debe coincidir con la del CSS)
    const cellsX = 3;       // nº de manchas a lo ancho
    const cellsY = 4;       // nº de manchas a lo alto
    const lines = ASCII.split('\n');
    const rowsN = lines.length;
    const colsN = Math.max(...lines.map((l) => l.length));

    const nodes = [];
    lines.forEach((line, r) => {
      const rn = r / Math.max(rowsN - 1, 1);
      Array.from(line).forEach((chr, c) => {
        if (chr === ' ') { nodes.push(' '); return; }
        const cn = c / Math.max(colsN - 1, 1);
        let phase = valueNoise(cn * cellsX, rn * cellsY);
        phase = (phase + rnd(r * 92821 + c * 53 + 7) * 0.03) % 1;
        const delay = (phase * D).toFixed(2);
        nodes.push(
          <span
            key={`${r}-${c}`}
            className="ascii-ch"
            style={{ animationDelay: `-${delay}s` }}
          >
            {chr}
          </span>
        );
      });
      nodes.push('\n');
    });
    return nodes;
  }, []);

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

    const frame = () => {
      cur.nx = lerp(cur.nx, targ.nx, 0.09);
      cur.ny = lerp(cur.ny, targ.ny, 0.09);
      cur.px = lerp(cur.px, targ.px, 0.2);
      cur.py = lerp(cur.py, targ.py, 0.2);
      cur.on = lerp(cur.on, targ.on, 0.12);

      /* Foco: posición relativa a la capa del logo (centrada) */
      const r = spot.getBoundingClientRect();
      wrap.style.setProperty('--mx', (((cur.px - r.left) / r.width) * 100).toFixed(2) + '%');
      wrap.style.setProperty('--my', (((cur.py - r.top) / r.height) * 100).toFixed(2) + '%');
      wrap.style.setProperty('--spotO', cur.on.toFixed(3));

      /* Scrollytelling: progreso sobre el recorrido alto del hero (0 arriba → 1
       * cuando termina). El gecko queda fijo (sticky) un instante y luego TODO
       * sale a la vez: las palabras se separan hacia afuera y el gecko sube +
       * escala, desvaneciéndose juntos hasta revelar el carrusel. */
      const sr = section.getBoundingClientRect();
      const travel = Math.max(1, sr.height - innerHeight);
      const sp = Math.max(0, Math.min(1, -sr.top / travel));
      const p = Math.max(0, Math.min(1, (sp - 0.12) / 0.78)); // hold inicial, luego salida única
      const xMax = innerWidth * 0.45;

      /* Palabras: se separan en sentidos opuestos + fade (sobre el parallax de mouse) */
      if (labelEl) {
        labelEl.style.transform = `translateX(${(-p * xMax).toFixed(1)}px)`;
        labelEl.style.opacity = (1 - p).toFixed(3);
      }
      if (svcEl) {
        svcEl.style.transform = `translateX(${(p * xMax).toFixed(1)}px)`;
        svcEl.style.opacity = (1 - p).toFixed(3);
      }

      /* Gecko ASCII: sale al mismo tiempo que las palabras (sube + escala + fade) */
      const asciiY = p * -120;
      const asciiScale = 1 - p * 0.12;
      wrap.style.transform = `translate(${(-cur.nx * 55).toFixed(1)}px, ${(-cur.ny * 45 + asciiY).toFixed(1)}px) scale(${asciiScale.toFixed(3)})`;
      wrap.style.opacity = (1 - p).toFixed(3);
      if (content) content.style.transform = `translate(${(cur.nx * 26).toFixed(1)}px, ${(cur.ny * 20).toFixed(1)}px)`;

      if (running) raf = requestAnimationFrame(frame);
    };

    const onMove = (e) => {
      const r = section.getBoundingClientRect();
      targ.nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      targ.ny = ((e.clientY - r.top) / r.height) * 2 - 1;
      targ.px = e.clientX;
      targ.py = e.clientY;
      targ.on = 1;
    };
    const onLeave = () => { targ.on = 0; targ.nx = 0; targ.ny = 0; };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseleave', onLeave);

    // El loop hace getBoundingClientRect + escrituras de estilo cada frame.
    // Una vez que el hero sale de pantalla no hay nada que animar → lo paramos.
    let running = false;
    const startLoop = () => { if (!running) { running = true; raf = requestAnimationFrame(frame); } };
    const stopLoop = () => { running = false; cancelAnimationFrame(raf); };
    const io = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? startLoop() : stopLoop(); },
      { rootMargin: '100px' }
    );
    io.observe(section);

    return () => {
      io.disconnect();
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf);
      wrap.style.transform = '';
      wrap.style.opacity = '';
      if (content) { content.style.transform = ''; content.style.opacity = ''; }
      if (labelEl) { labelEl.style.transform = ''; labelEl.style.opacity = ''; }
      if (svcEl) { svcEl.style.transform = ''; svcEl.style.opacity = ''; }
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="hero-section">
       <div className="hero-sticky">

        {/* ASCII de fondo — caracteres que se encienden al azar + foco del cursor */}
        <div ref={wrapRef} className="hero-ascii-wrapper">
          <div className="hero-ascii hero-ascii--chars" aria-hidden="true">{asciiNodes}</div>
          <pre ref={spotRef} className="hero-ascii hero-ascii--cursor" aria-hidden="true">{ASCII}</pre>
        </div>

        {/* 3 tercios: frase rotando (izq) · logo ASCII (medio) · servicio rotando (der) */}
        <div ref={contentRef} className="hero-content-wrapper">
          {/* Tercio 1 — rodillo INVERTIDO: entra desde abajo, sale por arriba */}
          <h1 ref={labelRef} className="hero-label">
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
          </h1>

          {/* Tercio 3 — rodillo: entra desde arriba, sale por abajo */}
          <a ref={servicesRef} href="/servicios" className="hero-services" aria-label={`${labels[labelIdx]}: ${services[svcIdx]}`}>
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
          /* Alto = recorrido del scrollytelling. La capa interna queda sticky. */
          height: 190vh;
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
        .ascii-ch {
          --ascii-floor: 0.18;
          opacity: var(--ascii-floor);
          color: var(--ascii-ink);
          text-shadow: 0 0 6px var(--ascii-glow);
          animation: ascii-pulse 6s ease-in-out infinite;
          will-change: opacity;
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
          .hero-section { height: 160vh; }
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
