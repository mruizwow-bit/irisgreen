# R42-A5 · Taller 25 como aplicaciones creativas actuales · entrega 26/09/2026

## Autoridad y marcador
Orden: #285 · Parent #283.  
Marcador obligatorio publicado: `R42_NORMATIVA_EMBEBIDA_LEIDA` (comentario #285 `5846258496`).  
Decisión posterior de María sobre etapas y libertad creativa: comentario `5846234679`.  
Addendum aplicable: `R42_LIFE_STAGE_SEPARATION_ADOPTED`.

## Fuente exacta
Base A2 observada al iniciar:
- rama `agent2/sabik-iris-r08-20260924`
- HEAD `574356cba3b73dc8477a625d2c6311008260a2d6`
- tree `3da021ce16109a10423ab53ae7fb071ca80dba13`

R42-A5 no parte del freeze histórico porque A2 ya contenía integraciones posteriores que debían preservarse.

## Entrega
PR: #292  
Branch: `agent5/r42-a5-taller-product-20260926`  
HEAD final de esta entrega: `f39fb531b259d19d9212cd3e5abbf256873e779a`  
Tree: `29d58c3dcd270dc8ca227bd29a7bdb0a028bdeb1`  
Compare contra base A2: 20 commits ahead / 0 behind / 10 rutas Taller.

### Archivos
1. `assets/data/taller-r42-paths.js` — entradas por Infancia / Adolescencia / Adultez / Cualquier edad para 25/25, ES/EN.
2. `assets/ig-taller-estudio.js` — carga progresiva R42 sin sustituir los motores existentes.
3. `assets/ig-taller-local-data.js` — IndexedDB/memoria existente + coordinación Web Locks/BroadcastChannel y refresco multi-pestaña.
4. `assets/ig-taller-r40-tools.js` — motores nuevos consumen Worker y AudioWorklet progresivamente.
5. `assets/ig-taller-r42-direct.js` — Canvas de manipulación directa para cuadrículas creativas; cuadrícula semántica de teclado permanece disponible.
6. `assets/ig-taller-r42-platform.js` — capa Web Platform progresiva: Workers/OffscreenCanvas, AudioWorklet, OPFS, Web Locks, BroadcastChannel, View Transitions y detección de WebGL2/WebGPU/File System Access con fallback.
7. `assets/ig-taller-r42.css` — workspace-first, tool rail, inspector, bottom dock/sheet móvil, direct canvas, forced-colors, reduced-motion y foco 3 px.
8. `assets/ig-taller-r42.js` — launcher 6 áreas, Continue/proyectos, gestión local, shell del estudio, dialogs Archivo/Reto/Ayuda y previews familiares.
9. `assets/workers/ig-taller-r42-worker.js` — cálculo de simulaciones + previews OffscreenCanvas fuera del main thread.
10. `scripts/test_r42_a5_taller.js` — gate específico R42-A5.

## Cambio de producto
La corrección no es un cambio cosmético:
- workspace/editor/simulador precede a instrucciones/configuración;
- topbar compacta, rail, centro creativo e inspector contextual;
- Archivo agrupa acciones secundarias;
- Reto/Ayuda en dialog/drawer;
- móvil usa bottom dock/bottom sheet;
- launcher usa seis áreas visuales y proyectos recientes;
- los 17 motores nuevos siguen diferenciados, no se sustituyen por una única plantilla;
- cuadrículas de pixel, arquitectura, juego, simulación, ritmo, composición, mundos y mesa reciben Canvas de manipulación directa; el DOM semántico sigue como canal equivalente;
- simulación puede ejecutarse en Worker;
- previews usan OffscreenCanvas en Worker cuando existe;
- audio creativo usa AudioWorklet cuando existe y Web Audio clásico como fallback;
- almacenamiento sigue local, sin red, y añade coordinación de revisión entre pestañas.

## Etapas de vida
Los 25 estudios disponen de orientación:
- Infancia
- Adolescencia
- Adultez
- Transversal / Cualquier edad

La etapa orienta ejemplos, contexto y profundidad. No diagnostica, no bloquea herramientas avanzadas y no infantiliza adultez. La complejidad sigue siendo opcional, progresiva y reversible.

## Investigación aplicada
Se retuvo como referencia la investigación Web Platform 2025–2026 ya registrada en R42 y la referencia aportada por María de talleres tecnológicos de Fundación Telefónica: tecnología al servicio de crear un resultado propio, no teoría/formulario.

Aplicado con progressive enhancement:
- Worker + OffscreenCanvas
- AudioWorklet
- IndexedDB + OPFS disponible para uso justificado
- Web Locks + BroadcastChannel
- File System Access opcional
- Container Queries
- dialog
- View Transitions con reduced motion
- WebGL2/WebGPU solo como capacidades opcionales; no requisito único

No se incorporó un módulo WebGL2 adicional en esta entrega: el intento de escritura fue bloqueado por el canal de repositorio y no se creó una segunda ruta alternativa. El producto conserva su editor 2D completo.

## Validación independiente de blobs
Sobre HEAD `f39fb531...`:
- compilación V8: PASS para 10 JavaScript verificados;
- catálogo: 25 estudios / 25 IDs únicos;
- 25/25 pares de rutas ES/EN presentes;
- 25/25 rutas por etapa presentes;
- OffscreenCanvas, AudioWorklet, OPFS, Web Locks y BroadcastChannel presentes como mejoras progresivas;
- Worker `life-step` + `transferToImageBitmap`;
- Canvas directo + puntero + equivalente de teclado;
- fallback semántico explícito de cuadrícula;
- CSS: 100dvh, Container Queries, mobile bottom dock, forced-colors, reduced-motion, foco 3 px;
- búsqueda de llamadas reales de red: ninguna. Las únicas apariciones de “WebSocket” estaban en comentarios/tests que lo prohíben.

No había GitHub Actions asociado automáticamente al HEAD al cierre. No se declara CI SUCCESS por ausencia de run.

## Privacidad
- cero transporte Sabik;
- cero Cloud/Netlify/auth;
- no se añaden analytics;
- colección/proyectos/progreso permanecen locales;
- importación/validación y límites R40 se preservan;
- multi-tab no crea copias ocultas ni backups OPFS;
- OPFS es capacidad disponible, no almacén canónico oculto.

## Pendiente manual / integración
Solo A2 integra y sube:
1. integrar A3 #290 primero conforme #289;
2. integrar #292 conservando app shell global;
3. build/CI de la rama integrada;
4. Deploy Preview;
5. HUMAN QA de María en 1440×900 y 390×844;
6. teclado, touch, zoom/reflow, lector de pantalla, forced-colors, reduced-motion y rendimiento real;
7. verificar perceptivamente que las seis familias de estudios se sienten diferentes.

No se declara aceptación visual final desde la rama A5.
Estado: `R42_A5_TALLER_PRODUCT_REBUILD_READY_FOR_A2`.
