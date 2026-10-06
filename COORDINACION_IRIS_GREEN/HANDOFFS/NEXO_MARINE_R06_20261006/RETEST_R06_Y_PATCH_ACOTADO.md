# Nexo · Retest independiente acotado · Peces R06
2026-10-06.
Gate Nexo: NEXO_MARINE_R06_TARGETED_REWORK_REQUIRED.
KEEP_CORE. No escalado a 200+. NO MAIN · NO PUBLIC DEPLOY.
## Entrega inspeccionada
Producto: descubrimiento-peces-R06.zip, 6398805 bytes,
917548b0a710ed2f17a9264e9516a0bd329f86511fe514fc8f5adf52962f6e03.
Interno: descubrimiento-peces-R06-interno.zip, 4579633 bytes,
3d1cfd216adbde27be5d898f63c8d60f44650f93293eee9d402feaec91358bd2.
34/34 entradas del manifest producto correctas. Seis PNG del runtime idénticos byte a byte a R05.
Lámina DENTRO del ZIP: 1760×2270 RGB, 1075576 bytes, f8e130ea42928fde48852decd7a5e7f2abcdddc9dcf52ce143d70e0c4442b834; coincide con el hash anunciado.
Adjunto PNG suelto: 1587×2048 RGBA, 1406941 bytes, f926fe757b94849ce22adf2b65040d1100e097807958b3392d61c1f25dc42d0e. Es otra representación, no el mismo binario; no inferir por qué se transformó. Usar la lámina del ZIP como referencia exacta.
## Método
Lectura de motor.js, interfaz.js, datos, scripts de observables/perceptibilidad/r06, notas y lámina. Funciones originales extraídas y ejecutadas en Node VM con estados explícitos y dobles de geometría para el detector. Script y JSON adjuntos.
No nuevo navegador, dispositivo físico, lector o HUMAN QA. El 20/20 es evidencia del autor. No se han repetido los renders ni mediciones IoU locales.
## Correcciones que sí se sostienen en la lógica
- Fase de deformación acumulada: transiciones NORMAL→REDUCED→NONE→NORMAL conservan onda y giro en nueve casos (tres animales × tres transiciones) con fase 6,75 y dt=0; posición sólo ruido numérico hasta 4,55e-13 unidades.
- Confirmación: prueba anunciar A → evento repeat ignorado → cero candidatos con invalidación → mismos ids con B elegido → vuelve a anunciar B → siguiente Enter examina B.
- Observables[] y revealFacts separados; etiquetas activas en interfaz, estado humano PENDING. Decisión de representación distinguida de dato factual.
- Producto modoEquipo=false, seis PNG originales conservados; mejoras de reflow/reenunciado presentes en código, pendientes de mi retest de navegador.
## P1 · Regresión nueva reproducida: dos fases comparten p.fase
avanzarNado incrementa p.fase en ciclos para la onda. posicionMundo y reanclarPorMovimiento siguen leyendo p.fase como desfase de trayectoria en radianes; antes era el valor constante del slot.
pintar llama avanzarNado antes de recuadro. Por ello la ondulación ahora modifica continuamente la velocidad del recorrido. No es sólo nomenclatura.

| Animal | Periodo X declarado | Periodo X efectivo R06 NORMAL | Velocidad X máxima nominal / medida |
|---|---:|---:|---:|
| Hacha | 31 s | 4,9465 s | 60,805 / 381,063 |
| Linterna | 24 s | 5,7628 s | 68,068 / 283,474 |
| Calamar | 38 s | 12,1839 s | 54,565 / 170,179 |

Velocidades en unidades de mundo/s, NO píxeles de pantalla. Medición de funciones reales durante 60 segundos simulados a 60 Hz. Fórmula del periodo efectivo: 2π/(2π/periodo + frecuenciaNado×factorEstilo).
El vx devuelto sigue usando sólo la derivada del recorrido original; ya no representa la velocidad real (error máximo ~320,262 unidades/s para hacha).
La prueba FASE-SIN-SALTO en pausa es correcta pero no detecta la regresión durante evolución posterior.
Corrección: faseOndaCiclos acumulada y faseRecorridoRad independiente, inicializada desde el slot. Mantener periodo, reanclaje, pose y NONE. Revisar vx incluyendo el desvío si sigue usándose como velocidad/orientación.
Retest: estabilidad instantánea más trayectoria y velocidad durante un ciclo, a 30/60/120 Hz y tras cambios de perfil. No hace falta rehacer el motor.
## P1 · Calamar: fallback declarado, no cierre del observable
El dato tiene activo:false/BLOQUEO_LOCAL. evaluar usa activos===0 ? true, por lo que basta el contexto corporal.
Fixture de detector original: cuerpo 40%, observable brazos 0%, examinable=true. Es consecuencia del bypass, no prueba visual de un caso concreto de la escena.
No debe presentarse como cumplimiento del contrato cuerpo+rasgo. Puede mantenerse como fallback provisional de revisión, expresamente separado de un encuentro validado. Para entrega final de ese encuentro: corregir pareja de biblioteca y reactivar/retestar, o acordar otro rasgo observable respaldado por el asset. No obligar a María a acertar una zona que no casa.
Las métricas IoU locales aportadas indican precisamente que el problema de biblioteca sigue abierto. No recortar puntas ni regenerar los seis assets.
## P2 · Esquema que todavía no gobierna todo el comportamiento
1. bodyContext.requiredFraction y bodyContext.muestras existen en datos, pero motor.js no lee bodyContext. Usa a.muestras y el umbral global. Hoy coinciden y no altera a estos tres, pero cambiar el registro nuevo no cambia la ejecución.
2. Observable activo con puntos vacíos obtiene fo=1; fixture propio: cuerpo40%, puntos[], cumple=true y examinable=true. Ninguno de los tres entregados tiene puntos vacíos; es un defecto de validación antes de reutilizar la plantilla.
3. La habilitación se resuelve por activo; el motor no deriva bloqueo desde localRegistrationQA. Validar consistencia al incorporar datos, sin convertir un umbral IoU provisional en estándar automático.
4. schemaVersion=2 se guarda, pero no hay política explícita de rechazo/migración de versiones futuras. La conservación de ids antiguos ayuda; no equivale a migrador completo.
Corrección acotada: normalizar esquema al cargar, un origen para cuerpo/umbral, rechazar geometría inválida, distinguir OBSERVABLES_BLOCKED de NO_OBSERVABLE_REQUIRED y documentar compatibilidad del guardado.
## Material de perceptibilidad: útil pero cobertura parcial
23 PNG: 18 linterna (6 en A, B y C), 5 hacha (sólo B), 0 calamar. No emitir PASS humano para ninguno.
El generador filtra d.activo y omite casos sin candidato: explica el hueco, pero debe entregarse una matriz de cobertura con motivos en vez de sugerir tres animales × tres encuadres cubiertos.
Rango 'en el umbral' = 0,49–0,56; los cuatro casos entregados son 0,512/0,516/0,534/0,550. Son cercanos, no igualdad exacta a 0,5.
Añadir casos fronterizos del hacha en tamaños/encuadres distintos; calamar después de corregir el par. Registrar 'no alcanzable' cuando proceda, sin fabricar capturas ni PASS.
Esta preparación sigue siendo QA del equipo, no cuestionario dentro del producto.
## Medición geométrica y límites
observables.py calcula franjas/contornos/componentes luminosos del dibujo. Es una propuesta geométrica reproducible, no validación factual de cada fotóforo ni perceptibilidad humana.
En registro_local, el barrido del mejor desplazamiento desplaza la máscara ya recortada a region; la corrección global desplaza la máscara completa y después recorta. Sus resultados no son estrictamente comparables como optimizaciones del mismo problema. La comparación útil debe transformar completo y luego recortar a un ROI fijo, evitando wrap de np.roll.
No cuestionar el defecto visual del calamar por esto: hay residuo documentado. Sí evitar que 'mejor desplazamiento' se trate como una prueba definitiva de imposibilidad geométrica con este cálculo.
## Banco y portabilidad
r06.js y perceptibilidad.js fijan executablePath=/opt/pw-browsers/chromium; permitir navegador instalado por Playwright y override opcional.
observables.py apunta BASE/build/descubrimiento-peces/assets/profundidad, ruta ausente en el interno entregado; recibir la ruta del producto como argumento.
Las notas llaman a varias pruebas 'recorrido real', pero CONFIRMACION-CADUCA prepara y mueve el haz con IG_PRUEBA.apuntar y p.focus. ENTER/CLICK sí son eventos de UI; el setup es inyectado. Clasificar como prueba híbrida, no recorrido completo sin ayudas.
La sonda IG_PRUEBA incluye mutadores: no llamarla de sólo lectura. No bloquear el patch por retirar toda instrumentación, pero distinguir build de revisión y publicación.
## Orden de siguiente paso propuesta
R06.1 acotada:
1. Separar fase de recorrido/onda y retest temporal.
2. Mantener el calamar explícitamente pendiente; abrir corrección del par con referencia exacta, sin declarar observable cerrado por bypass.
3. Hacer que bodyContext gobierne el runtime y validar observables vacíos/estados.
4. Completar matriz de perceptibilidad y volver portable/reproducible la evidencia.
KEEP de controles, cámara, máscara alfa, estilo, traducciones y gestos ya corregidos salvo defecto demostrado.
Puede avanzar el inventario y diseño de la microescena como planificación. No escalar este build como plantilla validada para 200+.
Después: retest independiente del ZIP exacto → revisión humana perceptual y de interacción. No FEEL/HUMAN PASS actual.
