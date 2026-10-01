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


## Continuación orden #343 · 30/09/2026

Este corte sustituye el bloqueo de Mari Ángeles del cierre anterior: comentario 18196224100352492 enviado y visible en DdyHO1oI0OI. **111 fieles atendidos, 0 bloqueos de comentarios entre los identificados, 3 identidades sin recuperar**. Respetar su descanso de redes.

Cinco comentarios nuevos verificados en esta continuación: cuatro IG (Mari Ángeles, Autismo Madrid, NAS, Autismo España) y uno FB (ConecTEA). Autistica respondió y recibió like de cierre. NAS y AlfaSAAC muestran reciprocidad por reacción en FB. Miradas resuelta: Fundacion.Miradas.TEA. Sin follows nuevos ni bajas.

Detalle y límites: `INFORMES/INFORME_ORDEN343_CONTINUACION_20260930.md`. Próxima visita 01/10 y revisión de reciprocidad lunes 05/10; clasificación inversa pendiente de verificación. Automatización diaria IG+FB existente activa. TikTok fuera. No dar cierre 114/114 ni PASS de toda la jornada.


## Corte de descubrimiento y criba de calidad · 30/09/2026

Estado vigente: **10 altas Instagram y11 Facebook**, con follow y comentario verificados en SEGUIDOS_SOCIAL.csv. Faltan10IG y9FB para el objetivo20porred. No conceder PASS ni afirmar cuota completada. Altas anteriores a la criba estricta no implican superarla retrospectivamente.

Regla nueva de María: ampliar a toda la neurodiversidad en ES/EN, evaluar varias publicaciones recientes, conversación real y respuestas personales habituales del creador. El tamaño solo no basta. Solicitudes de recursos por palabra clave son interés legítimo, no penalización automática.

Sandra Kelly/mypureocdawakening aceptada tras5posts y respuestas en2hilos, seguida/comentada17934618135393399. Revisar01/10 y lunes05/10. Otras candidaturas y límites en CONTROL/CRIBA_ACTIVIDAD_20260930.md. No desbloquear adhd_love_. Neurodivergent Rebel requiere>24h de seguimiento para comentar, todavía sin alta. No inventar compartidos ocultos ni alcance.

La automatización existente conserva horario y aplica estos criterios. La actividad fuera de sesión no se presume ejecutada.


## Recuperación y continuidad · 01/10/2026 · mañana

Rama operativa de esta sesión: `social/community-manager-20261001`.
Informes nuevos: `INFORMES/AGORA_RECUPERACION_COMENTARIOS_20261001_MANANA.md` y `INFORMES/AGORA_CONTINUIDAD_20261001_TANDA2.md`.

Acumulado verificado: 21 textos (17 en publicaciones propias IG, 3 externos IG, 1 externo FB) y 10 reacciones (8 IG, 2 FB). Diez cuentas externas revisitadas en la segunda tanda, distinguiendo relaciones recientes de fieles. No se hicieron follows ni bajas. No se han recuperado las tres identidades pendientes.

Programación Metricool de hoy comprobada: FB385546537 a10:00 e IG383972701 a17:00 Europe/Madrid; ambas PENDING, automáticas, no borrador, dos imágenes y textos alternativos. Pendiente verificar publicación real tras hora prevista. No duplicar.

Los informes contienen enlaces por comentario y revisiones individuales más recientes que SEGUIDOS_SOCIAL.csv. Consultarlos antes de volver a contactar. Autismo España/Itinera, AlfaSAAC/formación y ADHD UK/congreso ya tienen comentarios: no repetir. Sandra sin nueva publicación posterior al último post atendido. Nuevos comentarios en BDA, Autism West Midlands, Mencap y Dan. ConecTEA nueva reacción, Autismo Madrid respuesta recibida atendida con reacción. Ciclo diario parcial; sin PASS ni funcionamiento continuo fuera de sesión.


## Continuidad · 01/10/2026 · tanda 3

Informe: `INFORMES/AGORA_CONTINUIDAD_20261001_TANDA3.md`.

14 cuentas revisadas en esta tanda (11 recientes + Danielle, Caty y Lea). Tres textos nuevos verificados: Autistica/Rachel y Autismo Sevilla/museo en IG, Plena Inclusión Madrid/feminismo en FB. Dos likes FB confirmados: Fundación Miradas/libro y Autismo Sevilla/museo. Lea ya comentada ayer; no duplicar.

Acumulado de recuperación y continuidad: **24 textos (17 propios IG, 5 externos IG, 2 externos FB), 12 reacciones (8 IG, 4 FB)**. Sin follows ni bajas nuevas.

**21/21 relaciones nuevas del 30/09 revisadas el 01/10 (10 IG + 11 FB)** entre las tres tandas. No equivale a 21 comentarios nuevos ni reciprocidad general. NAS Facebook sí muestra reacción del autor al comentario previo. Informe contiene registro individual y supera la fecha de revisión del CSV aún sin consolidar. Próxima revisión de novedades 02/10 y estratégica 05/10, sin bajas automáticas.

Rotación de fieles parcial; tres identidades históricas siguen pendientes. Verificar publicación real de campaña tras las ventanas de 10:00 FB y 17:00 IG Europe/Madrid. Ciclo diario parcial, sin PASS ni actividad fuera de sesión presumida.


## Recuperación de campaña Facebook · 01/10/2026 · tarde

Metricool FB385546537 devolvió ERROR: «Error getting Page Access Token». Se comprobó ausencia de la pieza en feed y biblioteca antes de recuperarla directamente en Facebook. Publicación completada y verificada, dos imágenes originales en orden, texto ES/EN aprobado y ambos textos alternativos conservados.

URL pública: https://www.facebook.com/irisgreen.eu/posts/pfbid0gUnEi3gwJJvCR5TPweCRL1M2SZ43VaL9crQYeKR7nNqZ3JYyv7ZbS7FfB4getR8Tl
Post: 122140483293386473. Fotos: 122140482105386473 y 122140482111386473. Facebook confirmó «Tu publicación se ha compartido correctamente con EVERYONE» y destino público mostró «Aún no hay comentarios».

La revisión automática detuvo inicialmente Publicar porque compartir en historias estaba activado para esta y futuras publicaciones. Se desactivó mediante la opción disponible de Facebook (también afecta a futuras publicaciones); confirmación visible «Compartir en historia desactivado». Después se publicó solo en el feed. Sin promoción pagada ni grupos.

**No reintentar FB385546537: la campaña ya está publicada directamente.** Error de conexión Metricool pendiente de reparación; no afirmar integración restaurada. IG383972701 sigue PENDING para17:00 Europe/Madrid, sin cambios.

La rotación iniciada con Dorit quedó interrumpida al priorizar la recuperación de campaña: última Dd56AgcgXf- abierta, comentarios aún no comprobados; no contar nueva interacción. Contadores de comunidad conservan24textos/12reacciones, más1publicación de campaña recuperada. No PASS diario.


## Rotación y búsqueda · 01/10/2026 · tarde

Informe vigente: `INFORMES/AGORA_ROTACION_Y_BUSQUEDA_20261001_TARDE.md` (consultar antes de volver a comentar). **25/114 fieles revisados hoy**, además de las21/21altas deayer revisadas en tandas anteriores. Tres identidades históricas pendientes.

Acumulado verificado de comunidad: **38 textos:19 propiosIG,15 externosIG,4 externosFB;16 reacciones:12IG+4FB;1 follow nuevoIG**. Más1publicación de campaña FB recuperada. No contar intentos de reacción sin cambio confirmado.

Alta mujeresalbordedeltdah registrada en SEGUIDOS_SOCIAL.csv con comentario18107686237919586, Siguiendo confirmado y próxima revisión02/10, estratégica05/10. Criba de varias publicaciones y respuestas personales recurrentes; tamaño modesto aceptado por conversación, no por cuota. No hay nuevas bajas.

Objetivo acumulado reconciliado desde control real: faltaban10IG+9FB deayer, más20porred hoy =30IG+29FB. Tras1altaIG, quedan **29IG+29FB**. No confundir revisiones con follows. Dyslexia in Adults, Neurodivergent Rebel, AutisticAngle y Espacio TDAH pendientes de evidencia suficiente; no forzar altas. Mica Ringo revisada: cinco piezas recientes centradas en conflicto/acusaciones personales, sin interacción ni follow; no encaja en la ronda actual.

Últimas conversaciones atendidas: Shelly en publicación propia; Jenn, Motheroo, colaboración Amy/Georgi (un solo texto), Softly Heals y Comcare enIG; ARASAAC y Autistic Girls Network enFB. Agradecimientos de Dorit, Aida y EverythingHygge cerrados conlike, sin nuevo texto. AutisticaFB revisada sin duplicar su hilo previo. Informe contiene textos, enlaces y revisiones sin novedad.

Facebook campaña ya publicada: NO reintentarFB385546537. Integración Metricool sigue conerror de token. Instagram383972701 a17:00Europe/Madrid aún pendiente de verificación pública. Ciclo parcial, sinPASS ni ejecución fuera de sesión presumida.
