# R59 · AGENTE INTERESES · FÓSILES R2v4 · CIERRE FINAL DE QA NOMINAL + GOBERNANZA

Fecha: 30/09/2026  
Issue: #323  
Responsable: Agente R59  
Revisión: Aura/Astra  
Aceptación final: María

Estado de entrada:

`R59_FOSSILS_R2V4_GOVERNANCE_SUMMARY_RECEIVED_ARTIFACT_VERIFICATION_REQUIRED`

## 0. Regla principal

**NO REABRIR EL PRODUCTO.**

Fósiles ya tiene PRODUCT PASS visual/técnico.

No:
- rerender general;
- cambiar arte;
- cambiar mecánica;
- cambiar materiales;
- cambiar contenido por iniciativa propia;
- abrir Minerales;
- A2;
- main;
- producción.

Tu trabajo ahora es cerrar únicamente:
1. QA nominal;
2. gobernanza verificable.

## 1. QA NOMINAL · CIERRE OBLIGATORIO

El problema anterior era concreto:
las capturas llamadas T. rex, mamut, Archaeopteryx y Dimetrodon no demostraban que el fósil nominal estuviera realmente seleccionado.

Debes demostrar:

1. selección explícita por id/índice antes de capturar;
2. assert de id/nombre activo;
3. FAIL nonzero si el activo no coincide;
4. regenerar las 4 capturas nominales;
5. manifest de capturas actualizado;
6. sellar la evidencia contra el mismo manifest del paquete;
7. prueba negativa del arnés:
   - cambiar deliberadamente el objetivo esperado;
   - el arnés debe fallar;
   - registrar código y fósil esperado/obtenido.

No basta con que el filename diga T. rex.

El contenido visible debe corresponder al fósil nominal.

## 2. GOBERNANZA · CIERRE OBLIGATORIO

R2v4 declara:
- `gobernanza/politicas.json`;
- `gobernanza/comprueba_politicas.py`;
- `gobernanza/prueba_de_politicas.py`;
- `qa/POLITICAS.json`;
- `qa/PRUEBA_POLITICAS.json`;
- `GOBERNANZA.md`;
- manifest 78/78;
- 19 políticas automáticas;
- 4 pendientes humanas;
- 7 sabotajes negativos.

Debes entregar todos esos artefactos dentro del paquete final y demostrar:

1. `MANIFEST.sha256` verifica 78/78 desde ZIP limpio;
2. todos los resultados citan el mismo digest de manifest;
3. `comprueba_politicas.py` ejecuta las automáticas, no solo las enumera;
4. las 4 políticas no automatizables aparecen como PENDIENTES, nunca como PASS automático;
5. los 7 sabotajes provocan FAIL en la política correcta;
6. DEP-01 prueba que el paquete no contiene capacidad de deploy/merge/producción;
7. `GOBERNANZA.md` declara:
   - piloto en revisión;
   - no aprobado para publicar;
   - no conformidad legal global;
   - quién decide cada gate;
   - ciclo de vida;
   - control de cambios.

## 3. CORRECCIÓN GOV-01 · EJECUTOR REAL

La rama puede conservar un nombre histórico con prefijo `codex/`, pero el informe debe explicar de forma inequívoca:

- quién ejecutó realmente R2v4;
- por qué la rama conserva ese nombre;
- que el nombre de rama NO significa que Codex estuviera activo si coordinación lo tenía en HOLD;
- qué agente es responsable de esta entrega.

No dejar ambigüedad.

## 4. POLÍTICAS HUMANAS · NO AUTOAPROBAR

Las políticas humanas deben seguir pendientes hasta firma real:

- EDI-01 · hechos/fuentes;
- EDI-02 · tono/no infantilización;
- A11Y-04 · lector de pantalla/teclado en uso real;
- PUB-01 · publicación.

No convertir:
“pendiente de firma”
en
“PASS porque el script existe”.

## 5. ENTREGA FINAL

Entregar:

- ZIP R2v4 final;
- ZIP capturas nominales;
- `GOBERNANZA.md`;
- `INFORME_R2.md`;
- `CONTRATO_REPRODUCIBILIDAD.md`;
- `PROCEDENCIA.md`;
- `MANIFEST.sha256`;
- políticas + ejecutores;
- todos los JSON de QA;
- hashes SHA-256;
- salida de los ejecutores desde desempaquetado limpio.

## 6. FORMATO DE RESULTADO

No entregar prosa triunfal antes de la evidencia.

Resumen final:

**QA NOMINAL**
- PASS/FAIL
- 4/4 objetivos
- negative test

**REPRO**
- manifest N/N
- byte/pixel result

**GOVERNANCE**
- automáticas PASS/FAIL
- humanas PENDING
- sabotajes N/N

**GOV-01**
- ejecutor real
- rama explicada

**HOLDS**
- Minerales
- A2
- main
- producción

## 7. SIGUIENTE MARCADOR

Si todo lo anterior está cerrado:

`R59_FOSSILS_PILOT_R2V4_FINAL_QA_GOV_READY_FOR_ASTRA_MARIA`

Después:

**STOP.**

No Minerales hasta revisión Astra/Aura + HUMAN QA María.

## 8. MODO DE TRABAJO EN EQUIPO

Aplicar:

`TEAM_WORK_POLICY_R01`

Reglas:
- leer Estado/Control/Orden vigente antes de actuar;
- resolver por ti mismo las decisiones técnicas que estén dentro de tu rol;
- no devolver a María decisiones que puedes investigar y resolver;
- si algo es de otro carril, señalarlo en una frase y continuar;
- no duplicar trabajo ya hecho por otro agente;
- no reabrir PASS sin evidencia nueva;
- no dejar handoffs solo en local si coordinación exige preservación;
- informar estado real, no inflado;
- tono respetuoso y colaborativo;
- error detectado → aprender → corregir → continuar.

No cambia normativa de producto.
