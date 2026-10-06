# Nexo · Vida marina R04 · revisión independiente de código y transformaciones
Fecha: 2026-10-06
Decisión: KEEP_CORE · R04_TARGETED_REWORK_REQUIRED_BEFORE_MICROSCENE
No constituye Axioma PASS, navegador PASS ni HUMAN QA.

## Artifact exacto y método
Producto: descubrimiento-peces-R04.zip
SHA256 1e58fa1f31c5af25d647be47a1cd324202f169f12aa4806fd812d4641f9ff028
6 443 978 bytes; 36 archivos (45 entradas ZIP con directorios); 35/35 hashes del MANIFEST_SHA256.txt correctos.
Interno: descubrimiento-peces-R04-interno.zip
SHA256 5c357cef5fcd373d3842bb7ffea6e278cc378ddc47798b3e43489a38386b7f9b
3 740 147 bytes; 39 archivos (45 entradas ZIP con directorios); no manifiesto global equivalente encontrado.
Los seis PNG de producto coinciden con hashes declarados en datos.
Leídos motor, interfaz, datos, HTML/CSS, notas, informe de registro y pruebas R04/qa8. Contrastado con la orden completa ORDEN_CLAUDE_CORRECCIONES_R03_Y_PILOTO.md de la rama de coordinación.
Ejecutados listeners y funciones originales en fixtures Node; dibujo de pares con Canvas nativo. Se construyen estados de prueba explícitos. No navegador real, layout, foco DOM nativo, lector ni teléfono físico. No ejecuté las suites Playwright entregadas.
Reproducciones adjuntas: reproduce.cjs y REPRODUCTIONS.json. Paquetes originales intactos.

## Mejoras que se conservan
- Listener original acepta clic quieto de 1300 ms: luz (0.31,0.22).
- pointercancel ya no llama apuntar en la secuencia simple reproducida.
- Entrada directa no cuantiza en NONE; código usa limitar, no rejilla.
- focus({preventScroll:true}) aborda el desplazamiento de página, aunque ese efecto requiere navegador para validarlo aquí.
- Examinar se sitúa inmediatamente después de escena en HTML; instrucciones extensas en Ayuda. Los 12 px declarados son medida de autor, no mía.
- Retirados controles de tramos inexistentes y selector visible.
- Densidad ambiental separada; motor dibuja esa capa aparte.
- Familias de deformación distintas y segunda condición de región, declaradas como representación. No equivale a validar nado o anatomía.
- Carga binaria del producto limitada a seis PNG; no los 26 anteriores.

## Bloqueos concretos
### R04-N01 · Registro luz/oscuro incorrecto al voltear
desplazarLuz calcula ajuste en pantalla y dibujarDeformado traslada el rectángulo antes de calcular su propio centro de giro. Oscuro y luz terminan girando alrededor de centros distintos. El desplazamiento no se refleja con el cuerpo.
Reproducción: funciones originales, PNG reales, sin onda y a escala nativa, fondo transparente, giro +1 y -1. IoU alfa >=128:
| Par | giro +1 | giro -1 |
|---|---:|---:|
| Pez hacha | 0.988841 | 0.977458 |
| Pez linterna (offset 0) | 0.981797 | 0.981797 |
| Calamar cristal | 0.964018 | 0.805537 |
Estos valores miden coincidencia de máscaras, no calidad anatómica. El caso sin onda aísla un error real de transformación; hay que comprobar también onda y giros intermedios.
Corrección: registrar el par en coordenadas locales comunes ANTES de deformación/reflexión, con pivote común. Render y muestras de detección/rasgo deben usar el mismo sistema. Ahora evaluar no aplica el ajuste de registro a muestras.
No redibujar originales. Retest ambos sentidos, giro intermedio, NORMAL/REDUCED/NONE, pausa y barrido parcial. Calamar mantiene además discrepancias locales de puntas reconocidas por autor: offset no las resuelve.

### R04-N02 · NONE conserva centro pero borra pose y puede invertir
reanclarPorMovimiento preserva posición. Pero hayPose depende de amplitud; NONE da false. orientacion calcula vx=0 y fuerza objetivo +1. Un animal que estaba a giro -1 cambia inmediatamente a +1. ondaY pasa a cero; cambiar a reducido también cambia fase/amplitud de golpe.
Fixture de estado pausado válido en t=7:
posición antes/después (2282.14414735743,604.8231745745485); giro -1 → +1.
No es una ruta de navegador: demuestra la lógica para ese estado.
La medición «0.000 px» de posiciones NO cubre continuidad de orientación/deformación.
Corrección: guardar pose visible al cambiar preferencia; NONE la congela. REDUCED adapta evolución sin salto y sin animación impuesta en NONE. Pausa manual se conserva.
El giro todavía ejecuta girar(...,0.055) por frame: tras 1 s a 30/60/120 llamadas el estado es -0.6336/-0.9329/-1. Usar dt; probar misma duración real y render adicional sin adelantar giro.

### R04-N03 · Selección múltiple incompleta y decisión de producto cambiada
El manejador Enter/Espacio conserva condición examinables.length===1. Con dos candidatos y candidatoId válido no examina, no anuncia ni preventDefault. Reproducido con listener original.
Además el motor escoge primero por fracción iluminada. La orden completa pedía comunicar varias señales y dejar elegir, sin elegir por persona. Como Claude no pudo leerla, esta parte debe trasladarse explícitamente.
Corrección propuesta: con varios, anunciar cantidad y cómo elegir; mantener selección explícita, mostrar posición/rasgo de la señal elegida; Enter/Espacio actúan coherentemente sobre ella. No revelar automáticamente al asignar un candidato. La tolerancia no debe convertirse en selección de otro animal sin intención.

### R04-N04 · Riesgo de foco trasladado a Otro animal
pintarCandidatos pone hidden=true a btn-otro al pasar de dos candidatos a uno o ninguno, sin comprobar activeElement ni transferir foco.
Fixture: hidden=true y cero llamadas a focus. No afirmo haber observado BODY en un navegador.
Corrección: conservar control enfocado hasta salida o transferir a Examinar/escena antes de ocultarlo; prueba Tab real, esperar que cambien candidatos y continuar sin click.

### R04-N05 · Segundo contacto todavía sustituye gesto
Cada pointerdown sobrescribe g. Dos contactos quietos y soltar segundo producen apuntar(0.8,0.5). Reproducido con eventos sintéticos, no pinch físico.
Corrección: gestionar punteros activos; multitouch no puede degradarse a tap del último dedo. Validar cancelación, lostpointercapture y scroll de página en teléfono real. No confundir prueba sintética con dispositivo.

## Evidencia y entrega que requieren corregirse
- Producto aún lleva catálogo de 16 entradas, escenas privadas de 13 y banco técnico de 3; datos.js es idéntico al interno. modoEquipo=false oculta UI y faltan binarios privados, pero no se ha separado físicamente el catálogo técnico. La orden pedía build de producto sin datos/rutas técnicos. Esto no es una filtración de secretos: es incumplimiento de aislamiento de entrega.
- NOTAS_DE_PRUEBAS.md sigue titulado R03, fecha 2026-10-05, tablas duplicadas y referencias a grabación/pruebas ausentes. No hay evidencia R04 guardada que respalde por sí sola «todo pasa».
- r04b.js titula una prueba «varios animales» y acepta max>=1. Enumerar 21 elementos no demuestra recorrerlos con Tab. FPS usa contador RAF de navegador; móvil es viewport emulado en host, no hardware móvil medido.
- qa8.js exige atributo aria-disabled === 'false' en btn-examinar; HTML no lo incluye y pintarCandidatos declara que ya no lo asigna. Ese oráculo no concuerda con el código entregado. El bucle termina anunciando fallos pero no establece exit code de fallo.
- Scripts dependen de build/descubrimiento-peces y /opt/pw-browsers/chromium; no son portables tal como extraídos. Resolver raíz y ejecutable configurables; producir resultados sobre ZIP final.
- Reflow R04 se limita principalmente a ancho horizontal/posición de botones. Falta clipping interno vertical y estados abiertos a 320/390/1440, 200 %.
- Clave de guardado sigue r01; no aparecen versiones separadas runtime/contenido/esquema ni migración explícita.
- avisar sigue descartando mensajes idénticos consecutivos. Pendiente reanuncio deliberado sin saturación.
- Taxón/talla/zona siguen heredados/pending; sin nueva habilitación factual.

## Qué significa la prueba de registro
INFORME_REGISTRO afirma «ningún par cambia anatomía», pero su propio anatomia4.json usa veredictos REVISAR y el informe reconoce puntas sin encajar. IoU alto del alfa no prueba igualdad de anatomía interna, color ni textura.
Las tres parejas técnicas tienen alfa idéntico en el R03 previo: comprobación auxiliar contra ese paquete, no contra binarios ausentes del R04. Sus RGBA NO son idénticos; píxeles RGB distintos: ctenóforo 612839, pepino 615436, sifonóforo 622368. Es normal entre luz/oscuro. Corregir frase «idénticas al píxel» por «máscara alfa idéntica», si ésa es la medida.
Las regiones del rasgo son cajas declaradas y muestras filtradas. Mejor que porcentaje global, pero 4 casos frenados de 180 NO validan correspondencia semántica. Exigir overlay revisable sobre cada uno de los tres assets, con vínculo entre frase y parte visible. Hacha usa cuerpo completo; no dar por probado que se vean los ojos.

## Patch acotado a trasladar íntegro a Claude
Mantener dirección visual, composición alfa, gesto directo, cámara, ayuda y acción próxima.
1. Registro en espacio local/pivote compartido; misma transformación para render y detección; retest en ambos sentidos.
2. Movimiento conserva pose además de posición; NONE congela; giro dt.
3. Unificar clic y Enter/Espacio para selección múltiple explícita y anunciada.
4. Foco estable cuando desaparece Otro animal; gestionar multitouch.
5. Producto con sólo tres registros/una escena y recursos requeridos; interno conserva catálogo completo. Compilación verificable, no bandera manual.
6. QA portable del ZIP exacto, resultados actuales, negativos, 320/390/1440 y clipping interno; separar emulación, navegador y dispositivo físico. Actualizar notas, versiones/guardado y feedback repetido.
7. Overlay de regiones y límites del calamar antes de afirmar reconocimiento/registro cerrado.
Después de este patch revisado, implementar la microescena. Puede preparar inventario/diseño mientras tanto, sin escalar animales ni inventar hábitats.
No rehacer assets aprobados, no main, no despliegue. No atribuir estos pendientes a desobediencia: Claude informó que no pudo abrir la orden completa.
