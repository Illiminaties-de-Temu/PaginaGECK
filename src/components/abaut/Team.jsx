import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';
import { localizedPath } from '../../i18n/routes';
import { visibleTeam, TEAM_TOGETHER, PROJECTS_SHOWN } from '../../data/team.js';
import { projectById } from '../../data/projects.js';

/**
 * "El equipo" — la página de Nosotros prometía equipo y no lo entregaba: el CTA
 * de la home dice "Conoce al equipo" y aterrizaba en el mapa, la misión y el
 * stack. Esto cierra esa promesa.
 *
 * Lo que se vende aquí NO es cuánta gente somos. Es que tu proyecto tiene UN
 * responsable con nombre, que además es quien lo programa. Contra una agencia
 * grande esa es la ventaja real —nadie hereda un ticket, nadie te pasa con un
 * ejecutivo de cuenta— y de paso evita el conteo de cabezas, que es donde un
 * equipo chico siempre pierde.
 *
 * EL RETRATO MANDA. Son fotos de estudio verticales y consistentes entre sí, y
 * a ese material se le hace caso: van grandes y en su proporción, no metidas a
 * la fuerza en un círculo de 64 px.
 *
 * LA ENTRADA VA ATADA AL SCROLL. No se dispara para correr sola: el progreso
 * del scroll ES la línea de tiempo, así que el visitante abre las cortinas con
 * la rueda y, si sube, se cierran. Se resuelve con useScroll y useMotionTemplate
 * —el mismo patrón de MisionVision y AboutTeaser— y no con las scroll-timelines
 * nativas de CSS, que Safari todavía no soporta.
 *
 * Los valores viven en MotionValues: se escriben directo sobre el estilo del
 * nodo, sin volver a renderizar React en cada frame.
 */

/* Dos iniciales bastan: con tres o más el recuadro se vuelve una sopa de
 * letras al tamaño al que se pinta. */
const initialsOf = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/* El ciclo completo, medido en progreso de scroll y no en segundos: aquí la
 * cadencia la marca la rueda.
 *
 * La sección se recorre entera (de asomar por abajo a salir por arriba), así
 * que hay DOS actos. Al entrar, la cortina sube y descubre el retrato; al
 * salir, sigue subiendo y lo tapa. El movimiento no se devuelve: va siempre en
 * el mismo sentido, de modo que la foto entra por abajo y se va por arriba.
 *
 * STEP escalona a las personas; OPEN y CLOSE son cuánto dura cada acto. Entre
 * el final de uno y el principio del otro los retratos se quedan quietos, que
 * es cuando toca leerlos. */
const STEP = 0.045;
const OPEN_AT = 0.05;
const OPEN = 0.20;
const CLOSE_AT = 0.60;
const CLOSE = 0.18;

/* Cuánto se pasa de escala la foto en los extremos del recorrido. */
const ZOOM = 1.18;

/* Medidas del archivo, para reservar el hueco y evitar el salto de layout.
 * Los retratos se generan todos al mismo ancho; el alto es el de la proporción
 * del marco, que es la que acaba viéndose. */
const PHOTO_W = 720;
const PHOTO_H = 1080;

/* Los proyectos enlazan al portafolio: el nombre del proyecto es el mejor
 * anchor posible, y de paso cierra el circuito entre quien lo hizo y la obra
 * —que es justo lo que esta seccion afirma— en vez de dejarlo como texto
 * suelto que hay que creer. */
function Built({ ids, t, lang }) {
  if (!ids || !ids.length) return null;

  const shown = ids.slice(0, PROJECTS_SHOWN);
  const rest = ids.length - shown.length;
  const href = localizedPath('portfolio', lang);

  return (
    <p className="tm__built">
      {shown.map((id, i) => {
        const p = projectById(id);
        if (!p) return null;
        return (
          <span key={id}>
            {i > 0 && <span className="tm__sep" aria-hidden="true"> · </span>}
            <a className="tm__link" href={href}>{p.title}</a>
          </span>
        );
      })}
      {rest > 0 && <span className="tm__more"> {t.more(rest)}</span>}
    </p>
  );
}

/* Cada persona calcula su propio tramo del progreso. Va en un componente aparte
 * porque los hooks tienen que ser estables: dentro de un .map no se pueden
 * llamar. */
function Person({ member, index, tm, progress, reduce, children }) {
  const openFrom = OPEN_AT + index * STEP;
  const openTo = openFrom + OPEN;
  const closeFrom = CLOSE_AT + index * STEP;
  const closeTo = closeFrom + CLOSE;

  /* La cortina se aplica al marco y no como opacidad sobre la foto: una cara a
     medio desvanecer se ve mal, y así el retrato siempre está sólido — solo que
     todavía no se ve entero.
     Dos recortes independientes y no uno: el de arriba descubre al entrar y el
     de abajo tapa al salir. Con un solo valor la salida sería la entrada
     rebobinada, que se lee como un error y no como un gesto. */
  const cutTop = useTransform(progress, [openFrom, openTo], [100, 0]);
  const cutBottom = useTransform(progress, [closeFrom, closeTo], [0, 100]);
  const clipPath = useMotionTemplate`inset(${cutTop}% 0 ${cutBottom}% 0)`;

  /* La foto entra pasada de escala y sale pasada otra vez: en medio se queda
     en su tamaño real, que es cuando toca mirarla. */
  const scale = useTransform(
    progress,
    [openFrom, openTo, closeFrom, closeTo],
    [ZOOM, 1, 1, ZOOM],
  );

  /* El texto entra detrás de su propia foto, no a la vez: eso es lo que hace
     que se lea como una presentación. Y se va antes que ella. */
  const textOpacity = useTransform(
    progress,
    [openFrom + 0.08, openTo + 0.03, closeFrom, closeFrom + 0.1],
    [0, 1, 1, 0],
  );
  const textY = useTransform(
    progress,
    [openFrom + 0.08, openTo + 0.03, closeFrom, closeFrom + 0.1],
    [30, 0, 0, -30],
  );

  return (
    <article className="tm__person">
      <motion.span className="tm__frame" style={reduce ? undefined : { clipPath }}>
        {member.photo ? (
          <motion.img
            className="tm__photo"
            style={reduce ? undefined : { scale }}
            src={member.photo}
            alt={tm.photoAlt(member.name)}
            /* Las medidas reales del archivo, no las de pantalla: sirven para
               que el navegador reserve el hueco antes de descargar la imagen y
               la pagina no de un salto. El tamano lo sigue mandando el CSS. */
            width={PHOTO_W}
            height={PHOTO_H}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span className="tm__initials" aria-hidden="true">{initialsOf(member.name)}</span>
        )}
      </motion.span>

      <motion.div
        className="tm__info"
        style={reduce ? undefined : { opacity: textOpacity, y: textY }}
      >
        {children}
      </motion.div>
    </article>
  );
}

export default function Team({ lang }) {
  const { t } = useLanguage(lang);
  const tm = t.team;
  const reduce = useReducedMotion();

  const secRef = useRef(null);

  /* La sección entera, de asomar por abajo a desaparecer por arriba. Antes el
     rango moría en el centro de la pantalla y solo daba para la entrada; con el
     recorrido completo caben los dos actos. */
  const { scrollYProgress } = useScroll({
    target: secRef,
    offset: ['start end', 'end start'],
  });
  /* Sin el muelle la cortina sigue la rueda a tirones; con él el gesto se
     siente continuo aunque el scroll llegue a saltos. */
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    mass: 0.35,
    restDelta: 0.0005,
  });

  const headOpacity = useTransform(progress, [0, 0.12, 0.72, 0.86], [0, 1, 1, 0]);
  const headY = useTransform(progress, [0, 0.12, 0.72, 0.86], [40, 0, 0, -40]);
  const noteOpacity = useTransform(progress, [0.34, 0.46, 0.74, 0.86], [0, 1, 1, 0]);
  const noteY = useTransform(progress, [0.34, 0.46, 0.74, 0.86], [26, 0, 0, -26]);

  const people = visibleTeam();
  const builders = people.filter((m) => m.founder);
  const care = people.filter((m) => !m.founder);
  const together = TEAM_TOGETHER.map(projectById).filter(Boolean);

  return (
    <>
      <section ref={secRef} className="tm" id="equipo">
        <motion.header
          className="tm__head"
          style={reduce ? undefined : { opacity: headOpacity, y: headY }}
        >
          <span className="tm__eyebrow">{tm.eyebrow}</span>
          <h2 className="tm__h2">
            {tm.title} <span className="tm__accent">{tm.highlight}</span>
          </h2>
          <p className="tm__lead">{tm.lead}</p>
        </motion.header>

        <span className="tm__label">{tm.buildersLabel}</span>

        <div className="tm__grid">
          {builders.map((m, i) => (
            <Person key={m.id} member={m} index={i} tm={tm} progress={progress} reduce={reduce}>
              <span className="tm__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="tm__name">{m.name}</h3>
              <span className="tm__role">{tm.founderRole}</span>
              <Built ids={m.projects} t={tm} lang={lang} />
            </Person>
          ))}
        </div>

        {together.length > 0 && (
          <motion.p
            className="tm__together"
            style={reduce ? undefined : { opacity: noteOpacity, y: noteY }}
          >
            <span className="tm__togetherlabel">{tm.togetherLabel}</span>
            {tm.togetherText}
          </motion.p>
        )}

        {care.length > 0 && (
          <>
            <span className="tm__label">{tm.careLabel}</span>
            <div className="tm__row">
              {care.map((m, i) => (
                /* Siguen el escalón donde lo dejaron los fundadores, para que la
                   ola no se reinicie a media sección. */
                <Person
                  key={m.id}
                  member={m}
                  index={builders.length + i}
                  tm={tm}
                  progress={progress}
                  reduce={reduce}
                >
                  <span className="tm__name tm__name--sm">{m.name}</span>
                  <span className="tm__role">{tm.roles[m.id]}</span>
                </Person>
              ))}
            </div>
          </>
        )}
      </section>

      <style>{`
        .tm {
          position: relative;
          padding: clamp(3.5rem, 9vh, 6rem) 1.25rem;
          max-width: 1120px;
          margin: 0 auto;
        }

        /* ── Encabezado ── */
        .tm__head { text-align: center; margin-bottom: clamp(2.2rem, 5vh, 3.2rem); }
        .tm__eyebrow {
          display: inline-block;
          font-size: .74rem; font-weight: 700; letter-spacing: .28em;
          text-transform: uppercase; color: var(--accent-text);
          margin-bottom: .8rem;
        }
        .tm__h2 {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 3.6vw, 2.6rem);
          font-weight: 900; line-height: 1.14; color: var(--text);
          margin: 0 auto .9rem;
          max-width: 22ch;
          text-wrap: balance;
        }
        .tm__accent { color: var(--accent-text); }
        .tm__lead {
          margin: 0 auto;
          max-width: 62ch;
          font-size: clamp(.92rem, 1.15vw, 1.03rem);
          line-height: 1.65; color: var(--text-muted);
        }

        /* Etiqueta de grupo: un filete que cruza el ancho y la nombra. */
        .tm__label {
          display: flex; align-items: center; gap: .8rem;
          margin-bottom: clamp(1rem, 2.5vh, 1.5rem);
          font-size: .66rem; font-weight: 800; letter-spacing: .2em;
          text-transform: uppercase; color: var(--text-muted);
        }
        .tm__label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

        /* ── Los retratos ──
           auto-fit y no tres columnas fijas: en un teléfono caben dos sin que
           nadie declare el punto de quiebre, y las fotos nunca bajan de un ancho
           en el que se vea la cara. */
        .tm__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(clamp(150px, 22vw, 250px), 1fr));
          gap: clamp(1.2rem, 2.6vw, 2rem);
        }

        .tm__frame {
          display: block;
          position: relative;
          width: 100%;
          /* La proporción la fija el marco; la foto la llena. Así una foto de
             0.56 y otra de 0.67 se ven idénticas en la fila sin estirarse. */
          aspect-ratio: 2 / 3;
          border-radius: 14px;
          overflow: hidden;
          background: var(--surface);
          border: 1px solid var(--border);
        }
        .tm__photo {
          width: 100%; height: 100%;
          object-fit: cover;
          /* Anclada arriba: en un retrato lo que sobra está en los pies, nunca
             en la cara. */
          object-position: center top;
          display: block;
        }
        .tm__initials {
          position: absolute; inset: 0;
          display: flex; align-items: center; justify-content: center;
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 3.4vw, 2.4rem);
          font-weight: 900; letter-spacing: .04em;
          color: var(--accent-text);
          background: var(--surface-2, var(--surface));
        }

        .tm__info { margin-top: .85rem; }
        .tm__num {
          display: block;
          margin-bottom: .25rem;
          font-family: var(--font-display);
          font-size: .68rem; font-weight: 800; letter-spacing: .18em;
          color: var(--accent-text);
          font-variant-numeric: tabular-nums;
        }
        .tm__name {
          display: block;
          font-family: var(--font-display);
          font-size: clamp(.98rem, 1.5vw, 1.2rem);
          font-weight: 800; line-height: 1.2; color: var(--text);
          margin: 0 0 .2rem;
          text-wrap: balance;
        }
        .tm__name--sm { font-size: clamp(.92rem, 1.3vw, 1.05rem); }
        .tm__role {
          display: block;
          font-size: .7rem; font-weight: 700; letter-spacing: .04em;
          color: var(--text-muted);
        }
        .tm__built {
          margin: .6rem 0 0;
          padding-top: .6rem;
          border-top: 1px solid var(--border);
          font-size: clamp(.78rem, .92vw, .86rem);
          line-height: 1.5; color: var(--text-muted);
        }
        .tm__link {
          color: inherit;
          text-decoration-color: var(--border);
          text-underline-offset: 3px;
          transition: color .25s ease, text-decoration-color .25s ease;
        }
        .tm__link:hover { color: var(--accent-text); text-decoration-color: var(--accent); }
        .tm__sep { opacity: .45; }
        .tm__more { opacity: .65; }

        /* ── La nota de los tres juntos ── */
        .tm__together {
          margin: clamp(1.6rem, 4vh, 2.4rem) auto clamp(2.2rem, 5vh, 3rem);
          font-size: clamp(.88rem, 1.1vw, .98rem);
          line-height: 1.6; color: var(--text-muted);
          max-width: 60ch;
          text-align: center;
        }
        .tm__togetherlabel {
          display: block;
          font-size: .64rem; font-weight: 800; letter-spacing: .16em;
          text-transform: uppercase; color: var(--accent-text);
          margin-bottom: .35rem;
        }

        /* ── Los que atienden ──
           Mismo formato que los de arriba y solo un punto más chicos. A 62 px de
           ancho no se les veía la cara, y son justamente las dos personas con
           las que el cliente va a hablar. */
        .tm__row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(clamp(140px, 18vw, 200px), 1fr));
          gap: clamp(1.2rem, 2.6vw, 2rem);
          max-width: 640px;
        }
        .tm__row .tm__initials { font-size: clamp(1.3rem, 2.6vw, 1.9rem); }
      `}</style>
    </>
  );
}
