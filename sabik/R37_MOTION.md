# R37 · movimiento de los cinco estados

Base: `integration/irisgreen-full-r35-20260923`, `5ba9bced1569a3748825d7c2ce32247ba9217cb5`.
Donante técnico consultado: PR #207, `b6a795de06e713de605fa3c38d26ed5ee743968b`.
La página actual y los cinco PNG Web con contornos reparados se conservan. No se importan la página antigua, la presencia IA, las capas orbitales ni el fondo oscuro del donante.

`window.setSabikState(state, {motionLevel, reason, hold, to})` es un contrato de presentación: `presente|orientar|transicion|pausa|confirmar`. Rechaza otros estados/niveles. `reason` no se registra ni persiste. `hold` permite mantener un master; por defecto CONFIRMAR vuelve a PRESENTE y TRANSICIÓN termina en `to` (PRESENTE si se omite). No modifica S0, sesión, seguridad, voz ni recuperación.

PRESENTE no anima, ni siquiera en su entrada. ORIENTAR hace una reorientación pequeña que se asienta en su master exacto. TRANSICIÓN reorganiza el master brevemente y termina en el destino conocido. PAUSA reduce y asienta el movimiento. CONFIRMAR converge sin rebote y vuelve a la presencia en reposo. Se usa una sola animación Web Animations API por controlador, finita, con `iterations: 1` y sin `fill: forwards`. Los porcentajes conservan proporciones en 32/40/64 px. No hay deformación del bitmap, filtro, cambio de color, oscilación, rAF continuo ni audio.

El ticket de revisión invalida decodificaciones y finalizaciones anteriores; una nueva acción cancela la anterior. El último master decodificado permanece disponible si falla una imagen. Las preferencias se aplican también durante una animación. El selector nativo ofrece NORMAL, REDUCIDO y SIN_MOVIMIENTO; no se guarda entre sesiones. La reducción del sistema nunca termina en NORMAL. El control general de Iris «sin movimiento» y «Bajar intensidad» prevalecen y detienen el movimiento. SIN_MOVIMIENTO cambia entre los masters exactos estáticos.

Proyección funcional:

| Entrada explícita | Presentación |
| --- | --- |
| Aclaración / corrección | ORIENTAR |
| Pausa | PAUSA |
| Reanudar, reiniciar, expandir o cambiar idioma | TRANSICIÓN a la presencia estable |
| Preferencia local aplicada | CONFIRMAR y PRESENTE |
| Reposo, búsqueda, composición, respuesta ordinaria, error o riesgo | PRESENTE; texto y capa de seguridad existentes |

La figura sigue siendo decorativa (`aria-hidden`). Las acciones, estado funcional, respuesta, avisos y región de estado breve comunican el significado. No se anuncian nombres técnicos B3. El foco no se mueve por una animación. El selector de movimiento conserva el comportamiento nativo del teclado.

R37 reemplaza cuatro expectativas anteriores: TRANSICIÓN como búsqueda, ORIENTAR para cualquier respuesta, PRESENTE único al reducir movimiento y ausencia total de animación. Se actualizan esas expectativas en las pruebas B3 manteniendo los contratos de identidad, seguridad, foco, respuesta sin imágenes y ausencia de proveedor. V7 histórica queda intacta; exige los anillos/voz antiguos y no es el contrato visual de R37.

Pruebas: `tools/test-sabik-motion-r37.js` (matriz 5×5×3, cancelación y carreras de decodificación); `tools/test-sabik-motion-r37-browser.js` (montaje real, matriz, frames de los tres niveles, tamaños y teclado); suites B3/S1/S0/S4 existentes. La revisión humana de movimiento y tecnologías de apoyo no se sustituye por estas pruebas.

El despliegue se limita a un candidato completo en irisgreen-home. Mantenimiento público vigente; ningún cambio en sabik-asistente ni activación de chat/proveedor.
