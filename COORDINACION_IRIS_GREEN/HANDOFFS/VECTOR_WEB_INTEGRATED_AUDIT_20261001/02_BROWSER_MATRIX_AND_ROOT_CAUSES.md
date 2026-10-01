# VECTOR · A2 · AUDITORÍA INTEGRADA R2 · MATRIZ NAVEGADOR Y CAUSAS

Fecha: 01/10/2026  
Orden: #356  
Owner: Vector · A2 — Web Release & Integration Engineer  
Recovery auditado: `6f6392f833a4d1d6716ecabec4e192b70d180b0b`  
Rama de auditoría: `vector/recovery-audit-20261001`  
Run: `36875489569`  
Artefacto: `11169001383 · vector-integrated-web-audit-r2-20261001`  
Digest: `sha256:f35ed75478d1e63a5e24a25829a7da7abd39f22a50fa2a9389889a7ddb01c253`

Estado:
`VECTOR_INTEGRATED_WEB_AUDIT_R2_SYSTEMIC_UI_FAILS_CONFIRMED`

## 1. Alcance real

Se ha construido el recovery vivo y probado en Chromium, no source aislado.

Matriz:
- 38 rutas/modos lingüísticos;
- 1440×900;
- 390×844;
- 320×800;
- 114 comprobaciones de ruta;
- ES/EN incluyendo rutas bilingües por query cuando el producto funciona así;
- shell;
- H1;
- superficies;
- contraste;
- requests/runtime;
- child-safe;
- Sabik.

La primera auditoría contenía 404 falsos por adivinar rutas EN separadas donde el producto usa `?lang=en`.  
Quedan RETRACTADOS. R2 usa el contrato lingüístico real.

No hubo en R2:
- 404 de las rutas válidas probadas;
- fallo de navegación global;
- duplicación de header/footer;
- pérdida del DARK NAVY inicial.

Eso NO equivale a PASS de producto: los fallos visuales/sistémicos siguientes son reales.

## 2. HOME · FAIL duro de encuadre de título

ES:
`/`

EN:
`/en/`

A 1440:
- ancho visible del H1 = 384 px;
- ES necesita `scrollWidth = 590 px`;
- EN necesita `scrollWidth = 438 px`;
- CSS activo usa `white-space: nowrap`;
- el hero usa `grid-template-columns:minmax(24rem,.46fr) minmax(0,1fr)`;
- `overflow:hidden` en el hero recorta el texto.

Resultado:
el título está físicamente recortado/solapado por la segunda columna.

Marcador:
`HOME_DESKTOP_H1_CLIPPING_CONFIRMED`

Causa:
contrato de grid del Home R42/R69 posterior al PASS antiguo.

Owner de reparación:
Vector/A2 como integración del recovery.

No hace falta rediseñar Home.
Hay que corregir el sizing y añadir gate de no-overflow.

## 3. DARK NAVY · CONTRASTE SISTÉMICO FAIL

R2 detecta contraste severamente bajo en 90 de las 114 combinaciones de ruta/viewport.

No se interpreta el número 90 como “90 bugs distintos”.
La causa es SISTÉMICA:
- DARK NAVY global activo;
- múltiples componentes/runtimes conservan literales de la paleta LIGHT anterior;
- aliases globales no corrigen valores literales;
- varios runtimes aplican estilos dinámicos;
- R69 intenta detectar colores mediante selectores `[style*="#..."]`, pero un runtime puede serializarlos como `rgb(...)` y escapar del selector.

Ejemplos reproducidos:

### Condiciones
`/es/neurodiversidad/condiciones/`
- lede legacy `#435268` sobre `#0B1A2B` ≈ 2.21:1;
- CTA “Cuestionarios orientativos” con combinación LIGHT/DARK incoherente.

### Situaciones / Vida diaria / Datos / Privacidad
Breadcrumbs y ledes conservan color LIGHT legacy sobre fondo DARK.

### Investigación
`/es/investigacion/`
- eyebrow `#5A49A8` sobre DARK ≈ 2.47:1;
- lede `#435268` sobre DARK ≈ 2.21:1;
- panel de filtros aparece como gran superficie gris clara dentro de DARK.

### Ayudas / Directorio
`/es/tramites/directorio/`
- subnav completo gris claro;
- panel de filtros gris claro;
- cards de resultado gris claro;
- título de card claro sobre card clara;
- copy legacy `#435268` sobre DARK;
- hay textos con ratio medido ≈ 1.48:1.

### Juegos
`/es/recursos/juegos/`
- counts legacy `#5c7391` sobre surface DARK ≈ 2.78:1;
- flechas/link `#1f5f8b` sobre DARK ≈ 1.97:1.

### Intereses
`/es/intereses/`
- descripciones legacy `#405369` sobre surface DARK ≈ 1.71:1;
- CTA “Entrar →” `#1f5f8b` ≈ 1.97:1.

### Libros / Videoteca
eyebrows, ledes, badges y metadata conservan tonos LIGHT legacy incompatibles con DARK.

Marcador:
`DARK_NAVY_LITERAL_COLOR_CASCADE_FAIL_CONFIRMED`

## 4. BLANCOS / SUPERFICIES LIGHT · hay dos clases distintas

### A. LIGHT que ES un bug de interfaz

Ejemplos confirmados:
- filtros de Investigación;
- filtros/directorio de Ayudas;
- cards de resultados de Ayudas;
- bloques editoriales de “Sobre Iris Green”;
- Tarjeta Iris en fichas de condiciones;
- varios controles/CTA compartidos.

### B. superficie clara INTENCIONAL que NO debe volverse DARK

Ejemplos:
- hoja A4 imprimible;
- hoja de Rutina Visual;
- preview de papel;
- arte de las tarjetas del Taller;
- thumbnail/media cuando forma parte del arte.

Problema adicional:
R49/R69 contiene un override global:
`h1,h2,h3 → var(--ig-text)!important`.

En DARK, eso puede convertir el texto de una hoja blanca intencional en texto casi blanco.

Ejemplos medidos:
- `.rv-sheet-title` → ≈ 1.11:1 sobre hoja blanca;
- `.sh-t` de Rutinas imprimibles → ≈ 1.11:1 sobre hoja blanca.

Esto es un fallo de frontera:
`GLOBAL_THEME_MUST_NOT_RECOLOR_INTENTIONAL_PAPER_ART`.

Por tanto NO se soluciona pintando toda la web oscura.
Se necesita:
- tokens en UI;
- exclusiones/contrato de arte y papel;
- texto oscuro conservado dentro de paper/art intencional.

## 5. SOBRE IRIS GREEN · FAIL visible

Ruta:
`/es/sobre-iris-green/`
y EN por query.

Los bloques `.about-block` y otras superficies conservan:
`rgba(255,255,255,.8/.84)`.

El global R69 cambia encabezados/textos hacia color DARK claro.

Resultado visible:
cards gris/blancas con texto blanco casi ilegible.

Marcador:
`ABOUT_LIGHT_CARD_DARK_TEXT_CONTRACT_COLLISION_CONFIRMED`

Este fallo no pertenece al contenido editorial.
Es integración de tema.

## 6. TARJETA IRIS EN FICHAS · FAIL visible

Ejemplo:
`/es/neurodiversidad/condiciones/autismo/`.

`assets/tarjetas-iris-cta.css` mantiene paleta propia LIGHT:
- card `#fff`;
- need block claro;
- botones `#fff`;
- textos `#17395c`.

R69 convierte parte del outer card a superficie DARK mediante selectores genéricos, pero deja subcomponentes LIGHT.

Resultado:
- card híbrida;
- bloque “Necesito” casi blanco;
- copy muy pálido;
- botones blancos.

Mediciones incluyen:
- `.iris-mini-brand` ≈ 1.14:1 en la composición observada;
- otros elementos <3:1.

Marcador:
`IRIS_CARD_PARTIAL_THEME_BRIDGE_FAIL_CONFIRMED`

## 7. VIDEOTECA · FAIL de integración visual actual

Ruta:
`/es/videos/` y EN query.

Visible:
- gran filtro gris claro dentro de DARK;
- copy/lede legacy oscuro;
- media/poster claro.

La superficie clara de una miniatura puede ser arte/placeholder válido, pero el control debe seguir siendo legible.
R2 detecta el botón `.ig-video-poster` con texto claro sobre fondo claro en un estado:
ratio ≈ 1.07:1.

Videoteca R06 posterior está clasificada REBASE_REQUIRED y además espera #357.
Eso no autoriza dejar rota la generación visible actual.

Marcador:
`VIDEOTECA_CURRENT_DARK_INTEGRATION_FAIL_CONFIRMED`

## 8. CHILD-SAFE · hard payload PASS acotado / policy conflict detectado

Se probaron dos S2:

### Anorexia
GENERAL:
- safe visible;
- full = 0;
- requests full = 0.

AGE_0_12:
- safe existe en DOM;
- full = 0;
- requests full = 0;
- PERO page age gate bloquea el main y la safe variant deja de ser visible.

AGE_13_17:
- safe visible;
- full = 0;
- requests full = 0.

AGE_18_PLUS:
- safe primero;
- full = 0;
- requests = 0 antes de gesto;
- botón explícito presente;
- click → 1 request full → full visible.

### Abuso/explotación
La matriz permite 0–12.
GENERAL / AGE_0_12 / AGE_13_17:
- safe visible;
- full = 0;
- 0 requests full.

AGE_18_PLUS:
- safe primero;
- full solo tras gesto explícito.

Conclusión:
`HARD_S2_PAYLOAD_GATE_NEGATIVE_TEST_PASS_ON_SAMPLED_ROUTES`.

No se ha encontrado fuga de full S2 en estas pruebas.

Pero existe una divergencia de producto:
#333 decía:
`deep link S2 → safe variant`.

En anorexia + AGE_0_12:
la clasificación de edad excluye la ruta y el page gate deja la safe variant inert/oculta.

Esto NO es fuga de safety.
Es conflicto entre:
- safe deep-link contract;
- age discovery/page gating.

Estado:
`CHILD_SAFE_HARD_PAYLOAD_PASS__AGE_DEEPLINK_POLICY_RECONCILIATION_REQUIRED`.

No cambiar esta política a ciegas.
Debe resolverse manteniendo siempre:
- 0 full S2 antes del gesto adulto;
- safe content como única posible excepción;
- discovery por edad independiente.

## 9. SABIK · causa funcional confirmada

Visual activo:
`/sabik/assets/web-r01/web_presente.png?v=r69-20260930-4`

Eso ya está superseded visualmente por #354 y por la referencia de María con núcleo.

Más importante:
el Web actual apunta a:
`https://6ab7a2cd2cf8dc09d3ae9aca--sabik-asistente.netlify.app`

En prueba real desde el recovery:
`/sabik-connect?lang=es&embedded=1` responde HTTP **401**.

Netlify del proyecto `sabik-asistente` tiene Team Login obligatorio.

El frontend captura el fallo y cae al buscador local.
Por eso puede producir una respuesta, pero NO está usando el Cloud configurado.

Respuesta de prueba local:
- respuesta generada a partir de snippets;
- 6 fuentes;
- Cloud 401;
- fallback local activo.

Estado:
`SABIK_CLOUD_AUTH_PATH_UNAVAILABLE_TO_PUBLIC_WEB__LOCAL_FALLBACK_MASKS_FAILURE`.

Esto explica por qué un test superficial puede decir “Sabik responde” mientras el producto conversacional real no está conectado.

Nexo ha sido consultado en Slack para cerrar el contrato del nuevo núcleo + runtime/Core.
#354 no se adelantará antes de su cadena de owners.

## 10. Inglés

Las rutas query-based fueron verificadas usando su contrato real:
- Research;
- Support;
- Videos;
- Books;
- About.

No se repiten los falsos 404 de la auditoría R1.

Los mismos problemas visuales aparecen en ES y EN:
no son un fallo de traducción; son integración/cascade.

## 11. Clasificación de propietarios

| Bloque | Estado | Owner principal | Acción A2 |
|---|---|---|---|
| Home H1 clipping | FAIL | Vector/A2 | reparar ahora + gate |
| Theme bridge transversal | FAIL | Vector/A2 integración | reparar compatibilidad sin rediseñar |
| `controles-comunes.css` | FAIL | Prisma #357 → Axioma | esperar delta y consumir |
| Paper/art recolored by global theme | FAIL | Vector/A2 integración | proteger fronteras |
| Tarjeta Iris theme bridge | FAIL | Vector/A2 integración / owner frontend si rework | shim semántico ahora |
| Sabik old visual | superseded | #354 Croma→Prisma/Motor→Axioma→Astra | slot preparado; no adelantar |
| Sabik Cloud 401 | FAIL | Nexo/Pulso + Vector integration | reconciliar endpoint/transport antes de preview |
| child-safe hard payload | sampled PASS | A2 | ampliar negative matrix |
| age/deep-link policy | CONFLICT | Astra/Aura + A2 | reconciliar contrato |
| Videoteca R06 | REBASE_REQUIRED | Videoteca + #357 → Vector | no overlay |
| Sakura | ALREADY_INTEGRATED_VERIFY | A2 | verificar supervivencia |
| Faroles | WAIT_EXPERT_GATE | Lumen→Astra | no A2 |
| Fósiles | PREP_QUEUE local-only | Senda→Astra/Aura | no A2 |

## 12. Orden M1 antes de paquetes

1. Reparar Home H1 overflow.
2. Reparar theme bridge y contraste de superficies actuales.
3. Proteger papel/arte claro frente a global theme.
4. Corregir Tarjeta Iris híbrida.
5. Integrar #357 en cuanto llegue su gate.
6. Resolver Sabik Cloud/auth + recibir cadena #354.
7. Resolver deep-link safe/age policy.
8. Rebuild.
9. QA 1440/390/320 ES/EN.
10. Solo entonces abrir intake masivo de paquetes sobre un chasis estable.

Marcadores:

`VECTOR_INTEGRATED_WEB_AUDIT_R2_SYSTEMIC_UI_FAILS_CONFIRMED`

`M1_RECOVERY_REPAIR_REQUIRED_BEFORE_PACKAGE_INTAKE`

No main.  
No producción.
