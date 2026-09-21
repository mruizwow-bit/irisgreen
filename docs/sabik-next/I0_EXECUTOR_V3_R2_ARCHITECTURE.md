# I0 · EXECUTOR V3-R2 · GENERALIZACIÓN

**Fecha:** 21/09/2026  
**Base exacta:** `b3daefe4f0cd471c8cc92b35472b51f1840569fa`  
**Estado:** desarrollo sobre development + regression V2 consumida; Calibration V3/V4 reservadas no accesibles.

## Señal diagnóstica permitida

R2 utiliza únicamente los agregados publicados por Astra:
- Calibration V3 independiente mostró fallos globales en Safety, insufficient y multiacción;
- no se accede a corpus, utterances, IDs, predicciones, discrepancias ni artifacts de esa Calibration.

## Arquitectura

```text
normalización
→ detección Safety
→ gate protector
→ segmentación composicional
→ intención por cláusula
→ parámetros/slots
→ contexto contractual
→ construcción por acción
→ política por acción
→ ResultKind / S0 / B3
```

### Safety

Tres capas separadas:
1. `detectSafetySignals()`
2. `resolveSafetyGate()`
3. `protectSafetyGate()`

Si el gate resuelto no es `normal`:
- command plan ordinario = vacío;
- action plan ordinario = vacío;
- solo se emite el evento S0 contractual;
- `handoff` produce `human_help`;
- la planificación ordinaria no se ejecuta.

### Insufficient

R2 deriva `insufficient` de ausencia real:
- query obligatoria no derivable;
- parámetro obligatorio ausente;
- operación/confirmación/resultado previo inexistente;
- lastAction inexistente;
- human-help offline sin fallback aprobado;
- estado contractual incompatible.

Una salida `insufficient` contiene **cero acciones ordinarias**.

### Parámetros opacos

R2 no inventa:
- `flowId`;
- `contextId`;
- `contentId`;
- `resultId`;
- `confirmationId`;
- rutas;
- queries genéricas.

Cuando el command es semánticamente resoluble pero el identificador opaco requerido no existe en el contexto:
- se registra `contract_gap`;
- el identificador no se sintetiza;
- otras acciones independientes y válidas del mismo turno pueden ejecutarse;
- el evaluador excluye únicamente ese parámetro opaco de los gates estructurales.

### 18 intenciones

Las 18 intenciones del contrato se prueban individualmente:
- ENCONTRAR_CONTENIDO
- ABRIR_CONTENIDO
- CAMBIAR_TAMANO_TEXTO
- CAMBIAR_MOVIMIENTO
- CAMBIAR_PASO_A_PASO
- CAMBIAR_VISTA_SENCILLA
- CAMBIAR_DETALLES
- SIGUIENTE
- ATRAS
- REPETIR_INDICACION
- RESTABLECER_PREFERENCIAS
- CONFIRMAR_ACCION
- CANCELAR
- DESHACER_ULTIMA_ACCION
- RECHAZAR_RESULTADO
- OTRA_VIA
- DETENER
- PEDIR_AYUDA_HUMANA

### Multiacción

- segmentación por puntuación y conectores solo cuando la cláusula derecha contiene otra acción;
- orden conservado;
- máximo tres commands contractuales;
- slots y parámetros pertenecen a su cláusula;
- última operación del mismo intent sustituye la anterior;
- coreferencia elíptica estructural permitida;
- navegación siempre al final;
- no se usa nearest-neighbour ni threshold de similitud.

### Search mode

Regla de producto:
- intención explícita de ubicación (`dónde / ubicación / localización`) → `locate`;
- otras búsquedas → `list`.

`localizar` por sí solo no fuerza `locate`.

### ResultKind / S0 / B3

Se derivan después de resolver el plan:
- Safety no-normal → proyección Safety;
- gap contractual real sin acción válida → `insufficient`;
- acción ejecutada → `action_result`;
- human-help → `human_help`;
- búsqueda sin acción → `response`;
- aclaración estructural → `clarification`;
- B3 se deriva del resultado/acción/evento resuelto.

## Anti-hardcode

R2 reutiliza y endurece el esquema de auditoría:
- utterances completas;
- fragmentos cortos/largos;
- equivalencia normalizada;
- clusters;
- phrase tables;
- regex near-verbatim;
- IDs/tablas por caso.

Gate:
`CASE_SHAPED_FORBIDDEN = 0`.

## Aislamiento

CI R2:
- checkout shallow de un solo commit;
- sin tags;
- sin credenciales persistentes;
- elimina `origin`;
- no conserva refs remotos/pull;
- tokens GitHub vacíos durante runtime;
- no contiene rutas ni llamadas a evaluaciones reservadas;
- solo lee development y regression V2 consumida.

No se ejecuta Calibration V3 ni V4.
No se abre validation reservada.
No merge.
No deploy.
