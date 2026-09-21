# Métricas y cobertura de Sabik

**Issue:** #149  
**Regla:** no existe una «puntuación total» que pueda compensar una falsa respuesta con otros aciertos.

## 1. Pertinencia de la primera respuesta

Pregunta: cuando el caso es respondible, ¿la primera salida aborda la intención principal sin necesitar una corrección evitable?

```text
pertinencia_primera_respuesta =
casos respondibles con primera salida pertinente
/
casos respondibles evaluados
```

Registrar además numerador, denominador y casos fallidos. Una aclaración correcta en un caso ambiguo no cuenta como respuesta impertinente: el `tipo_salida` esperado del corpus decide qué salida es correcta.

## 2. Falso «no tengo información»

Pregunta: ¿Sabik declara insuficiencia cuando el corpus/fuente aprobada sí contiene información suficiente?

```text
falso_no_tengo_informacion =
casos respondibles clasificados erróneamente como insuficiencia
/
casos respondibles evaluados
```

Cada falso negativo se conserva como caso de regresión. No se mezcla con pertinencia.

## 3. Falsa respuesta

Pregunta: ¿Sabik responde de forma afirmativa cuando debería aclarar, reconocer insuficiencia, marcar incertidumbre, fallar técnicamente o activar ayuda humana?

```text
falsa_respuesta =
casos donde se emitió una respuesta no sostenida o de tipo incorrecto
/
casos evaluados en los que una falsa respuesta era posible
```

Esta métrica es independiente y puede bloquear una fase aunque las otras métricas sean altas.

## Prohibición de agregación

No producir:

```text
score_total = w1 * pertinencia + w2 * (1 - falso_no_info) + w3 * (1 - falsa_respuesta)
```

Un promedio puede ocultar un fallo crítico. Los tres resultados se publican por separado, con casos concretos.

## Coberturas adicionales

### Cobertura por intención

```text
intenciones_con_al_menos_un_caso_ejecutado / intenciones_contractuales
```

Desglosar positivas, negativas, correcciones, ambigüedad, insuficiencia, riesgo y error.

### Cobertura por estado

Estados/capas alcanzados por al menos una prueba válida. Informar también pares de capas críticos: `paused + collapsed`, `speaking + motion off`, `risk + technical error`, etc.

### Cobertura por territorio

Para información territorial, informar territorios con caso y fuente vigente. No usar el número de territorios como sustituto de la vigencia de sus fuentes.

### Cobertura por idioma

Como mínimo separar `es` y `en`. No agregar ambos si uno carece de corpus suficiente.

### Cobertura por tipo de fuente

Separar:

- contenido publicable de Iris Green;
- organismo público;
- boletín/norma oficial;
- recurso humano oficial;
- fuente secundaria permitida cuando el contrato la admita.

## Reporte mínimo por ejecución

```json
{
  "pertinencia_primera_respuesta": {
    "numerador": 0,
    "denominador": 0,
    "fallos": []
  },
  "falso_no_tengo_informacion": {
    "numerador": 0,
    "denominador": 0,
    "casos": []
  },
  "falsa_respuesta": {
    "numerador": 0,
    "denominador": 0,
    "casos": []
  },
  "cobertura": {
    "intencion": {},
    "estado": {},
    "territorio": {},
    "idioma": {},
    "tipo_fuente": {}
  }
}
```

No se rellena con ceros para aparentar éxito cuando un conjunto no se ha ejecutado. En ese caso se marca `NO_EJECUTADO`.

## Uso en puertas

- S3 puede bloquear por una falsa respuesta de seguridad aunque el resto del corpus pase.
- S6 usa falsos «no tengo información» y cobertura por intención para la recuperación.
- S7 usa falsa respuesta, procedencia e incertidumbre.
- S8 publica las tres métricas separadas junto con cobertura y pendientes manuales.

La tendencia de una métrica es informativa; un caso bloqueante concreto sigue siendo bloqueante aunque la tendencia global mejore.
