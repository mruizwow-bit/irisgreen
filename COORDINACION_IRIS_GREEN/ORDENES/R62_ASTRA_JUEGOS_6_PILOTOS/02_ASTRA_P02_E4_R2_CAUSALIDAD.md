# R62 · ASTRA · P02 TERRARIO E4 R2 · REWORK ACOTADO DE CAUSALIDAD

Fecha: 29/09/2026  
Issue: #326  
Responsable de corrección: Claude  
Revisión: Astra + HUMAN QA María

Estado:
`R62_P02_E4_SCENE_PASS_CAUSALITY_VISUAL_REWORK_REQUIRED`

## KEEP

No reabrir:
- motor E4;
- mecánica;
- heightfield;
- agua por cota;
- roca integrada;
- sombra/humedad/musgo calculados;
- gameplay desktop;
- gameplay móvil;
- sección frontal;
- cuatro familias de follaje;
- colgantes ramificadas;
- material de roca;
- bandeja móvil;
- LIGHT/NAVY.

## Único bloqueo

El estado causal actual demuestra la roca, pero la cadena:
`roca → sombra → humedad → musgo`
sigue demasiado sutil a primera vista.

Los datos no sustituyen este juicio visual.

## R3 · SOLO CAUSALIDAD

Modificar únicamente las láminas causalidad LIGHT/NAVY.

1. mismo encuadre;
2. misma luz;
3. único cambio causal inicial = añadir roca;
4. ubicar la roca donde la sombra caiga sobre suelo visible adyacente al charco;
5. dejar visible la franja de suelo afectada;
6. humedad legible por material/textura/temperatura además de valor;
7. musgo nuevo visible y espacialmente continuo con sombra+humedad;
8. mantener penumbra natural;
9. no usar overlays explicativos dentro del mundo;
10. texto 1→4 queda secundario.

No rerenderizar gameplay/móvil.

## Entrega

- `causalidad-navy` 1440;
- `causalidad-claro` 1440;
- opcional close-up QA de zona;
- prueba mismo encuadre/luz;
- musgo delta;
- hashes;
- patch/delta mínimo.

Marcador:
`R62_P02_TERRARIO_E4_R3_CAUSALITY_READY_FOR_ASTRA_MARIA`

STOP.
P03 HOLD.
Codex #321 HOLD.
No A2/main/producción.

## Normativa

No cambia normativa transversal.
Consume `IRIS_GREEN_VISUAL_STANDARD_SEP_2026` y el contrato R62 vigente.
