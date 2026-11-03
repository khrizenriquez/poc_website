# Dirección técnica de la POC

Fecha: 2026-10-31.

Estado: aplicación, traducciones y suite implementadas localmente. El workflow de GitHub Pages está preparado; la publicación remota no se ha realizado. Ver README y test-matrix.md para ejecución y evidencia.

## Requisitos confirmados

- React 19 y pnpm.
- Publicación estática en GitHub Pages desde el repositorio `khrizenriquez/poc_website`.
- Demo sin base de datos ni datos sensibles; contenido y datos de ejemplo locales.
- Configuración de idiomas en JavaScript, español predeterminado e inglés disponible.
- Corporativo regional conectado con sitios nacionales mediante selector, mapa y presencia regional.
- Referencias visuales: Lusion, Montfort y Apple AirPods Pro.

## Selección técnica propuesta

| Capa         | Selección                            | Propósito                                                                                  |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------ |
| Aplicación   | React 19 + Vite                      | Compilar HTML, CSS, JS y recursos para alojamiento estático.                               |
| Dependencias | pnpm                                 | Fijar versiones compatibles y conservar `pnpm-lock.yaml`.                                  |
| Estilos      | Tailwind CSS 4 + CSS propio          | Composición responsive y variables compartidas de color, tipografía, espacio y movimiento. |
| Animación    | GSAP + ScrollTrigger + `@gsap/react` | Coordinar capítulos de scroll y limpiar animaciones al cambiar de página.                  |
| Escenas 3D   | Three.js + React Three Fiber 9       | Cargar escenas de apertura/red regional bajo demanda; la versión 9 corresponde a React 19. |
| Navegación   | React Router con HashRouter          | Soportar enlaces directos y recarga en GitHub Pages sin reglas de reescritura.             |
| Idiomas      | i18next + react-i18next              | Textos, plurales y cambio de idioma con recursos JavaScript locales.                       |
| Contenido    | Módulos JavaScript locales           | Países, servicios, productos y novedades de la demo.                                       |

El aspecto se construirá con componentes propios. CSS resolverá estados sencillos de botones, enlaces y controles; GSAP coordinará el movimiento narrativo. La escena 3D tendrá una alternativa estática y respetará las preferencias de movimiento reducido.

## Rutas y GitHub Pages

Base de compilación para el repositorio: `/poc_website/`.

Ejemplos de rutas previstas, no URLs ya publicadas:

```text
/poc_website/#/es/
/poc_website/#/es/presencia-regional/
/poc_website/#/es/guatemala/
/poc_website/#/en/guatemala/
```

Las rutas lógicas descritas en el mapa del sitio se conservarán dentro del fragmento, precedidas por el idioma. Los slugs serán estables entre idiomas en esta demo; cambiar a inglés traduce el contenido y mantiene la página y país seleccionados.

Se preparará GitHub Actions para instalar con `pnpm install --frozen-lockfile`, validar, compilar y publicar `dist` usando el mecanismo oficial de Pages. Los recursos se resolverán con la base de Vite; las páginas nacionales no dependerán de archivos fuera de `poc`. Las fuentes y recursos propios usados por la demo se incluirán en la compilación.

La configuración del repositorio deberá habilitar Pages con GitHub Actions cuando corresponda publicar. La compatibilidad de despliegue se verificará; no se considera demostrada por escribir este documento.

## Idiomas

Archivo existente: `src/config/languages.js`.

Estructura prevista:

```text
src/
  config/
    languages.js
  i18n/
    index.js
    locales/
      es.js
      en.js
  data/
    countries.js
    products.js
    news.js
  styles/
    theme.css
    global.css
```

- Primera visita sin idioma explícito ni preferencia guardada: español, independientemente del idioma del navegador.
- Un idioma válido en la URL tiene prioridad sobre la preferencia guardada.
- Sin idioma explícito, se usa una preferencia guardada válida; en su ausencia, español.
- Guardar la selección de idioma en localStorage. Si el almacenamiento no está disponible, el selector y la URL siguen funcionando.
- Un prefijo de idioma no admitido lleva al equivalente en español o a la página de ruta inexistente si el resto de la ruta no existe.
- Actualizar `html.lang`, títulos de página, navegación, contenido, etiquetas accesibles y validaciones al cambiar el idioma.
- Español es la alternativa si falta una traducción, pero se comprobará la paridad de claves para entregar ambas versiones completas.
- Los datos traducibles de productos, países y noticias deben estar localizados; no basta con traducir el menú.
- País e idioma son decisiones independientes.
- Agregar un idioma requiere registrar su configuración y aportar sus traducciones.

## Comportamiento de demo

Formularios y pedidos validan localmente y muestran una confirmación explícita de simulación. No transmiten información ni persisten datos introducidos en formularios. El almacenamiento local se limita a las preferencias de idioma y apariencia.

El contenido de ejemplo puede estar escrito directamente en módulos JS. Las cifras, testimonios o afirmaciones inventadas para demostrar un diseño se identificarán como contenido de ejemplo.

## Aceptación técnica que deberá cumplir la implementación

| ID   | Comprobación                                                                                                                    |
| ---- | ------------------------------------------------------------------------------------------------------------------------------- |
| T-01 | React y React DOM pertenecen a la versión mayor 19; instalación reproducible mediante pnpm y lockfile.                          |
| T-02 | La compilación produce un `dist` estático sin procesos de servidor necesarios en producción.                                    |
| T-03 | Las rutas corporativas y nacionales abren directamente y admiten recarga bajo `/poc_website/`, sin errores de recursos propios. |
| T-04 | Primera visita en español y cambio a inglés manteniendo país y página; enlaces con idioma explícito son reproducibles.          |
| T-05 | Paridad de claves ES/EN y traducción de texto visible, estados de formularios y etiquetas accesibles.                           |
| T-06 | Los formularios de demo no envían datos ni prometen un registro o entrega real.                                                 |
| T-07 | Navegación, contenido y selector regional funcionan en móvil, con teclado, con movimiento reducido y sin escena 3D.             |
| T-08 | Las rutas desconocidas muestran una vista interna de página no encontrada con retorno al sitio.                                 |

## Documentación consultada

- [Vite: despliegue estático en GitHub Pages](https://vite.dev/guide/static-deploy)
- [Tailwind CSS con Vite](https://tailwindcss.com/docs/installation/using-vite)
- [GSAP con React](https://gsap.com/resources/React/)
- [React Three Fiber y compatibilidad con React 19](https://r3f.docs.pmnd.rs/getting-started/introduction)
- [React Router: HashRouter](https://reactrouter.com/api/declarative-routers/HashRouter)
- [react-i18next](https://react.i18next.com/latest)

## Apariencia

Implementado claro/oscuro/sistema. Ver [contrato del tema](theme.md), configuración en `src/config/theme.js` y colores en `src/styles/themes.css`. El proveedor permanece montado al navegar para conservar elecciones aunque el almacenamiento esté bloqueado.
