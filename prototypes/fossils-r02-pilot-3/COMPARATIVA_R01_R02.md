# R01 → R02 · decisiones del piloto

| R01 | Decisión R02 | Consecuencia para la persona | Evidencia prevista |
|---|---|---|---|
| R00 preparación/mensaje podían discrepar | una sola `evaluate()` gobierna status, observar e identificar | no se promete una acción que el mismo estado rechaza | browser QA estado/botones/mensaje |
| R01 se identificaba fuera de vista | una zona sólo cuenta si está despejada **y visible en viewport** | no se revela lo que ya no se puede ver | pan fuera → identificar disabled |
| R02 teclado actuaba fuera de pantalla | punto de trabajo de teclado se clampa al viewport | la consecuencia ocurre donde la persona puede verla | test de flechas + Enter |
| R03 mensaje listo se sobrescribía | cada acción termina recalculando un único status | feedback coherente | test status tras último despeje |
| R04 idioma anunciaba otro modo | idioma sólo traduce; `mode` no cambia | instrucciones corresponden al modo activo | test ES→EN en Despejar |
| R05 “esta zona” actuaba en otro lugar | botón usa exactamente `state.point` | nombre y consecuencia corresponden | before/after coordenadas iguales |
| R06 selector sin efecto | retirado selector local | no se ofrecen preferencias falsas | ausencia del control |
| 48 % + 2/3 universal | regiones manuales por piloto | se observa un detalle, no una barra invisible | `REGIONES_QA.md` + SVG |
| ficha como recompensa | Observación parcial antes de identidad | primero se entiende lo que aparece | recorrido de 3 encuentros |
