# Apariencia: contrato de implementación

Fecha: 2026-11-02. Alcance: demo estática completa, corporativo y seis países, ES/EN.

## Comportamiento

1. Selector nativo accesible «Apariencia / Appearance», con Sistema, Claro y Oscuro; operable por teclado.
2. Sin selección guardada: sigue `prefers-color-scheme: dark`; si la API no existe, claro. El cambio del sistema se refleja sin recarga cuando la elección es Sistema.
3. Selección explícita prevalece sobre el sistema. Volver a Sistema usa su estado actual.
4. Persistencia local en `leterago-poc.theme`. Lecturas/escrituras fallidas no impiden cambiar la UI; valores inválidos se normalizan a Sistema. No se guardan datos de formularios.
5. Eventos de localStorage de otras pestañas sincronizan apariencia. Borrar la clave o limpiar almacenamiento vuelve a Sistema. Claves ajenas y sessionStorage se ignoran. Todos los listeners se limpian al desmontar.
6. El proveedor envuelve el árbol de rutas y sobrevive a cambios de país/idioma/página, incluso sin almacenamiento. El cambio de tema no remonta formularios, catálogo ni diálogos.
7. `data-theme`, `color-scheme` y `theme-color` se actualizan con el tema resuelto. Paletas semánticas abarcan fondo, encabezado, navegación, inputs, filtros, diálogos, errores, éxito y foco. Fotografías, envases y secciones editoriales oscuras conservan colores intencionales.
8. No se añade animación de transición al tema; se respeta la configuración existente de movimiento reducido.

## Verificación

- 328 casos de renderizado: 82 rutas × 2 idiomas × 2 temas.
- Los siete formularios se verifican con errores y recuperación en las cuatro combinaciones de idioma/tema.
- Tests de fallos de almacenamiento, prioridad del sistema, sincronización, StrictMode, ausencia de APIs, borradores, foco y estados abiertos.
- Contraste calculado desde los colores de `themes.css`: 30 pares, mínimo 4.5:1 para texto normal y 3:1 para foco/bordes. No sustituye una auditoría completa de accesibilidad ni la inspección de todas las combinaciones de píxeles.
- Vista real en escritorio/móvil, catálogo, pedido, cambio de idioma, recarga y evidencia en `docs/preview`.

Ver [matriz completa](test-matrix.md) e [informe](verification.md).
