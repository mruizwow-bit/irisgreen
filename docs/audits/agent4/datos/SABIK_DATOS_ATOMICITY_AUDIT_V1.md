# SABIK_DATOS_ATOMICITY_AUDIT_V1

**Fase:** C2-R1 · Atomicidad + hardening final  
**Fecha:** 21/09/2026  
**Base revisada:** 168 claims de C2-R0  
**Resultado:** **188 claims atómicos/contextuales**

## Regla aplicada

Se separó toda magnitud publicada que puede verificarse o fallar de forma independiente:
- conteo vs porcentaje;
- porcentaje vs «1 de cada N»;
- tasa por 1.000 / 100.000 vs porcentaje / «1 de N»;
- razón o proporción derivada;
- conversiones equivalentes.

No se separaron edades, años ni tamaños de muestra cuando funcionan únicamente como contexto de población o evidencia.

## Splits principales

- Australia autismo 2022/2018: conteo y porcentaje.
- Canadá autismo 2019: porcentaje y equivalentes 1/N.
- ADDM 2022: tasa por 1.000, porcentaje y equivalentes 1/N.
- GBD autismo: 788,3/100.000 y 1/127.
- Discapacidad global: 1.300 millones, 16 % y 1/6.
- Tourette: 1/162 ↔ 0,6 % y 1/333 ↔ 0,3 %.
- TDAH infantil EE. UU.: porcentajes y conteos absolutos.
- Ansiedad: 27,6 % y representación «1 de cada 4».
- Brecha salarial: 9/12 → tres cuartas partes.
- GBD por sexo: razón derivada ≈2.
- Empleo/discapacidad ILOSTAT: afirmación separada «aproximadamente la mitad».

## Contexto no dividido

Se mantienen como `CONTEXTO_MUESTRA` los registros que reúnen exclusivamente tamaño de la base de evidencia:
- 588 estudios + 3.277.590 participantes;
- 18 artículos + 31.203 participantes.

## Derivaciones

Cada conversión derivada tiene:
- `derivado=SI`;
- operación;
- numerador / denominador;
- fórmula;
- regla de redondeo;
- tolerancia.

El validador recalcula todas las derivaciones.
