# El taller de las islas · Prototipo jugable R01

Entrada: `juegos.html`.

Abrir:
1. Extraer el ZIP completo.
2. Abrir `juegos.html` con Chrome, Edge, Firefox o Safari moderno.
3. No necesita servidor, instalación ni conexión de red.

Alcance:
- personaje controlable;
- recoger 24 madera + 12 piedra iniciales y +12 piedra al otro lado;
- modos Recorrer / Construir;
- plataforma (1 madera), bloque (1 piedra), escalera (2 madera);
- cursor con altura y orientación;
- preview válido/inválido con causa textual;
- rutas R1/R2 C1–C5 con soluciones A/B R02;
- abrir caja y desbloquear escaleras;
- dos escaleras para llegar a terraza;
- parcela libre con materiales ilimitados;
- retirada con devolución;
- bloqueo de retirada con dependencias;
- deshacer construcción;
- guardado local con fallback no bloqueante;
- teclado y botones touch;
- NORMAL / REDUCED / NONE;
- DOM textual equivalente para estado/cursor/validez.

Controles teclado:
- Recorrer: flechas/WASD, Enter/Espacio acción, B Construir.
- Construir: flechas/WASD cursor, 1/2/3 pieza, Enter/Espacio colocar, R girar,
  PageUp/PageDown altura, Supr retirar, Ctrl+Z deshacer, Escape cancelar, B Recorrer.

Limitaciones conocidas del R01:
- arte funcional/provisional, no assets finales;
- un único escenario y un solo juego;
- sin backend, sonido ni multijugador;
- el historial de Deshacer no persiste tras recargar; la partida sí;
- el modo libre usa la misma cuadrícula y reglas del prototipo, no es todavía un editor completo.

NO MAIN · NO PRODUCCIÓN.
