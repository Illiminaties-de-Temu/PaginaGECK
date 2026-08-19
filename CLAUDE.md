# CLAUDE.md — PaginaGECK (Geck Codex)

## Idioma de comunicacion

**Siempre responder en español.** El usuario es hispanohablante y prefiere comunicarse en español en todas las interacciones.

---

## Descripcion del proyecto

Sitio web corporativo de **Geck Codex**, agencia de desarrollo de tecnologia ubicada en Parral, Chihuahua, Mexico. Diseno premium orientado a captacion de clientes: muestra servicios, portafolio, equipo y contacto.

- URL produccion: https://geckcodex.com
- Contacto: ventas@geckcodex.com | WhatsApp +52-627-174-5436
- Rama activa: `astro` (es la rama principal de desarrollo y produccion)

---

## Stack tecnico

| Capa | Tecnologia |
|------|------------|
| Framework principal | Astro 5 (SSG con hidratacion parcial) |
| Componentes interactivos | React 19 |
| Estilos | Tailwind CSS 4 + CSS global personalizado |
| Animaciones | Framer Motion 12 + Canvas API |
| Fisica | Matter.js 0.20.0 (lluvia de tecnologias) |
| Mapas | Leaflet 1.9 + React-Leaflet 5 |
| Iconos | Lucide React |
| SEO | @astrojs/sitemap, Open Graph, Schema.org JSON-LD |

> El proyecto usa `.jsx` (no `.tsx`) — TypeScript en strict mode esta configurado pero los componentes son JS puro. No usar `any` sin justificacion.

---

## Estructura del proyecto

```
src/
├── components/
│   ├── hero/
│   │   ├── Header.jsx              # Titulo hero + CTAs + fade en scroll
│   │   ├── ProjectCarousel.jsx     # Carousel infinito de proyectos con tooltips
│   │   ├── SpecialtiesShowcase.jsx # Sticky scroll con 3 videos (IA/Web/Mobile)
│   │   ├── Carrusel.jsx            # Logos de clientes con loop CSS
│   │   ├── StatsSection.jsx        # "En numeros" con count-up animation
│   │   └── VideoBackground.jsx     # Video parallax del hero
│   ├── abaut/
│   │   ├── Abouthero.jsx           # Parallax + mapa Leaflet de Parral
│   │   ├── Techstack.jsx           # Bento grid de tecnologias con Framer Motion
│   │   ├── Processtimeline.jsx     # Timeline del proceso de trabajo
│   │   ├── Fin.jsx                 # Seccion de cierre
│   │   └── python.jsx              # Showcase tecnologia Python
│   ├── servicios/
│   │   ├── ServicesSection.jsx     # Grid/carousel de 10 servicios + modal detalle
│   │   └── Testmodal.jsx           # Modal reutilizable para servicios
│   ├── portafolio/
│   │   └── Portafoliosection.jsx   # Grid de proyectos + filtros + modal detalle
│   ├── contacto/
│   │   └── Contact.jsx             # Formulario + WhatsApp/Gmail/Instagram
│   ├── Navbar.jsx                  # Nav multi-idioma + animacion logo + ondas canvas
│   ├── Footer.jsx                  # Redes sociales + boton UP + ondas canvas
│   ├── VideoBackground.jsx         # Wrapper parallax para videos
│   └── EnConstruccioin.jsx         # Placeholder "en construccion"
├── pages/
│   ├── index.astro                 # Homepage
│   ├── nosotros.astro
│   ├── servicios.astro
│   ├── portafolio.astro
│   ├── contacto.astro
│   └── blog.astro                  # Stub (noindex)
├── layouts/
│   └── MainLayout.astro            # Layout base: SEO completo, OG, Schema.org
└── styles/
    ├── global.css                  # Variables CSS, Tailwind, resets
    └── stacktecno.css              # Estilos especificos del tech stack
```

---

## Paleta de colores

```css
--navy-dark:   #0B1D33   /* Fondo principal */
--navy-mid:    #0b1f49
--navy-light:  #0c1e3c
--gold:        #D4AF37   /* Acento principal */
--gold-light:  #F4E4BC   /* Texto sobre fondos oscuros */
--gold-dark:   #B8941F
```

**Colores secundarios en uso:**
- `#222220` / `#1e1e1c` — fondos de secciones oscuras (contacto, servicios)
- `#030C1D` — navy profundo
- Gradiente de texto dorado: `linear-gradient(135deg, #F4E4BC, #D4AF37, #B8941F)`

No introducir colores fuera de esta paleta sin aprobacion del usuario.

---

## Patrones de animacion establecidos

Respetar estos patrones al crear o modificar componentes:

1. **Ondas canvas** — `AnimatedWaves` en Navbar y Footer. Patron de olas seno con particulas.
2. **Parallax scroll** — `useScroll` + `useTransform` de Framer Motion.
3. **Dispersion de texto** — hover caracter por caracter en el logo del Navbar. NO romper.
4. **Links magneticos** — `MagneticLink` en nav, seguimiento del mouse.
5. **Lluvia de tecnologias** — Matter.js en la pagina Nosotros.
6. **Carousel infinito** — loop CSS en Carrusel.jsx, pausa en hover/touch.
7. **Count-up** — StatsSection.jsx con IntersectionObserver + RAF.
8. **Sticky scroll transitions** — SpecialtiesShowcase.jsx con 240vh y video crossfade.

Siempre respetar `prefers-reduced-motion`. Todos los componentes tienen fallback estatico.

---

## Patrones de implementacion

### Animaciones con Framer Motion
```jsx
// Entrada estandar de secciones
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
```

### Carga dinamica (para Leaflet y componentes pesados)
```jsx
// En archivos .astro — evitar SSR de componentes con window/document
<ComponenteConMapa client:only="react" />
```

### Estado de idioma
El idioma vive solo en `Navbar.jsx` como estado React local. Otros componentes tienen texto hardcodeado en espanol. Al agregar texto en secciones que YA tienen soporte multilingue, usar el mismo patron de objeto de traducciones.

---

## Idiomas

El sitio soporta **espanol, ingles y portugues**. El selector esta en Navbar.jsx con un objeto `translations` que contiene los tres idiomas. El resto de los componentes aun estan en espanol hardcodeado — es deuda tecnica conocida, no un bug.

---

## Paginas y estado

| Pagina | Ruta | Estado |
|--------|------|--------|
| Homepage | `/` | Produccion |
| Nosotros | `/nosotros` | Produccion |
| Servicios | `/servicios` | Produccion |
| Portafolio | `/portafolio` | Produccion (reescritura reciente) |
| Contacto | `/contacto` | Produccion |
| Blog | `/blog` | Placeholder (noindex) |

---

## Assets y rutas de imagenes

```
public/
├── assets/
│   ├── image/
│   │   ├── portafolio/   # Imagenes de proyectos del portafolio
│   │   └── servicios/    # Imagenes de servicios (algunas pueden faltar)
│   └── video/
│       ├── geck-bg.mp4       # Hero desktop
│       ├── geck-movil.mp4    # Hero mobile
│       ├── ia.mp4/ ia-cel.mp4
│       ├── web.mp4/ web-movil.mp4
│       └── cel.mp4
└── favicon.svg
```

Si un video no existe, el componente falla silenciosamente (el fondo queda negro). No es un error critico.

---

## Servicios de Geck Codex

- Desarrollo Web (responsive, SEO, Core Web Vitals, CRM)
- Apps Moviles (nativas y cross-platform)
- E-commerce
- SaaS
- Automatizacion de procesos / Software a medida
- UI/UX Design
- Marketing Digital / Social Media
- Inversion en proyectos tecnologicos (Venture Studio)

---

## Clientes actuales (carousel en homepage)

- Gobierno Municipal de Parral
- Restaurante Las Chikis
- Capital Transport
- ITParral
- Coronado Gym

---

## Portafolio — proyectos actuales

El `Portafoliosection.jsx` tiene 16 proyectos hardcodeados divididos en categorias:

| Categoria | Badge color | Proyectos |
|-----------|-------------|-----------|
| Landing | Azul | Chuchulucos, Agend-In, LandingKit, Chava Calderon, BizBot |
| Mobile | Purpura | FleetTrack, SpendWise |
| Web | Verde | GymHub, StoreTools, BadgePrint |
| Software & IA | Naranja | SafePosture, RanchoControl, DrowsyGuard, EduAI, GeckCRM, + |

---

## Integraciones externas

- **WhatsApp**: `https://wa.me/5262717...` con mensaje automatico
- **Gmail**: formulario usa `mailto:` para pre-llenar
- **Leaflet**: mapa con zoom animado a Parral, Chihuahua, marcador dorado personalizado
- **SEO**: Google Site Verification en `MainLayout.astro`
- **Sitemap**: generado automaticamente por `@astrojs/sitemap`

---

## Lo que NO hacer

- No cambiar la paleta de colores sin aprobacion
- No romper la animacion de dispersion del logo en `Navbar.jsx`
- No eliminar el soporte `prefers-reduced-motion`
- No modificar `astro.config.mjs` sin verificar que `site: "https://geckcodex.com"` se mantiene
- No usar `any` en TypeScript
- No agregar texto hardcodeado en un solo idioma en secciones que ya tienen i18n
- No agregar dependencias pesadas sin evaluar impacto en bundle
- No usar `client:load` donde `client:visible` o `client:only` sea suficiente
