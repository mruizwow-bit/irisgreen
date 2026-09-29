# R59 · Fósiles R2v2 · revisión Astra de procedencia · 29/09/2026

Estado: `R59_FOSSILS_R2V2_PROVENANCE_STILL_BLOCKED_QA_HARNESS_REPRO_CONTRACT_EXECUTOR`

## Material revisado
- FOSILES_R2v2_INFORME.md
- FOSILES_R2v2_PROCEDENCIA.md
- FOSILES_PILOTO_R2v2_PARA_SUBIR.zip
- FOSILES_R2v2_CAPTURAS.zip
- ejecución independiente de MANIFEST.sha256
- ejecución independiente de fuente/reproducir.py desde copia limpia
- inspección de qa/shots.py

## Lo que sí mejora
PASS:
- generadores con rutas relativas;
- entrada única fuente/reproducir.py;
- generadores fuera de web/;
- semilla explícita para la capa de polvo;
- marca visible “Imagen hecha por ordenador” ES/EN;
- MANIFEST.sha256 presente;
- 29/29 WebP regenerados byte-identical en entorno Astra;
- producto visual R2 permanece aprobado.

## BLOCKER 1 · el arnés nominal sigue sin seleccionar idx
El bloqueo QA anterior NO está cerrado.

En qa/shots.py sigue existiendo un bucle `for capa, idx, quien in [...]`, pero `idx` nunca se utiliza.
El arnés cambia de capa y cepilla, pero no selecciona el fósil objetivo antes de capturar.

Por tanto las capturas hallazgo-* siguen sin acreditar por código la asociación nombre de archivo ↔ especie activa.

Corrección mínima:
- seleccionar explícitamente por id/índice antes de screenshot;
- assert del id/nombre activo;
- fallar si no coincide.

## BLOCKER 2 · contrato de reproducción contradice PROCEDENCIA.md
PROCEDENCIA.md dice que 59 archivos salen byte a byte idénticos y también que, si otra versión AVIF produce bytes distintos, se compara la imagen decodificada.

Pero fuente/reproducir.py SOLO compara SHA-256 de bytes. No implementa fallback de comparación decodificada.

Reproducción Astra desde copia limpia:
- Python 3.13.5
- numpy 2.3.5
- scipy 1.17.0
- Pillow 12.3.0

Resultado:
- iguales 29
- distintos 30
- faltan 0

Los 29 WebP son byte-identical.
Los 29 AVIF cambian por encoder/versiones y estratos.json cambia únicamente en tamaños AVIF redondeados.

Esto no demuestra no-determinismo del generador; demuestra que el contrato/documentación del reproductor está incompleto.

Corrección válida, elegir una:
A. fijar/pinear entorno exacto reproducible (Python/numpy/scipy/Pillow/codec AVIF) y probarlo;
B. implementar en reproducir.py la comparación decodificada que PROCEDENCIA.md promete, con tolerancia/criterio explícito, conservando hash exacto cuando el encoder coincide.

No declarar 59/59 universal mientras el script no soporte la ruta B o el entorno no esté sellado.

## BLOCKER 3 · ejecutor/procedencia de rama sigue sin reconciliar
INFORME_R2.md aún declara `codex/r59-intereses-fase1`.
La coordinación vigente dice Agente R59 activo y Codex HOLD hasta 01/10/2026.
PROCEDENCIA.md no identifica ejecutor real ni explica por qué se conserva una rama codex/.
Por tanto GOV-01 anterior sigue abierto.

## Decisión
El producto Fósiles continúa en PASS visual/técnico.
NO rehacer arte.

La procedencia R2v2 NO pasa todavía.

Siguiente marcador esperado: `R59_FOSSILS_PILOT_R2V3_QA_REPRO_EXECUTOR_FIXED_READY_FOR_ASTRA_MARIA`.

STOP. No Minerales todavía. No A2/main/producción.
