// python.jsx — Terminal animada sin setState durante animación
// Técnica: refs + mutación directa del DOM → 0 re-renders tras la carga inicial
import { useState, useEffect, useRef } from 'react';

const CODE_LINES = [
  { text: '', delay: 0 },
  { text: '', delay: 100 },
  { text: '', delay: 200 },
  { text: '', delay: 300 },
  { text: '                  ___  ___      ',                               delay: 400,  style: 'snake-head', isSnake: true, snakeIndex: 0  },
  { text: '         \\/     /~  ╱    \\  ',                               delay: 500,  style: 'snake-tongue',isSnake: true, snakeIndex: 1, isTongue: true },
  { text: '          \\____|           \\  ',                              delay: 600,  style: 'snake-head', isSnake: true, snakeIndex: 2  },
  { text: '                 \\ _______/\\/ \\ ',                          delay: 700,  style: 'snake-body', isSnake: true, snakeIndex: 3  },
  { text: '                         `/\\/\\/\\                    \\',     delay: 800,  style: 'snake-body', isSnake: true, snakeIndex: 4  },
  { text: '                           |\\/\\/|                    \\',    delay: 900,  style: 'snake-body', isSnake: true, snakeIndex: 5  },
  { text: '                          /\\/\\//                      \\',   delay: 1000, style: 'snake-body', isSnake: true, snakeIndex: 6  },
  { text: '                         / / / /                       \\\\',  delay: 1100, style: 'snake-body', isSnake: true, snakeIndex: 7  },
  { text: '                       /      /                         \\ \\', delay: 1200, style: 'snake-body', isSnake: true, snakeIndex: 8  },
  { text: '                      /     /                            \\  \\',delay: 1300, style: 'snake-body', isSnake: true, snakeIndex: 9  },
  { text: '                    /     /             _----_            \\   \\',delay:1400, style: 'snake-body', isSnake: true, snakeIndex: 10 },
  { text: '                   /     /           _-~      ~-_         |   |', delay:1500, style: 'snake-body', isSnake: true, snakeIndex: 11 },
  { text: '                  (      (        _-~    _--_    ~-_     _/   |', delay:1600, style: 'snake-body', isSnake: true, snakeIndex: 12 },
  { text: '                   \\      ~-____-~    _-~    ~-_    ~-_-~    /',delay:1700, style: 'snake-tail', isSnake: true, snakeIndex: 13 },
  { text: '                     ~-_           _-~          ~-_       _-~', delay:1800, style: 'snake-tail', isSnake: true, snakeIndex: 14 },
  { text: '                        ~--______-~                ~-___-~',    delay:1900, style: 'snake-tail', isSnake: true, snakeIndex: 15 },
  { text: '', delay: 2100 },
  { text: '', delay: 2200 },
];

const TONGUES = [
  '         \\/     /~  ╱    \\  ',
  '         \\ /    /~  ╱    \\  ',
  '         \\  /   /~  ╱    \\  ',
  '         \\ /    /~  ╱    \\  ',
];

const renderBar = (p) => {
  const filled = Math.round((p / 100) * 24);
  return '│   ' + '█'.repeat(filled) + '░'.repeat(24 - filled) + `  ${p}%`;
};

export default function PythonTerminal() {
  const [lines, setLines]   = useState([]);     // único estado — sólo para renderizar las líneas

  /* Refs para mutación directa del DOM — cero re-renders */
  const wrapperRef    = useRef(null);
  const terminalRef   = useRef(null);
  const tongueRef     = useRef(null);
  const projBarRef    = useRef(null);
  const clientBarRef  = useRef(null);
  const dotRef        = useRef(null);
  const snakeRefs     = useRef({});             // snakeIndex → DOM element

  const rafRef        = useRef(null);
  const phaseRef      = useRef(0);
  const mountedRef    = useRef(true);

  /* ── 1. Mostrar líneas una a una (efecto typewriter, una sola vez) ── */
  useEffect(() => {
    const timers = CODE_LINES.map((line) =>
      setTimeout(() => {
        if (!mountedRef.current) return;
        setLines(prev => [...prev, line]);
      }, line.delay)
    );
    return () => {
      timers.forEach(clearTimeout);
      mountedRef.current = false;
    };
  }, []);

  /* ── 2. Wave animation — RAF + mutación directa, CERO setState ───── */
  useEffect(() => {
    const tick = () => {
      if (!mountedRef.current) return;
      phaseRef.current = (phaseRef.current + 0.05) % (Math.PI * 2);
      const mobile = window.innerWidth < 768;
      const base = mobile ? 1.5 : 3;
      for (let i = 0; i <= 15; i++) {
        const el = snakeRefs.current[i];
        if (!el) continue;
        const amp = base + Math.pow(i / 16, 2) * (mobile ? 4 : 10);
        el.style.transform = `translateX(${Math.sin(phaseRef.current + i * 0.3) * amp}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── 3. Tongue — interval + mutación directa ────────────────────── */
  useEffect(() => {
    let tp = 0;
    const id = setInterval(() => {
      if (tongueRef.current) tongueRef.current.textContent = TONGUES[tp % 4];
      tp++;
    }, 150);
    return () => clearInterval(id);
  }, []);

  /* ── 4. Barras y dots — arrancan al entrar en viewport ──────────── */
  useEffect(() => {
    let proj = 0, client = 0, barsInt = null;

    const startBars = () => {
      if (barsInt) return;
      barsInt = setInterval(() => {
        let done = true;
        if (proj < 92)  { proj++;   if (projBarRef.current)   projBarRef.current.textContent   = renderBar(proj);   done = false; }
        if (client < 100) { client++; if (clientBarRef.current) clientBarRef.current.textContent = renderBar(client); done = false; }
        if (done) clearInterval(barsInt);
      }, 20);
    };

    let dp = 0;
    const LABELS = ['ONLINE', 'DISPONIBLE', 'OK'];
    const dotInt = setInterval(() => {
      if (dotRef.current)
        dotRef.current.textContent = '│   ' + LABELS.map((l, i) => dp === i ? `● ${l}` : `○ ${l}`).join('  ');
      dp = (dp + 1) % 3;
    }, 500);

    /* IntersectionObserver para entrada y para disparar barras */
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        wrapperRef.current?.classList.add('is-visible');
        startBars();
      }
    }, { threshold: 0.1 });

    if (terminalRef.current) obs.observe(terminalRef.current);

    return () => {
      clearInterval(barsInt);
      clearInterval(dotInt);
      obs.disconnect();
    };
  }, []);

  return (
    <>
      <header className="py-header">
        <div className="py-container">

          {/* El wrapper tiene la clase is-visible añadida por IntersectionObserver */}
          <div ref={wrapperRef} className="py-anim-wrapper">
            <div ref={terminalRef} className="py-terminal">

              {/* Barra de título */}
              <div className="py-bar">
                <div className="py-dots">
                  <span className="py-dot py-dot--red" />
                  <span className="py-dot py-dot--yellow" />
                  <span className="py-dot py-dot--green" />
                </div>
                <span className="py-title">python_digital.py</span>
              </div>

              {/* Cuerpo */}
              <div className="py-body">
                <div className="py-content">

                  {/* Serpiente */}
                  <div className="py-snake-wrap">
                    <div className="py-snake">
                      {lines.map((line, idx) => (
                        <div
                          key={idx}
                          className={`py-snake-line ${line.style || ''}`}
                          ref={el => {
                            if (el && line.isSnake && line.snakeIndex !== undefined)
                              snakeRefs.current[line.snakeIndex] = el;
                          }}
                          style={{ transition: 'transform 0.05s linear' }}
                        >
                          {line.isTongue
                            ? <span ref={tongueRef}>{line.text}</span>
                            : line.text
                          }
                          {line.snakeIndex === 0 && <span className="py-eye">●</span>}
                          {idx === lines.length - 1 && line.text && <span className="py-cursor" />}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Stats — solo el span interno cambia, el pre es estático */}
                  <div className="py-stats">
                    <pre className="py-stat">
{`┌──────────────────────────────────┐
│     PROYECTOS COMPLETADOS        │
`}<span ref={projBarRef}>{renderBar(0)}</span>{`
└──────────────────────────────────┘`}
                    </pre>

                    <pre className="py-stat">
{`┌──────────────────────────────────┐
│     CLIENTES SATISFECHOS         │
`}<span ref={clientBarRef}>{renderBar(0)}</span>{`
└──────────────────────────────────┘`}
                    </pre>

                    <pre className="py-stat">
{`┌──────────────────────────────────┐
│         SOPORTE 24/7             │
`}<span ref={dotRef}>{`│   ○ ONLINE  ○ DISPONIBLE  ○ OK`}</span>{`
└──────────────────────────────────┘`}
                    </pre>
                  </div>

                </div>
              </div>

              {/* Footer */}
              <div className="py-footer">
                <button className="py-btn" onClick={() => window.location.href = '/contacto'}>
                  <span className="py-btn__icon">►</span>
                  <span>INICIAR CONTACTO</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      <style>{`
        /* ── Wrapper de animación de entrada ── */
        .py-anim-wrapper {
          opacity: 0;
          transform: translateY(60px) rotateX(14deg) scale(0.92);
          transition: opacity .8s cubic-bezier(0.22,1,0.36,1),
                      transform .8s cubic-bezier(0.22,1,0.36,1);
          perspective: 1200px;
        }
        .py-anim-wrapper.is-visible {
          opacity: 1;
          transform: translateY(0) rotateX(0deg) scale(1);
        }

        .py-header {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          padding: 2rem 1rem;
        }
        .py-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        /* ── Terminal ── */
        .py-terminal {
          background: linear-gradient(135deg, rgba(15,23,42,0.92), rgba(0,0,0,0.96));
          border-radius: 1rem;
          border: 2px solid rgba(212,175,55,0.38);
          box-shadow: 0 10px 40px rgba(0,0,0,0.4);
          overflow: hidden;
          will-change: auto;
        }

        /* Barra título */
        .py-bar {
          background: #222220;
          padding: .7rem 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 1px solid rgba(212,175,55,0.28);
        }
        .py-dots { display: flex; gap: .45rem; }
        .py-dot  { width: .72rem; height: .72rem; border-radius: 50%; }
        .py-dot--red    { background: #ef4444; }
        .py-dot--yellow { background: #eab308; }
        .py-dot--green  { background: #22c55e; }
        .py-title { color: #d4af37; font-size: .78rem; font-family: monospace; }

        /* Cuerpo */
        .py-body {
          padding: 1.5rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: .9rem;
          min-height: 320px;
          background: #030C1D;
        }
        .py-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        /* Serpiente */
        .py-snake-wrap {
          width: 100%;
          overflow: hidden;
          display: flex;
          justify-content: center;
        }
        .py-snake {
          font-size: .9rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-variant-ligatures: none;
          letter-spacing: 0;
          white-space: pre;
        }
        .py-snake-line { line-height: 1; white-space: pre; position: relative; }
        .snake-head   { color: #d4af37; }
        .snake-tongue { color: #f4d03f; }
        .snake-body   { color: #d4af37; }
        .snake-tail   { color: #b8921f; }

        .py-eye {
          position: absolute;
          color: #d4af37;
          text-shadow: 0 0 10px #d4af37;
          left: 60%;
          top: 50%;
          animation: py-pulse 2s infinite;
        }
        .py-cursor {
          display: inline-block;
          width: .45rem;
          height: .9rem;
          background: #d4af37;
          margin-left: .25rem;
          vertical-align: text-bottom;
          animation: py-blink 1.2s step-end infinite;
        }

        /* Stats */
        .py-stats {
          display: flex;
          flex-direction: column;
          gap: .7rem;
          color: rgba(212,175,55,.72);
          font-size: .78rem;
          align-items: center;
        }
        .py-stat {
          line-height: 1.4;
          margin: 0;
          width: 100%;
        }

        /* Footer */
        .py-footer {
          background: #222220;
          padding: 1.25rem 1.5rem;
          border-top: 1px solid rgba(212,175,55,0.28);
          display: flex;
          justify-content: center;
        }
        .py-btn {
          background: linear-gradient(135deg, #d4af37, #b8921f);
          border: 2px solid #d4af37;
          color: #000;
          padding: .85rem 2rem;
          font-family: monospace;
          font-size: .88rem;
          font-weight: 700;
          border-radius: .5rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: .75rem;
          transition: transform .2s ease, box-shadow .2s ease;
          box-shadow: 0 4px 14px rgba(212,175,55,.28);
          position: relative;
          overflow: hidden;
        }
        .py-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.28), transparent);
          transform: translateX(-100%);
          transition: transform .5s ease;
        }
        .py-btn:hover::before { transform: translateX(100%); }
        .py-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(212,175,55,.45); }
        .py-btn__icon { animation: py-pulse 2s infinite; }

        /* Keyframes */
        @keyframes py-blink  { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes py-pulse  { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.18);opacity:.75} }

        /* Desktop 2 col */
        @media (min-width: 1280px) {
          .py-content { display: grid; grid-template-columns: auto 1fr; align-items: center; gap: 2rem; }
        }

        /* Mobile */
        @media (max-width: 768px) {
          .py-header { padding: 1rem .5rem; }
          .py-container { padding: 0 .5rem; }
          .py-body { padding: 1rem; min-height: 260px; font-size: .75rem; }
          .py-snake { font-size: .7rem; }
          .py-footer { padding: 1rem; }
          .py-stat { font-size: .68rem; }
        }
        @media (max-width: 480px) {
          .py-body { padding: .75rem; min-height: 220px; font-size: .7rem; }
          .py-stat { font-size: .62rem; }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .py-anim-wrapper { transition: none !important; opacity: 1 !important; transform: none !important; }
          .py-eye, .py-cursor, .py-btn__icon { animation: none !important; opacity: 1; }
          .py-snake-line { transition: none !important; }
        }
      `}</style>
    </>
  );
}
