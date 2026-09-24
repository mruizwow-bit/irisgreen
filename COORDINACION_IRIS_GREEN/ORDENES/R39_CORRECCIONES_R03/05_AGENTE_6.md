# S2-A6-R02 · Rechazar WAV incompletos sin alterar la voz
Fecha: 24/09/2026. Responsable: Agente 6. Autoridad: María, siguientes órdenes tras revisión final. Estado: EMITIDA_PENDIENTE_ACUSE.

## Base privada y archivos
Paquete de código revisado SHA256 `36c5da7aecf0d8c9fb23219a7326336608dfedf3f0103afa222b24c750396243`, sin audio humano.
Corregir solo `LOCAL_PRIVADO/voz-sabik/tools/validate_audio.py`, `package_audio.py` si lo exige la propagación de errores, y `tests/test_voice_tools.py`. Conservar cualquier corrección posterior existente.
Fuente: [revisión final](../../MEMORIA/REVISION_FINAL_AGENTES_R39_2026-09-24.md), OBS-A6-01. No nueva elección de voz, DSP, normalización o investigación de proveedores.

## Fallo a cerrar
La reproducción con PCM16 mono a 16000 Hz y 1600 frames declarados, retirando 20 bytes finales, produjo status valid pese a leer solo 1590 muestras. El empaquetador aceptó esa entrada. Retirar un byte provocó `struct.error` sin conversión al error controlado de entrada.

## Corregir
- Validar la cantidad real de audio leída frente a frames declarados, canales y ancho de muestra, dentro de los formatos ya soportados. Comprobar alineación completa de frames; no confundir muestra de un canal con frame multicanal.
- Rechazar truncamiento y errores de decodificación con `AudioValidationError` o el error de entrada canónico de la herramienta. Mensaje claro y salida de CLI no exitosa. No declarar válido un archivo parcialmente leído.
- Impedir que el empaquetador finalice una entrega válida a partir de esa entrada. Los temporales no deben presentarse como paquete aprobado; conservar intactos paquetes previos y fuentes. No dejar un manifiesto final que afirme validación satisfactoria.
- No reparar la cabecera, rellenar audio ni normalizar como forma de ocultar el defecto. La acción permitida es detectar, rechazar y explicar. Preservar copia byte-idéntica e idempotencia para entradas válidas.

## Pruebas y entrega
Mantener las nueve pruebas originales y añadir como mínimo: truncamiento de 20 bytes; truncamiento de un byte; alineación de frame multicanal en un formato ya soportado; error controlado y salida no exitosa; ausencia de paquete final válido; original sin modificar; WAV íntegro sigue funcionando y segunda ejecución conserva el paquete previo.
Usar señales sintéticas etiquetadas. No se necesitan grabaciones humanas para reproducir el fallo. Entregar ZIP de código sin audio, parche, manifest de código, comandos/entorno/resultados y cierre OBS-A6-01. La evidencia pública omite rutas personales, nombres/hashes de voz humana y cualquier dato biométrico. Confirmar disponibilidad del código para Codex por un canal de archivos autorizado, sin publicar la carpeta privada.
No bloquea R39, HTTP, C17 ni A3. No activar voz, micrófono, TTS ni sincronización Motion/voz.

## Normativa obligatoria y ES+EN
Aplicar [REQUISITOS_OPERATIVOS_ES_EN](../../NORMATIVA/REQUISITOS_OPERATIVOS_ES_EN.md). **Iris Green es español e inglés.** Esta herramienta privada no es voz pública bilingüe. Etiquetar el idioma real del material, nunca inferir que existe voz EN. Cualquier mensaje o ayuda que se proponga para la web se entrega completo en ES+EN; para CLI interno justificar NO_APLICA_TEXTO_PUBLICO sin impedir futuras traducciones.
Escritura clara ISO 24495-1/COGA: explicar qué archivo no se puede usar y cómo continuar, sin volcar trazas privadas como mensaje de usuario. Marco de construcción y accesibilidad: WCAG 2.2 AA, ISO/IEC 40500, EN 301 549 y familia ISO 9241 según superficie; no aplican aquí pruebas visuales de la web y debe constar. UNE 153101 EX, PDF/UA y braille solo cuando se produzca esa adaptación: esta orden no la produce ni certifica. Preservar originales, privacidad y permisos. Ninguna subida de audio humano a Git, ninguna modificación de la web de María/A2 ni de sus ajustes de Lectura. El marco no cambia: se aplica al alcance real.
