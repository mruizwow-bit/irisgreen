## DECISIÓN VIGENTE · 30/09/2026 · TIKTOK RETIRADO

Por instrucción expresa de María, desde este corte la gestión social operativa queda limitada a **Instagram y Facebook**.

- **INSTAGRAM = ACTIVA**
- **FACEBOOK = ACTIVA**
- **TIKTOK = RETIRADA / NO SE USA**

TikTok queda fuera de publicación, comentarios, follows, descubrimiento, seguimiento, métricas operativas, gates diarios y rutinas futuras. No intentar reactivar acceso ni mantener una cola pendiente de TikTok.

Esta decisión **sustituye** cualquier mención anterior en este documento a TikTok como “pausado”, “pendiente de reactivación” o plataforma a retomar.

Regla vigente:
`SOCIAL_ACTIVE_PLATFORMS = INSTAGRAM + FACEBOOK`

## Fidelización saliente + hoja de seguidos · 30/09/2026

Reglas vigentes:

`FIDELITY_REQUIRES_OUTBOUND_ENGAGEMENT`

Los 114 fieles se visitan en sus propias cuentas y se comentan sus publicaciones nuevas cuando haya contenido pertinente. No basta con responderles únicamente cuando comentan en Iris Green.

`FOLLOW → RETURN → PARTICIPATE → OBSERVE_RECIPROCITY`

Toda cuenta nueva seguida debe:
- registrarse en `CONTROL/SEGUIDOS_SOCIAL.csv`;
- recibir próxima revisión;
- volver a ser visitada;
- tener continuidad cuando publique algo pertinente.

Seguir y abandonar:
`FAIL_FOLLOW_WITHOUT_CONTINUITY`.

La hoja de seguidos ya contiene las altas verificadas del 30/09 de Instagram y Facebook.

# ESTADO ACTUAL · SOCIAL IRIS GREEN

Fecha: 30/09/2026

Estado vigente:

`CM_R01_ACTIVE_RELATIONSHIP_FIRST`

## Decisión

El community manager deja de utilizar como patrón principal:

`descubrir → comentar una vez → seguir → abandonar`.

Pasa a:

`atender comunidad → habituales → conversaciones → relaciones cálidas → descubrimiento → seguimiento`.

## Prioridades por plataforma

Instagram:
- fidelización y reactivación;
- la comunidad existente es el activo principal.

Facebook:
- lanzamiento/reactivación intensiva;
- presencia sostenida en comunidad.

TikTok:
- **RETIRADO / NO SE USA**;
- fuera de publicación, comentarios, follows, descubrimiento, seguimiento y métricas operativas.

## ES/EN

Trabajo continuo en:
- España;
- UK;
- ecosistema internacional pertinente.

## Gate diario

PASS:
`CM_DAILY_COMMUNITY_CYCLE_COMPLETE`

FAIL:
`CM_DAILY_FAIL_RANDOM_OUTREACH_ONLY`

## Corrección de sobre-respuesta · 30/09/2026

Se detecta un segundo patrón incorrecto:

`RESPUESTA RECIBIDA → RESPONDER OTRA VEZ → OTRA VEZ → MISMO HILO DURANTE DÍAS`.

Queda prohibido como estrategia.

Regla vigente:
`RESPONDER → CERRAR → CAMBIAR DE CONTEXTO`.

Un agradecimiento o cierre social se reconoce con reacción/like, no con otra pregunta automática.

La continuidad se demuestra volviendo a la persona en otra publicación futura cuando haya contenido pertinente, no alargando el mismo hilo.

Marcador:
`THREAD_SATURATED_MOVE_ON`.

Después del marcador, la secuencia obligatoria es:
`comentario propio pendiente → habitual no visitado → relación cálida → descubrimiento nuevo → rotar plataforma`.

Regla:
`ONE_THREAD_CLOSED → NEXT_RELATION`.

## Reorientación IG + FB · 30/09/2026

TikTok queda:
`CM_TIKTOK_RETIRED_DO_NOT_USE`.

No participa en el gate diario ni en ninguna rutina operativa.

Todo su tiempo se redistribuye a Instagram y Facebook.

Corrección de intensidad:
**3 respuestas no constituyen una tanda suficiente.**

Instagram:
- 15–25 cuentas únicas comunidad/habituales/cálidas;
- 10–15 conversaciones externas;
- 5–8 cuentas nuevas investigadas;
- 3–5 follows solo si proceden;
- backlog propio progresivo 5–10 por jornada además de comentarios nuevos.

Facebook:
- 12–18 conversaciones externas;
- 6–10 nuevas páginas/cuentas/grupos investigados;
- 4–6 follows pertinentes;
- 3–6 relaciones cálidas revisitadas.

Marcador:
`CM_SESSION_TOO_SHALLOW_CONTINUE_WORKING`.

El agente no puede cerrar una sesión tras 3 respuestas si todavía hay comunidad, habituales, cálidas o descubrimiento pertinente por trabajar.

## Instagram · universo real de 114 fieles · 30/09/2026

La usuaria confirma que el agente social ya recibió el 29/09 una lista completa de **114 fieles/habituales**.

Coordinación ha preservado ahora la lista adjunta en:
- `CONTROL/FIELES_INSTAGRAM_114_SOURCE.md`;
- `CONTROL/FIELES_INSTAGRAM_114.csv`.

La transcripción recibida contiene **108 filas de datos**. Como el universo declarado es 114, el agente debe reconciliar las entradas faltantes contra su lista previa del 29/09.

No pedir de nuevo la lista a la usuaria.
No inventar handles.
No sustituir la fuente por CONTACTOS_SOCIAL.csv.

Estado:
`IG_114_FAITHFUL_ROTATION_ACTIVE`
+
`PENDING_RECONCILE_TO_114_FROM_AGENT_PRIOR_LIST`.

Rotación:
- 15–25 fieles distintos por jornada;
- full sweep aproximado 5–8 días;
- no repetir siempre el mismo núcleo;
- interacción solo cuando el contenido sea pertinente;
- registrar última revisión/interacción.

Los informes deben decir:
`X/114 fieles revisados hoy`.

## Fuente de verdad de este carril

1. `ESTADO_ACTUAL.md`
2. `ORDENES/CM_R01_GESTION_COMUNIDAD_Y_CRECIMIENTO.md`
3. `ESTRATEGIA/COMMUNITY_GROWTH_ES_EN_20260930.md`
4. `CONTROL/CONTROL_SOCIAL.csv`
5. `CONTROL/CONTACTOS_SOCIAL.csv` (registro vivo)
6. `CONTROL/CONTACTOS_SOCIAL_TEMPLATE.csv` (plantilla)
7. `MEMORIA/`
8. `INFORMES/INFORME_CM_R01_20260930_SESION_MANANA.md`

## Separación

Este carril NO modifica ni gobierna:
- Web;
- Sabik;
- R67;
- main de producto.

Rama:
`social/community-manager-20260930`.

## Corte de sesión de mañana · 30/09/2026

Instagram y Facebook trabajados con comunidad propia, habituales y continuidad. Registro actualizado. Ciclo parcial: queda backlog antiguo y trabajo en grupos. TikTok pausado por orden del usuario a las 07:45:49 Europe/Madrid hasta que arregle el acceso. No conceder PASS diario ni afirmar gestión de todo el día. Próximas acciones y revisiones individuales en CONTACTOS_SOCIAL.csv e informe.

## Continuación y calendario · corte 09:00 del 30/09

Informe complementario: `INFORMES/INFORME_CM_R01_20260930_CONTINUACION_MANANA.md`. Contiene las nuevas relaciones, evidencias y próximas revisiones que aún no están consolidadas en los CSV del primer corte. Consultar ambos informes antes de actuar para evitar repeticiones.

Instagram: tres respuestas propias nuevas verificadas, Ana y Brie atendidas en publicaciones distintas, Danielle revisada sin duplicar, Autism West Midlands seguida y comentada. Euskal Kultura respondió con agradecimiento: reconocido con like, hilo cerrado. No volver a escribir allí.

Facebook: Leeds continuada en otra publicación, Fundación Miradas seguida/comentada, OCD-UK comentada pero follow rechazado por revisión automática. No reintentar el seguimiento bloqueado. Feed reciente propio quedó en carga tras una recarga: verificación incompleta, no asumir publicación ni ausencia.

Pieza 30/09 «¿Qué significa información clara?»: Facebook Metricool ID 384232832 PENDING a las 10:00 e Instagram ID 384232732 PENDING a las 17:00 Europe/Madrid. Aún no hay URL pública verificada de la pieza de hoy. No crear duplicados. Campaña 2 del 01/10 y 3 del 04/10 conservan programación aprobada. TikTok sin nueva pieza pendiente hoy y continúa pausado por acceso.

Pendiente: verificar publicación real en cada ventana, guardar URL pública y atender comentarios posteriores. Visitas contextuales a nuevas relaciones 01/10 y revisión de follows 07/10. Ciclo diario parcial, sin PASS.

## Ampliación tras orden nueva · corte 09:36 del 30/09

Informe: `INFORMES/INFORME_CM_R01_20260930_AMPLIACION_RONDA.md`. Consultarlo junto a los dos previos: los CSV conservan el primer corte, pendiente consolidación.

Nueva orden ejecutada: más relaciones distintas, TikTok excluido del gate. No se volvió a escribir a Lea porque ya había comentario pertinente; agradecimiento de Sugey reconocido con like. Shelly atendida en comentario antiguo propio de Luma; AuthentiKids y Lucero en publicaciones externas distintas.

Instagram acumulado de mañana: 12 textos propios (11 resoluciones/continuaciones justificadas, 1 redundante de primera tanda), 14 comentarios externos en cuentas distintas, 21 relaciones existentes/habituales/cálidas atendidas con texto o reacción y 3 revisadas sin texto nuevo. 5 follows nuevos confirmados. Últimas altas: Autismo España y Autistica. AGN ya seguida, no contar follow nuevo. Ninguna transición adicional ni follow-back demostrado en esta tanda.

Facebook: biblioteca propia cargó a las 09:14, tres piezas más historia, cero comentarios; administrador “¡Estás al día!”. Corrige la limitación de carga del corte anterior. La pieza de hoy todavía no aparecía antes de su hora prevista. 12 comentarios externos acumulados en cuentas distintas, 6 follows nuevos confirmados. Continuación AGN en post distinto; nueva Plena Inclusión Madrid seguida/comentada; Autismo España y Ambitious comentadas, ambas ya seguidas. Scope investigada sin contacto. ARASAAC y Autistica revisadas sin respuesta nueva. Notificaciones finales sin nueva respuesta escrita.

Pendientes: verificar destino real Facebook tras 10:00 e Instagram tras 17:00, guardar URL, atender ventana posterior, evaluar grupo pertinente y continuar backlog/rotación. Último estado de programador observado: PENDING. No duplicar ni modificar piezas aprobadas.

El ciclo diario sigue parcial. No conceder PASS de jornada antes de las verificaciones pendientes. TikTok está retirado y no forma parte del gate vigente. No afirmar funcionamiento continuo fuera de sesión.


## Continuación mediodía · fidelización en publicaciones ajenas · 30/09

Aclaración de María incorporada en CM R01: visitar y comentar publicaciones nuevas de los 114 fieles, no limitarse a comentarios propios. Informe: `INFORMES/INFORME_CM_R01_20260930_FIDELIZACION_PUBLICACIONES_AJENAS.md`.

Cinco comentarios externos nuevos y verificados: ashleychang22, pictea.caa (colaboración con diverteacor), semillas.de.brillo, nickycooper.life y roge_lector. Otras cuatro cuentas revisadas sin duplicar/forzar: studio__zoomies, lifeseekers.world, playfullystories y littletale_land. CSV de fieles actualizado con nueve revisiones y cinco interacciones externas. Ashley resuelta desde enlace real en comentarios propios; raw conservado. Dos perfiles adicionales autiharriet/autismsupermom con disponibilidad/identidad pendiente: no suman cobertura confirmada. Acumulado provisional 37/114 revisados; fuente 108/114 materializada, reconciliación pendiente.

Instagram: likes de ambitiousaboutautism y nationalautisticsociety a comentarios de Iris, reciprocidad inicial observada; no son respuestas textuales. No reabrir cierres Kati/Talia. Seguir otras novedades de fieles.

Facebook: el registro de continuidad de 11:27 y la comprobación en este hilo confirman publicación directa https://www.facebook.com/photo/?fbid=122140119279386473&set=a.122102247273386473 ; última revisión sin comentarios. El ERROR de Metricool no equivale a ausencia de publicación. No duplicar. Instagram de hoy pendiente de verificar tras 17:00 Europe/Madrid. No declarar PASS diario ni funcionamiento continuo fuera de sesión.


## Auditoría de continuidad · 30/09/2026 · 14:58 Europe/Madrid

Se revisaron los controles reales de la rama social.

### Instagram · puesta al día de fieles

Archivo: `CONTROL/PUESTA_AL_DIA_114_20260930.json`

- entradas registradas: **96**;
- `COMENTADA`: **75**;
- `COMENTADA_TANDA_ANTERIOR`: **5**;
- `YA_COMENTADA`: **8**;
- `YA_COMENTADA_HOY`: **6**;
- `COMENTARIOS_NO_DISPONIBLES`: **1** — `fdezfdezmariangeles`;
- `IDENTIDAD_PENDIENTE`: **1** — `autismsupermom`.

Lectura correcta:
- **94/96** entradas tienen revisión/interacción saliente ya comprobada o comentario previo confirmado;
- **2/96** permanecen bloqueadas y NO deben contarse como comentadas;
- quedan **18/114 sin estado en PUESTA_AL_DIA**;
- por tanto, el pendiente real de cierre es **20/114**: 18 sin estado + 2 bloqueadas;
- esto **NO equivale a 114/114**.

La fuente `CONTROL/FIELES_INSTAGRAM_114.csv` continúa materializando **108/114** filas. Faltan 6 entradas de la fuente original y no se inventarán handles para completarlas.

Marcador:
`IG_FAITHFUL_SWEEP_94_CLOSED_2_BLOCKED_18_WITHOUT_STATUS_SOURCE_108_OF_114`.

### Nuevas cuentas seguidas

Archivo: `CONTROL/SEGUIDOS_SOCIAL.csv`

Hay **12 altas registradas el 30/09**:
- Instagram: **5**;
- Facebook: **7**.

Todas conservan próxima revisión el **01/10/2026** y revisión estructurada alrededor de 7 días cuando proceda.

Regla vigente:
`FOLLOW → RETURN → PARTICIPATE → OBSERVE_RECIPROCITY`.

### TikTok

Estado definitivo:
`CM_TIKTOK_RETIRED_DO_NOT_USE`.

Cualquier mención histórica anterior a “pausado” queda supersedida y no genera tareas futuras.


## Puesta al día de últimas publicaciones · cierre comprobado 30/09/2026

Este corte sustituye las cifras parciales de96cuentas anteriores.

- **111 cuentas identificadas y revisadas**:107cuentas reales de la tabla original (108filas menos1placeholder) y4recuperadas de capturas originales: rochesterzucconi, esteeeeeefi_, solosipsandsoftness y miriamhiguerasart.
- **110 atendidas**:88comentarios nuevos de esta puesta al día,5de la tanda inmediatamente anterior y17comentarios previos comprobados sin duplicar.
- **1 sin comentarios habilitados**: fdezfdezmariangeles. No contar como comentada.
- **3 identidades por recuperar** para reconciliar114. No afirmar114/114 ni completar con cuentas arbitrarias.
- Todos los nombres incompletos de la tabla han quedado resueltos; talia_alisa y susialisa son cuentas distintas de la misma persona, ambas comprobadas.
- La orden concreta de María era revisar la última de cada uno, incluidas ayer y anteriores; no aplicar el límite habitual15–25 a esta puesta al día.

Control individual: `CONTROL/PUESTA_AL_DIA_114_20260930.json`. Fuente normalizada: `CONTROL/FIELES_INSTAGRAM_114.csv` (112filas preservadas,111cuentas y1placeholder). Informe: `INFORMES/INFORME_CM_R01_20260930_CIERRE_111_CUENTAS.md`.

No reabrir hilos comentados. Continuar ante publicación nueva, comentarios habilitados de Mari Ángeles o recuperación de las tres identidades. TikTok retirado. Las verificaciones de campaña/publicación propia pendientes de cortes anteriores no se consideran realizadas por esta ronda.
