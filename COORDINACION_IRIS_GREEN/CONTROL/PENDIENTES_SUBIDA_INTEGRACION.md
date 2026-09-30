## R44-A0 · reconciliación V2 · adoptar 3 / construir 5 · 30/09/2026

Estado:
`R44_A0_RECONCILIATION_V2_ADOPT_3_BUILD_5_AUTHORIZED`.

Hallazgo confirmado contra el Taller vivo:
- `E01` ya existe como `d1 · Una sola línea` en Dibujo, con `maxStrokes:1` y `noErase:true`;
- `E17` ya existe como `e6 · Pasa un camión` en Estructuras, con prueba de carga;
- `E22` ya existe como `l6 · Semáforo` en Circuitos, con lógica V→A→R.

Decisión de arquitectura:
- **ADOPTAR** E01/E17/E22: R44 no duplica lógica, estado ni comprobación. Añade ID R44, metadata canónica, presentación/preview y acceso al reto existente.
- **CONSTRUIR NUEVOS** E06/E28/E34/E38/E44: no existen retos internos equivalentes en esos cinco estudios y R44 sí aporta la capa completa.

A0 sigue cubriendo los ocho ámbitos del gate, pero deja de significar “ocho motores de reto nuevos”.

### Corrección de hashes

Los hashes de adjunto y los hashes del contenido preservado en GitHub son distintos y deben separarse.

Matriz fuente:
- adjunto original: 88 581 bytes · SHA-256 `f059d56607c97336612ac6112592264d7b34d3bbfa3d358aed400a8b4166695e`;
- contenido actualmente preservado en GitHub: 88 579 bytes · SHA-256 `d86a931edfe8f4c2a1038490670c9aa8df8b5dd73cdb9840b8be47300b39a147`.

Reconciliación anterior:
- adjunto original: 11 852 bytes · SHA-256 `f1c1d709a4e37e87c4436cd47cd3d9718dfc69feae72318b110ea7aec6eafc44`;
- contenido actualmente preservado en GitHub: 11 851 bytes · SHA-256 `6d26ad955e601e3aa23545be3be3975976ca195569ede82e312f14d09493391c`.

La afirmación anterior “byte-identical” queda RETRACTADA. La diferencia se introdujo al importar texto desde el adjunto; no es deriva de Claude entre commits.

### Framework R1 preservado

Bundle:
- `r44-a0-framework.bundle`;
- 17 773 bytes;
- SHA-256 `9622daf6be256f74f86111e2926e9f6c407bdde1389570dcfb30196dca1bd8ad`;
- prerequisite `2e559991762aca18b7c62f65f4df83ecfbee519b`;
- HEAD `18c15f65557b595dca8477d7d398066c29f6a16f`.

Cadena:
`318a5745789922b82e96bfaebd1536cac240a43e` (existe en remoto) → bundle R62/P04 → `2e559991762aca18b7c62f65f4df83ecfbee519b` → bundle R44 → `18c15f65557b595dca8477d7d398066c29f6a16f`.

El bundle R44 queda preservado en GitHub bajo el handoff A0. Ya no depende solo del chat.

### Qué sigue

Claude continúa SIN STOP:
1. construir los cinco nuevos: E06, E28, E34, E38, E44;
2. después añadir adopción/integración de E01, E17, E22 sobre los retos existentes;
3. mantener la R2 previa: ES/EN completo, preview visual/artefacto visible, CTA real al workspace/reto, metadata ALL_AGES, sin delta stale de `ig-audience.js`, logs brutos y evidencia responsive.

Para los 3 adoptados:
- CTA = activar/navegar al reto existente real;
- criterio automático = heredar el del estudio;
- no crear segundo estado ni segunda comprobación R44.

No escalar a 55.
No main.
No producción.

## R44-A0 · revisión Aura · framework técnico PASS / pilotos R2 requerida · 30/09/2026

Estado:
`R44_A0_FRAMEWORK_TECH_PASS_PILOTS_PRODUCT_REWORK_REQUIRED`.

Artefactos revisados:
- `R44_A0_PRODUCTO.patch.gz` · 9 994 378 bytes · SHA-256 `0f7b8054145dafd102542fe1b44d9aef50a54e8192bc1bf04f9c29847f6e538a`;
- `R44_A0_retos_pilotos_1.png` · SHA-256 `6cdead1bd470b843b40c3b913f5f0c912e1fa5d46962c6624f284a62047ec28e`;
- `R44_A0_retos_pilotos_2.png` · SHA-256 `f8e766f6fcf791a3ed60ec7dc9060f9b8bb75518a5c70c65227f3f54aa8b46cc`.

### PASS técnico acotado

KEEP:
- namespace R44 propio;
- no toca `taller-retos.json` legacy;
- ocho IDs correctos E01/E06/E17/E22/E28/E34/E38/E44;
- panel montado después de `#igt-app`;
- estado de reto solo en memoria de pestaña;
- foco/aria-live/botón 44 px;
- E22 corrige la promesa “LED fundido”;
- detección del problema de taxonomía fue correcta.

### BLOQUEOS antes de review final

1. **ES/EN incompleto**
   - los 8 `en.alternativa` están vacíos;
   - `artefacto` es un único string en español y se renderiza también en EN;
   - por tanto el claim “ES/EN completo” no pasa.

2. **Contrato visual/producto R44 no cumplido**
   - los ocho pilotos entregados son paneles textuales;
   - no hay mini-escena/preview del resultado;
   - no se ve el artefacto final;
   - incumple el gate R44: “RETO = PROPUESTA VISUAL DE HACER ALGO”.

3. **CTA todavía no activa un reto real**
   - “Empezar el reto” solo cambia el estado local 0→1;
   - no carga starter/contexto, no enfoca una acción del workspace ni conecta el reto con el motor;
   - mantener sin puntuación, pero el inicio debe producir una entrada observable al reto real.

4. **Patch no está aislado**
   - el archivo llamado A0 contiene 41 commits, incluyendo R43/R54/R65;
   - para review/integración se exige patch/bundle R44-A0 aislado, no reinyectar la cadena histórica.

5. **No modificar el age gate global desde A0**
   - el A2 vivo ya tiene `assets/ig-audience.js` canónico con AGE_* / ALL_AGES;
   - el cambio R44 sobre una versión legacy es stale y debe desaparecer del patch A0;
   - R44 consume el contrato global, no lo reemplaza.

6. **Metadata de starter**
   - los ocho retos son “Todas”;
   - no fijar `starter_stage: AGE_0_12` para todos sin un starter infantil específico aprobado;
   - usar `ALL_AGES` hasta que exista variante real o declarar una variante por reto.

7. **Evidencia de handoff incompleta**
   - los adjuntos actuales no incluyen logs brutos de axe, reflow, teclado/foco y prueba de edad;
   - deben viajar con R2.

### Móvil

Las capturas muestran colisiones del shell/header en 390. No se atribuyen automáticamente a R44 porque el carril está sobre una base anterior al shell global actual.

Regla:
- NO arreglar header/nav global desde R44;
- rebase/reconciliar A0 contra la base Taller/R67 vigente para evidencia final;
- si una colisión persiste fuera del scope, registrar `R67_GLOBAL_SHELL_BLOCKER` sin invadir el carril.

### R2 mínima

No rehacer framework.

Corregir:
- bilingüe completo;
- preview/mini-escena y artefacto visible por piloto;
- CTA conectado a workspace/starter real;
- starter metadata;
- retirar delta stale de `ig-audience.js`;
- entregar patch/bundle A0 aislado;
- adjuntar logs brutos;
- recapturar evidencia 1440/390/320 LIGHT/DARK, ES/EN sobre base reconciliada.

Marcador esperado:
`R44_A0_FRAMEWORK_8_PILOTS_R2_READY_FOR_ASTRA_AURA_MARIA`.

No escalar a los 55.
No main.
No producción.

## CLAUDE · cola reconciliada tras RESUME GATE · 30/09/2026

La lectura que decía “la matriz R44 no existe” queda SUPERSEDED por avance canónico posterior.

HEAD coordinación vigente al emitir esta corrección:
`4da40f27ea7cf8b8816f8a0c785dc69d31defe7a`.

La matriz exacta YA está preservada en:
`MEMORIA/R44_MATRIZ_64_RETOS_TALLER_CLAUDE_20260928.md`
SHA-256:
`f059d56607c97336612ac6112592264d7b34d3bbfa3d358aed400a8b4166695e`.

La reconciliación YA está preservada en:
`MEMORIA/R44_MATRIZ_RECONCILIADA_OLA_A_CLAUDE_20260930.md`
SHA-256:
`f1c1d709a4e37e87c4436cd47cd3d9718dfc69feae72318b110ea7aec6eafc44`.

Por tanto §2 y §3 de R44-A0 están cerrados y el bloqueo de fuente NO existe.

### Cola ejecutable de ESTA sesión

1. **R44-A0 · ACTIVO AHORA**
   - continuar §4 framework;
   - construir §5: E01, E06, E17, E22, E28, E34, E38, E44;
   - puede preservar por tandas/bundles si el push directo sigue bloqueado;
   - no necesita esperar aprobación entre tandas; STOP solo al completar A0 o ante bloqueo real nuevo.

2. **R62-P04 · AUTORIZADO PARA E4, DESPUÉS DE R44-A0**
   - concepto caja de música de taller PASS;
   - no está esperando HUMAN QA de concepto;
   - no iniciar mientras R44-A0 sea el carril activo salvo nueva orden de María.

3. **R62-P03 · PRODUCTO CERRADO**
   - no trabajo visual;
   - preservación/importación del bundle queda en cola de coordinación;
   - último bundle recibido en chat: SHA-256 `2f61695b23258409673f072f18104fbf7a48e83e7a526c2d864188e89c175f6e`, HEAD `2e559991762aca18b7c62f65f4df83ecfbee519b`, prerequisite `318a5745789922b82e96bfaebd1536cac240a43e`;
   - este bundle incluye la continuación P04 declarada por Claude y sustituye al bundle previo como cadena más reciente de esa sesión;
   - no bloquea R44-A0 por decisión explícita de María.

4. **R61 / R68**
   - no ejecutables en esta sesión si sus artefactos siguen en otros contenedores;
   - no rerenderizar ni reconstruir.

R65 permanece HUMAN QA PASS y no se reabre.

Regla operativa específica:
la autorización explícita de María de R44-A0 fija este carril como trabajo actual pese a que existan preservaciones pendientes gestionadas por coordinación.

No main. No producción.

## R44-A0 · fuente preservada + reconciliación aceptada · 30/09/2026

Estado:
`R44_A0_SOURCE_PRESERVED_RECONCILIATION_ACCEPTED_FRAMEWORK_8_PILOTS_IN_PROGRESS`.

Aura verifica los adjuntos entregados por Claude:

- matriz fuente: SHA-256 `f059d56607c97336612ac6112592264d7b34d3bbfa3d358aed400a8b4166695e`, 88 581 bytes;
- reconciliación: SHA-256 `f1c1d709a4e37e87c4436cd47cd3d9718dfc69feae72318b110ea7aec6eafc44`, 11 852 bytes;
- el patch serie recibido aplica limpio y reproduce ambos documentos byte a byte en verificación local de coordinación.

§2 queda CERRADO:
la matriz exacta se recuperó y queda preservada canónicamente.

§3 queda ACEPTADO como reconciliación de trabajo:
- 55 Ola A / 9 Ola B;
- 27 hosts con motor;
- único hueco de exportación documentado: X08 requiere STL desde Modelado 3D;
- colisión `taller-retos.json` 72 legacy detectada; R44 usa namespace propio;
- correcciones E09/E18/X03/E35/E41 + E22 registradas;
- 8 pilotos reales fijados: E01, E06, E17, E22, E28, E34, E38, E44.

Trazabilidad pendiente, NO bloqueo de construcción:
los logs brutos de axe/exportadores/teclado/foco deben preservarse con el handoff A0. El resultado recibido sobre los hosts no equivale a PASS de accesibilidad de los retos todavía no construidos.

Precedencia de metadata:
la matriz fuente es evidencia histórica. El producto R44 NO usa el valor legacy `TRANSVERSAL`; consume la reconciliación con `ALL_AGES` y `recommended_stage/starter_stage` separados de safety/discovery.

Copy pendiente antes de liberar Ola A:
E09 no debe publicarse con el título bruto “Paleta que funciona para daltonismo”; debe reformularse hacia no depender solo del color, sin garantía de daltonismo.

Claude continúa directamente con §4 framework + §5 ocho pilotos.
R65 no se reabre.
No main. No producción.

## R44-A0 · ampliación Taller · pendiente de construir/preservar/subir · 30/09/2026

| ID | Producto | Issue | Estado producto | Preservación | Integración | Destino | Bloqueo / siguiente acción |
|---|---|---:|---|---|---|---|---|
| R44-A0 | Taller · ampliación 64 retos · A0 cubre 8 = adopta 3 + construye 5 | #319 | R44_A0_RECONCILIATION_V2_ADOPT_3_BUILD_5_AUTHORIZED | FRAMEWORK_BUNDLE_PRESERVED_GITHUB | R2_BUILD_IN_PROGRESS | R67_TALLER_AFTER_R65_PHASE3 | Construir E06/E28/E34/E38/E44 + adoptar E01/E17/E22; mantener R2 de ES/EN/visual/CTA/logs |

Regla: puede construirse ya en carril propio, pero no entra en A2/R67 hasta que el R65 aprobado esté integrado y el A0 pase revisión.

# REGISTRO CANÓNICO · PENDIENTE DE SUBIR / INTEGRAR / ACTIVAR

Fecha de creación: 30/09/2026  
Propósito: impedir que entregas aprobadas o trabajo local se pierdan mientras R67/Web/Sabik están en reparación.

## 0. Regla de interpretación

A partir de ahora NO se usa “subido” como palabra ambigua.

Estados separados:

- `LOCAL_AT_RISK`  
  Existe en máquina/chat/patch local, pero todavía no está preservado de forma suficiente en GitHub.

- `PRESERVED_IN_GITHUB`  
  Fuentes/artefactos están guardados en GitHub o en un handoff versionado.

- `READY_FOR_INTEGRATION`  
  Producto aprobado para entrar en la rama A2/R67.

- `INTEGRATED_A2`  
  Ya está fusionado en la rama viva A2. Puede seguir sin verse por build/preview/global integration.

- `ACTIVATION_PREVIEW_PENDING`  
  Está integrado pero falta build limpio / Deploy Preview / HUMAN QA.

- `FIX_BEFORE_INTEGRATION`  
  Producto o evidencia necesita una corrección acotada antes de integrarse.

- `PRODUCTION_HOLD`  
  Nada de esta cola pasa a main/producción sin gate explícito.

## 1. Cola prioritaria

| ID | Producto | Issue | Estado de producto | Preservación | Integración | Siguiente acción |
|---|---|---:|---|---|---|---|
| R63 | Sala sensorial Sakura | #328 | Runtime/handoff PASS Astra | PRESERVED_IN_GITHUB | **INTEGRATED_A2** | Desbloquear R67, 0 external requests, hardware QA, Deploy Preview, HUMAN QA María |
| R54/R47 | Taller · 6 primeros visuales R54 dentro del Taller real R47 | #318 / #329 | KEEP 6/6 + Taller R47 funcional | PRESERVED_IN_GITHUB | **INTEGRATED_A2** | No restaurar fixture R64. Mantener arte R54 dentro de Taller real; desbloquear build R67 |
| R65 | Taller · 27 visuales + 9 variantes AGE_0_12 | #330 | HUMAN QA María PASS · listo para R67 Fase 3 | HANDOFF_IDENTIFIED | **READY_FOR_INTEGRATION** | Integrar en R67 Fase 3; no reabrir arte ni crear otra QA |
| R62-P03 | Rutas de luz | #326 | HUMAN QA María PASS · P03 cerrado | BUNDLE_LATEST_IN_CHAT_IMPORT_PENDING | PRODUCT_APPROVED_IMPORT_PENDING | Coordinación importa/verifica bundle; no reabrir P03; no bloquea R44-A0 |
| R62-P04 | Ritmo de colores · caja de música de taller | #326 | R62_P04_RITMO_DE_COLORES_CONCEPT_PASS_E4_AUTHORIZED | BUNDLE_LATEST_IN_CHAT_NOT_IMPORTED | E4_AUTHORIZED_WAIT_R44_A0 | R62/E4 | Ejecutar acabado E4 después de R44-A0; no reabrir concepto |
| R61 | Pecera audiovisual 10 min | #325 | Máster KEEP; QA/transfer pendiente | **BLOCKED_BY_SESSION_ARTIFACT_LOCATION** | NOT_READY | Recuperar binarios desde la sesión que los contiene; luego hashes + móvil/motion/benchmark/performance |
| R59 | Fósiles piloto | #323 | Producto PASS; contrato repro aceptado; QA nominal/GOV pendientes | PACKAGE_IN_CHAT / NOT_FINAL | FIX_BEFORE_INTEGRATION | Corregir 4 capturas nominales + GOV-01; después preservar paquete final |
| R68 | Faroles flotantes | #335 | R2 spatial PASS; projection/mobile/LIGHT R3 pending | **LOCAL_AT_RISK** | NOT_READY | Ejecutar R3 acotada; preservar fuente/patch; movimiento runtime separado |
| R42-CONTENT | Contenido R02 | #302 | Mismo ZIP aa3649a8 verificado; base 9c721a79 ya 51 commits atrás | PACKAGE_VERIFIED_ATTACHMENT / STALE_BASE | REBASE_REQUIRED | Rebase sobre HEAD A2 vivo 8ea50128… o posterior; no aplicar ZIP actual |

## 2. Detalle · ya integrados pero no activados como producto final

### R63 · Sakura

Estado verificado en GitHub:

`R63_ASTRA_SAKURA_RUNTIME_HANDOFF_PASS_READY_FOR_A2`

Astra integró el handoff:
- PR #338;
- merge de producto/runtime: `7ac554b85edc256bd85c36271e5e5f6a86ef115a`;
- ajustes posteriores #339 y #340;
- gate R63/Rincón PASS en A2.

Estado operativo:
`INTEGRATED_A2_ACTIVATION_PREVIEW_PENDING`.

Pendiente:
- blocker global R67;
- Google Fonts / 0 external requests;
- `PENDING_HARDWARE_QA`;
- Deploy Preview;
- HUMAN QA María.

**No reconstruir Sakura. No volver a pedir sus fuentes. No revertirla para arreglar R67.**

### R54/R47 · Taller · seis primeros visuales

#329 confirma que la maqueta R64 de HUMAN QA fue retirada.

Checkpoint correcto:
- Taller R47 real;
- 27 estudios;
- ES/EN;
- navegación y motores reales;
- arte R54 de las seis tarjetas integrado como arte;
- sin copy interno R64/HUMAN QA;
- QA específico SUCCESS en `a24cc2e227c7275d17212d9cd72b6e7d1bea7930`.

Estado:
`TALLER_R47_KEEP6_INTEGRATED_A2_GLOBAL_R67_BLOCKED`.

**No volver a subir el fixture R64.**
La fuente válida es Taller R47 + arte R54.

## 3. Detalle · listo para la siguiente integración cuando pase gate

### R65 · Taller 27 + 9

Estado:
`R65_TALLER_27_PLUS_9_HUMAN_APPROVED_FOR_R67_INTEGRATION`.

KEEP: 27/27, KEEP 6/6, 21 nuevas, 9 AGE_0_12, assets AVIF/WebP, launcher/QA responsive y child-safe visual R65.

HUMAN QA:
María confirma el 30/09/2026 que el lote está OK.

Integración:
`READY_FOR_INTEGRATION` → R67 Fase 3.

No crear otra maqueta de QA. No reabrir arte. No main. No producción.

## 4. Detalle · material local que corre riesgo de perderse

### R62 P03 · Rutas de luz

Estado producto:
`R62_P03_CAUSALITY_LAYOUT_R3_AURA_PASS_HUMAN_QA_PENDING`.

R3 recibido:
- patch SHA-256 `a72251f496f3f607a7963a5778b473e346d1edd36d78ea79448499cf4a17632c`;
- bundle SHA-256 `bc4579db5680e9719348e817d1fdbcafcfff2aa3478bffb62fc1f253a0e2de60`;
- prerequisite bundle `318a5745789922b82e96bfaebd1536cac240a43e`;
- HEAD bundle `706a9a671e9f2c6729fa977b4cb9c860c3f5b2c5`.

Aura verifica:
- causalidad layout cerrada;
- paneles WebP no rerenderizados;
- móvil limpia anclaje cortado.

Preservación:
`BUNDLE_IN_CHAT_VERIFIED_METADATA_IMPORT_PENDING`.

No declarar todavía:
`PRESERVED_IN_GITHUB`.

Siguiente:
1. HUMAN QA María;
2. importar bundle en un repo con prerequisite;
3. repetir tests de cadena;
4. preservar rama remota.

Handoff:
`HANDOFFS/R62_P03_R3/README.md`.

### R61 · Pecera

Estado:
`R61_PECERA_10MIN_MASTER_KEEP_FINAL_QA_TRANSFER_PENDING`.

Artefactos declarados:
- `pecera_10min.mp4` · 151,2 MB;
- `pecera_bu.mp4` · 321,4 MB;
- audio M4A/Opus;
- poster;
- HTML;
- build.

Riesgo:
los binarios finales están en otra sesión/contenedor y no son accesibles desde la sesión actual de Claude.

Prioridad:
**TRANSFERIR/PRESERVAR antes de cualquier nueva iteración.**

No rerender visual.

### R68 · Faroles

Claude declara 46 commits locales.

Estado:
`R68_FAROLES_DIRECTION_KEEP_SPATIAL_LIGHTING_REWORK_REQUIRED`.

No está listo para integración, pero sí debe evitarse perder su fuente local.

Preservar cuando entregue R2 o si el entorno local corre riesgo.

## 5. Cola de “NO APLICAR TAL CUAL”

### R42 Contenido R02

ZIP verificado nuevamente:
`iris-green-contenido-R42-20260929(2).zip`

SHA-256:
`aa3649a821da1226dd84bda70f35ee8c8e286cb81c1bd5711af97e71761e8961`.

Es byte-identical al paquete ya auditado. No es una revisión nueva.

Base paquete:
`9c721a79`.

A2 vivo revalidado:
`8ea50128b490207b4dd5508c3c46692f5be69c87`.

Diferencia:
**51 commits por delante**.

No aplicar directamente.

Motivos:
- base A2 obsoleta;
- solapamiento `scripts/build_site.py`;
- R67/R63/child-safe/tokens han avanzado;
- deuda de clasificación corregida a 465 campos URL anómalos, no 405;
- trazabilidad de fuentes aún requiere reconciliación.

Handoff de preservación:
`HANDOFFS/R42_CONTENT_R02_STALE_BASE/README.md`.

Conservar como fuente editorial/rebase.

### R59 Fósiles R2v3

Producto visual KEEP.

No integrar todavía:
- QA nominal incorrecta;
- GOV-01 abierto.

Conservar paquete, corregir solo gate restante.

## 6. Regla de operación mientras Astra repara R67

Antes de comenzar trabajo nuevo, comprobar esta cola.

Prioridad:

1. **PRESERVAR LOCAL_AT_RISK**
2. **NO PERDER INTEGRATED_A2**
3. **INTEGRAR READY_FOR_INTEGRATION**
4. **ACTIVAR/PREVIEW**
5. solo después abrir más trabajo

Regla:

`PRESERVE → INTEGRATE → ACTIVATE → NEW_WORK`

No aceptar:
`NEW_WORK → NEW_WORK → NEW_WORK`
mientras existan handoffs aprobados únicamente en local.

## 7. A2 vivo

Rama:
`agent2/sabik-iris-r08-20260924`

HEAD observado al actualizar este registro:
`8ea50128b490207b4dd5508c3c46692f5be69c87`.

El HEAD puede cambiar mientras Astra trabaja.

**Siempre releer HEAD antes de integrar.**

## 8. Main / producción

Todo este registro mantiene:

`NO_MAIN_NO_PRODUCTION_UNTIL_R67_INTEGRATED_PREVIEW_AND_HUMAN_QA`.
