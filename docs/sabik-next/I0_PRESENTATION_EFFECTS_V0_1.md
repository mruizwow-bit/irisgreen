# I0 · MATRIZ DE EFECTOS DE PRESENTACIÓN · V0.1

**Fecha:** 20/09/2026  
**Estado:** contrato I0 para Vista sencilla / Detalles

## Regla

Vista sencilla reduce elementos secundarios, no contenido esencial.

| Categoría | Vista normal | Vista sencilla | Puede forzarse visible |
|---|---|---|---|
| explicación principal | visible | **visible** | siempre |
| instrucción actual | visible | **visible** | siempre |
| siguiente acción necesaria | visible | **visible** | siempre |
| errores | visible | **visible** | siempre |
| seguridad/human help | visible | **visible** | siempre |
| Atrás/Siguiente cuando aplican | visible | **visible** | siempre |
| controles esenciales | visible | **visible** | siempre |
| títulos/enlaces de fuentes que sostienen respuesta | visible | **visible/accesible** | siempre |
| detalles secundarios | según contenido | cerrados por defecto | sí |
| ejemplos ampliados no esenciales | visibles o plegados | plegados | sí |
| ayudas duplicadas | visibles | pueden ocultarse | sí si se piden |
| decoración no funcional | visible | puede ocultarse | no necesaria |
| paneles no necesarios para tarea actual | visibles según contexto | pueden ocultarse | sí |

## Frase contractual

«Muéstrame menos cosas, pero no ocultes la explicación.»

Resultado:
- `CAMBIAR_VISTA_SENCILLA {enabled:true}`
- explicación principal permanece visible;
- si la exclusión se refiere a un bloque de detalles concreto, añadir `CAMBIAR_DETALLES {expanded:true}`.

## Definición de Detalles

`Detalles` son bloques editoriales secundarios cuya ocultación no impide:
- comprender la afirmación principal;
- completar la tarea;
- conocer un riesgo;
- acceder a una fuente necesaria;
- volver/continuar.

Si un bloque no cumple esas condiciones, no puede clasificarse como Detalles.

## Invariantes

- Vista sencilla no cambia B3.
- Detalles no cambian B3 por sí solos.
- La persona siempre puede volver a vista completa.
- No usar «modo simple».
- No ocultar explicación principal por defecto.
