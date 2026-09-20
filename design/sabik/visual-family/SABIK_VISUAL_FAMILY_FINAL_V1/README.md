# SABIK_VISUAL_FAMILY_FINAL_V1_R1

Fecha: 20/09/2026  
Coordinación: Astra  
Agente: n.º 3 · Prototipos

## Estado

**SABIK_VISUAL_FAMILY_FINAL_V1_R1_READY**

Corrección técnica de Fase 2D. **No se ha rediseñado ninguna presencia.** La dirección, las cuatro formas, las paletas y el sistema verbal continúan cerrados.

## Sistema verbal oficial

**SABIK**  
**CLARIDAD INTELIGENTE.**  
**Una IA que adapta la información para que sea más fácil de entender y usar.**

Terminología única:

**UNA MISMA ESENCIA · CUATRO PRESENCIAS**

## Correcciones R1

1. Los cuatro masters eliminan exclusivamente componentes alpha desconectados del cuerpo principal: rayas residuales, píxeles sueltos y ruido de extracción. Los píxeles RGBA conservados permanecen byte-a-byte idénticos.
2. Los masters de las presencias se declaran correctamente como **raster 512×512 RGBA**. No se presenta como vector un SVG que contenga un PNG incrustado.
3. Las siluetas ya no usan `alpha threshold + MaxFilter + MinFilter`. Se generan con una tinta única y el canal alpha maestro exacto, sin dilatación ni erosión.
4. SABIK IA no incorpora órbitas ni trazos blancos añadidos.
5. SABIK T1 dispone de maestro SVG real trazado desde la referencia aprobada; el PNG queda como preview.
6. El rebuild desde una copia limpia finaliza sin errores y compara derivados por SHA-256.
7. La matriz separa generación técnica a 32 px de validación perceptiva y limita cada PASS al activo realmente evaluado.

## Escalas

64 px, 40 px y 32 px están generados.  
32 px es el mínimo recomendado **provisional**: el archivo técnico está validado, pero la suficiencia perceptiva en todos los contextos queda pendiente de revisión humana.  
24 px sigue siendo prueba de resistencia y no tamaño estándar.

## Reproducibilidad

Desde la raíz del ZIP R1:

```bash
python scripts/rebuild_all.py
```

Resultados esperados:

- `REBUILD_ALL_PASS`
- `REPRODUCIBILITY_PASS`

Entorno fijado en `requirements.txt`.

## Evidencia

Paquete R1: `/SABIK/Agent3/SABIK_VISUAL_FAMILY_FINAL_V1_R1.zip`

El índice de activos registra IDs de Biblioteca, hashes, masters individuales, siluetas, pruebas y wordmark T1.

**NO MERGE hasta revisión directa de Astra.**