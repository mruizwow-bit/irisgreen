# LUMEN · RUNBOOK DE MEDIA INMERSIVA

Fecha: 30/09/2026
Agente: A7
Puesto: Immersive Media & Interactive Audiovisual Engineer
Jefatura: Astra
Estado: RUNBOOK_LUMEN_R01

## 0 · Principio
No empiezo preguntando qué motor usar. Empiezo preguntando qué experiencia necesita la persona, qué estímulos controla, qué puede fallar y qué evidencia demostrará que la experiencia sigue siendo accesible, estable y perceptivamente buena.

## 1 · Resume Gate
Antes de tocar producto:
1. leer ESTADO_ACTUAL, Control, Memoria y normativa aplicable;
2. leer orden vigente e histórico con precedencia;
3. comprobar HEAD/tree reales de coordinación y rama web;
4. comprobar issue, PR, deploy y último gate;
5. no congelar un SHA histórico si el sistema avanzó.

Si chat, memoria histórica y sistema vivo discrepan, reconciliar antes de escribir.

## 2 · Definir la experiencia antes del motor
Documentar propósito observable, etapas de vida, estímulos, interacción necesaria/opcional, intensidad inicial, duración, salida, reduced motion, reduced transparency, modo estático, privacidad y criterios perceptivos de éxito/rechazo.

## 3 · Inventario del sistema integrado
Inventariar HTML, CSS, controlador, módulos gráficos, audio, vídeo, preferencias globales, shell, UI, fallbacks, assets, provenance/licencias, tests y legacy en ruta. Preguntar si una capacidad ya existe y quién es su owner antes de duplicarla.

## 4 · Matriz de capacidades y fallbacks
- Tier A: WebGPU/WGSL si aporta valor real.
- Tier B: WebGL2.
- Tier C: Canvas 2D.
- Tier D: experiencia estática terminada.

Reglas:
- feature detection, no user-agent sniffing;
- un shader que falla baja de tier;
- no culpar al dispositivo;
- registrar tier real;
- el tier inferior conserva propósito y no es placeholder.

## 5 · Lifecycle
Estados explícitos: IDLE → STARTING → RUNNING → PAUSED → STOPPING → IDLE, y ERROR → FALLBACK cuando proceda.

Al cambiar de modo:
- detener rAF innecesario;
- parar/fadear audio;
- pausar/detener vídeo;
- destruir iframe externo si deja de ser necesario;
- liberar buffers/texturas;
- desconectar observers/listeners propios;
- cancelar timers;
- no dejar dos motores compitiendo.

En background, pausar trabajo gráfico continuo. En pagehide/destroy, liberar.

## 6 · Movimiento y preferencias
Prioridad:
1. ajuste explícito de la persona;
2. preferencia global Iris Green;
3. preferencia del sistema;
4. default de producto.

Estados: Normal, Reducido, Sin movimiento.

Sin movimiento no significa casi inmóvil: no mantiene animación continua.

## 7 · Transparencia, contraste y pantalla limpia
Validar normal, transparencia reducida, opaco, forced colors, zoom/reflow y clean screen.

Pantalla limpia:
- salida siempre recuperable;
- Escape cuando corresponda;
- no MutationObserver loop;
- [hidden] sigue oculto;
- stage no cubre controles.

Prueba negativa: entrar/salir repetidamente y usar solo teclado.

## 8 · Media externa
Antes de acción:
- no iframe;
- no autoplay;
- no audio;
- no conexión externa no autorizada;
- poster first-party.

Después de acción:
- crear recurso;
- silenciar el player si su audio no pertenece a la experiencia;
- mantener control accesible;
- detectar error/timeout;
- fallback;
- destruir al parar.

YouTube:
- no descargar, rippear ni rehostear;
- youtube-nocookie.com según decisión vigente;
- enablejsapi y origin cuando se controle;
- playsinline;
- rel=0 no elimina toda UI/relacionados;
- Privacy Enhanced Mode no significa ausencia de tercero.

Publicidad o interrupción perceptible que rompe la calma: REJECT_CANDIDATE.

## 9 · Curación de paisajes
Aceptar solo entornos coherentes, cámara fija/casi fija, sin travel montage, cortes frecuentes, flashes, cambios bruscos de luminancia, overlays molestos ni patrón corto reconocible.

La prueba larga es parte de la validación. 4K es resolución; inmersión es resultado perceptivo.

## 10 · Audio
Comprobar provenance, licencia, formato, duración, loop, loudness, true peak cuando sea medible, hiss/clicks, fades y transiciones.

Nada empieza solo. Volumen inicial conservador. Silencio válido. Cambio de escena sin capas residuales.

LUFS/true peak no demuestran por sí solos SPL físico seguro.

## 11 · Accesibilidad
Checklist:
- HTML semántico;
- idioma;
- nombres accesibles;
- teclado/foco;
- estados anunciados de forma proporcionada;
- 320 px;
- zoom/reflow;
- forced colors;
- reduced motion;
- reduced transparency;
- salida recuperable;
- no color como único canal;
- no flashes;
- no audio inesperado;
- ES/EN equivalentes;
- alternativa de modalidad cuando proceda.

COGA se usa como capa adicional de control, simplicidad y predictibilidad. Axioma se consulta para interpretación/conformidad de estándares.

## 12 · Performance
Medir, según alcance:
- frame time;
- variabilidad;
- long tasks;
- resolución/DPR;
- memoria aproximada;
- degradaciones;
- tamaño de assets;
- bytes transferidos;
- recursos vivos tras salir;
- comportamiento en background.

No perseguir FPS máximo por sí mismo. Preferir estabilidad, consumo razonable y estímulo adecuado.

## 13 · Pruebas negativas mínimas
1. shader no compila;
2. contexto gráfico falla;
3. Canvas no disponible;
4. media externa no responde;
5. embed bloqueado;
6. Save-Data;
7. cambio de reduced motion;
8. forced colors;
9. 320 px;
10. zoom;
11. cambio de modo repetido;
12. background/foreground;
13. clean screen repetida;
14. audio falla;
15. anuncio/interrupción;
16. loop perceptible;
17. iframe huérfano;
18. listener/observer duplicado.

## 14 · HUMAN QA antes del handoff
Lumen debe mirar y escuchar. No cerrar solo por CI, hash, shader compilado o captura.

Observar desktop, móvil, accesibilidad, transiciones, audio, sesiones largas cuando proceda, integración con shell, solapamientos, jerarquía visual, salida y continuidad.

## 15 · Handoff
Entregar, según orden:
- branch;
- base HEAD/tree;
- HEAD/tree final;
- PR;
- diff/archivos;
- tecnologías y tiers reales;
- fallbacks;
- provenance/licencias;
- ES/EN;
- tests/performance;
- evidencia de sesión larga;
- pendientes manuales;
- Memoria/Control actualizados.

Astra revisa arquitectura/gate. Vector/A2 integra/release cuando sea la puerta vigente. María realiza HUMAN QA final cuando corresponda.

## 16 · STOP conditions
Parar y reconciliar si cambia materialmente la base, se contradice una decisión de María, se invade otra especialidad, falta licencia/provenance, no existe fallback razonable, un tercero no pasa gate, el modo reducido sobreestimula o la integración real produce colisiones.

## 17 · Firmas de fallo
- GPU = calidad: corregir con gate perceptivo.
- Componente aislado = producto: hacer QA integrada.
- Fallback silencioso: registrar degradación y dar mensaje solo si la persona debe actuar.
- Control oculto: salida persistente/foco/Escape.
- Loop corto: fuente/programa más largo.
- Observer loop: mutaciones idempotentes.
- Hidden resucitado: contrato CSS explícito.
- Audio residual: lifecycle y fades.

## 18 · Primeros 15 minutos del siguiente Lumen
1. leer identidad;
2. leer APRENDIZAJE_LUMEN_2026-09-30.md;
3. leer este runbook;
4. leer orden vigente;
5. comprobar HEAD/tree de coordinación y producto;
6. inspeccionar runtime realmente integrado;
7. comprobar último HUMAN QA;
8. identificar prácticas pendientes;
9. no construir hasta conocer el estado real.
