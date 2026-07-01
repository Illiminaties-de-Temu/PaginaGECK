import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useSpring, useTransform, useReducedMotion, cubicBezier } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const STEP_NUMBERS = ['01', '02', '03', '04', '05'];
const EASE = cubicBezier(0.16, 1, 0.3, 1);

/* ── Geometría del "mundo" (sistema de coordenadas del árbol) ── */
const WORLD_OX = 340;          // centro horizontal del mundo
const TOP_PAD  = 240;
const GAP_Y    = 360;          // separación vertical entre nodos
const OFFSET_X = 210;          // cuánto se desvía un nodo a su lado
const ZOOM     = 1.18;         // acercamiento de la cámara

/* Posición de cada nodo en el mundo. La raíz (i=0) va al centro;
   los demás alternan derecha/izquierda como ramas. */
function nodePoints(n, offX) {
  return Array.from({ length: n }, (_, i) => {
    const dir = i === 0 ? 0 : (i % 2 === 1 ? 1 : -1);
    return { px: WORLD_OX + dir * offX, py: TOP_PAD + i * GAP_Y, side: dir < 0 ? 'left' : 'right' };
  });
}

/* ── Un nodo + su tarjeta. Aparece y se mantiene en foco; al pasar, se atenúa ── */
function TreeNode({ step, i, n, point, isRoot, progress, reduce }) {
  const gap    = 1 / (n - 1);
  const center = i * gap;
  const start  = center - gap * 0.7;
  const after  = Math.min(1, center + gap * 0.6);
  const isLast = i === n - 1;

  const opacity = useTransform(
    progress,
    [start, center, after],
    isLast ? [0, 1, 1] : [0, 1, 0.4]
  );
  const scale = useTransform(progress, [start, center], [0.55, 1], { ease: EASE });

  return (
    <motion.div
      className={`ptz-group ptz-group--${point.side}`}
      style={{
        left: point.px,
        top: point.py,
        opacity: reduce ? 1 : opacity,
        scale: reduce ? 1 : scale,
      }}
    >
      <div className={`ptz-node${isRoot ? ' ptz-node--root' : ''}`}>
        <span className="ptz-node__num">{step.number}</span>
        {isRoot && <span className="ptz-node__pulse" aria-hidden="true" />}
      </div>
      <div className="ptz-card">
        <h3 className="ptz-card__title">{step.title}</h3>
        <p className="ptz-card__desc">{step.description}</p>
      </div>
    </motion.div>
  );
}

export default function ProcessTimeline() {
  const { t } = useLanguage();
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const steps = t.process.steps.map((s, i) => ({ number: STEP_NUMBERS[i], ...s }));
  const N = steps.length;
  const worldW = WORLD_OX * 2;
  const worldH = TOP_PAD + (N - 1) * GAP_Y + TOP_PAD;

  const [stage, setStage] = useState(() => ({
    w: typeof window !== 'undefined' ? window.innerWidth : 1280,
    h: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));

  /* Zoom y desvío de ramas adaptados al ancho disponible */
  const narrow = stage.w < 860;
  const zoom = narrow ? 1.0 : ZOOM;
  const points = nodePoints(N, narrow ? 130 : OFFSET_X);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      setStage({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 80, damping: 26, mass: 0.4, restDelta: 0.001,
  });

  /* Cámara: centra y enfoca el nodo activo (pan vertical/horizontal con zoom fijo).
     En móvil la tarjeta cuelga DEBAJO del nodo, así que el punto de enfoque se
     baja (focusY) para que el grupo nodo+tarjeta quede centrado y legible, sin
     que la tarjeta se desborde por abajo. */
  const focusY = narrow ? 120 : 0;
  const input = points.map((_, i) => i / (N - 1));
  const txArr = points.map((p) => stage.w / 2 - p.px * zoom);
  const tyArr = points.map((p) => stage.h / 2 - (p.py + focusY) * zoom);
  const camX = useTransform(progress, input, txArr);
  const camY = useTransform(progress, input, tyArr);

  /* El tronco (ramas) se dibuja conforme baja la cámara */
  const trunkLen = useSpring(scrollYProgress, { stiffness: 90, damping: 30, restDelta: 0.001 });
  const pathD = points.map((p, i) => `${i ? 'L' : 'M'} ${p.px} ${p.py}`).join(' ');

  /* ── Timeline vertical: solo como fallback de reduced-motion ── */
  if (reduce) {
    return (
      <section className="ptz-section ptz-section--static">
        <div className="ptz-heading">
          <p className="ptz-eyebrow">{t.process.eyebrow}</p>
          <h2 className="ptz-title">{t.process.title} <span className="ptz-gold">{t.process.accent}</span></h2>
        </div>
        <ol className="ptz-static-list">
          {steps.map((step, i) => (
            <li key={step.number} className="ptz-static-item">
              <div className={`ptz-node${i === 0 ? ' ptz-node--root' : ''}`}>
                <span className="ptz-node__num">{step.number}</span>
              </div>
              <div className="ptz-card">
                <h3 className="ptz-card__title">{step.title}</h3>
                <p className="ptz-card__desc">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
        <style>{styles}</style>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="ptz-section" style={{ height: `${N * 85}vh` }}>
      <div ref={stageRef} className="ptz-stage">

        <div className="ptz-heading ptz-heading--float">
          <p className="ptz-eyebrow">{t.process.eyebrow}</p>
          <h2 className="ptz-title">{t.process.title} <span className="ptz-gold">{t.process.accent}</span></h2>
        </div>

        <motion.div
          className="ptz-world"
          style={{ x: camX, y: camY, scale: zoom, width: worldW, height: worldH }}
        >
          {/* Ramas */}
          <svg className="ptz-links" viewBox={`0 0 ${worldW} ${worldH}`} width={worldW} height={worldH} fill="none" aria-hidden="true">
            <path d={pathD} stroke="var(--border)" strokeWidth="2" />
            <motion.path d={pathD} stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" style={{ pathLength: trunkLen }} />
          </svg>

          {/* Nodos */}
          {steps.map((step, i) => (
            <TreeNode
              key={step.number}
              step={step}
              i={i}
              n={N}
              point={points[i]}
              isRoot={i === 0}
              progress={progress}
              reduce={reduce}
            />
          ))}
        </motion.div>
      </div>

      <style>{styles}</style>
    </section>
  );
}

const styles = `
  .ptz-section {
    position: relative;
    width: 100%;
    background: transparent;
    font-family: var(--font-body);
  }

  /* Escenario fijo: la cámara se mueve por dentro */
  .ptz-stage {
    position: sticky;
    top: 0;
    height: 100vh;
    overflow: hidden;
  }

  /* ── Encabezado flotante (se queda arriba) ── */
  .ptz-heading { text-align: center; }
  .ptz-heading--float {
    position: absolute;
    top: clamp(40px, 8vh, 80px);
    left: 0;
    right: 0;
    z-index: 5;
    pointer-events: none;
  }
  .ptz-eyebrow {
    font-size: 0.72rem;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--text-muted);
    margin: 0 0 14px;
    opacity: 0.9;
  }
  .ptz-title {
    font-size: clamp(1.8rem, 4.5vw, 3.4rem);
    font-weight: 700;
    color: var(--text);
    margin: 0;
    line-height: 1.15;
  }
  .ptz-gold { color: var(--accent-text); font-weight: 300; }

  /* ── Mundo (se transforma por la cámara) ── */
  .ptz-world {
    position: absolute;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    will-change: transform;
  }
  .ptz-links { position: absolute; top: 0; left: 0; overflow: visible; }

  /* ── Grupo nodo + tarjeta (un punto en el mundo) ── */
  .ptz-group {
    position: absolute;
    width: 0;
    height: 0;
    will-change: transform, opacity;
  }

  .ptz-node {
    position: absolute;
    top: 0;
    left: 0;
    transform: translate(-50%, -50%);
    width: 72px;
    height: 72px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
    background: var(--surface);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }
  .ptz-node__num {
    font-size: 0.85rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    color: var(--accent-text);
  }
  .ptz-node--root {
    width: 88px;
    height: 88px;
    border-color: var(--accent);
    box-shadow: 0 0 32px -4px color-mix(in srgb, var(--accent) 55%, transparent);
  }
  .ptz-node__pulse {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
    animation: ptz-pulse 2.6s ease-out infinite;
  }
  @keyframes ptz-pulse {
    0%   { transform: scale(0.9); opacity: 0.7; }
    70%  { transform: scale(1.3); opacity: 0; }
    100% { opacity: 0; }
  }

  /* ── Tarjeta al lado del nodo ── */
  .ptz-card { position: absolute; top: 50%; width: 300px; }
  .ptz-group--right .ptz-card { left: 64px; transform: translateY(-50%); text-align: left; }
  .ptz-group--left  .ptz-card { right: 64px; transform: translateY(-50%); text-align: right; }

  .ptz-card__title {
    font-size: 1.6rem;
    font-weight: 800;
    color: var(--text);
    margin: 0 0 12px;
    line-height: 1.15;
  }
  .ptz-card__desc {
    font-size: 1rem;
    line-height: 1.6;
    color: var(--text-muted);
    margin: 0;
  }

  /* ── Fallback estático ── */
  .ptz-section--static {
    padding: 120px 28px 140px;
  }
  .ptz-section--static .ptz-heading { margin-bottom: 72px; }
  .ptz-static-list {
    list-style: none;
    margin: 0 auto;
    padding: 0;
    max-width: 640px;
    display: flex;
    flex-direction: column;
    gap: 40px;
    border-left: 2px solid var(--border);
  }
  .ptz-static-item {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding-left: 28px;
    position: relative;
  }
  .ptz-section--static .ptz-node { position: relative; transform: none; flex-shrink: 0; }
  .ptz-section--static .ptz-card { position: relative; top: auto; width: auto; transform: none; text-align: left; }
  .ptz-section--static .ptz-node__pulse { display: none; }

  /* ── Mobile: menos zoom y tarjetas más estrechas ──
     Al lado del nodo, la tarjeta (cámara centra el nodo) se salía del
     viewport y el stage la recortaba. En móvil la centramos DEBAJO del nodo
     y acotamos su ancho a la pantalla → sin recorte, sin perder el efecto. */
  @media (max-width: 860px) {
    .ptz-node { width: 60px; height: 60px; }
    .ptz-node--root { width: 72px; height: 72px; }
    .ptz-card {
      width: min(80vw, 300px);
      top: 44px;
    }
    .ptz-card__title { font-size: 1.25rem; }
    .ptz-card__desc { font-size: 0.92rem; }
    .ptz-group--right .ptz-card,
    .ptz-group--left  .ptz-card {
      left: 50%;
      right: auto;
      transform: translateX(-50%);
      text-align: center;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .ptz-node__pulse { animation: none; }
  }
`;
