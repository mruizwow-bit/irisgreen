# VECTOR · A2 · AUDITORÍA AS-IS DEL PRODUCTO INTEGRADO · BLOQUE 1

Fecha: 01/10/2026  
Orden: #356  
Owner: Vector · A2 — Web Release & Integration Engineer  
Estado: `VECTOR_INTEGRATED_WEB_AUDIT_BLOCK1_FAILS_CONFIRMED`

## Alcance de este bloque

Primero se audita el producto integrado antes de cargar paquetes.

Referencia Git:
- A2 vivo: `8ea50128b490207b4dd5508c3c46692f5be69c87`
- recovery vivo: `6f6392f833a4d1d6716ecabec4e192b70d180b0b`

Producción pública está bajo mantenimiento y NO se usa como representación del candidato a reparar.

Se revisa:
- Sabik;
- child-safe / age safety;
- shell/layout;
- DARK NAVY / LIGHT;
- blancos residuales;
- títulos/anchuras/espaciado;
- responsive;
- alcance real de los gates existentes.

## 1. SABIK · FAIL DE PRODUCTO / IDENTIDAD ACTUAL OBSOLETA

### AS-IS recovery

El recovery `6f6392f...` sigue cargando:
- `sabik/assets/web-r01/`;
- `sabik/sabik-motion-r37.js`;
- `sabik/sabik-web-r01.js`.

`mount-config.mjs` sigue conectado a:
- Cloud deploy `6ab7a2cd2cf8dc09d3ae9aca--sabik-asistente.netlify.app`;
- biblioteca sellada `n04-es-20260916-56f72c4d3959`.

Ese Cloud antiguo sigue READY en Netlify y expone funciones N04, pero no demuestra que sea el backend/corpus final vigente para Sabik nuevo.

El montaje actual:
- permite pregunta escrita;
- usa `conversation-core-r66.mjs`;
- intenta Cloud y hace fallback a índice local;
- compone respuesta concatenando snippets de hasta dos candidatos;
- NO implementa STT;
- NO implementa TTS dinámico de respuestas;
- el propio copy declara que la voz conversacional dinámica no sustituye al texto.

### TO-BE confirmado

Issue #354:
el Sabik Web visible actual deja de ser referencia.

María aporta referencia visual del Sabik Web nuevo:
- núcleo central brillante;
- cuerpo azul/cian/turquesa;
- centro espacial estable;
- transformación interna;
- presencia visual con profundidad.

Regla:
el núcleo NO se tratará como decoración aislada.

Se ha consultado a Nexo en Slack para cerrar:
- contrato semántico del núcleo;
- relación asset/runtime/Core;
- estados Web vs estados Sabik IA;
- dependencias con R66/retrieval/futura voz;
- piezas que quedan legacy.

Estado:
`SABIK_CURRENT_RECOVERY_NOT_FINAL_PRODUCT`.

## 2. CHILD-SAFE · PIPELINE PRESENTE, COBERTURA DE GATE INSUFICIENTE

Positivo:
`scripts/build_site.py` sí ejecuta `apply_child_safe_r42.py` antes de Home/R50/R51.

El transform:
- extrae full S2 a `assets/safety/full/`;
- sustituye páginas S2 por safe variants;
- genera contratos de búsqueda safe/intentional/adult;
- no prefetch/preload del full S2.

Problema:
el gate principal `test_home_child_safe_r42.py` comprueba un conjunto fijo de rutas S2 y contratos concretos.
Eso NO demuestra por sí solo:
- navegación completa con AGE_0_12 / AGE_13_17;
- todos los deep links;
- todas las rutas clasificadas;
- páginas posteriores a nuevas integraciones;
- relaciones/links secundarios;
- regressions tras cargar paquetes.

R51 sí usa matriz 965/965 para edad/discovery, pero su `syncPageGate()` bloquea página mediante `inert`/`aria-hidden` para age mismatch.
Eso es age/discovery gating; NO sustituye la extracción hard-payload S2.

Conclusión:
hay dos mecanismos diferentes y los tests actuales pueden dar PASS parcial sin probar el safety integrado end-to-end.

Estado:
`CHILD_SAFE_PIPELINE_EXISTS__SYSTEM_GATE_INCOMPLETE`.

## 3. DARK NAVY / BLANCOS · FAIL CONFIRMADO

`assets/controles-comunes.css` conserva hardcodes con `!important`:
- `background:#fff!important`;
- activos `color:#fff!important`;
- hover `#f2f6f9`;
- focus `#5a49a8`;
- paneles/cards `rgba(255,255,255,...)`.

R69 intenta sobreescribirlos después con tokens, pero eso es compatibilidad reactiva, no eliminación del contrato paralelo.

Issue #357 ya identifica la misma deuda transversal.

Evidencia visual del artefacto R69 previamente declarado PASS:
- página Condiciones en DARK NAVY muestra tarjetas grandes claras;
- texto/títulos de esas tarjetas quedan extremadamente pálidos sobre la superficie clara;
- el problema no es solo “blanco”: hay combinación de superficie clara + tokens de texto DARK aplicada sobre ella.

Por tanto el gate previo:
“no large pure-white surface >18% viewport”
es demasiado permisivo:
- deja pasar blancos menores;
- deja pasar superficies casi blancas;
- no valida contraste semántico dentro de cada superficie;
- no detecta mezcla LIGHT-card dentro de DARK.

Estado:
`DARK_NAVY_LEGACY_SURFACE_MIX_CONFIRMED`.

## 4. LAYOUT / TÍTULOS / ESPACIO · GATE DEMASIADO ESTRECHO

El CSS transversal R49 impone perfiles `content / browse / workspace`, pero convive con:
- HTML legacy inline;
- adaptadores R50 por familia;
- R67 global fill;
- R69 compatibility final.

Resultado:
la anchura final depende de ownership/data-profile + selectores heredados.

R69 browser QA mide expresamente unas pocas familias:
- Home;
- Research;
- Books;
- Support;
- Exoplanets;
- Taller;
- Recursos/Juegos/Rutinas;
- Quiet Space.

No existe en ese gate una auditoría exhaustiva de:
- todos los H1;
- relación H1/contenedor;
- bloques hero vacíos;
- min-height excesivos;
- frases cortas partidas por max-width heredado;
- alineación de ejes en todas las páginas;
- whitespace vertical;
- todas las familias de Condiciones/Situaciones/Contenido.

Evidencia móvil:
Situaciones 390 muestra:
- cabecera extremadamente comprimida;
- controles reducidos a símbolos;
- título/lede con contraste visual débil;
- filtro ocupa prácticamente toda la pantalla inicial;
- contenido útil queda muy desplazado hacia abajo.

Estado:
`GLOBAL_LAYOUT_TYPOGRAPHY_SYSTEM_QA_MISSING`.

## 5. LOS PASS ANTERIORES NO EQUIVALEN A PRODUCTO CORRECTO

El workflow R69 existente ejecuta gates útiles, pero se orienta a regresiones concretas y rutas de muestra.

El artefacto del run PASS `36696024165` corresponde a HEAD `ad196500...`, no al recovery vivo actual `6f6392f...`.

Recovery actual está 39 commits por delante de ese HEAD.

Por tanto:
- no usar las capturas antiguas como certificación del recovery vivo;
- sí sirven como evidencia de que el gate anterior podía declarar PASS mientras todavía había problemas visuales.

Estado:
`PREVIOUS_R69_PASS_NOT_CURRENT_SYSTEM_ACCEPTANCE`.

## 6. Primera clasificación de reparación

### P0 antes de paquetes
1. Sabik functional/identity contract:
   - confirmar contrato Nexo;
   - no activar set viejo como producto final;
   - mantener slot #354 sin adelantarse a owners.
2. Child-safe SYSTEM QA:
   - hard-payload;
   - age lens;
   - deep links;
   - search/discovery;
   - ES/EN.
3. Layout/typography transversal:
   - H1;
   - hero;
   - max/min widths;
   - whitespace;
   - axis;
   - 1440/390/320.
4. Theme:
   - eliminar superficies LIGHT residuales dentro de DARK;
   - #357 como dependencia para controles compartidos.
5. Expandir browser matrix:
   - todas las familias públicas, no solo muestra R69.

### Después
Intake de paquetes según #356, sin meter contenido nuevo sobre un chassis roto.

## 7. Próximo bloque de auditoría

- inventario automático/manual de familias/rutas;
- localizar hardcodes/blancos por origen;
- localizar H1/hero con ratios anómalos;
- safety negative matrix;
- Sabik Cloud/Core contract;
- 404/console/network;
- tabla FAIL → owner → fix → gate.

Marcador:
`VECTOR_INTEGRATED_WEB_AUDIT_BLOCK1_FAILS_CONFIRMED`

No paquetes aplicados en este bloque.  
No main.  
No producción.
