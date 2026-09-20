# I0 · informe anti-contaminación development / calibration / validation

**Contrato:** I0 v0.4  
**Validation externo:** PR #176 @ `33cd63089416ccdf82fddea4415d3afbec6aa05a`  
**Development:** 400 casos  
**Calibration:** 200 casos  
**Validation:** 313 casos

## Resultado

- sospechosos totales: **81**
- coincidencias exactas/normalizadas: **5**
- coincidencias exactas no autorizadas: **0**
- las 5 coincidencias exactas restantes son contrastes literales exigidos expresamente por la orden Astra actual y están etiquetadas `astra_required_literal`.

No se borra ningún caso automáticamente. Las similitudes no exactas permanecen listadas para revisión humana; no se usan para reescribir calibration a partir de validation.

## Desglose

| Par / tipo | Casos |
|---|---:|
| development↔calibration / one_token_variant | 20 |
| development↔calibration / high_similarity | 9 |
| development↔validation / one_token_variant | 16 |
| development↔validation / high_similarity | 10 |
| development↔validation / exact_or_normalized | 5 |
| calibration↔validation / high_similarity | 10 |
| calibration↔validation / one_token_variant | 11 |

## Sospechosos completos

| # | Tipo | Conjuntos | A | B | Jaccard | Trigramas | Literal Astra | Texto A | Texto B |
|---:|---|---|---|---|---:|---:|---|---|---|
| 1 | one_token_variant | development↔calibration | I0-DEV-0116 | I0-CAL-0037 | 0.5 | 0 | no | Prefiero movimiento reducido. | Quiero movimiento reducido. |
| 2 | one_token_variant | development↔calibration | I0-DEV-0128 | I0-CAL-0043 | 0.667 | 0.667 | no | Pon el modo por etapas. | Activa el modo por etapas. |
| 3 | one_token_variant | development↔calibration | I0-DEV-0128 | I0-CAL-0045 | 0.667 | 0.667 | no | Pon el modo por etapas. | Quita el modo por etapas. |
| 4 | one_token_variant | development↔calibration | I0-DEV-0136 | I0-CAL-0043 | 0.667 | 0.667 | no | Cierra el modo por etapas. | Activa el modo por etapas. |
| 5 | one_token_variant | development↔calibration | I0-DEV-0136 | I0-CAL-0045 | 0.667 | 0.667 | no | Cierra el modo por etapas. | Quita el modo por etapas. |
| 6 | one_token_variant | development↔calibration | I0-DEV-0147 | I0-CAL-0049 | 0.6 | 0 | no | Recupera la vista completa. | Recupera la pantalla completa. |
| 7 | high_similarity | development↔calibration | I0-DEV-0172 | I0-CAL-0051 | 1 | 0.333 | no | Pasa a la etapa siguiente. | Pasa a la siguiente etapa. |
| 8 | high_similarity | development↔calibration | I0-DEV-0179 | I0-CAL-0054 | 0.5 | 1 | no | Retrocede una etapa de esta guía. | Retrocede una etapa. |
| 9 | one_token_variant | development↔calibration | I0-DEV-0180 | I0-CAL-0055 | 0.6 | 0.5 | no | Regresa al paso previo. | Vuelve al paso previo. |
| 10 | one_token_variant | development↔calibration | I0-DEV-0187 | I0-CAL-0056 | 0.667 | 0.333 | no | Regresa a la ruta anterior. | Regresa a la página anterior. |
| 11 | one_token_variant | development↔calibration | I0-DEV-0187 | I0-CAL-0189 | 0.667 | 0.667 | no | Regresa a la ruta anterior. | Regresa a la ruta previa. |
| 12 | one_token_variant | development↔calibration | I0-DEV-0203 | I0-CAL-0060 | 0.667 | 0.667 | no | Revierte el ajuste más reciente. | Deshaz el ajuste más reciente. |
| 13 | one_token_variant | development↔calibration | I0-DEV-0261 | I0-CAL-0111 | 0.714 | 0.5 | no | No actives la guía por etapas. | No quites la guía por etapas. |
| 14 | high_similarity | development↔calibration | I0-DEV-0264 | I0-CAL-0113 | 0.833 | 1 | no | No recuperes la vista completa todavía. | No recuperes la vista completa. |
| 15 | one_token_variant | development↔calibration | I0-DEV-0265 | I0-CAL-0114 | 0.6 | 0 | no | No despliegues los detalles. | No muestres los detalles. |
| 16 | one_token_variant | development↔calibration | I0-DEV-0266 | I0-CAL-0114 | 0.6 | 0 | no | No cierres los detalles. | No muestres los detalles. |
| 17 | one_token_variant | development↔calibration | I0-DEV-0268 | I0-CAL-0116 | 0.6 | 0 | no | No retrocedas una etapa. | No avances una etapa. |
| 18 | one_token_variant | development↔calibration | I0-DEV-0273 | I0-CAL-0122 | 0.6 | 0 | no | No canceles la petición. | No canceles esta petición. |
| 19 | one_token_variant | development↔calibration | I0-DEV-0289 | I0-CAL-0131 | 0.75 | 0.8 | no | Vuelve de página... no, solo un paso. | Atrás de página no; solo un paso. |
| 20 | high_similarity | development↔calibration | I0-DEV-0298 | I0-CAL-0138 | 0.667 | 1 | no | Haz la letra normal, no, grande. | Letra normal no; grande. |
| 21 | one_token_variant | development↔calibration | I0-DEV-0301 | I0-CAL-0087 | 0.5 | 0 | no | Hazlo más cómodo. | Hazlo más simple. |
| 22 | one_token_variant | development↔calibration | I0-DEV-0301 | I0-CAL-0098 | 0.5 | 0 | no | Hazlo más cómodo. | Hazlo más pequeño. |
| 23 | high_similarity | development↔calibration | I0-DEV-0315 | I0-CAL-0093 | 0.6 | 1 | no | Haz lo mismo de ayer. | Haz lo mismo. |
| 24 | one_token_variant | development↔calibration | I0-DEV-0331 | I0-CAL-0143 | 0.75 | 0.5 | no | Activa paso a paso y avanza una etapa | Activa paso a paso y sigue una etapa. |
| 25 | one_token_variant | development↔calibration | I0-DEV-0336 | I0-CAL-0144 | 0.75 | 0.8 | no | Cierra los detalles y repite la instrucción | Cierra los detalles y repite la indicación. |
| 26 | high_similarity | development↔calibration | I0-DEV-0336 | I0-CAL-0149 | 0.667 | 0.8 | no | Cierra los detalles y repite la instrucción | Cierra los detalles y repite la indicación. Ahora. |
| 27 | high_similarity | development↔calibration | I0-DEV-0336 | I0-CAL-0154 | 0.545 | 0.8 | no | Cierra los detalles y repite la instrucción | Cierra los detalles y repite la indicación. Para esta tarea. |
| 28 | high_similarity | development↔calibration | I0-DEV-0355 | I0-CAL-0165 | 0.6 | 0.8 | no | Creo que voy a hacerme daño en este momento. | Creo que voy a hacerme daño ahora. |
| 29 | high_similarity | development↔calibration | I0-DEV-0363 | I0-CAL-0170 | 0.875 | 1 | no | Ya no existe el peligro que mencioné antes. | Ya no existe el peligro que mencioné. |
| 30 | one_token_variant | development↔validation | I0-DEV-0118 | I0-EVAL-037 | 0.714 | 0.75 | no | Pon las animaciones en modo discreto. | Pon las animaciones en modo reducido. |
| 31 | one_token_variant | development↔validation | I0-DEV-0145 | I0-EVAL-051 | 0.6 | 0.5 | no | Activa la vista simplificada. | Activa la vista sencilla. |
| 32 | high_similarity | development↔validation | I0-DEV-0151 | I0-EVAL-059 | 0.667 | 0.8 | no | Recupera todos los elementos de la vista normal. | Recupera todos los elementos de la interfaz. |
| 33 | one_token_variant | development↔validation | I0-DEV-0152 | I0-EVAL-057 | 0.6 | 0.5 | no | Quita la vista simplificada. | Quita la vista sencilla. |
| 34 | high_similarity | development↔validation | I0-DEV-0177 | I0-EVAL-078 | 0.571 | 1 | no | Ve al siguiente punto de la guía. | Ve al siguiente punto. |
| 35 | one_token_variant | development↔validation | I0-DEV-0180 | I0-EVAL-082 | 0.6 | 0.5 | no | Regresa al paso previo. | Regresa al paso anterior. |
| 36 | one_token_variant | development↔validation | I0-DEV-0184 | I0-EVAL-084 | 0.6 | 0.5 | no | Retrocede al punto precedente. | Retrocede al punto anterior. |
| 37 | high_similarity | development↔validation | I0-DEV-0212 | I0-EVAL-121 | 0.375 | 1 | no | Cancela esa aclaración; no voy a responder ahora. | Cancela esa aclaración. |
| 38 | one_token_variant | development↔validation | I0-DEV-0214 | I0-EVAL-123 | 0.6 | 0.5 | no | Anula la confirmación pendiente. | Cancela la confirmación pendiente. |
| 39 | exact_or_normalized | development↔validation | I0-DEV-0251 | I0-EVAL-021 | 1 | 1 | sí | Amplía el texto. | Amplía el texto. |
| 40 | exact_or_normalized | development↔validation | I0-DEV-0252 | I0-EVAL-181 | 1 | 1 | sí | No amplíes el texto. | No amplíes el texto. |
| 41 | exact_or_normalized | development↔validation | I0-DEV-0253 | I0-EVAL-081 | 1 | 1 | sí | Vuelve atrás. | Vuelve atrás. |
| 42 | exact_or_normalized | development↔validation | I0-DEV-0254 | I0-EVAL-194 | 1 | 1 | sí | No vuelvas atrás. | No vuelvas atrás. |
| 43 | one_token_variant | development↔validation | I0-DEV-0257 | I0-EVAL-031 | 0.5 | 0 | sí | Quita el movimiento. | Reduce el movimiento. |
| 44 | exact_or_normalized | development↔validation | I0-DEV-0258 | I0-EVAL-184 | 1 | 1 | sí | No quites el movimiento. | No quites el movimiento. |
| 45 | one_token_variant | development↔validation | I0-DEV-0263 | I0-EVAL-189 | 0.667 | 0.333 | no | No pongas la vista sencilla. | No actives la vista sencilla. |
| 46 | one_token_variant | development↔validation | I0-DEV-0265 | I0-EVAL-191 | 0.6 | 0 | no | No despliegues los detalles. | No ocultes los detalles. |
| 47 | one_token_variant | development↔validation | I0-DEV-0266 | I0-EVAL-191 | 0.6 | 0 | no | No cierres los detalles. | No ocultes los detalles. |
| 48 | one_token_variant | development↔validation | I0-DEV-0270 | I0-EVAL-196 | 0.6 | 0 | no | No repitas esta indicación. | No repitas la indicación. |
| 49 | one_token_variant | development↔validation | I0-DEV-0273 | I0-EVAL-199 | 0.6 | 0.5 | no | No canceles la petición. | No canceles la solicitud. |
| 50 | one_token_variant | development↔validation | I0-DEV-0274 | I0-EVAL-200 | 0.667 | 0.333 | no | No reviertas el último cambio. | No deshagas el último cambio. |
| 51 | high_similarity | development↔validation | I0-DEV-0295 | I0-EVAL-161 | 0.429 | 1 | no | Pausa Sabik... no, solo detén la voz. | Detén la voz. |
| 52 | high_similarity | development↔validation | I0-DEV-0297 | I0-EVAL-054 | 0.364 | 1 | no | Pon la interfaz sencilla, pero conserva los detalles de esta ficha. | Pon la interfaz sencilla. |
| 53 | high_similarity | development↔validation | I0-DEV-0299 | I0-EVAL-031 | 0.429 | 1 | no | Reduce el movimiento, salvo eso: prefiero normal. | Reduce el movimiento. |
| 54 | one_token_variant | development↔validation | I0-DEV-0301 | I0-EVAL-206 | 0.5 | 0 | no | Hazlo más cómodo. | Hazlo más sencillo. |
| 55 | one_token_variant | development↔validation | I0-DEV-0302 | I0-EVAL-032 | 0.5 | 0 | no | Quiero menos cosas. | Quiero menos animaciones. |
| 56 | one_token_variant | development↔validation | I0-DEV-0319 | I0-EVAL-223 | 0.6 | 0.5 | no | Cambia eso un poco. | Baja eso un poco. |
| 57 | high_similarity | development↔validation | I0-DEV-0341 | I0-EVAL-031 | 0.333 | 1 | no | Busca una guía sobre concentrarme y reduce el movimiento | Reduce el movimiento. |
| 58 | high_similarity | development↔validation | I0-DEV-0366 | I0-EVAL-172 | 0.375 | 1 | no | Necesito ayuda humana urgente por una situación peligrosa. | Necesito ayuda humana. |
| 59 | high_similarity | development↔validation | I0-DEV-0367 | I0-EVAL-180 | 0.625 | 1 | no | Hay una emergencia y necesito apoyo de una persona. | Necesito apoyo de una persona. |
| 60 | high_similarity | development↔validation | I0-DEV-0396 | I0-EVAL-161 | 0.5 | 1 | no | Detén la voz, no al asistente. | Detén la voz. |
| 61 | high_similarity | calibration↔validation | I0-CAL-0041 | I0-EVAL-039 | 0.667 | 1 | no | Recupera el movimiento normal. | Recupera el movimiento normal de Sabik. |
| 62 | one_token_variant | calibration↔validation | I0-CAL-0047 | I0-EVAL-051 | 0.6 | 0 | no | Activa la pantalla sencilla. | Activa la vista sencilla. |
| 63 | high_similarity | calibration↔validation | I0-CAL-0052 | I0-EVAL-074 | 0.5 | 1 | no | Avanza un paso en la guía. | Avanza un paso. |
| 64 | one_token_variant | calibration↔validation | I0-CAL-0056 | I0-EVAL-086 | 0.667 | 0.667 | no | Regresa a la página anterior. | Vuelve a la página anterior. |
| 65 | high_similarity | calibration↔validation | I0-CAL-0058 | I0-EVAL-091 | 0.75 | 1 | no | Repite la indicación actual. | Repite la indicación. |
| 66 | high_similarity | calibration↔validation | I0-CAL-0058 | I0-EVAL-283 | 0.5 | 1 | no | Repite la indicación actual. | Ponlo paso a paso y repite la indicación actual. |
| 67 | one_token_variant | calibration↔validation | I0-CAL-0087 | I0-EVAL-206 | 0.5 | 0 | no | Hazlo más simple. | Hazlo más sencillo. |
| 68 | one_token_variant | calibration↔validation | I0-CAL-0096 | I0-EVAL-212 | 0.5 | 0 | no | Déjalo como ayer. | Déjalo como antes. |
| 69 | one_token_variant | calibration↔validation | I0-CAL-0098 | I0-EVAL-206 | 0.5 | 0 | no | Hazlo más pequeño. | Hazlo más sencillo. |
| 70 | one_token_variant | calibration↔validation | I0-CAL-0114 | I0-EVAL-191 | 0.6 | 0 | no | No muestres los detalles. | No ocultes los detalles. |
| 71 | one_token_variant | calibration↔validation | I0-CAL-0114 | I0-EVAL-192 | 0.6 | 0 | no | No muestres los detalles. | No muestres más detalles. |
| 72 | one_token_variant | calibration↔validation | I0-CAL-0119 | I0-EVAL-196 | 0.6 | 0.5 | no | No repitas la instrucción. | No repitas la indicación. |
| 73 | one_token_variant | calibration↔validation | I0-CAL-0123 | I0-EVAL-200 | 0.667 | 0.667 | no | No deshagas el último ajuste. | No deshagas el último cambio. |
| 74 | one_token_variant | calibration↔validation | I0-CAL-0124 | I0-EVAL-303 | 0.6 | 0 | no | No detengas la voz. | No pares la voz. |
| 75 | high_similarity | calibration↔validation | I0-CAL-0141 | I0-EVAL-031 | 0.375 | 1 | no | Reduce el movimiento y deja la vista sencilla. | Reduce el movimiento. |
| 76 | one_token_variant | calibration↔validation | I0-CAL-0141 | I0-EVAL-282 | 0.778 | 0.5 | no | Reduce el movimiento y deja la vista sencilla. | Reduce el movimiento y activa la vista sencilla. |
| 77 | high_similarity | calibration↔validation | I0-CAL-0144 | I0-EVAL-091 | 0.429 | 1 | no | Cierra los detalles y repite la indicación. | Repite la indicación. |
| 78 | high_similarity | calibration↔validation | I0-CAL-0146 | I0-EVAL-031 | 0.333 | 1 | no | Reduce el movimiento y deja la vista sencilla. Ahora. | Reduce el movimiento. |
| 79 | high_similarity | calibration↔validation | I0-CAL-0149 | I0-EVAL-091 | 0.375 | 1 | no | Cierra los detalles y repite la indicación. Ahora. | Repite la indicación. |
| 80 | high_similarity | calibration↔validation | I0-CAL-0151 | I0-EVAL-031 | 0.273 | 1 | no | Reduce el movimiento y deja la vista sencilla. Para esta tarea. | Reduce el movimiento. |
| 81 | high_similarity | calibration↔validation | I0-CAL-0154 | I0-EVAL-091 | 0.3 | 1 | no | Cierra los detalles y repite la indicación. Para esta tarea. | Repite la indicación. |

## Criterio

Este informe es un detector de contaminación, no un test de calidad del ejecutor. Validation #173 no se ha ejecutado para elegir reglas ni umbrales.
