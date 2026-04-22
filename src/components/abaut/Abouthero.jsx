import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

export default function AboutHero() {
  const { t } = useLanguage();
  const [MapComponent, setMapComponent] = useState(null);
  const heroRef = useRef(null);

  // --- LÓGICA DE PARALLAX UNIFICADA ---
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // El texto sube más rápido (Efecto Capa Superior)
  const yText = useTransform(scrollYProgress, [0, 1], [0, -300]);

  // El mapa sube más lento (Efecto Capa de Fondo)
  const yMap = useTransform(scrollYProgress, [0, 1], [0, -150]);

  // Desvanecimiento común al salir
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useEffect(() => {
    import('leaflet/dist/leaflet.css');
    import('react-leaflet').then((module) => {
      const { MapContainer, TileLayer, Marker, Popup, Circle, useMap } = module;
      import('leaflet').then((L) => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const customIcon = new L.Icon({
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`<svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="25" cy="25" r="22" fill="url(#grad)" stroke="#fff" stroke-width="4"/><circle cx="25" cy="25" r="10" fill="#fff"/><defs><linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#d4af37;stop-opacity:1" /><stop offset="100%" style="stop-color:#f4d03f;stop-opacity:1" /></linearGradient></defs></svg>`),
          iconSize: [50, 50],
          iconAnchor: [25, 25],
        });

        function AutoZoom() {
          const map = useMap();
          const timeoutsRef = useRef([]);
          useEffect(() => {
            const mexicoCenter = [23.6345, -102.5528];
            const parralCoords = [26.9323, -105.6669];
            const run = () => {
              map.setView(mexicoCenter, 5, { animate: true });
              timeoutsRef.current.push(setTimeout(() => map.flyTo(parralCoords, 7, { duration: 3.5 }), 2000));
              timeoutsRef.current.push(setTimeout(() => map.flyTo(parralCoords, 9, { duration: 2.5 }), 6500));
            };
            run();
            const int = setInterval(run, 15000);
            return () => { clearInterval(int); timeoutsRef.current.forEach(clearTimeout); };
          }, [map]);
          return null;
        }

        const Map = () => (
          <MapContainer center={[23.6345, -102.5528]} zoom={5} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            <AutoZoom />
            <Circle center={[26.9323, -105.6669]} radius={80000} pathOptions={{ color: '#d4af37', fillColor: '#d4af37', fillOpacity: 0.1, weight: 2 }} />
            <Marker position={[26.9323, -105.6669]} icon={customIcon} />
          </MapContainer>
        );
        setMapComponent(() => Map);
      });
    });
  }, []);

  return (
    <>
      <section className="about-hero" ref={heroRef}>
        {/* COLUMNA IZQUIERDA - TEXTO DESLIZANTE */}
        <div className="about-hero__text-side">
          <motion.div 
            style={{ y: yText, opacity }}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="about-hero__text-content"
          >
            <h1 className="about-hero__title">
              {t.about.title}
              <span className="about-hero__title-highlight">{t.about.highlight}</span>
            </h1>
            <p className="about-hero__subtitle">
              {t.about.subtitle}
            </p>
          </motion.div>
        </div>

        {/* COLUMNA DERECHA - MAPA DESLIZANTE */}
        <div className="about-hero__map-side">
          <motion.div 
            style={{ y: yMap, opacity }}
            initial={{ opacity: 0, y: 150 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="about-hero__map-wrapper"
          >
            {MapComponent ? (
              <MapComponent />
            ) : (
              <div className="about-hero__map-loading"><span>{t.about.mapLoading}</span></div>
            )}
          </motion.div>
        </div>
      </section>

      <style>{`
        .about-hero {
          font-family: 'Outfit', sans-serif;
          position: relative;
          min-height: 120vh; /* Un poco más alto para dar margen al deslizamiento */
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
          color: #f5f5f5;
          letter-spacing: -0.03em;
        }

        .about-hero__title-highlight {
          display: block;
          margin-top: 1rem;
          background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-weight: 300;
          text-transform: uppercase;
          font-size: 0.35em;
          letter-spacing: 0.4em;
        }

        .about-hero__subtitle {
          margin-top: 2rem;
          color: rgba(255,255,255,0.6);
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

        .about-hero__map-wrapper {
          width: 100%;
          height: 75vh;
          border-radius: 40px;
          overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.5);
          border: 1px solid rgba(212, 175, 55, 0.15);
          background: #030816;
        }

        .about-hero__map-loading {
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          text-transform: uppercase;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
        }

        @media (max-width: 1024px) {
          .about-hero { flex-direction: column; min-height: auto; }
          .about-hero__text-side { width: 100%; padding: 10rem 2rem 4rem; text-align: center; justify-content: center; }
          .about-hero__map-side { width: 100%; padding: 2rem; }
          .about-hero__map-wrapper { height: 50vh; }
        }
      `}</style>
    </>
  );
}