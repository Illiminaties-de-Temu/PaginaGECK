import { useEffect, useRef, useState } from 'react';
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

export default function VideoBackground({ children }) {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const cursorRef = useRef(null);
  const target = useRef({ x: 0.5, y: 0.42 });
  const cur = useRef({ x: 0.5, y: 0.42 });
  const rafRef = useRef(0);
  const hoverRef = useRef(false);
  const [hover, setHover] = useState(false);

  /* ── Iluminación que sigue al cursor (sobre las ondas) ──
   * Listeners en la SECCIÓN (recibe eventos por bubbling aunque el
   * contenido del hero esté por encima del ASCII). */
  useEffect(() => {
    const section = sectionRef.current;
    const wrap = wrapRef.current;
    const cursor = cursorRef.current;
    if (!section || !wrap || !cursor) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const loop = () => {
      cur.current.x += (target.current.x - cur.current.x) * 0.16;
      cur.current.y += (target.current.y - cur.current.y) * 0.16;
      wrap.style.setProperty('--mx', (cur.current.x * 100).toFixed(2) + '%');
      wrap.style.setProperty('--my', (cur.current.y * 100).toFixed(2) + '%');
      if (hoverRef.current) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = 0;
      }
    };

    const onMove = (e) => {
      const r = cursor.getBoundingClientRect();
      target.current = {
        x: (e.clientX - r.left) / r.width,
        y: (e.clientY - r.top) / r.height,
      };
      if (!rafRef.current) rafRef.current = requestAnimationFrame(loop);
    };
    const onEnter = () => { hoverRef.current = true; setHover(true); };
    const onLeave = () => { hoverRef.current = false; setHover(false); };

    section.addEventListener('mousemove', onMove);
    section.addEventListener('mouseenter', onEnter);
    section.addEventListener('mouseleave', onLeave);
    return () => {
      section.removeEventListener('mousemove', onMove);
      section.removeEventListener('mouseenter', onEnter);
      section.removeEventListener('mouseleave', onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <section ref={sectionRef} className="hero-section">

        {/* ASCII de fondo — base + ondas + foco del cursor */}
        <div ref={wrapRef} className={`hero-ascii-wrapper${hover ? ' is-hover' : ''}`}>
          <pre className="hero-ascii hero-ascii--base" aria-hidden="true">{ASCII}</pre>
          <pre className="hero-ascii hero-ascii--wave" aria-hidden="true">{ASCII}</pre>
          <pre ref={cursorRef} className="hero-ascii hero-ascii--cursor" aria-hidden="true">{ASCII}</pre>
        </div>

        {/* Banda inferior: ubicación · tagline · coordenadas (misma altura) */}
        <div className="hero-content-wrapper">
          <div className="hero-bar">
            <span className="hero-meta hero-meta--l">
              <i className="hero-dot" />{t.heroAscii.location}
            </span>
            <p className="hero-tagline">{t.heroAscii.tagline}</p>
            <span className="hero-meta hero-meta--r" aria-hidden="true">{t.heroAscii.coords}</span>
          </div>
          {children}
        </div>

      </section>

      <style>{`
        .hero-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: var(--background);
          /* Color del ASCII según el modo: navy en claro, marfil en oscuro */
          --ascii-ink: var(--navy-dark);
        }
        :root[data-theme="dark"] .hero-section {
          --ascii-ink: var(--brand-ivory);
        }

        /* ── ASCII ── (ocupa la zona superior; el texto va siempre debajo) */
        .hero-ascii-wrapper {
          --mx: 50%;
          --my: 42%;
          --spot: clamp(150px, 17vw, 280px);
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: clamp(7rem, 18vh, 12rem);
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

        /* Capa base — siempre visible (logo legible) */
        .hero-ascii--base {
          opacity: 0.5;
        }

        /* Capa de ONDAS — bandas de luz diagonales en bucle */
        .hero-ascii--wave {
          opacity: 1;
          will-change: mask-position, -webkit-mask-position;
          -webkit-mask-image: repeating-linear-gradient(
            70deg,
            transparent 0px,
            transparent 70px,
            rgba(0,0,0,0.55) 110px,
            #000 132px,
            rgba(0,0,0,0.55) 154px,
            transparent 194px,
            transparent 260px
          );
                  mask-image: repeating-linear-gradient(
            70deg,
            transparent 0px,
            transparent 70px,
            rgba(0,0,0,0.55) 110px,
            #000 132px,
            rgba(0,0,0,0.55) 154px,
            transparent 194px,
            transparent 260px
          );
          animation: hero-wave 5s linear infinite;
        }

        /* Desplaza la máscara un período (260px sobre el eje a 70°)
         * → (sin70, -cos70) × 260 ≈ (244, -89) px, bucle perfecto */
        @keyframes hero-wave {
          from { -webkit-mask-position: 0px 0px;     mask-position: 0px 0px; }
          to   { -webkit-mask-position: 244px -89px; mask-position: 244px -89px; }
        }

        /* Capa CURSOR — foco radial que sigue al mouse (sobre las ondas) */
        .hero-ascii--cursor {
          opacity: 0;
          transition: opacity 0.35s ease;
          -webkit-mask-image: radial-gradient(
            circle var(--spot) at var(--mx) var(--my),
            #000 0%, rgba(0,0,0,0.55) 48%, transparent 74%
          );
                  mask-image: radial-gradient(
            circle var(--spot) at var(--mx) var(--my),
            #000 0%, rgba(0,0,0,0.55) 48%, transparent 74%
          );
        }
        .hero-ascii-wrapper.is-hover .hero-ascii--cursor {
          opacity: 1;
        }

        .hero-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--success);
          box-shadow: 0 0 8px var(--success);
          animation: hero-dot-pulse 2.2s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes hero-dot-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%      { opacity: 0.4; transform: scale(0.85); }
        }

        /* ── Contenido (banda inferior) ── */
        .hero-content-wrapper {
          position: relative;
          z-index: 10;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 0 clamp(1.6rem, 3.5vw, 2.8rem) clamp(3rem, 9vh, 6.5rem);
          pointer-events: none;
        }

        .hero-bar {
          width: 100%;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: clamp(1rem, 4vw, 3rem);
          animation: hero-copy-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes hero-copy-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hero-meta {
          display: inline-flex;
          align-items: center;
          gap: 0.55rem;
          font-family: 'Courier New', ui-monospace, monospace;
          font-size: clamp(0.78rem, 1.35vw, 1.02rem);
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent-text);
          white-space: nowrap;
        }
        .hero-meta--l { justify-self: start; }
        .hero-meta--r { justify-self: end; }

        .hero-tagline {
          justify-self: center;
          text-align: center;
          margin: 0;
          max-width: 760px;
          font-size: clamp(1.25rem, 3.2vw, 2.1rem);
          font-weight: 500;
          line-height: 1.4;
          color: var(--text);
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-bar { animation: none !important; }
          .hero-dot { animation: none !important; }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .hero-ascii {
            font-size: clamp(3px, 2.05vw, 9px);
          }
          .hero-ascii--base { opacity: 0.4; }
          .hero-meta { display: none; }
        }

        /* Sin movimiento: logo completamente visible y estático */
        @media (prefers-reduced-motion: reduce) {
          .hero-ascii--base { opacity: 0.85; }
          .hero-ascii--wave, .hero-ascii--cursor {
            animation: none !important;
            -webkit-mask-image: none;
                    mask-image: none;
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
