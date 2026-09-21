# B3 runtime assets · R0

**Estado:** candidato de producción derivado del B3 R1 congelado.

Este directorio contiene **15 archivos WebP individuales**, uno por combinación de presencia y estado:

- Web × PRESENTE / ORIENTAR / TRANSICIÓN / PAUSA / CONFIRMAR;
- IA × PRESENTE / ORIENTAR / TRANSICIÓN / PAUSA / CONFIRMAR;
- Educa × PRESENTE / ORIENTAR / TRANSICIÓN / PAUSA / CONFIRMAR.

## Autoridad visual

Fuente congelada:

PR #182 @ `e5f70cba76a4414527c10b0fbecfd549a7390e66`

Los 15 PNG R1 originales de 544×544 siguen siendo la autoridad. **No se modifica ningún keyframe, geometría, color ni significado.**

## Derivación de runtime

Cada archivo de runtime es:

- 128×128 px;
- WebP;
- derivado con LANCZOS desde 544×544;
- empaquetado individualmente;
- limitado a un stage máximo de 128×128 para evitar ampliación del derivado de transporte.

`ASSET_MANIFEST.json` registra, para cada combinación:

- ruta runtime;
- tamaño en bytes;
- SHA-256 runtime;
- archivo fuente R1;
- tamaño fuente;
- SHA-256 fuente;
- Library ID de la fuente congelada.

Los tests R0 validan que los 15 archivos existen y que bytes + SHA-256 coinciden con el manifest.

## Fallback

Si el asset requerido no puede cargarse, `b3-integration.js` mantiene visible el holograma legacy existente. La interfaz y el texto no desaparecen.

## Alcance

Este empaquetado es una **derivación técnica de runtime**, no una quinta familia, una variante visual ni un rediseño de #181/#182.

**NO MERGE · NO DEPLOY.**
