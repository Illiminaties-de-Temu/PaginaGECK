import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const MEXICO_CENTER = [23.6345, -102.5528];
const PARRAL = [26.9323, -105.6669];
const REACH = [
  [PARRAL, [19.4326, -99.1332]],   // Parral → CDMX
  [PARRAL, [29.7604, -95.3698]],   // Parral → Houston, USA
];
const EASE = [0.16, 1, 0.3, 1];

export default function AboutHero({ lang }) {
  const { t } = useLanguage(lang);
  const heroRef = useRef(null);
  const mapRef = useRef(null);
  const leafletRef = useRef(null);
  const flownRef = useRef(false);
  /* El acento vive también en un ref: el efecto que arma el mapa corre una sola
     vez y necesita el valor del momento sin volver a depender de él. */
  const accentRef = useRef('#C3AD85');

  const mapElRef = useRef(null);
  const layersRef = useRef({ circle: null, lines: [] });
  const [mapReady, setMapReady] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [inView, setInView] = useState(false);
  const [landed, setLanded] = useState(false);
  const [accent, setAccent] = useState('#C3AD85');
  const reduce = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Parallax ---
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const yText = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const yMap = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  // --- Color de acento real desde el token (Leaflet no resuelve var() en atributos SVG) ---
  useEffect(() => {
    const c = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim();
    if (c) { accentRef.current = c; setAccent(c); }
  }, []);

  /* Leaflet a secas, sin react-leaflet.
   *
   * Antes esto montaba <MapContainer> y compañía, y el mapa se quedaba clavado
   * en "Estableciendo conexión": si la isla revienta al hidratar, React se
   * queda con el marcado del servidor, que es justo ese mensaje de carga.
   * react-leaflet 5 sobre React 19 era el sospechoso, y aquí no aportaba nada:
   * el vuelo, el zoom y el aterrizaje ya se hacían de forma imperativa contra
   * `mapRef`, así que la capa declarativa solo añadía una superficie de fallo.
   *
   * Ahora la única dependencia es `leaflet`, que no toca el árbol de React: el
   * div existe siempre en el DOM y Leaflet pinta dentro. Si el import falla,
   * `mapFailed` lo dice en pantalla en vez de dejar el mensaje girando para
   * siempre. */
  useEffect(() => {
    let mounted = true;
    let map = null;

    (async () => {
      try {
        await import('leaflet/dist/leaflet.css');
        const mod = await import('leaflet');
        const L = mod.default || mod;
        if (!mounted || !mapElRef.current || mapRef.current) return;

        map = L.map(mapElRef.current, {
          center: MEXICO_CENTER,
          zoom: 5,
          scrollWheelZoom: false,
          zoomControl: false,
          /* La atribución vuelve, en pequeño: Esri la exige por licencia y un
             mapa sin crédito no es un mapa que podamos usar. El CSS la deja
             discreta en la esquina, no la esconde. */
          attributionControl: true,
        });

        /* Esri y no CARTO.
         *
         * CARTO cerró sus basemaps públicos y desde entonces estampa
         * "API KEY REQUIRED — carto.com/basemaps/apikey" DENTRO de cada
         * cuadrito. No fue un cambio nuestro y no daba error: los tiles
         * seguían respondiendo 200, solo que con la marca pintada encima.
         *
         * Esri World Dark Gray sirve sin registro y en el mismo tono. Va en
         * dos capas —el terreno y los rótulos aparte— porque así lo publica
         * Esri, y de paso los nombres quedan por encima del círculo y del
         * pin en vez de debajo. Llega hasta z16 y aquí no pasamos de z9.
         *
         * Sin `{s}` ni `{r}`: no reparte por subdominios ni tiene versión
         * retina, y dejar los marcadores puestos pediría URLs que no existen. */
        const ESRI = 'https://services.arcgisonline.com/ArcGIS/rest/services/Canvas';
        const esriAttrib = 'Tiles &copy; Esri';

        L.tileLayer(`${ESRI}/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}`, {
          maxZoom: 16,
          attribution: esriAttrib,
        }).addTo(map);

        L.tileLayer(`${ESRI}/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}`, {
          maxZoom: 16,
          /* El crédito ya lo puso la capa de abajo; repetirlo lo duplica. */
          pane: 'shadowPane',
        }).addTo(map);

        const accentNow = accentRef.current;

        layersRef.current.circle = L.circle(PARRAL, {
          radius: 80000,
          color: accentNow,
          fillColor: accentNow,
          fillOpacity: 0.08,
          weight: 1.5,
        }).addTo(map);

        L.marker(PARRAL, {
          icon: L.divIcon({
            className: 'ah-pin',
            html: '<span class="ah-pin__pulse"></span><span class="ah-pin__pulse ah-pin__pulse--2"></span><span class="ah-pin__core"></span>',
            iconSize: [22, 22],
            iconAnchor: [11, 11],
          }),
        }).addTo(map);

        mapRef.current = map;
        leafletRef.current = L;
        setMapReady(true);
      } catch (err) {
        console.error('[AboutHero] Leaflet no cargó:', err);
        if (mounted) setMapFailed(true);
      }
    })();

    return () => {
      mounted = false;
      if (map) map.remove();
      mapRef.current = null;
      layersRef.current = { circle: null, lines: [] };
    };
  }, []);

  /* Las líneas de alcance salen al aterrizar, no antes: dibujadas desde el
     principio delatan el destino del vuelo. */
  useEffect(() => {
    const map = mapRef.current;
    const L = leafletRef.current;
    if (!map || !L) return;

    if (!landed) {
      layersRef.current.lines.forEach((l) => l.remove());
      layersRef.current.lines = [];
      return;
    }
    layersRef.current.lines = REACH.map((line) =>
      L.polyline(line, { color: accent, weight: 1.4, opacity: 0.5, dashArray: '4 9' }).addTo(map),
    );
  }, [landed, accent]);

  /* El acento se lee del token después del primer pintado, así que puede
     cambiar cuando las capas ya existen. */
  useEffect(() => {
    const { circle, lines } = layersRef.current;
    if (circle) circle.setStyle({ color: accent, fillColor: accent });
    lines.forEach((l) => l.setStyle({ color: accent }));
  }, [accent]);

  // --- Disparar el vuelo cuando el hero entra en vista (una sola vez) ---
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !mapReady || flownRef.current) return;
    flownRef.current = true;
    const map = mapRef.current;
    if (!map) return;

    if (reduce) {
      map.setView(PARRAL, 8, { animate: false });
      setLanded(true);
      return;
    }

    map.setView(MEXICO_CENTER, 5, { animate: false });
    const t1 = setTimeout(() => map.flyTo(PARRAL, 7, { duration: 3.2 }), 700);
    const t2 = setTimeout(() => map.flyTo(PARRAL, 9, { duration: 2.6 }), 4200);
    const t3 = setTimeout(() => setLanded(true), 7200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [inView, mapReady, reduce]);

  return (
    <>
      <section className="about-hero" ref={heroRef}>
        {/* TEXTO */}
        <div className="about-hero__text-side">
          <motion.div
            style={{ y: yText, opacity }}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: EASE }}
            className="about-hero__text-content"
          >
            <h1 className="about-hero__title">
              {t.about.title}
              <span className="about-hero__title-highlight">{t.about.highlight}</span>
            </h1>
            <p className="about-hero__subtitle">{t.about.subtitle}</p>
          </motion.div>
        </div>

        {/* MAPA */}
        <div className="about-hero__map-side">
          <motion.div
            style={{ y: yMap, opacity }}
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: EASE }}
            className="about-hero__map-wrapper"
          >
            {/* El nodo del mapa está siempre en el DOM: Leaflet necesita un
                contenedor con medidas ya resueltas para calcular sus teselas. */}
            <div ref={mapElRef} className="about-hero__map" />

            {!mapReady && (
              <div className="about-hero__map-loading">
                <span>{mapFailed ? t.about.mapCity : t.about.mapLoading}</span>
              </div>
            )}

            {/* Tarjeta que aparece al aterrizar */}
            <motion.div
              className="about-hero__card"
              initial={false}
              animate={landed ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <span className="about-hero__card-dot" aria-hidden="true" />
              <div className="about-hero__card-body">
                <strong className="about-hero__card-city">{t.about.mapCity}</strong>
                <span className="about-hero__card-badge">{t.about.mapBadge}</span>
                <span className="about-hero__card-reach">{t.about.mapReach}</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .about-hero {
          font-family: var(--font-body);
          position: relative;
          min-height: 120vh;
          width: 100%;
          display: flex;
          background: transparent;
          overflow: hidden;
          padding-bottom: 20vh;
        }

        .about-hero__text-side {
          width: 40%;
          display: flex;
          align-items: center;
          padding-left: 5%;
          z-index: 10;
        }

        .about-hero__title {
          font-size: clamp(2.5rem, 4.5vw, 4rem);
          font-weight: 900;
          line-height: 1.05;
          color: var(--text);
          letter-spacing: -0.03em;
        }

        .about-hero__title-highlight {
          display: block;
          margin-top: 1rem;
          color: var(--accent-text);
          font-weight: 300;
          text-transform: uppercase;
          font-size: 0.35em;
          letter-spacing: 0.4em;
        }

        .about-hero__subtitle {
          margin-top: 2rem;
          color: var(--text-muted);
          font-size: 1.1rem;
          font-weight: 300;
          max-width: 380px;
          line-height: 1.6;
        }

        .about-hero__map-side {
          width: 60%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding-right: 5%;
        }

        .about-hero__map { position: absolute; inset: 0; }
        .about-hero__map-wrapper {
          position: relative;
          /* Contexto de apilamiento propio. Leaflet pinta sus capas en z-index
             400 y la tarjeta de ubicación en 500; sin aislar, esos valores
             compiten en la raíz y tapan el menú del navbar (z-index 59). No
             basta con el transform del parallax: cuando el scroll lo deja en
             cero, Framer emite transform:none y el contexto desaparece. */
          isolation: isolate;
          width: 100%;
          height: 75vh;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          border: 1px solid rgba(195, 173, 133, 0.15);
          background: #030816;
        }

        .about-hero__map-loading {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
        }

        /* ── Tarjeta de ubicación ── */
        .about-hero__card {
          position: absolute;
          left: 22px;
          bottom: 22px;
          z-index: 500;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          max-width: 280px;
          padding: 16px 20px;
          border-radius: 16px;
          background: color-mix(in srgb, #030816 78%, transparent);
          border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
          backdrop-filter: blur(10px);
          box-shadow: 0 18px 40px rgba(0,0,0,0.45);
          pointer-events: none;
        }
        .about-hero__card-dot {
          width: 9px;
          height: 9px;
          margin-top: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent);
          flex-shrink: 0;
        }
        .about-hero__card-body { display: flex; flex-direction: column; gap: 3px; }
        .about-hero__card-city {
          font-size: 1rem;
          font-weight: 700;
          color: var(--gold-light, #F4E4BC);
          letter-spacing: 0.01em;
        }
        .about-hero__card-badge {
          font-size: 0.66rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: var(--accent);
        }
        .about-hero__card-reach {
          margin-top: 6px;
          font-size: 0.78rem;
          line-height: 1.4;
          color: rgba(255,255,255,0.62);
        }

        /* ── Crédito de los tiles ──
           Esri lo pide por licencia. Se queda legible pero fuera del camino:
           el fondo blanco de Leaflet arruinaría el mapa oscuro. */
        .leaflet-control-attribution {
          background: rgba(11, 29, 51, 0.55) !important;
          color: rgba(255, 255, 255, 0.45) !important;
          font-size: 0.6rem;
          padding: 1px 6px;
          backdrop-filter: blur(2px);
        }
        .leaflet-control-attribution a {
          color: rgba(255, 255, 255, 0.6) !important;
        }

        /* ── Marcador con pulso (divIcon) ── */
        .ah-pin { position: relative; }
        .ah-pin__core {
          position: absolute;
          top: 50%; left: 50%;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: var(--accent);
          border: 2px solid #fff;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 12px color-mix(in srgb, var(--accent) 80%, transparent);
        }
        .ah-pin__pulse {
          position: absolute;
          top: 50%; left: 50%;
          width: 12px; height: 12px;
          border-radius: 50%;
          background: var(--accent);
          transform: translate(-50%, -50%);
          animation: ah-pulse 2.4s ease-out infinite;
        }
        .ah-pin__pulse--2 { animation-delay: 1.2s; }
        @keyframes ah-pulse {
          0%   { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(5); }
        }

        @media (max-width: 1024px) {
          .about-hero { flex-direction: column; min-height: auto; }
          .about-hero__text-side { width: 100%; padding: 10rem 2rem 4rem; text-align: center; justify-content: center; }
          .about-hero__map-side { width: 100%; padding: 2rem; }
          .about-hero__map-wrapper { height: 50vh; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ah-pin__pulse { animation: none; opacity: 0; }
        }
      `}</style>
    </>
  );
}
