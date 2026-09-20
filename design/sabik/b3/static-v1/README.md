# SABIK_B3_FAMILY_STATES_STATIC_V1_R1

Fecha: 20/09/2026  
Coordinación: Astra  
Agente: n.º 3 · Prototipos

## Estado

**SABIK_B3_FAMILY_STATES_STATIC_V1_R1_READY**

Base exacta: `742e502802cdc9e3e7b154ddbb8493493c903898`.

PR #181 permanece congelado. PR #163 no se modifica. Este refinamiento actualiza el mismo PR #182.

## Qué cambia frente a V1

PRESENTE queda congelado. PAUSA conserva el concepto de contención. ORIENTAR, TRANSICIÓN y CONFIRMAR dejan de ser grados del mismo gesto:

- ORIENTAR → direccionalidad asimétrica;
- TRANSICIÓN → reorganización de fase mediante contrarrotación;
- PAUSA → reducción/contención global;
- CONFIRMAR → cierre transversal y cohesión.

R1 elimina las fronteras visibles del generador de bandas V1. Las regiones usadas por ORIENTAR, TRANSICIÓN y CONFIRMAR se forman con pertenencias Gaussianas normalizadas; no existe una costura dura utilizada como señal.

## Test ciego

El paquete incluye seis hojas a 64 px, sin nombres de estado y con orden aleatorizado:

- Web color / monocromo;
- IA color / monocromo;
- Educa color / monocromo.

La clave y la plantilla de respuesta se entregan por separado. **No se han fabricado participantes ni una matriz de confusión.** El piloto humano todavía no se ha realizado.

## Reproducibilidad del paquete

Desde la raíz del ZIP:

```bash
python scripts/verify_b3_static.py
python scripts/verify_manifest.py
```

Resultados actuales:

- `ACCEPTED_FAMILY_MASTER_LOCK_PASS 4 files`
- `B3_STATIC_R1_BUILD_PASS`
- `B3_STATIC_R1_REPRODUCIBILITY_PASS 75 files`
- `MANIFEST_PASS 115 files`

PRESENTE Web/IA/Educa se verifica byte-a-byte contra el master aceptado dentro del lienzo técnico.

## Percepción

64 px es la referencia mínima de esta ronda. 32 px se conserva técnicamente, pero queda `PENDING HUMAN TEST`.

## No se toca

Familia visual aceptada, Matriz, T1, paletas, sistema verbal, Core, runtime, main, producción, voz, Safety ni el número/nombres del núcleo B3.

**NO MERGE.**