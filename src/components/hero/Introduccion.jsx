import { useState, useEffect, useRef } from 'react';

export default function AboutHero() {
  const [MapComponent, setMapComponent] = useState(null);
  const heroRef = useRef(null);

  // Cargar Leaflet solo en el cliente
  useEffect(() => {
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
          iconUrl: 'data:image/svg+xml;base64,' + btoa(`
            <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
              <circle cx="25" cy="25" r="22" fill="url(#grad)" stroke="#fff" stroke-width="4"/>
              <circle cx="25" cy="25" r="10" fill="#fff"/>
              <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:var(--accent);stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#f4d03f;stop-opacity:1" />
                </linearGradient>
              </defs>
            </svg>
          `),
          iconSize: [50, 50],
          iconAnchor: [25, 25],
          popupAnchor: [0, -25],
        });

        // Componente que maneja la animación del zoom con loop infinito
        function AutoZoom() {
          const map = useMap();

          useEffect(() => {
            const mexicoCenter = [23.6345, -102.5528];
            const parralCoords = [26.9323, -105.6669];

            const runAnimation = () => {
              map.setView(mexicoCenter, 5, { animate: false });

              setTimeout(() => {
                map.flyTo(parralCoords, 7, {
                  duration: 3,
                  easeLinearity: 0.25
                });
              }, 2000);

              setTimeout(() => {
                map.flyTo(parralCoords, 9, {
                  duration: 2.5,
                  easeLinearity: 0.25
                });
              }, 6000);
            };

            runAnimation();

            const loopInterval = setInterval(() => {
              runAnimation();
            }, 15000);

            return () => {
              clearInterval(loopInterval);
            };
          }, [map]);

          return null;
        }

        const Map = () => {
          const parralCoords = [26.9323, -105.6669];

          return (
            <MapContainer
              center={[23.6345, -102.5528]}
              zoom={5}
              scrollWheelZoom={false}
              zoomControl={true}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              />

              <AutoZoom />

              <Circle
                center={parralCoords}
                radius={80000}
                pathOptions={{
                  fillColor: 'var(--accent)',
                  fillOpacity: 0.1,
                  color: 'var(--accent)',
                  weight: 2,
                  opacity: 0.5,
                }}
              />

              <Marker position={parralCoords} icon={customIcon}>
                <Popup>
                  <div style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <strong style={{ color: 'var(--accent)', fontSize: '1.1rem' }}>
                      Parral, Chihuahua 🇲🇽
                    </strong>
                    <br />
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      Innovación desde el norte
                    </span>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          );
        };

        setMapComponent(() => Map);
      });
    });
  }, []);

  return (
    <>
      <section className="about-hero" ref={heroRef}>
        {/* COLUMNA IZQUIERDA - SOLO TÍTULO */}
        <div className="about-hero__text-side">
          <div className="about-hero__text-content">
            <h1 className="about-hero__title">
              Jóvenes Mexicanos
              <span className="about-hero__title-highlight"> Revolucionando la Tecnología</span>
            </h1>
          </div>
        </div>

        {/* COLUMNA DERECHA - MAPA CON ZOOM AUTOMÁTICO LOOP */}
        <div className="about-hero__map-side">
          <div className="about-hero__map-wrapper">
            {MapComponent ? (
              <>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
                <MapComponent />
              </>
            ) : (
              <div className="about-hero__map-loading">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="3" strokeDasharray="60" strokeLinecap="round" opacity="0.3"/>
                  <circle cx="12" cy="12" r="10" stroke="var(--accent)" strokeWidth="3" strokeDasharray="15 45" strokeLinecap="round" style={{ animation: 'spin 1s linear infinite' }}/>
                </svg>
                <span>Cargando mapa...</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* HERO PRINCIPAL - FONDO TRANSPARENTE */
        .about-hero {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: transparent;
          display: flex;
          overflow: hidden;
        }

        /* COLUMNA IZQUIERDA - TRANSPARENTE */
        .about-hero__text-side {
          position: relative;
          width: 35%;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4rem 3rem;
          z-index: 2;
          background: transparent;
        }

        .about-hero__text-content {
          max-width: 500px;
        }

        /* TÍTULO - MISMA TIPOGRAFÍA QUE INTRODUCTION */
        .about-hero__title {
          font-size: 4rem;
          font-weight: 900;
          line-height: 1.8;
          color: #F4E4BC;
          text-shadow: 0 2px 12px rgba(0, 0, 0, 0.9);
          margin: 0;
          letter-spacing: 0.02em;
        }

        .about-hero__title-highlight {
          background: linear-gradient(135deg, var(--accent) 0%, #f4d03f 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: block;
          margin-top: 0.5rem;
          font-weight: 900;
          letter-spacing: 0.02em;
        }

        /* COLUMNA DERECHA - MAPA */
        .about-hero__map-side {
          position: relative;
          width: 65%;
          min-height: 100vh;
          z-index: 1;
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* WRAPPER DEL MAPA CON BORDES REDONDEADOS */
        .about-hero__map-wrapper {
          width: 100%;
          height: 85vh;
          border-radius: 30px;
          overflow: hidden;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.5),
            0 0 0 1px rgba(195, 173, 133, 0.2);
        }

        .about-hero__map-loading {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          background: rgba(6, 22, 58, 0.5);
          color: var(--accent);
          font-size: 1.3rem;
          font-weight: 600;
        }

        /* Controles de Leaflet */
        .about-hero__map-wrapper :global(.leaflet-control-zoom) {
          border: none !important;
          background: rgba(6, 22, 58, 0.9) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(195, 173, 133, 0.3) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }

        .about-hero__map-wrapper :global(.leaflet-control-zoom a) {
          background: rgba(27, 54, 93, 0.8) !important;
          color: var(--accent) !important;
          border: none !important;
          font-size: 1.2rem !important;
          width: 36px !important;
          height: 36px !important;
          line-height: 36px !important;
        }

        .about-hero__map-wrapper :global(.leaflet-control-zoom a:hover) {
          background: rgba(195, 173, 133, 0.2) !important;
        }

        /* Popup personalizado */
        .about-hero__map-wrapper :global(.leaflet-popup-content-wrapper) {
          background: rgba(6, 22, 58, 0.95) !important;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(195, 173, 133, 0.3);
          border-radius: 12px !important;
        }

        .about-hero__map-wrapper :global(.leaflet-popup-tip) {
          background: rgba(6, 22, 58, 0.95) !important;
        }

        /* RESPONSIVE */
        @media (max-width: 1200px) {
          .about-hero__text-side {
            width: 40%;
          }

          .about-hero__map-side {
            width: 60%;
            padding: 2rem;
          }

          .about-hero__title {
            font-size: 3.5rem;
          }
        }

        @media (max-width: 968px) {
          .about-hero {
            flex-direction: column;
          }

          .about-hero__text-side {
            width: 100%;
            min-height: auto;
            padding: 5rem 2rem 3rem;
            background: transparent;
          }

          .about-hero__text-content {
            max-width: 100%;
            text-align: center;
          }

          .about-hero__map-side {
            width: 100%;
            min-height: 60vh;
            padding: 2rem;
          }

          .about-hero__map-wrapper {
            height: 60vh;
            border-radius: 20px;
          }

          .about-hero__title {
            font-size: 3rem;
          }
        }

        @media (max-width: 640px) {
          .about-hero__text-side {
            padding: 4rem 1.5rem 2.5rem;
          }

          .about-hero__title {
            font-size: 2.5rem;
          }

          .about-hero__map-side {
            padding: 1.5rem;
          }

          .about-hero__map-wrapper {
            height: 50vh;
            border-radius: 16px;
          }
        }

        /* ACCESIBILIDAD */
        @media (prefers-reduced-motion: reduce) {
          .about-hero__map-wrapper :global(.leaflet-control-zoom),
          .about-hero__map-wrapper :global(.leaflet-popup) {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}