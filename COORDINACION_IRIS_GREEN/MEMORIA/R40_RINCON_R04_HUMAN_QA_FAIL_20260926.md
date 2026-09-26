# Memoria · R40 Rincón R04 · HUMAN QA FAIL · 26/09/2026

María revisa la preview R03 y la rechaza.

Hallazgos:
- la barra Vídeos/Sonidos/Bola se añadió, pero no resolvió el problema;
- en Vídeos aparecen antes del reproductor las 9 escenas y ajustes de Velocidad, Color, Luz y Sonido;
- para ver el vídeo/escena hay que bajar;
- por tanto la página sigue expandiéndose hacia abajo;
- visualmente, las escenas anteriores no fueron reconstruidas de forma sustantiva;
- auditivamente, los nuevos sonidos no proyectan la identidad/relajación requerida.

Revisión técnica del diff R03:
- `assets/rincon-escenas-3d.js` no fue reconstruido en R03;
- se añadió principalmente Pulpos + UI;
- `assets/rincon-sonidos-r40.js` sigue usando de forma extensa white/pink/brown noise filtrado como base.

Decisión:
R03 queda `REJECTED_BY_HUMAN_QA` y se sustituye por #271 R04.

R04 exige reproductor/sonido/bola arriba, reconstrucción visual real y sonido perceptivamente diferenciado.

A7 construye. A2 integra/sube. Aceptación final en la web real.
