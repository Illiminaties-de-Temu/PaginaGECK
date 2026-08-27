import { useState, useRef, useEffect, useMemo } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

const CLIENTS_BASE = [
  { id:1, name:'Gobierno Municipal de Parral',   logo:'assets/image/parral.webp' },
  { id:2, name:'Las Chikis Restaurante',          logo:'assets/image/laschikis.webp' },
  { id:3, name:'Capital Transport LLP',           logo:'assets/image/CapitalTransport.webp' },
  { id:4, name:'Instituto Tecnológico de Parral', logo:'assets/image/yec.webp' },
  { id:5, name:'Coronado Gym',                    logo:'assets/image/gym.webp' },
  /* Placeholders — se reemplazan con logos reales cuando los tengan */
  { id:6, name:'Cafetería La Esquina',   logo:null, placeholder:true },
  { id:7, name:'Ferretería El Tornillo', logo:null, placeholder:true },
  { id:8, name:'Clínica Dental Sonríe',  logo:null, placeholder:true },
  { id:9, name:'AutoLavado Express',     logo:null, placeholder:true },
];

/* ── Parámetros de la simulación de fuerzas ── */
const REST       = 168;   // longitud de reposo de los links (hub → cliente)
const REPULSION  = 8200;  // cuánto se repelen los nodos
const SPRING     = 0.02;  // fuerza de los links
const CENTER     = 0.003; // empuje suave al centro
const FRICTION   = 0.85;  // amortiguación
const WANDER     = 0.42;  // fuerza del vaivén continuo (vida)
const NODE       = 68;    // diámetro nodo cliente (px)
const HUB        = 118;   // diámetro hub (px)
const ZOOM_MIN   = 0.5;
const ZOOM_MAX   = 2.4;
const FOCUS_ZOOM = 1.85;  // zoom al enfocar un nodo (hover/clic)

const initialsOf = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

export default function ClientGraph({ lang }) {
  const { t } = useLanguage(lang);
  const [activeId, setActiveId] = useState(null);

  const viewportRef = useRef(null);
  const worldRef    = useRef(null);
  const view        = useRef({ panX: 0, panY: 0, zoom: 1, w: 0, h: 0, ready: false });
  const userView    = useRef({ panX: 0, panY: 0, zoom: 1 }); // vista que dejó el usuario (pan/zoom manual)
  const focus       = useRef({ node: null });                // nodo enfocado (zoom-in)
  const drag        = useRef(null);
  const rafRef      = useRef(0);

  const clients = useMemo(() => CLIENTS_BASE.slice(0, 60), []);

  /* Grafo (posiciones/velocidades viven en refs, no en estado) */
  const graph = useRef(null);
  if (!graph.current) {
    const nodes = [{ id: 'hub', isHub: true, x: 0, y: 0, vx: 0, vy: 0, fixed: true, el: null }];
    clients.forEach((c, i) => {
      const a = (i / clients.length) * Math.PI * 2;
      nodes.push({ id: c.id, client: c, x: Math.cos(a) * REST, y: Math.sin(a) * REST, vx: 0, vy: 0, fixed: false, phase: Math.random() * Math.PI * 2, el: null });
    });
    const links = clients.map((_, i) => ({ a: 0, b: i + 1, el: null }));
    graph.current = { nodes, links };
  }

  /* ── Conversión pantalla → mundo ── */
  const toWorld = (clientX, clientY) => {
    const r = viewportRef.current.getBoundingClientRect();
    const { panX, panY, zoom } = view.current;
    return { x: (clientX - r.left - panX) / zoom, y: (clientY - r.top - panY) / zoom };
  };

  /* ── Bucle de física + render ── */
  useEffect(() => {
    const vp = viewportRef.current;
    const measure = () => {
      const r = vp.getBoundingClientRect();
      view.current.w = r.width; view.current.h = r.height;
    };
    measure();
    view.current.panX = userView.current.panX = view.current.w / 2;
    view.current.panY = userView.current.panY = view.current.h / 2;
    view.current.zoom = userView.current.zoom = 1;
    view.current.ready = true;
    window.addEventListener('resize', measure, { passive: true });

    const { nodes, links } = graph.current;
    let frame = 0;

    const tick = () => {
      frame += 1;
      // Repulsión entre todos los pares
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        a.ax = 0; a.ay = 0;
        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const b = nodes[j];
          let dx = a.x - b.x, dy = a.y - b.y;
          let d2 = dx * dx + dy * dy || 0.01;
          const f = REPULSION / d2;
          const d = Math.sqrt(d2);
          a.ax += (dx / d) * f;
          a.ay += (dy / d) * f;
        }
        // empuje al centro
        a.ax += -a.x * CENTER;
        a.ay += -a.y * CENTER;
        // vaivén continuo → sensación de vida (no se congela nunca)
        if (!a.isHub) {
          a.ax += Math.sin(frame * 0.013 + a.phase) * WANDER;
          a.ay += Math.cos(frame * 0.011 + a.phase * 1.3) * WANDER;
        }
      }
      // Links (resorte)
      for (const lk of links) {
        const a = nodes[lk.a], b = nodes[lk.b];
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const diff = (d - REST) / d * SPRING;
        a.ax += dx * diff; a.ay += dy * diff;
        b.ax -= dx * diff; b.ay -= dy * diff;
      }
      // Integración + escritura al DOM
      for (const n of nodes) {
        if (!n.fixed) {
          n.vx = (n.vx + n.ax) * FRICTION;
          n.vy = (n.vy + n.ay) * FRICTION;
          n.x += n.vx; n.y += n.vy;
        }
        if (n.el) n.el.style.transform = `translate(${n.x}px, ${n.y}px) translate(-50%, -50%)`;
      }
      // Links
      for (const lk of links) {
        const a = nodes[lk.a], b = nodes[lk.b];
        if (lk.el) {
          lk.el.setAttribute('x1', a.x); lk.el.setAttribute('y1', a.y);
          lk.el.setAttribute('x2', b.x); lk.el.setAttribute('y2', b.y);
        }
      }
      // ── Vista: enfoca el nodo activo (zoom-in) o vuelve a la vista del usuario ──
      const v = view.current;
      const fn = focus.current.node;
      let tPanX, tPanY, tZoom;
      if (fn && !drag.current) {
        tZoom = FOCUS_ZOOM;
        tPanX = v.w / 2 - fn.x * tZoom;
        tPanY = v.h / 2 - fn.y * tZoom;
      } else {
        tPanX = userView.current.panX;
        tPanY = userView.current.panY;
        tZoom = userView.current.zoom;
      }
      // mientras se arrastra un nodo, no muevas la cámara (se haría mareante)
      if (!(drag.current && drag.current.type === 'node')) {
        const k = 0.1;
        v.panX += (tPanX - v.panX) * k;
        v.panY += (tPanY - v.panY) * k;
        v.zoom += (tZoom - v.zoom) * k;
      }
      if (worldRef.current) worldRef.current.style.transform = `translate(${v.panX}px, ${v.panY}px) scale(${v.zoom})`;

      if (running) rafRef.current = requestAnimationFrame(tick);
    };

    // La física es O(n²) por frame. Fuera de pantalla era CPU desperdiciada
    // (jank en el resto del sitio). Solo simular mientras el grafo es visible.
    let running = false;
    const startLoop = () => { if (!running) { running = true; rafRef.current = requestAnimationFrame(tick); } };
    const stopLoop = () => { running = false; cancelAnimationFrame(rafRef.current); };
    const io = new IntersectionObserver(
      ([e]) => { e.isIntersecting ? startLoop() : stopLoop(); },
      { rootMargin: '150px' }
    );
    if (viewportRef.current) io.observe(viewportRef.current);

    return () => { io.disconnect(); cancelAnimationFrame(rafRef.current); window.removeEventListener('resize', measure); };
  }, []);

  /* ── Zoom con rueda (hacia el cursor) ── */
  useEffect(() => {
    const vp = viewportRef.current;
    const onWheel = (e) => {
      e.preventDefault();
      const r = vp.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const v = view.current;
      const nz = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, v.zoom * (e.deltaY < 0 ? 1.12 : 0.89)));
      const wx = (mx - v.panX) / v.zoom, wy = (my - v.panY) / v.zoom;
      v.panX = mx - wx * nz; v.panY = my - wy * nz; v.zoom = nz;
      // el zoom manual toma el control: guarda la vista y suelta el enfoque
      userView.current = { panX: v.panX, panY: v.panY, zoom: v.zoom };
      focus.current.node = null;
      setActiveId(null);
    };
    vp.addEventListener('wheel', onWheel, { passive: false });
    return () => vp.removeEventListener('wheel', onWheel);
  }, []);

  /* ── Arrastrar / enfocar nodo ── */
  const onNodePointerDown = (e, n) => {
    if (n.isHub) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    n.fixed = true;
    drag.current = { type: 'node', n };
    setActiveId(n.id); // tap/clic enfoca (importante en móvil, sin hover)
  };

  /* ── Soltar el enfoque solo al salir del viewport (no al moverse el nodo bajo el cursor) ── */
  const onViewportLeave = (e) => {
    if (e.pointerType === 'touch') return; // en táctil el enfoque se controla con tap
    if (drag.current) return;              // no soltar mientras se arrastra
    setActiveId(null);
  };

  /* ── Paneo del fondo (mouse). En touch se deja pasar el scroll de la página) ── */
  const onBgPointerDown = (e) => {
    setActiveId(null);
    focus.current.node = null;
    if (e.pointerType === 'touch') return; // no secuestrar el swipe vertical
    const v = view.current;
    drag.current = { type: 'pan', sx: e.clientX, sy: e.clientY, px: v.panX, py: v.panY };
  };

  useEffect(() => {
    const onMove = (e) => {
      const dg = drag.current;
      if (!dg) return;
      if (dg.type === 'node') {
        const p = toWorld(e.clientX, e.clientY);
        dg.n.x = p.x; dg.n.y = p.y; dg.n.vx = 0; dg.n.vy = 0;
      } else if (dg.type === 'pan') {
        const v = view.current;
        v.panX = dg.px + (e.clientX - dg.sx);
        v.panY = dg.py + (e.clientY - dg.sy);
        userView.current = { panX: v.panX, panY: v.panY, zoom: v.zoom };
      }
    };
    const onUp = () => {
      const dg = drag.current;
      // suelta el nodo, salvo que siga enfocado (para que quede centrado)
      if (dg?.type === 'node' && focus.current.node !== dg.n) dg.n.fixed = false;
      drag.current = null;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  /* ── Enfoque: congela el nodo activo para que la cámara haga zoom sobre él ── */
  useEffect(() => {
    const prev = focus.current.node;
    if (prev && !(drag.current && drag.current.n === prev)) prev.fixed = false;
    if (activeId != null) {
      const n = graph.current.nodes.find((x) => x.id === activeId);
      focus.current.node = n || null;
      if (n) n.fixed = true;
    } else {
      focus.current.node = null;
    }
  }, [activeId]);

  const active = activeId != null ? graph.current.nodes.find((n) => n.id === activeId) : null;
  const ap = active?.client;
  const apDesc = ap ? t.clients.descriptions[ap.id] : null;

  return (
    <>
      <section className="og-section">
        <header className="og-header">
          <h2 key={ap ? ap.id : 'default'} className={'og-h2' + (ap ? ' is-focused' : '')}>{ap ? ap.name : t.clients.title}</h2>
        </header>

        <div
          ref={viewportRef}
          className="og-viewport"
          onPointerDown={onBgPointerDown}
          onPointerLeave={onViewportLeave}
        >
          <div ref={worldRef} className="og-world">
            <svg className="og-links" aria-hidden="true">
              {graph.current.links.map((lk, i) => {
                const tid = graph.current.nodes[lk.b].id;
                const cls = activeId == null ? '' : (activeId === tid ? ' is-active' : ' is-dim');
                return <line key={i} ref={(el) => { lk.el = el; }} className={`og-link${cls}`} />;
              })}
            </svg>

            {graph.current.nodes.map((n) => {
              const isHub = n.isHub;
              const dim = activeId != null && activeId !== n.id && !isHub;
              return (
                <div
                  key={n.id}
                  ref={(el) => { n.el = el; }}
                  className={
                    'og-node' +
                    (isHub ? ' og-node--hub' : '') +
                    (n.client?.placeholder ? ' og-node--ph' : '') +
                    (activeId === n.id ? ' is-active' : '') +
                    (dim ? ' is-dim' : '')
                  }
                  onPointerDown={(e) => onNodePointerDown(e, n)}
                  onPointerEnter={() => !isHub && setActiveId(n.id)}
                >
                  {isHub ? (
                    <span className="og-hub__brand">Geck<span className="og-hub__brand2">Codex</span></span>
                  ) : n.client.logo ? (
                    <img src={n.client.logo} alt={n.client.name} className="og-node__img" loading="lazy" decoding="async" draggable="false" />
                  ) : (
                    <span className="og-node__mono">{initialsOf(n.client.name)}</span>
                  )}
                </div>
              );
            })}
          </div>

          <span className="og-hint">{t.clients.subtitle}</span>
        </div>

        <div className="og-caption">
          {ap && apDesc ? (
            <p key={ap.id} className="og-cap__desc">{apDesc}</p>
          ) : (
            <p className="og-cap__hint">{t.clients.graphHint}</p>
          )}
        </div>
      </section>

      <style>{`
        .og-section {
          position: relative;
          background: var(--background);
          padding: clamp(3.5rem, 9vh, 6.5rem) 1rem clamp(3.5rem, 8vh, 6rem);
          overflow: hidden;
        }
        .og-header { text-align: center; margin-bottom: clamp(1.5rem, 4vh, 2.6rem); }
        .og-h2 {
          font-size: clamp(1.7rem, 4vw, 2.7rem);
          font-weight: 900; color: var(--text); margin: 0; line-height: 1.1;
        }
        .og-h2.is-focused {
          color: var(--accent-text);
          animation: og-name-in 0.45s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes og-name-in {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── VIEWPORT (pan/zoom) ── */
        .og-viewport {
          position: relative;
          width: 100%;
          max-width: 1100px;
          height: clamp(420px, 62vh, 660px);
          margin: 0 auto;
          border: 1px solid var(--border);
          border-radius: 24px;
          background:
            radial-gradient(circle at 50% 45%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 60%),
            var(--surface);
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;   /* deja scrollear la página; los nodos capturan el touch */
        }
        .og-viewport:active { cursor: grabbing; }

        .og-world { position: absolute; top: 0; left: 0; transform-origin: 0 0; will-change: transform; }

        /* ── LINKS ── */
        .og-links { position: absolute; top: 0; left: 0; overflow: visible; width: 0; height: 0; }
        .og-link {
          stroke: var(--accent);
          stroke-width: 1.4;
          opacity: 0.2;
          transition: opacity .25s ease, stroke-width .25s ease;
        }
        .og-link.is-active { opacity: 0.95; stroke-width: 2.2; }
        .og-link.is-dim { opacity: 0.07; }

        /* ── NODOS ── */
        .og-node {
          position: absolute;
          top: 0; left: 0;
          width: ${NODE}px;
          height: ${NODE}px;
          border-radius: 50%;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 12px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.4);
          border: 1.5px solid transparent;
          cursor: grab;
          touch-action: none;   /* el nodo sí captura el touch para arrastrar */
          will-change: transform;
          transition: border-color .25s ease, box-shadow .25s ease, opacity .25s ease, filter .25s ease;
        }
        .og-node:active { cursor: grabbing; }
        .og-node.is-active {
          border-color: var(--accent);
          box-shadow: 0 16px 44px rgba(0,0,0,0.6), 0 0 0 4px color-mix(in srgb, var(--accent) 30%, transparent);
          z-index: 5;
        }
        .og-node.is-dim { opacity: .4; filter: grayscale(.4); }

        .og-node__img {
          max-width: 100%; max-height: 100%;
          object-fit: contain;
          filter: grayscale(.7) opacity(.85);
          transition: filter .3s ease;
          pointer-events: none;
        }
        .og-node.is-active .og-node__img { filter: none; }

        .og-node--ph { background: var(--surface); border-color: var(--border); }
        .og-node__mono {
          font-family: var(--font-display);
          font-weight: 800;
          font-size: 1.15rem;
          color: var(--text-muted);
          pointer-events: none;
        }
        .og-node--ph.is-active .og-node__mono { color: var(--accent-text); }

        /* ── HUB ── */
        .og-node--hub {
          width: ${HUB}px;
          height: ${HUB}px;
          padding: 14px;
          background: radial-gradient(circle at 50% 38%, #16223A 0%, var(--navy) 70%);
          border: 1px solid rgba(195,173,133,0.55);
          box-shadow: 0 14px 40px rgba(0,0,0,0.5),
                      0 0 0 7px color-mix(in srgb, var(--accent) 6%, transparent);
          cursor: default;
          text-align: center;
          z-index: 4;
        }
        .og-hub__brand {
          font-family: var(--font-display);
          font-size: clamp(1.05rem, 2vw, 1.4rem);
          font-weight: 700; color: var(--brand-ivory); line-height: 1;
          letter-spacing: .01em;
        }
        .og-hub__brand2 {
          display: block;
          font-size: .58rem; font-weight: 700; letter-spacing: .4em;
          text-transform: uppercase; color: var(--accent);
          padding-left: .4em; margin-top: .35em;
        }
        .og-hub__name {
          font-family: var(--font-display);
          font-size: clamp(.78rem, 1.4vw, .96rem);
          font-weight: 700; color: var(--brand-ivory); line-height: 1.2;
          animation: og-pop .3s cubic-bezier(0.22,1,0.36,1);
        }
        @keyframes og-pop { from { opacity:0; transform: scale(.9); } to { opacity:1; transform: scale(1); } }

        .og-hint {
          position: absolute;
          left: 50%; bottom: 14px; transform: translateX(-50%);
          font-size: .8rem; color: var(--text-muted); opacity: .65;
          pointer-events: none; text-align: center; max-width: 90%;
        }

        /* ── CAPTION ── */
        .og-caption {
          min-height: 54px;
          margin-top: clamp(1.4rem, 3.5vh, 2.4rem);
          display: flex; align-items: flex-start; justify-content: center;
          text-align: center; padding: 0 1.2rem;
        }
        .og-cap__hint, .og-cap__desc {
          font-size: .92rem; color: var(--text-muted); margin: 0;
          max-width: 540px; line-height: 1.5; letter-spacing: .02em;
        }
        .og-cap__desc { color: var(--text); font-weight: 500; animation: og-pop .3s cubic-bezier(0.22,1,0.36,1); }

        @media (max-width: 768px) {
          .og-viewport { height: clamp(360px, 56vh, 520px); border-radius: 18px; }
          /* En táctil el scroll vertical de la página tiene prioridad sobre el
             arrastre del nodo (si no, el dedo se queda "atrapado" moviendo el
             nodo y no se puede scrollear). El tap para enfocar sigue activo. */
          .og-node { touch-action: pan-y; }
        }

        @media (prefers-reduced-motion: reduce) {
          .og-node, .og-link, .og-hub__name, .og-cap__desc, .og-h2 { transition: none !important; animation: none !important; }
        }
      `}</style>
    </>
  );
}
