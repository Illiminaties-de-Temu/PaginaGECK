# state.md — Estado actual del proyecto PaginaGECK

> Ultima actualizacion: 2026-04-21
> Rama activa: `astro`

---

## Que estamos haciendo

Construyendo el sitio web corporativo de **Geck Codex** — un sitio premium con animaciones avanzadas para captar clientes. Cada pagina tiene diseno y animaciones propias. El objetivo inmediato es dejar el portafolio listo y funcional en produccion.

---

## Estado por pagina

### Homepage (`/`) — COMPLETA
Todas las secciones funcionando:
- Hero con video parallax + CTAs
- `ProjectCarousel` con 14 proyectos (tooltips, infinite loop)
- `SpecialtiesShowcase` sticky scroll con 3 videos (IA / Web / Mobile)
- `Carrusel` de logos de clientes
- `StatsSection` con count-up

### Nosotros (`/nosotros`) — COMPLETA
- Parallax hero con texto + mapa Leaflet animado de Parral
- Bento grid de tecnologias (Techstack.jsx)
- Timeline del proceso de trabajo
- Lluvia de tecnologias (Matter.js)

### Servicios (`/servicios`) — COMPLETA
- 10 servicios en 3 categorias
- Grid masonry en desktop, carousel en mobile
- Modal de detalle por servicio
- URL hash navigation (#web, #ia, etc.)

### Portafolio (`/portafolio`) — RECIEN REESCRITA, PENDIENTE COMMIT
Ver seccion de "Trabajo en progreso" abajo.

### Contacto (`/contacto`) — COMPLETA
- Formulario que redirige a WhatsApp o Gmail segun eleccion del usuario
- Animacion de exito (anillo + checkmark)
- 3 metodos de contacto: WhatsApp, Gmail, Instagram

### Blog (`/blog`) — PLACEHOLDER
Solo muestra `EnConstruccioin.jsx`. Tiene `noindex: true`. No se va a trabajar por ahora.

---

## Trabajo en progreso ahora mismo

### Portafolio — reescritura de `Portafoliosection.jsx`

**Que se hizo:**
- Reescritura completa del componente (era basico, ahora es un gallery completo)
- Cards con aspect ratio 19:9, imagen, overlay gradiente, badge de categoria, indicador "Live"
- Filtros por categoria: Todos / Landing / Mobile / Web / Software & IA
- Paginacion: 3 proyectos por pagina con Framer Motion entre paginas
- Modal de detalle con: imagen, descripcion, features, tech stack chips, link a produccion
- 16 proyectos hardcodeados con datos completos
- 9 imagenes nuevas agregadas a `public/assets/image/portafolio/`

**Que falta:**
- [ ] Hacer commit de `Portafoliosection.jsx` modificado
- [ ] Hacer commit de las imagenes en `public/assets/image/portafolio/`
- [ ] Verificar que las imagenes referenciadas en el codigo coincidan con los archivos reales
- [ ] Probar en mobile que el grid y el modal funcionen bien
- [ ] Revisar que el modal cierra correctamente con ESC y click fuera

**Archivos con cambios sin commitear:**
```
M  src/components/portafolio/Portafoliosection.jsx
?? public/assets/image/portafolio/
```

---

## Deuda tecnica conocida (no urgente)

| Item | Descripcion | Prioridad |
|------|-------------|-----------|
| i18n incompleta | Solo Navbar tiene traducciones EN/PT. Resto hardcodeado en ES | Media |
| Videos faltantes | geck-bg.mp4, ia.mp4, web.mp4, cel.mp4 no estan en el repo | Media |
| Imagenes de servicios | Algunas imagenes en `/assets/image/servicios/` pueden faltar | Baja |
| Blog vacio | Falta estructura, posts, filtrado | Baja |
| Error boundaries | No hay manejo de errores en carga de Leaflet ni videos | Baja |

---

## Decisiones de diseno tomadas (no revertir sin discutir)

- **Portafolio cards** usan aspect ratio 19:9 con imagen centrada y texto en la parte baja sobre gradiente oscuro
- **Colores de categoria** en portafolio: Landing=azul, Mobile=purpura, Web=verde, Software=naranja
- **Paginacion** de 3 proyectos (no infinite scroll) porque el modal necesita contexto visible
- **Modal del portafolio** tiene fondo `backdrop-blur` con `background: rgba(0,0,0,0.85)` — no cambiar a white/light
- **Contacto** usa azul `#1a4fd6` para el boton principal — excepcion aprobada a la paleta navy/gold
- **Carrusel de clientes** tiene logos en escala de grises que colorean en hover

---

## Contexto del equipo

- Carlos (usuario) — desarrollador principal del proyecto, toma decisiones de diseno y arquitectura
- Sergio — dio observaciones sobre el diseno (mencionadas en commits recientes), probablemente otro miembro del equipo o cliente
- El proyecto es para **Geck Codex**, que es la misma agencia que lo construye (sitio propio)

---

## Proximos pasos sugeridos

1. Commit del portafolio (imagenes + componente)
2. Probar portafolio en mobile
3. Verificar nombres de archivo de imagenes vs referencias en el codigo
4. (Opcional) Agregar mas proyectos reales al portafolio conforme se tengan
