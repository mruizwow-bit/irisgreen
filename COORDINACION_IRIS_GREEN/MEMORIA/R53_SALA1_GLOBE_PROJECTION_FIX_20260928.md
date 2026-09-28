# R53 · Sala 1 Globos · corrección de proyección PASS · E4 sigue abierto · 28/09/2026

Issue: #317.

Estado:
`R53_SALA1_GLOBE_PROJECTION_FIX_PASS_E4_REWORK_CONTINUES`

## Evidencia revisada

Astra revisa:
- prueba controlada del mismo globo repetido en cinco posiciones;
- sala real tras corrección en escritorio y 390.

## Hallazgo cerrado

El defecto de forma era geométrico/proyectivo:
los impostores alejados del eje óptico quedaban recortados por su quad portador, generando cortes rectos laterales y lectura de blob/deformación.

Tras la corrección:
- las siluetas aisladas quedan circulares/completas;
- desaparece el corte recto;
- la familia vuelve a leerse inequívocamente como globos/esferas.

Gate:
`GLOBE_SILHOUETTE_PROJECTION_PASS`

No reabrir la geometría esférica salvo regresión.

## E4 todavía pendiente

Queda:
- material de membrana inflable más convincente;
- arquitectura material;
- composición que cuente interacción;
- composición móvil propia;
- benchmark E4 final.

El recorte por borde del viewport puede ser composición; no se permite que el propio impostor corte/deforme la silueta.

## Hallazgo transversal

Mismo patrón detectado por Claude en:
- rincon-r53-room-cloud.js
- rincon-r53-room-garden.js

No tocar ahora. Registrar para cuando esas salas se abran.

Marcador final esperado de Sala 1:
`R53_SALA1_GLOBOS_E4_R2_READY_FOR_ASTRA_MARIA`

Otras 5 salas HOLD.
No A2/main/producción.
