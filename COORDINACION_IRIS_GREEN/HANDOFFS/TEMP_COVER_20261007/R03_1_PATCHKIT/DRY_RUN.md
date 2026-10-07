# R03.1 patchkit · non-hardware self-test

Resultado reproducible del bloque no dependiente de GPU:

- `qa_static_r031.py`: **23 PASA · 0 FALLA**
- `gen_datos3d.py --verificar`: **R03.1 DATA SOURCE PASS**
- `qa_idempotence_r031.py`: segunda aplicación con **0 added · 0 removed · 0 changed**
- `R03.1 IDEMPOTENCE PASS`
- Python compile: PASS
- JS `node --check`: PASS
- ZIP integrity: PASS
- manifest interno: 12 entradas

Patchkit exportado:
`R03_1_PATCHKIT_v2.zip`

SHA-256:
`d7351cae556c648230e845202e9b6b956087194aefe11e6b8110b98a3b11c82a`

Defectos detectados y corregidos antes del runtime real:

1. tapas ausentes en cuerpos por secciones;
2. source-of-truth R03.1 sin generador propio;
3. guard no idempotente de tentáculos;
4. calamar incompleto: faltaban dos tentáculos;
5. fotóforos oculares incompletos en Teuthowenia;
6. Myctophum sin pectorales/adiposa explícitas;
7. evidencia luminosa contaminada por entorno;
8. dependencia PNG innecesaria del arranque;
9. revelado global por centro en vez de por superficie;
10. anclaje frágil para insertar las aletas del linterna.

El oracle de navegador exige además:
- secciones variables;
- mallas seccionales cerradas;
- 8 brazos + 2 tentáculos + 2 clubs;
- 6 fotóforos oculares;
- 2 pectorales + 1 adiposa en Myctophum;
- raycast volumétrico;
- PNG no cargado en arranque;
- root no camera-facing;
- cambio de setting sin teletransporte;
- bloqueo de calamar preservado.
