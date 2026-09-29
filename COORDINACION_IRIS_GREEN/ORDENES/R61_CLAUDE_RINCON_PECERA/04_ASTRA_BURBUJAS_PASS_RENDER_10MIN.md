# R61 · ASTRA / HUMAN QA · PECERA · BURBUJAS PASS · RENDER 10 MIN AUTORIZADO

Fecha: 29/09/2026  
Issue: #325  
Autoridad de producto: María  
Revisión: Astra  
Responsable de ejecución: Claude

Estado:

`R61_PECERA_BUBBLES_PROTOTYPE_HUMAN_APPROVED_RENDER_10MIN_AUTHORIZED`

Esta orden supersede el STOP previo de `03_ASTRA_BURBUJAS_VISUALES.md` únicamente respecto al render largo. El prototipo de burbujas ya pasa revisión humana.

## PASS

Se aprueban:
- columna lateral derecha;
- anillos ilustrados;
- grosor actual;
- velocidad actual;
- densidad actual;
- oclusión por plantas/rocas/fauna;
- coherencia con el audio de burbujas.

El defecto original —audio de burbujas sin burbujas visibles— queda resuelto.

## KEEP / no reabrir

No tocar:
- composición;
- roca;
- rama;
- peces;
- vegetación;
- arena;
- agua;
- cámara;
- audio aprobado;
- lenguaje ilustrado.

La pérdida localizada de contraste sobre la roca clara no justifica mover la roca ni reabrir la composición.

No aumentar densidad por defecto para igualar un conteo bruto del donor. Para Rincón tranquilo se conserva la densidad actual.

## Ejecución autorizada

Claude puede:
1. renderizar el máster completo de ≈10 min;
2. remux con el audio aprobado;
3. ejecutar QA final;
4. verificar NORMAL / REDUCIDO / SIN_MOVIMIENTO;
5. comprobar 1440 / 390 / 320;
6. comprobar ausencia de loop evidente;
7. registrar codec, peso, hashes, procedencia y rendimiento real o `PENDING_HARDWARE_QA`.

## Gate de salida

Marcador esperado:

`R61_PECERA_10MIN_ILLUSTRATED_AV_READY_FOR_ASTRA_MARIA`

STOP tras la entrega.

Astra review → HUMAN QA María.

No segunda sala.  
No A2.  
No main.  
No producción.

## Normativa

No cambia normativa transversal.

Se consumen:
- `IRIS_GREEN_VISUAL_STANDARD_SEP_2026`;
- low-stimulation;
- NORMAL / REDUCIDO / SIN_MOVIMIENTO;
- accesibilidad vigente;
- ES/EN;
- performance/provenance ya exigidos por R61.
