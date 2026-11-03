# Recursos visuales locales

Fecha de selección: 2026-10-31. Todos los archivos se copiaron sin modificar desde la exportación local de Leterago Guatemala. Las imágenes se inspeccionaron visualmente antes de su selección. Son material existente del proyecto, no fotografías generadas para la POC.

La base de las rutas fuente de imágenes es `../leterago-static/assets/leterago.com.gt/wp-content/uploads/`, relativa a la raíz de `poc`. Los destinos están en `public/media/`.

| Destino                   | Fuente                                                                                                               | Descripción y uso recomendado                                                                                                                 |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `logistics-person.jpg`    | `2026/05/1.-Quienes-somos-min-scaled.jpg`                                                                            | Operario con caja de Leterago entre estanterías. 1620×1080, 226 KB. Imagen de operación y servicio, con persona a la izquierda.               |
| `distribution-center.jpg` | `2026/05/3.-Distribucion-de-vanguardia-en-Centroamerica-min-scaled.jpg`                                              | Centro de distribución, vehículos y muelles de carga. 1920×976, 330 KB. Fotografía horizontal para infraestructura o sección de gran formato. |
| `regional-office.jpg`     | `2026/05/1.-empresa-vision-regional-min-scaled.jpg`                                                                  | Fachada corporativa identificada con la marca Leterago. 1620×1080, 262 KB. Presentación institucional.                                        |
| `people-team.jpg`         | `2026/05/4.-Capital-Humano-min-scaled.jpg`                                                                           | Equipo de Leterago en un pasillo de almacenamiento. 1624×1080, 298 KB. Cultura, empleo y componente humano.                                   |
| `quality-care.jpg`        | `2026/05/2.-Politica-de-calidad-min-scaled.jpg`                                                                      | Profesional con productos en estantería. 1623×1080, 193 KB. Calidad, respaldo y portafolio.                                                   |
| `pharmacy.jpg`            | `2021/01/closeup-view-of-pharmacist-hand-taking-medicine-box-from-the-shelf-in-drug-store-scaled-e1623830759225.jpg` | Mano tomando una caja en farmacia. 1618×1080, 123 KB. Contexto de salud, sin presentar indicaciones médicas.                                  |
| `leterago-logo-white.png` | `2026/05/LETERAGO-LOGO.png`                                                                                          | Logo con lettering blanco, símbolo azul y transparencia. 1920×647, 60 KB. Usar sobre fondo oscuro; no es la variante para fondo blanco.       |
| `favicon.png`             | `2026/05/cropped-LETERAGO-LOGO-32x32.png`                                                                            | Favicon existente de la marca.                                                                                                                |

Las fotografías provienen del material del sitio de Guatemala. Si se reutilizan en páginas nacionales de la demo, deben presentarse como imágenes de referencia de la red, sin afirmar que corresponden a instalaciones específicas de otro país.

## Tipografía

Se copiaron tres pesos de Barlow ya presentes en el proyecto. La correspondencia de pesos se verificó en `../leterago-static/css/fonts.googleapis.com/css-0101d90760`.

Base fuente: `../leterago-static/assets/fonts.gstatic.com/s/barlow/v13/`.

| Destino en `public/media/` | Fuente                         | Peso       |
| -------------------------- | ------------------------------ | ---------- |
| `barlow-light.ttf`         | `7cHqv4kjgoGqM7E3p-ks6Vop.ttf` | 300 normal |
| `barlow-regular.ttf`       | `7cHpv4kjgoGqM7E_Ass8.ttf`     | 400 normal |
| `barlow-semibold.ttf`      | `7cHqv4kjgoGqM7E30-8s6Vop.ttf` | 600 normal |

## Composición

- El centro de distribución admite una imagen horizontal amplia y da contraste a una apertura abstracta 3D.
- El equipo y el operario pueden aportar el contexto humano entre capítulos visuales.
- La paleta de las fotografías ya contiene azul corporativo y tonos cálidos de las estanterías; se integra bien con fondos blancos, azul profundo y acentos discretos.
- Las imágenes originales están comprimidas y cada fotografía seleccionada pesa menos de 500 KB. No se generaron variantes ni se modificó el contenido.
- Se encontró un video corporativo de aproximadamente 13 MB (`2026/05/leterago-home.mp4`), pero no se incluyó para evitar aumentar la carga inicial de la demo.

## Banderas del selector de país

Los seis SVG a color de `public/media/flags/` se copiaron de `../leterago-static/assets/leterago.com.gt/wp-content/themes/uncode/library/img/flags/`. Se conservan los originales: `gt.svg`, `sv.svg`, `hn.svg`, `ni.svg`; `costa-rica.svg` y `panama.svg` se nombran `cr.svg` y `pa.svg` en la demo. El encabezado y desplegable los muestran en un espacio de 15 × 15 px con `object-fit: contain`, sin alterar proporciones ni colores. Son decorativos para lectores de pantalla porque el nombre/código del país ya aparece como texto. No requieren solicitudes externas.

## Fuentes activas en la interfaz

DM Sans y Outfit se sirven localmente desde `@fontsource-variable/dm-sans` y `@fontsource-variable/outfit`, versión 5.3.0, con licencia OFL-1.1. `src/styles/fonts.css` importa un WOFF2 latino variable por familia y conserva sus nombres CSS. Los TTF Barlow copiados originalmente no forman parte de la interfaz activa. Documentación: https://fontsource.org/docs/getting-started/variable.
