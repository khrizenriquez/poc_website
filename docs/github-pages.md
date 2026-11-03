# Preparación de GitHub Pages

Repositorio: `https://github.com/khrizenriquez/poc_website.git`. El directorio local `poc/` es la raíz Git: el workflow se ejecuta desde esa raíz, sin `working-directory: poc`.

## Entorno verificado

| Herramienta                            | Versión instalada            |
| -------------------------------------- | ---------------------------- |
| Node.js                                | 26.13.0 exacta en local y CI |
| pnpm                                   | 12.16.1                      |
| React / React DOM                      | 19.3.1                       |
| Vite                                   | 8.3.5                        |
| Tailwind CSS                           | 4.3.4                        |
| GSAP / @gsap/react                     | 3.15.0 / 2.1.2               |
| React Router                           | 7.18.5                       |
| i18next / react-i18next                | 25.10.10 / 16.6.6            |
| Three / React Three Fiber              | 0.180.0 / 9.8.2              |
| Vitest / coverage-v8                   | 5.1.0                        |
| Fontsource Variable (DM Sans / Outfit) | 5.3.0                        |

`pnpm install --frozen-lockfile` reproduce las dependencias. `@vitejs/plugin-react` se actualizó a 6.2.1 para Vite 8. `.npmrc` exige los engines declarados. `pnpm-workspace.yaml` conserva las excepciones de antigüedad que pnpm 12 generó para las versiones exactas solicitadas; no desactiva globalmente esa política.

Vitest 5 reinicia la base de su servidor: `test.env.BASE_URL` comparte la constante de la base de Vite para que las pruebas DOM sigan validando `/poc_website/`. Se mantienen los umbrales de 95% y todo `src` dentro de cobertura. Se añadieron pruebas para recursos con base raíz, subruta de Pages y otra subruta.

Referencias de migración: [Vite 8](https://vite.dev/guide/migration.html), [Vitest 5](https://vitest.dev/guide/migration/) y [cambio de BASE_URL en Vitest](https://github.com/vitest-dev/vitest/issues/9156).

## Archivos listos

- `vite.config.js`: base `/poc_website/`.
- HashRouter: navegación profunda y recarga sin reglas de servidor.
- `.github/workflows/pages.yml`: instalación con lockfile, tests/cobertura ≥95%, compilación, auditoría y artefacto Pages. Publicación restringida a `main` y dependiente del éxito de la validación.
- Configuración de Pages y despliegue con permisos `pages: write` e `id-token: write`, limitados al job de publicación.
- `.gitignore`: excluye dependencias, dist, cobertura y resultados temporales.
- `scripts/check-build.mjs`: valida los archivos bajo la base correcta, 164 URLs de contenido localizadas, recursos CSS locales y presupuesto de tipografías.

## Solicitudes y tamaño

- Dos archivos WOFF2 variables locales sustituyen cuatro fuentes de peso fijo: **4 → 2 solicitudes de tipografía**. Conservan DM Sans y Outfit y los caracteres de ES/EN.
- Las fuentes suman 69,224 bytes. Esto es algo mayor que los cuatro WOFF2 latinos anteriores (~56 KB): la mejora es en cantidad de solicitudes, no en bytes de fuente.
- Un CSS compilado y un JS principal; la escena 3D sigue en un chunk diferido, solo solicitado cuando se utiliza.
- Fotos secundarias con carga diferida; recursos e idiomas locales, sin API o CDN en tiempo de ejecución. Las banderas del desplegable se solicitan cuando se abre.
- Build: **24 archivos en dist**, antes 38. Archivos emitidos no equivale a solicitudes durante una visita; algunos recursos conservados en public no se utilizan en pantalla.
- Auditoría falla si aparecen más de dos fuentes, más de un CSS, fuentes que no sean WOFF2, tipografías de más de 100 KB en total o referencias CSS externas/rotas.

## Publicación posterior a la revisión

1. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Subir el commit revisado con `git push -u origin main`.
3. Revisar **Actions → Validate and publish GitHub Pages**: validar y desplegar deben terminar correctamente.
4. Abrir la URL esperada `https://khrizenriquez.github.io/poc_website/`, probar ES/EN, claro/oscuro y recargar una ruta profunda como `#/en/guatemala/pedidos/?product=P01`.

No se hizo push ni se activó Pages desde esta entrega. La publicación remota y la URL final deben comprobarse después del despliegue.

Referencias: [workflows personalizados de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) y [fuentes variables de Fontsource](https://fontsource.org/docs/getting-started/variable).
