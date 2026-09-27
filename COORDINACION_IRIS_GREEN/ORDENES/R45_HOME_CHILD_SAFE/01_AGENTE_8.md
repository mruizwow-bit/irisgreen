# R45 · Agente 8 · Home nueva + child-safe

Fecha: 27/09/2026  
Issue operativo: #305  
Puerta web: #289  
Parent child-safe: #293  
Fuente Design/contenido: #301 + #302

## Decisión
María abre un carril exclusivo para construir la nueva interfaz de la Home de Iris Green e implantar child-safe sobre el baseline nuevo.

No reutilizar mecánicamente #294–#297. Son históricos/pausados sobre el baseline viejo.

## Ejecución
Leer Control, Memoria, normativa, #283, #289, #293, #301, #302 y el issue #305 completo. Publicar `R42_NORMATIVA_EMBEBIDA_LEIDA` y construir en la misma sesión.

Base: PR #244 / rama A2 vigente. HEAD observado al emitir: `bf44d6ae7aa362b81fadb16b44bdef358cc31bcc`; releer antes de ramificar.

## Alcance
- Home nueva sobre R42 app shell + Design R02.
- Material/cristal solo en chrome; lectura opaca.
- ES/EN completo.
- selector `Contenido para… / Content for…`: Infancia, Adolescencia, Adultez, Cualquier edad.
- sin selección = SAFE_BY_DEFAULT.
- sin DOB, identidad, diagnóstico ni cuenta.
- child-safe antes de autocomplete/resultados/cards/related.
- S2 full fuera de HTML/payload inicial DEFAULT/INFANCIA/ADOLESCENCIA.
- adulto: full S2 solo tras acción explícita.
- deep link S2 seguro.
- usar manifest auditado de #302: 965 / S0 724 / S1 225 / S2 16.
- no voz, no Cloud, no Taller R43/R44, no Rincón, no main/producción.

## Entrega
Branch, base/head/tree, diff, archivos, build, ES/EN, 1440×900 + 390×844 + 320, teclado/foco/lector/reflow, forced colors, reduced motion/transparency, evidencia de payload child-safe y memoria/control actualizados.

Marcador:
`R42_A8_HOME_CHILD_SAFE_READY_FOR_A2`.

A2 integra y María hace HUMAN QA.
