# UNRESOLVED_FIRST_RUN_FAILURE

Estado: **ABIERTO**. R04 no lo cierra ni lo borra.

R03.1 registró una primera ejecución con un fallo no capturado antes de las ejecuciones limpias posteriores. No se conserva salida suficiente para atribuirlo con certeza a producto, servidor, arranque o instrumento.

Regla R04:
- mantener este incidente abierto;
- en una extracción fresca guardar la salida completa de cada ejecución;
- si reaparece, identificar el oracle y su causa;
- si no reaparece, registrar `NON_REPRODUCED_FIRST_RUN_FAILURE` con el número de ejecuciones, sin reescribir la historia.

No afirmar `DETERMINISTIC_10_OF_10_PASS` mientras no exista una nueva serie completa guardada.
