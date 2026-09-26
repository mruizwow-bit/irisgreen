# Agente 7 · R40-RINCON-R04

## Construcción obligatoria

Partir del HEAD web integrado vigente de A2 y corregir R03.

### UX
En Vídeos:
1. reproductor/escena arriba;
2. controles esenciales;
3. selector compacto de escena;
4. ajustes secundarios en disclosure.

Nunca 9 tarjetas + velocidad + color + luz + sonido antes del reproductor.

En Sonidos:
- reproductor/estado actual y controles primero;
- selector compacto después.

En Bola:
- bola y controles primero;
- ajustes secundarios después.

### Sonido
Rehacer 12 sonidos generales + 9 ambientes. No usar ruido filtrado como cama audible dominante de casi todos los sonidos. Preferir assets first-party renderizados/locales y reproducibles, con loops limpios y hashes.

### Visuales
Reconstruir de verdad las ocho escenas previas además de Pulpos. El diff debe tocar el motor visual real, no solo CSS/UI.

### Evidencia
Entregar:
- diff real;
- inventario de visuales modificados;
- assets de audio nuevos con hashes/procedencia;
- tabla R03→R04;
- capturas 1440×900 y 390×844 con herramienta principal arriba.

No deploy. Entregar patch/commit a A2.

Estado final: `R40_RINCON_R04_REAL_REBUILD_READY_FOR_A2`.
