# Plan de implementación local y aceptación

Fecha: 2026-10-31. Autorización: implementación local solicitada por el usuario.

1. Preparar React 19, Vite, pnpm, Tailwind y CI estático.
2. Definir un manifiesto único de 82 rutas de contenido (8 corporativas, 72 nacionales, 2 legales) más una vista 404, para 83 vistas base. Cada ruta tiene versión ES/EN.
3. Separar contenido bilingüe, resolución de rutas, configuración de idiomas, filtros y validación de formularios.
4. Implementar portada narrativa, mapa regional, navegación nacional, contenido editorial, catálogo filtrable, noticias con detalle, formularios simulados y páginas legales.
5. Agregar escena 3D progresiva, alternativa SVG, movimiento reducido, navegación con teclado y adaptación móvil.
6. Verificar con Vitest/Testing Library y V8 todo el código de `src`, sin excluir componentes o ramas difíciles para elevar cobertura. Umbral global mínimo: 95% en instrucciones, líneas, funciones y ramas.
7. Probar rutas/idiomas, almacenamiento indisponible, rutas inválidas, filtros sin resultados, entradas inválidas/límites, recuperación de formulario, error de escena, movimiento reducido y flujo completo de simulación.
8. Compilar, auditar archivos/rutas base y revisar escritorio/móvil en navegador. No publicar ni hacer push en esta etapa.

La cobertura es una medida de ejecución, no una demostración de exhaustividad. Los tests DOM pueden sustituir WebGL/animación por adaptadores controlados; la verificación de renderizado real y responsive se complementa en navegador. El contenido nacional ilustrativo no pretende ser una captura oficial de cada país.
