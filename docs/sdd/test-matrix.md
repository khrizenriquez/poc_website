# Matriz de escenarios y verificación

Fecha inicial: 2026-10-31. Verificación final: 2026-11-02. Demo local; no se publicó en GitHub Pages.

Resultado final: **499 pruebas aprobadas y 100% en las cuatro métricas de cobertura**. Ver [informe final](verification.md).

## Contrato de cobertura

`pnpm test:coverage` usa Vitest + V8, con umbral de **95% en instrucciones, ramas, funciones y líneas**, incluyendo todos los archivos `src/**/*.{js,jsx}`. El proceso falla si alguna métrica baja del umbral. Los informes se generan en `coverage/` y el workflow conserva el artefacto.

## Escenarios automatizados

| Área                   | Camino esperado                                                            | Casos alternativos y de error                                                                                                                                                             | Evidencia                                                    |
| ---------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Rutas                  | Las 82 rutas de contenido renderizan en ambos idiomas y ambos temas        | Página/country-path inexistente, URL sin idioma, idioma no admitido, barras repetidas, URI malformada, normalización y retorno al inicio                                                  | `routes.test.jsx`, `domain.test.js`, `interactions.test.jsx` |
| HashRouter y arranque  | Inicio React 19 en StrictMode y enlace nacional                            | Remontaje con ruta profunda, conservación del hash y página al recargar                                                                                                                   | `bootstrap.test.jsx`                                         |
| Idiomas                | Traducción de navegación, contenido, formularios y títulos                 | Almacenamiento bloqueado/lleno, preferencia inválida, prioridad de URL, falta de clave con fallback español, paridad de claves y textos no vacíos                                         | `domain.test.js`, `interactions.test.jsx`                    |
| Cambio de idioma       | Conserva país, página y query de noticia/producto                          | Traduce errores existentes sin perder borrador; funciona sin localStorage                                                                                                                 | `form-flows.test.jsx`, `interactions.test.jsx`               |
| Navegación             | Corporativo → mapa → país → catálogo → otro país → corporativo             | Menú móvil abierto/cerrado, Escape, clic exterior y foco de retorno, salto al contenido                                                                                                   | `interactions.test.jsx`                                      |
| Catálogo               | Seis productos, categoría y búsqueda por nombre/código                     | Mayúsculas, espacios, acentos, combinación sin coincidencias, lista vacía, categoría inválida, reset y plurales de resultados                                                             | `domain.test.js`, `interactions.test.jsx`                    |
| Detalle                | Diálogo de producto y pedido con referencia seleccionada                   | Escape, botón cerrar, clic fuera/dentro, Tab/Shift+Tab, restauración de foco y scroll del documento                                                                                       | `interactions.test.jsx`                                      |
| Noticias               | Listado, detalle por URL y regreso                                         | Identificador de noticia desconocido vuelve al listado                                                                                                                                    | `interactions.test.jsx`                                      |
| Todos los formularios  | Los siete flujos completan la simulación en ES y EN, claro y oscuro        | Envío vacío seguido de corrección; no se llama a fetch/XHR ni se persisten campos                                                                                                         | `form-flows.test.jsx`                                        |
| Campos de texto        | Valores válidos, recorte de espacios                                       | Nombre de 0/1/81 caracteres; aceptación de 2/80; correo malformado, espacios internos y máximo 160; mensaje vacío/19/1501 y aceptación de 20/1500                                         | `domain.test.js`                                             |
| Pedidos/devoluciones   | Referencias del catálogo; cantidades 1 y 100                               | Referencia ausente/inventada; cantidad vacía, 0, 101, negativa, decimal, exponente o texto                                                                                                | `domain.test.js`, `interactions.test.jsx`                    |
| Reporte anónimo        | Omite identidad solo en ética/denuncias                                    | Sigue exigiendo mensaje y consentimiento; desactivar anonimato vuelve a exigir identidad                                                                                                  | `domain.test.js`, `form-flows.test.jsx`                      |
| Recuperación           | Enfoca el primer error; corrección limpia errores; éxito permite reiniciar | Datos se limpian al cambiar de página/país; formulario no afirma haber enviado información                                                                                                | `interactions.test.jsx`                                      |
| Apariencia             | Claro, oscuro, sistema; persistencia y metadatos                           | Valores corruptos, almacenamiento bloqueado/lleno, matchMedia ausente, cambio de sistema, prioridad explícita, sincronización/limpieza entre pestañas, StrictMode y limpieza de listeners | `theme.test.jsx`                                             |
| Estado al cambiar tema | Conserva borrador, errores, país, idioma, query, filtros y detalle abierto | Navegación sin almacenamiento; 404; cambios de sistema con diálogo abierto sin perder foco                                                                                                | `theme.test.jsx`                                             |
| Contraste de temas     | Texto normal ≥4.5:1; foco y bordes de controles ≥3:1                       | 30 combinaciones de colores CSS reales en claro y oscuro, incluyendo errores y hover                                                                                                      | `theme-contrast.test.js`                                     |
| Movimiento             | Revelación y parallax configurados en GSAP                                 | Movimiento reducido, cambio de preferencia, matchMedia ausente, ausencia de scope/arte, limpieza de listeners                                                                             | `motion.test.jsx`                                            |
| Escena 3D              | Carga diferida, geometría y rotación                                       | WebGL no disponible o lanza error, pérdida de contexto, error de render, grupo desmontado, alternativa SVG                                                                                | `artwork.test.jsx`, `scene.test.jsx`                         |
| Artefacto estático     | Todos los archivos de dist se sirven bajo `/poc_website/`                  | Rutas raíz incorrectas rechazadas; assets faltantes fallan; chunk 3D separado y entrada estática verificadas                                                                              | `scripts/check-build.mjs`                                    |

## Revisión en navegador

Realizada sobre el servidor local con navegador integrado:

- Portada corporativa en escritorio (1440×1000), escena WebGL real visible y consola sin errores en la revisión inicial.
- Mapa regional y navegación al inicio de Guatemala.
- Sitio de Guatemala en móvil (390×844), menú móvil y catálogo.
- Cambio ES → EN conservando Guatemala y catálogo.
- Búsqueda sin coincidencias, reset y apertura del detalle de producto.
- Producto → pedido, validación vacía, foco en el primer error, corrección con datos ficticios y confirmación de simulación.
- Sin desbordamiento horizontal en la vista móvil del pedido revisada.

Revisión adicional de apariencia:

- Portada oscura en escritorio; selección persiste después de recargar.
- Encabezado en 390 y 320 píxeles; selector, menú móvil y cambio ES/EN operativos.
- Corregido desbordamiento por tamaño intrínseco del mapa; portada y pedido sin scroll horizontal a 320 píxeles.
- Catálogo: filtros sin coincidencias, alternancia claro/oscuro y detalle legible.
- Pedido: errores, borrador y referencia P01 conservados al cambiar tema e idioma; confirmación en oscuro.

## Qué mide y qué no mide

La cobertura no demuestra todos los escenarios posibles ni equivalencia entre navegadores. La suite ejecuta las ramas propias de la aplicación. GSAP y React Three Fiber usan adaptadores controlados en tests DOM: se comprueban integración, callbacks y recuperación, pero esos tests no evalúan los píxeles de WebGL, el rendimiento de GPU ni la interpolación interna de bibliotecas externas.

La auditoría HTTP comprueba entrega de archivos y la entrada para las URLs con hash; el renderizado de cada ruta se verifica por separado en las 328 pruebas DOM de rutas. No se hizo un recorrido de las 164 rutas en navegadores reales, una auditoría completa de accesibilidad ni una prueba de publicación remota. Las capturas visuales complementan la suite.

Parallax: pruebas en `motion.test.jsx` para fotos grandes, exclusión de miniaturas/textos, marco sin imagen, movimiento reducido, API ausente y cambios de ruta/preferencia. Las pruebas de rutas verifican la marca PoC y el footer solicitado en ES/EN y claro/oscuro.

Actualización de herramientas: pruebas parametrizadas de recursos en `/`, `/poc_website/` y `/another-demo/`, incluidas fotos y SVG anidados. La aserción independiente de la base de GitHub Pages se conserva.
