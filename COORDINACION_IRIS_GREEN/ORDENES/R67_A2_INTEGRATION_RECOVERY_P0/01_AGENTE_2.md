# R67 · A2 · P0 · RECUPERACIÓN DE INTEGRACIÓN REAL

Fecha: 29/09/2026  
Issue: #333  
Responsable: Agente 2  
Revisión: Astra  
Aceptación final: HUMAN QA María

Estado:
`R67_A2_INTEGRATION_RECOVERY_P0_ORDERED`

## Diagnóstico reproducido en HEAD A2

HEAD observado:
`9e69bd1a8ab6b5ff2253d5565141c84ae20386f7`

### Shell
Home e interiores conservan headers antiguos incrustados. Los assets R49/R50 existen, pero no gobiernan de forma transversal el artefacto visible.

### Taller
`es/taller/index.html` sigue siendo R40/25 estudios con acordeones. R64 añade una pantalla HUMAN QA mediante `main.innerHTML`, con seis tarjetas y controles de edad que solo cambian copy. Los assets R54 están embebidos como data URI/base64 dentro de JS, no como los 24 assets finales.

### Sabik
El runtime actual sigue con:
- “Puedo ayudarte a buscar información”;
- “Solo reproduce mensajes fijos cuando la activas”.

No hay micrófono/STT/TTS dinámico ni conversación R66 real.

### Child-safe
`scripts/apply_child_safe_r42.py` existe, pero `scripts/build_site.py` no lo ejecuta.

Páginas S2 verificadas en source actual siguen sin:
- `data-ig-s2-safe`;
- `ig-child-safe.js`.

El build aplica R51 edad/discovery, pero eso no sustituye el hard gate S2.

## Regla

No más parches superpuestos.

R67 integra el producto real en cuatro fases secuenciales:

1. shell global R49/R50;
2. child-safe hard payload;
3. Taller definitivo;
4. Sabik conversacional R66.

Cada fase produce commit/tests/evidencia/Memoria/Control.

## Fase 1 · shell global

Visible:
**Iris Green · Buscar · Música · Accesibilidad · Contenido · idioma · Explorar**

- retirar/superseder headers viejos;
- una sola hoja de tokens;
- DARK NAVY inicial;
- LIGHT alternativa;
- ES/EN;
- Home + interiores mismo contrato;
- no flash de interfaz vieja.

Gate:
`R67_A2_GLOBAL_SHELL_REAL_PASS`

## Fase 2 · child-safe

Ejecutar `apply_child_safe_r42.py` sobre el artefacto de build final, después de materializar contenido y antes de discovery/publicación final.

GENERAL / AGE_0_12 / AGE_13_17:
- full S2 fuera de HTML/payload;
- 0 preload/prefetch;
- safe variant antes de render.

AGE_18_PLUS:
- safe inicialmente;
- full solo tras acción explícita.

Generar y probar:
- `assets/safety/full/*`;
- search-safe-default;
- search-intentional-safe;
- search-adult-full-catalog;
- library-adult-s2.

Gate:
`R67_A2_CHILD_SAFE_HARD_PAYLOAD_PASS`

## Fase 3 · Taller

Eliminar la estrategia QA:
`r64-taller-six-cards.js -> main.innerHTML`.

Integrar las seis tarjetas aprobadas en el Taller definitivo.

Obligatorio:
- catálogo real;
- 27 estudios cuando source exista;
- rutas reales;
- AVIF/WebP 1x/2x como ficheros;
- no data URI/base64 de producto;
- selector AGE_* conectado a `IGAudience`;
- no textos HUMAN QA/R54/R64 públicos;
- shell de Fase 1;
- R65 se consume en paralelo a medida que entrega.

Gate:
`R67_A2_TALLER_DEFINITIVE_INTEGRATION_PASS`

## Fase 4 · Sabik

Ejecutar R66 real:
- Core PRE-#144 reconciliado;
- mismo submitTurn texto/voz;
- R04 conocimiento;
- respuesta principal + fuentes;
- mic explícito;
- STT ES/EN;
- TTS dinámico voz Sabik ES/EN;
- WAV fijos solo sistema;
- Motion R37/B3;
- cancel/stop;
- no persistencia por defecto.

Gate:
`R67_A2_SABIK_CONVERSATIONAL_REAL_PASS`

## Preview final

Solo tras las cuatro fases:
`R67_A2_IRIS_GREEN_INTEGRATED_PREVIEW_READY_FOR_MARIA`

Una única Deploy Preview para HUMAN QA.

## Precedencia

R67 supersede como gate integrado:
- R64 READY parcial;
- shell PASS parciales;
- age PASS sin hard S2;
- R66 BASE READ.

No borra arte ni trabajo técnico válido.

## Límites

No main.
No producción.
No reset.
No rerender de arte aprobado.
No READY por existencia de assets o CI parcial.

## Normativa

No hay norma nueva. Aplicar R42, R49/R50, R51, R54/R64, R66, tokens globales, low stimulation y marco WCAG/ISO/EN/COGA.
