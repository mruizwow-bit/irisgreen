# R61 · PECERA · QA FINAL POST-TRANSFERENCIA

Fecha: 30/09/2026
Issue: #325
Responsable: Agente R61 / Claude
Revisión: Aura + Astra
HUMAN QA: María

Estado de entrada:
`R61_PECERA_PACKAGE_TRANSFERRED_AGENT_HASH_VERIFIED_FINAL_QA_PENDING`

## 0. Regla principal

TRANSFERENCIA CERRADA.
NO rerenderizar.
NO reabrir arte.

El paquete ya está accesible en el equipo.

## 1. Móvil

Probar el producto real:
- 390×844;
- 320×800.

Verificar:
- vídeo visible sin recorte crítico;
- controles completos;
- target >=44 px;
- touch;
- texto;
- foco;
- fullscreen/salida;
- no overflow destructivo.

Solo si una prueba objetiva demuestra fallo:
corregir layout/player, NO el vídeo/master.

## 2. Movimiento

Demostrar tres estados:

NORMAL
- vídeo/animación completa aprobada.

REDUCIDO
- reducción real y observable según contrato del Rincón;
- no basta cambiar una etiqueta.

SIN_MOVIMIENTO
- 0 movimiento continuo;
- frame estático o equivalente aprobado;
- sin RAF continuo si hay runtime.

Documentar qué asset/runtime usa cada estado.

## 3. Controles

Probar:
- play;
- pause si existe;
- mute/unmute;
- volumen;
- stop;
- fullscreen;
- Escape;
- teclado;
- touch;
- foco visible;
- retorno de foco cuando corresponda.

## 4. Rendimiento

Medir cuando sea posible:
- tiempo hasta primera reproducción;
- tiempo hasta imagen usable;
- buffering;
- memoria;
- CPU;
- GPU si disponible;
- móvil/red simulada o real.

Si el hardware no permite una medición representativa:
`PENDING_HARDWARE_QA`
con campos concretos pendientes.

No inventar PASS.

## 5. Peso / streaming

MP4 web actual ≈151,2 MB.
Master ≈321,4 MB.

NO degradar el master.

Primero medir:
- Range requests;
- startup;
- buffering;
- seek;
- comportamiento en móvil.

Si el MP4 web falla por peso:
generar variante web desde el master, conservando master original.
No rerenderizar escena.

Registrar:
- codec;
- bitrate;
- tamaño;
- duración;
- quality delta;
- hashes.

## 6. Benchmark externo E4

Aplicar benchmark vigente del estándar visual del proyecto.

Comparar producto final, no solo screenshot:
- acabado;
- composición;
- materialidad;
- calma/estimulación;
- interacción;
- móvil;
- accesibilidad;
- rendimiento.

No convertir benchmark en copia estética.

## 7. Incidencia C2PA

Registrar en entrega:
- primer chunk MP4 mutado +5.875 bytes;
- resto exacto;
- gzip evita detección;
- reconstrucción final coincide con hash esperado.

Para futuras transferencias por ese canal:
encapsular MP4 si hay mutación automática y verificar hash al final.

## 8. Salida

Entregar:
- screenshots 390/320;
- matriz motion3;
- controles;
- performance/hardware status;
- benchmark;
- decisión peso/streaming;
- hashes exactos finales;
- inventario de paquete.

Marcador:
`R61_PECERA_FINAL_PACKAGE_MOBILE_BENCHMARK_QA_READY_FOR_ASTRA_MARIA`

Después STOP para review.

No segunda sala.
No A2.
No main.
No producción.
