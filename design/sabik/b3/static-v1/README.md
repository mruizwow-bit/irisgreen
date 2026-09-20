# SABIK_B3_FAMILY_STATES_STATIC_V1

Fecha: 20/09/2026  
Coordinación: Astra  
Agente: n.º 3 · Prototipos

## Estado

**SABIK_B3_FAMILY_STATES_STATIC_V1_READY**

Base exacta aceptada:

`742e502802cdc9e3e7b154ddbb8493493c903898`

PR visual de origen: #181 · **congelado; no modificar**.

Esta entrega proyecta B3 sobre:

- SABIK WEB
- SABIK IA
- SABIK EDUCA

Presencia Matriz permanece solo como origen/control familiar.

## Núcleo B3

Únicos estados:

**PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR**

Total: **3 presencias × 5 estados = 15 keyframes estáticos**.

No se generan estados de voz, loading, búsqueda, composición, error, Safety, emoción, diagnóstico o personalidad.

## Principio

**B3 comunica función del sistema.**

- Voz = canal independiente.
- Safety = capa independiente.
- UI operacional = capa independiente.
- Si un cambio visual no añade información útil, B3 permanece en PRESENTE.

## Gramática

Los estados se derivan de los masters aceptados. Se calculan tres bandas suaves sobre el eje nativo de cada presencia y se modifican únicamente relaciones de posición/opacidad/cohesión entre esas bandas.

No se añaden flechas, checks, partículas, órbitas, iconos o masas nuevas.

PRESENTE conserva el master aceptado byte-a-byte dentro del lienzo técnico.

## Entrega visual

- `proofs/LAMINA_A_MATRIZ_ESTADOS.png`
- `proofs/LAMINA_B_COMPARACION_POR_ESTADO.png`
- `proofs/LAMINA_C_MONOCROMO.png`
- `proofs/LAMINA_D_ESCALA_64_32.png`
- `proofs/LAMINA_E_MATRIZ_REFERENCIA.png`

## Documentación

- `docs/SABIK_B3_FAMILY_STATES_STATIC_V1.md`
- `docs/B3_STATE_GRAMMAR_V1.json`
- `docs/B3_LEGACY_COMPATIBILITY_MATRIX_V1.md`
- `docs/SABIK_B3_STATIC_COMPLIANCE_MATRIX_V1.md`
- `docs/SABIK_B3_STATIC_COMPLIANCE_MATRIX_V1.csv`
- `docs/STATE_ASSET_MAP.csv`

## Reproducibilidad

Desde la raíz:

```bash
python scripts/verify_b3_static.py
```

Resultado esperado:

`B3_STATIC_REPRODUCIBILITY_PASS`

El script verifica primero el lock de los cuatro masters aceptados y regenera todos los assets/proofs en un directorio temporal antes de comparar SHA-256.

## Accesibilidad

- ningún estado depende solo del color;
- todos disponen de keyframe estático;
- todos tienen señal textual propuesta;
- Motion y Reduced Motion se diseñarán después sobre la misma función;
- 32 px técnico está generado, pero su percepción queda `PENDING HUMAN TEST`;
- no se declara conformidad global de producto.

## Compatibilidad #163

PR #163 se usa como antecedente documental, no como núcleo B3. La matriz de compatibilidad separa `CURRENT_B3`, `UI_LAYER`, `VOICE_LAYER`, `SAFETY_LAYER`, `OBSOLETE` y `NEEDS_REVIEW`.

## Prohibiciones respetadas

No se ha tocado:

- PR #181;
- T1;
- masters aceptados;
- geometrías base;
- sistema verbal;
- Core;
- runtime;
- main;
- producción;
- deploy;
- PR #163.

No hay animación ni audio en esta entrega.

**NO MERGE.**