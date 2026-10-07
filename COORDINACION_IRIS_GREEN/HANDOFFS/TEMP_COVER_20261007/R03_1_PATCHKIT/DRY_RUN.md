# R03.1 patchkit dry-run

Probado contra un fixture sintético que reproduce la base **R03 true-volume** relevante para el patch.

Secuencia ejecutada:

1. aplicar `apply_r031_v2.py`;
2. ejecutar `qa_static_r031.py`;
3. ejecutar `procedencia/gen_datos3d.py --verificar`;
4. guardar hashes completos;
5. aplicar el mismo patch por segunda vez;
6. repetir QA y verificación;
7. comparar hashes primera/segunda aplicación;
8. `node --check` sobre los JS modificados.

Resultado antes de añadir los dos checks de topología estática:

`18 PASA · 0 FALLA`

Además:

- `R03.1 DATA SOURCE PASS`;
- `IDEMPOTENCE_PASS`;
- `JS_SYNTAX_PASS`;
- segunda aplicación: **0 archivos añadidos, 0 eliminados, 0 hashes cambiados**.

Durante el self-test se detectó y corrigió una fragilidad del generador local de prueba relacionada con el escape de nueva línea. El patch canónico usa el escape correcto para producir un `gen_datos3d.py` válido.

El oracle de navegador queda preparado para comprobar adicionalmente:

- secciones variables;
- mallas seccionales cerradas;
- raycast real;
- ausencia de PNG en arranque;
- raíz no camera-facing;
- no teletransporte;
- bloqueo de calamar.

La ejecución WebGL/GPU real sigue reservada al runtime servido.
