## R61 · Pecera · transferencia cerrada / QA final pendiente · 30/09/2026

Issue: #325

Estado:
`R61_PECERA_PACKAGE_TRANSFERRED_AGENT_HASH_VERIFIED_FINAL_QA_PENDING`.

El bloqueo por localización de binarios queda CERRADO.

El Agente R61 declara transferencia completada al equipo en:
`C:\Users\mruiz\Downloads\iris-pecera-burbujas\`.

Paquete presente según entrega:
- máster `pecera_bu.mp4` ≈321,4 MB;
- `web/pecera_10min.mp4` ≈151,2 MB;
- audio M4A/Opus;
- póster;
- reproductor/HTML;
- capturas QA;
- `build/` con código, incluido `burbujas.py`;
- documento de entrega.

Verificación declarada por el agente:
- diez trozos del paquete: huellas coincidentes;
- cinco medios: huellas coincidentes;
- máster reconstruido: huella coincidente byte a byte.

Coordinación NO inventa hashes no recibidos en este turno; el cierre de transferencia se basa en la verificación local declarada por el agente y deberá conservar los hashes exactos en el documento final de entrega.

### Incidencia de transporte C2PA

Primer intento del máster:
- primer chunk MP4 `ms_aa` recibió +5.875 bytes por inyección automática de procedencia C2PA;
- los demás chunks llegaron exactos;
- reenvío del primer chunk comprimido con gzip evitó la detección como MP4;
- máster reconstruido final coincidió con la huella esperada.

Regla operativa local:
para MP4 que atraviesen ese canal y sufran mutación de procedencia, transportar encapsulados/comprimidos y verificar SHA-256 tras reconstrucción.
Esto NO es una norma transversal del producto web.

### KEEP

No tocar:
- composición;
- roca;
- burbujas;
- densidad actual;
- saturación actual;
- audio;
- cámara;
- fauna;
- vegetación;
- máster 10 min.

### Pendiente antes de PASS final

1. 390×844;
2. 320×800;
3. NORMAL / REDUCIDO / SIN_MOVIMIENTO con evidencia;
4. controles: play, mute/unmute, volumen, stop, fullscreen, teclado, touch, foco, Escape cuando aplique;
5. startup/buffering/memoria/CPU/GPU o `PENDING_HARDWARE_QA`;
6. benchmark externo E4;
7. decisión de peso/streaming basada en medición real del MP4 web de 151,2 MB.

La pérdida localizada de contraste sobre roca clara, densidad 7,8 frente a ~9 del donor y saturación -12% permanecen aceptadas como decisiones de baja estimulación y NO autorizan rerender.

Siguiente marcador:
`R61_PECERA_FINAL_PACKAGE_MOBILE_BENCHMARK_QA_READY_FOR_ASTRA_MARIA`.

STOP:
- arte nuevo;
- salas 2–6;
- A2;
- main;
- producción.

No STOP de QA: esta sesión, si conserva acceso al paquete transferido, puede completar ahora la QA final.
