/**
 * El equipo de Geck Codex.
 *
 * Vive aqui y no dentro del componente porque lo consumen dos sitios con
 * necesidades distintas: la seccion de la pagina Nosotros y el JSON-LD de
 * `About.astro`, que emite un `Person` por cada uno. Cuando el mismo dato vive
 * en dos lados acaba divergiendo — ya paso con el portafolio.
 *
 * Los NOMBRES no se traducen; los puestos si, y se resuelven por `id` contra
 * `team.roles` en `src/i18n/translations.js`.
 *
 * `projects` son ids de `PROJECTS_STATIC`: quien llevo cada proyecto. No es
 * decoracion, es la prueba. Un perfil que dice "desarrollador full stack" no
 * demuestra nada; uno que dice "hizo Handlove, Ganova y Nuki" se puede
 * verificar en el portafolio de al lado, y es lo que los buscadores leen como
 * experiencia real.
 *
 * Los tres fundadores NO llevan rol tecnico. No es un olvido: no tienen roles
 * fijos —cada quien agarra un proyecto y lo saca completo, front, back,
 * servidor y diseño— y ponerles "Frontend Developer" seria mentira, ademas de
 * meternos a competir en el terreno donde una agencia de cuarenta personas
 * siempre gana. El argumento es el contrario: tu proyecto tiene UN responsable.
 *
 * `photo: null` dibuja las iniciales. Es un estado valido y definitivo, no un
 * hueco: la seccion se ve terminada sin foto y mejora cuando la haya. Hoy solo
 * Arleth esta asi.
 *
 * Los retratos son verticales (~2:3) y de estudio sobre fondo blanco. El
 * componente los encuadra a 2/3 anclados arriba: recorta por abajo, que es
 * donde no hay cara.
 */

export const TEAM = [
  {
    id: 'carlos',
    name: 'Carlos Manuel Ávila Holguín',
    founder: true,
    photo: '/assets/image/equipo/carlos.webp',
    projects: [22, 19, 17, 18, 3, 23, 21, 2, 9],
  },
  {
    id: 'eric',
    name: 'Eric Martín Ayala Argüello',
    founder: true,
    photo: '/assets/image/equipo/eric.webp',
    projects: [6, 25, 26],
  },
  {
    id: 'kevin',
    name: 'Kevin Eduardo Haros Araujo',
    founder: true,
    photo: '/assets/image/equipo/kevin.webp',
    projects: [24, 1, 11],
  },

  /* Estos dos no construyen: el cliente los trata, y por eso van en un bloque
   * aparte y con menos peso. El contador NO esta aqui a proposito — no toca el
   * producto ni al cliente, y sumarlo solo engorda el conteo.
   *
   * El componente descarta a quien no tenga nombre, asi que una entrada a
   * medias no rompe la pagina: se queda fuera hasta que se complete. */
  { id: 'ventas', name: 'Sergio Alfonso Borrego Soto',    founder: false, photo: '/assets/image/equipo/sergio.webp' },
  { id: 'admin',  name: 'Arleth Jaqueline Heredia Estrada', founder: false, photo: null },
];

/** Lo que salio de los tres a la vez. Va aparte porque no es de nadie. */
export const TEAM_TOGETHER = [7];

/** Cuantos proyectos se listan antes de resumir el resto en "y N mas". */
export const PROJECTS_SHOWN = 4;

export const teamById = (id) => TEAM.find((m) => m.id === id);

/** Los que se pintan: hoy, los que ya tienen nombre. */
export const visibleTeam = () => TEAM.filter((m) => m.name);
