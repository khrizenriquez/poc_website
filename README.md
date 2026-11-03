# PoC — Prueba de concepto corporativa regional

Demo local con React 19, pnpm, Vite y Tailwind CSS. Inspiración visual: Lusion, Montfort y Apple. Incluye una apertura 3D progresiva, navegación regional, seis países y español/inglés.

## Ejecutar

Desarrollo verificado con Node.js 26.13.0 y pnpm 12.16.1. `.nvmrc`, `engines` y CI fijan esas versiones exactas. React 19.3.1, Vite 8.3.5, Tailwind CSS 4.3.4 y Vitest 5.1.0 quedan fijados en `package.json` y `pnpm-lock.yaml`.

```sh
nvm install
nvm use
npm install --global pnpm@12.16.1
pnpm install --frozen-lockfile
pnpm dev
```

Abrir la URL que imprime Vite, normalmente `http://127.0.0.1:5173/poc_website/`.

Para revisar exactamente la salida de producción:

```sh
pnpm build
pnpm preview
```

## Pruebas

```sh
pnpm test                 # Suite unitaria y de integración DOM
pnpm test:coverage        # Suite + cobertura V8, umbral mínimo 95% en las 4 métricas
pnpm test:watch           # Desarrollo
pnpm check                # Cobertura + build + auditoría HTTP del artefacto
```

El reporte HTML se genera en `coverage/index.html`. El resumen legible por herramientas está en `coverage/coverage-summary.json`. La auditoría del build se guarda en `test-results/build-audit.json`.

La cobertura incluye **todos los archivos JS/JSX de `src`**, incluidos el arranque, componentes, escena 3D, navegación y formularios. No hay exclusiones de código ni comentarios para ignorar ramas. CSS, librerías externas y archivos de configuración de herramientas no forman parte de esa métrica.

Última verificación: **499 pruebas aprobadas, 100% en las cuatro métricas de cobertura**. Ver [informe final](docs/sdd/verification.md) y [matriz de escenarios y límites](docs/sdd/test-matrix.md).

## Marca y movimiento

La interfaz utiliza la marca **PoC** (logo, favicon, títulos y textos ES/EN). El footer muestra `© 2026 PoC - Christofer Enríquez`. Las fotografías originales se conservan como referencia visual regional.

Las imágenes grandes de portadas nacionales, panorámicas, páginas editoriales y detalles de noticias tienen parallax con GSAP ScrollTrigger. El movimiento está limitado dentro de un marco recortado y se desactiva con `prefers-reduced-motion`. No se aplica a miniaturas, banderas ni imágenes de formularios.

## Alcance

- 8 rutas corporativas.
- 12 rutas por cada uno de los 6 países: Guatemala, El Salvador, Honduras, Nicaragua, Costa Rica y Panamá.
- 2 rutas legales y una vista 404: **83 vistas base**.
- Las 82 rutas de contenido existen en ES y EN: **164 variantes localizadas**, más la vista 404 en ambos idiomas.
- Catálogo de seis productos ficticios: búsqueda, categorías, detalle accesible y acceso a un pedido de ejemplo.
- Tres noticias de muestra con detalle compartible en la URL.
- Contacto, consultas, pedidos, devoluciones, farmacovigilancia, ética/denuncias y empleo: validación local, estados de error y confirmación explícita de simulación.
- Apariencia claro/oscuro/sistema con persistencia local y sincronización entre pestañas.
- Menú móvil, selector de países, selector de idioma, navegación por teclado y preferencia de movimiento reducido.

Los sitios nacionales usan una identidad compartida y contenido ilustrativo por país; no son una nueva captura completa de sus sitios públicos. Las fotografías proceden de Guatemala y se identifican como referencia regional. Productos, noticias y formularios son ejemplos. No hay base de datos, envíos reales, credenciales ni persistencia de datos de formularios. Solo pueden guardarse las preferencias de idioma y apariencia.

## Idiomas y contenido

- `src/config/languages.js`: idiomas admitidos, español predeterminado y clave de preferencia.
- `src/i18n/locales/es.js` y `en.js`: contenido, etiquetas accesibles, errores y estados de interfaz.
- `src/i18n/index.js`: integración con i18next y recursos locales.
- `src/data/site.js`: países, manifiesto de rutas, productos y noticias.

Para agregar un idioma: registrarlo en `languages.js`, crear su diccionario e incorporarlo a `resources` en `src/i18n/index.js`. Las pruebas de paridad ES/EN detectan divergencias en los idiomas entregados; deben extenderse al nuevo idioma.

El idioma de la URL tiene prioridad sobre la preferencia guardada. La primera visita sin preferencia usa español. El selector conserva país, página y parámetros. Los slugs son estables entre idiomas.

## Claro, oscuro y sistema

El selector «Apariencia» está junto al idioma. En la primera visita usa la preferencia del sistema; una selección explícita tiene prioridad. «Sistema» vuelve a seguir los cambios del dispositivo en vivo. Si `matchMedia` no existe se usa claro. La elección persiste en `leterago-poc.theme`; un valor inválido vuelve a sistema. Si el navegador bloquea o llena el almacenamiento, el cambio sigue funcionando durante la sesión. Cambiar país, página o idioma no reinicia el tema; cambiar tema no borra borradores ni filtros.

- `src/config/theme.js`: opciones, clave local y consulta de sistema.
- `src/theme/ThemeProvider.jsx`: estado compartido, persistencia segura, sincronización y colores del navegador.
- `src/styles/themes.css`: colores semánticos de ambas apariencias.
- [Contrato y escenarios de aceptación](docs/sdd/theme.md).

## GitHub Pages

La base de Vite es `/poc_website/`. HashRouter permite abrir o recargar rutas como:

```text
/poc_website/#/es/
/poc_website/#/es/guatemala/productos/
/poc_website/#/en/guatemala/pedidos/?product=P01
```

El workflow `.github/workflows/pages.yml` ejecuta `pnpm check` y solo publica si pasa, en pushes a `main` o ejecución manual sobre `main`. En pull requests y ejecuciones manuales de otras ramas solo valida. Para publicar posteriormente, habilitar **Settings → Pages → Source: GitHub Actions** en el repositorio.

[Preparación, versiones y pasos de publicación](docs/github-pages.md).

Esta entrega es local: no se hizo push ni se activó GitHub Pages. La auditoría comprueba un servidor estático local con la misma subruta; el despliegue real se verificará al publicarlo.

## Organización

```text
src/
  components/    Navegación, mapa, diálogos y escena 3D
  config/        Configuración de idiomas y apariencia
  data/          Datos de demostración y rutas
  i18n/          Inicialización y diccionarios ES/EN
  lib/           Rutas, filtros y validación de formularios
  pages/         Portadas, editorial, catálogo, noticias y formularios
  styles/        Identidad visual, temas y responsive
  theme/         Preferencia compartida de apariencia
public/media/    Recursos locales autocontenidos
scripts/        Auditoría del build estático
tests/          Pruebas unitarias y de integración
docs/sdd/       Dirección técnica, plan y matriz de escenarios
```

[Procedencia de recursos](docs/asset-sources.md) · [Dirección visual](direccion-visual.md) · [Referencias](referencias-web.md).
