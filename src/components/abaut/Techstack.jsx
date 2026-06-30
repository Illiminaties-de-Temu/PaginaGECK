import { useRef } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../../hooks/useLanguage';

const categoriesBase = [
  { id: 'frontend',  techs: [ { name: 'React', logo: 'https://cdn.simpleicons.org/react/61DAFB' }, { name: 'Next.js', logo: 'https://cdn.simpleicons.org/nextdotjs/ffffff' }, { name: 'Astro', logo: 'https://cdn.simpleicons.org/astro/FF5D01' }, { name: 'TypeScript', logo: 'https://cdn.simpleicons.org/typescript/3178C6' }, { name: 'JavaScript', logo: 'https://cdn.simpleicons.org/javascript/F7DF1E' }, { name: 'Tailwind', logo: 'https://cdn.simpleicons.org/tailwindcss/06B6D4' }, { name: 'HTML', logo: 'https://cdn.simpleicons.org/html5/E34F26' }, { name: 'CSS', logo: 'https://cdn.simpleicons.org/css3/1572B6' } ] },
  { id: 'mobile',    techs: [ { name: 'Flutter', logo: 'https://cdn.simpleicons.org/flutter/02569B' }, { name: 'Swift', logo: 'https://cdn.simpleicons.org/swift/F05138' }, { name: 'Kotlin', logo: 'https://cdn.simpleicons.org/kotlin/7F52FF' } ] },
  { id: 'design',    techs: [ { name: 'Figma', logo: 'https://cdn.simpleicons.org/figma/F24E1E' }, { name: 'Vite', logo: 'https://cdn.simpleicons.org/vite/646CFF' } ] },
  { id: 'cloud',     techs: [ { name: 'AWS', logo: 'https://cdn.simpleicons.org/amazonaws/FF9900' }, { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/2496ED' }, { name: 'Git', logo: 'https://cdn.simpleicons.org/git/F05032' }, { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/ffffff' }, { name: 'Vercel', logo: 'https://cdn.simpleicons.org/vercel/ffffff' } ] },
  { id: 'backend',   techs: [ { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/339933' }, { name: 'Python', logo: 'https://cdn.simpleicons.org/python/3776AB' }, { name: 'Django', logo: 'https://cdn.simpleicons.org/django/ffffff' }, { name: 'FastAPI', logo: 'https://cdn.simpleicons.org/fastapi/009688' }, { name: 'PHP', logo: 'https://cdn.simpleicons.org/php/777BB4' }, { name: 'GraphQL', logo: 'https://cdn.simpleicons.org/graphql/E10098' } ] },
  { id: 'databases', techs: [ { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql/4169E1' }, { name: 'MongoDB', logo: 'https://cdn.simpleicons.org/mongodb/47A248' }, { name: 'Redis', logo: 'https://cdn.simpleicons.org/redis/DC382D' }, { name: 'Supabase', logo: 'https://cdn.simpleicons.org/supabase/3ECF8E' }, { name: 'Firebase', logo: 'https://cdn.simpleicons.org/firebase/FFCA28' }, { name: 'Prisma', logo: 'https://cdn.simpleicons.org/prisma/ffffff' } ] },
];

// Easing premium tipo expo-out
const easeExpo = [0.16, 1, 0.3, 1];

function TechIcon({ name, logo }) {
  return (
    <div className="bt-icon">
      <img src={logo} alt={name} className="bt-icon-img" loading="lazy" width="42" height="42" />
      <span className="bt-icon-name">{name}</span>
    </div>
  );
}

function BentoCard({ category, delay }) {
  return (
    <motion.div
      className={`bt-card bt-${category.id}`}
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.65, delay, ease: easeExpo }}
    >
      <span className="bt-label">{category.label}</span>
      <div className="bt-icons">
        {category.techs.map(t => (
          <TechIcon key={t.name} {...t} />
        ))}
      </div>
    </motion.div>
  );
}

export default function TechStack() {
  const { t } = useLanguage();
  const categories = categoriesBase.map(c => ({ ...c, label: t.tech.catLabels[c.id] }));
  return (
    <section className="bt-section">

      <motion.div
        className="bt-heading"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.6, ease: easeExpo }}
      >
        <p className="bt-eyebrow">{t.tech.eyebrow}</p>
        <h2 className="bt-title">
          {t.tech.title} <span className="bt-gold">{t.tech.highlight}</span>
        </h2>
      </motion.div>

      <div className="bt-grid">
        <BentoCard category={categories[0]} delay={0.08} />
        <BentoCard category={categories[1]} delay={0.16} />
        <BentoCard category={categories[2]} delay={0.22} />
        <BentoCard category={categories[3]} delay={0.28} />
        <BentoCard category={categories[4]} delay={0.34} />
        <BentoCard category={categories[5]} delay={0.40} />
      </div>

      <style>{`
        .bt-section {
          width: 100%;
          padding: 120px 48px 140px;
          font-family: var(--font-body);
          background: transparent;
          box-sizing: border-box;
        }

        /* ── Heading ── */
        .bt-heading {
          text-align: center;
          margin-bottom: 72px;
        }
        .bt-eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--text-muted);
          margin: 0 0 16px;
          opacity: 0.9;
        }
        .bt-title {
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 700;
          color: var(--text);
          margin: 0;
          line-height: 1.15;
        }
        .bt-gold {
          color: var(--accent-text);
          font-weight: 300;
        }

        /* ── Grid ── */
        .bt-grid {
          display: grid;
          grid-template-areas:
            "frontend frontend mobile  design"
            "frontend frontend mobile  cloud"
            "backend  backend  databases databases";
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: minmax(220px, auto) minmax(220px, auto) minmax(180px, auto);
          gap: 20px;
          max-width: 1300px;
          margin: 0 auto;
        }

        /* ── Card ── */
        .bt-card {
          background: rgba(11, 29, 51, 0.65);
          border: 1px solid rgba(195, 173, 133, 0.1);
          border-radius: 22px;
          padding: 36px 32px;
          backdrop-filter: blur(8px);
          transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.35s ease;
        }
        .bt-card:hover {
          border-color: rgba(195, 173, 133, 0.35);
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(195,173,133,0.08);
          transform: translateY(-6px);
        }

        .bt-frontend  { grid-area: frontend; }
        .bt-mobile    { grid-area: mobile; }
        .bt-design    { grid-area: design; }
        .bt-cloud     { grid-area: cloud; }
        .bt-backend   { grid-area: backend; }
        .bt-databases { grid-area: databases; }

        /* ── Label ── */
        .bt-label {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--accent);
          opacity: 0.75;
          margin-bottom: 22px;
        }

        /* ── Icons ── */
        .bt-icons {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          align-content: flex-start;
        }
        .bt-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          cursor: default;
        }
        .bt-icon-img {
          width: 42px;
          height: 42px;
          object-fit: contain;
          opacity: 0.72;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .bt-icon:hover .bt-icon-img {
          opacity: 1;
          transform: translateY(-3px) scale(1.08);
        }
        .bt-icon-name {
          font-size: 0.6rem;
          color: rgba(255, 255, 255, 0.38);
          letter-spacing: 0.04em;
          white-space: nowrap;
          transition: color 0.25s ease;
        }
        .bt-icon:hover .bt-icon-name {
          color: rgba(255, 255, 255, 0.88);
        }

        /* ── Responsive ── */
        @media (max-width: 900px) {
          .bt-section { padding: 80px 24px 100px; }
          .bt-grid {
            grid-template-areas:
              "frontend  frontend"
              "backend   backend"
              "databases databases"
              "mobile    design"
              "cloud     cloud";
            grid-template-columns: 1fr 1fr;
            grid-template-rows: auto;
          }
        }
        @media (max-width: 520px) {
          .bt-section { padding: 64px 16px 80px; }
          .bt-grid {
            grid-template-areas:
              "frontend"
              "backend"
              "databases"
              "mobile"
              "cloud"
              "design";
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .bt-card { transition: none; }
          .bt-icon-img { transition: none; }
        }
      `}</style>
    </section>
  );
}
