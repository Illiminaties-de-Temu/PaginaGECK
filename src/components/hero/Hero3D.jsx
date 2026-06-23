import { Suspense, useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  ContactShadows,
  Environment,
  Html,
  useProgress,
} from '@react-three/drei';

/* Precarga del modelo para que empiece a bajar cuanto antes */
useGLTF.preload('/models/geck.glb');

const MODEL_URL = '/models/geck.glb';

/* ──────────────────────────────────────────────
   Modelo: centrado, con flotación, auto-rotación
   y parallax suave siguiendo el mouse.
────────────────────────────────────────────── */
function GeckModel({ reduceMotion }) {
  const { scene } = useGLTF(MODEL_URL);
  const groupRef = useRef(null);
  const pointer = useThree((s) => s.pointer);

  /* Clon normalizado: centrado, escalado a un tamaño objetivo y con sombras.
     Esto hace que cualquier .glb (sin importar sus unidades) encaje en el encuadre. */
  const model = useMemo(() => {
    const clone = scene.clone(true);

    clone.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
        if (o.material) o.material.envMapIntensity = 1.1;
      }
    });

    /* Auto-fit: escalar para que la dimensión mayor mida ~3 unidades y centrar */
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 3 / maxDim;

    clone.scale.setScalar(scale);
    clone.position.set(
      -center.x * scale,
      -center.y * scale,
      -center.z * scale
    );

    return clone;
  }, [scene]);

  useFrame((state, delta) => {
    const g = groupRef.current;
    if (!g) return;

    if (reduceMotion) {
      g.rotation.y = -0.35;
      g.rotation.x = 0;
      g.position.y = 0;
      return;
    }

    /* Auto-rotación constante */
    g.rotation.y += delta * 0.25;

    /* Parallax: el modelo se inclina ligeramente hacia el mouse */
    const targetX = pointer.y * 0.18;
    const targetTilt = pointer.x * 0.25;
    g.rotation.x += (targetX - g.rotation.x) * 0.05;

    /* Flotación vertical suave */
    g.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;

    /* Ligero desplazamiento lateral con el mouse */
    g.position.x += (targetTilt * 0.4 - g.position.x) * 0.04;
  });

  return (
    <group ref={groupRef}>
      <primitive object={model} />
    </group>
  );
}

/* ──────────────────────────────────────────────
   Loader dorado mientras baja el .glb (15 MB)
────────────────────────────────────────────── */
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="hero3d-loader">
        <div className="hero3d-loader__ring" />
        <span className="hero3d-loader__pct">{Math.round(progress)}%</span>
        <style>{`
          .hero3d-loader {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            color: #F4E4BC;
            font-size: 0.7rem;
            letter-spacing: 0.2em;
            user-select: none;
          }
          .hero3d-loader__ring {
            width: 38px;
            height: 38px;
            border-radius: 50%;
            border: 2px solid rgba(195, 173, 133, 0.18);
            border-top-color: var(--accent);
            animation: hero3d-spin 0.9s linear infinite;
          }
          .hero3d-loader__pct { opacity: 0.7; }
          @keyframes hero3d-spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </Html>
  );
}

/* ──────────────────────────────────────────────
   Escena: luces en clave dorada/navy + reflejos
────────────────────────────────────────────── */
function Scene({ reduceMotion }) {
  return (
    <>
      {/* Luz ambiental tenue navy */}
      <ambientLight intensity={0.35} color="#7da0d4" />

      {/* Key light dorada principal */}
      <directionalLight
        position={[4, 6, 5]}
        intensity={2.4}
        color="#F4E4BC"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0002}
      />

      {/* Fill frío para volumen */}
      <directionalLight position={[-6, 2, -3]} intensity={0.8} color="#2a4a82" />

      {/* Rim dorado trasero para recortar la silueta */}
      <spotLight
        position={[0, 4, -6]}
        angle={0.6}
        penumbra={1}
        intensity={3}
        color="var(--accent)"
      />

      {/* Punto de brillo dorado */}
      <pointLight position={[2, -2, 3]} intensity={1.2} color="var(--accent)" />

      <Suspense fallback={<Loader />}>
        <GeckModel reduceMotion={reduceMotion} />
      </Suspense>

      {/* Reflejos PBR en su propio Suspense: el modelo se ve aunque el HDR
          remoto tarde o no cargue (degrada con elegancia a solo luces) */}
      <Suspense fallback={null}>
        <Environment preset="sunset" />
      </Suspense>

      {/* Sombra de contacto para anclar el modelo */}
      <ContactShadows
        position={[0, -1.3, 0]}
        opacity={0.45}
        scale={10}
        blur={2.6}
        far={3}
        color="#000000"
      />
    </>
  );
}

/* ──────────────────────────────────────────────
   Wrapper: Canvas + detección de reduced motion
────────────────────────────────────────────── */
export default function Hero3D() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const onChange = (e) => setReduceMotion(e.matches);
    mq.addEventListener('change', onChange);

    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      mq.removeEventListener('change', onChange);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <div className="hero3d">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 0.3, 6.2], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={reduceMotion ? 'demand' : 'always'}
        style={{ pointerEvents: 'none' }}
      >
        <Scene reduceMotion={reduceMotion} />
      </Canvas>

      <style>{`
        .hero3d {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        /* En mobile el modelo sube un poco para no chocar con el texto */
        @media (max-width: 768px) {
          .hero3d { transform: translateY(-8%) scale(0.9); }
        }
      `}</style>
    </div>
  );
}
