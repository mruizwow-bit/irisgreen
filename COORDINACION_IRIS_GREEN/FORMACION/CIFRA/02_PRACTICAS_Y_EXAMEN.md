# CIFRA · PRÁCTICAS Y EXAMEN R01

Fecha: 30/09/2026

Objetivo:
demostrar que la formación se puede convertir en análisis reproducible.

## Práctica 1 · Budget vs target vs forecast vs actual

Dado un mismo periodo:
- clasificar cada cifra;
- impedir que target sustituya forecast;
- explicar la desviación.

PASS:
las cuatro categorías permanecen separadas.

## Práctica 2 · Modelo driver-based

Construir un modelo simple de producto digital:
- usuarios;
- conversión;
- precio;
- churn;
- coste variable;
- headcount;
- otros costes fijos.

PASS:
los outputs cambian por drivers, no por hardcodes ocultos.

## Práctica 3 · P&L vs cash

Crear un caso donde:
- el P&L mejora;
- la caja empeora.

Explicar:
- timing;
- accruals;
- inversión;
- working capital si aplica.

PASS:
no confundir rentabilidad con liquidez.

## Práctica 4 · Runway

Con cash inicial + burn:
- calcular runway;
- introducir downside;
- definir cash floor;
- señalar trigger de actuación.

PASS:
la salida incluye supuestos y no una fecha falsa de certeza.

## Práctica 5 · Unit economics

Calcular:
- ARPU;
- gross margin;
- CAC;
- contribution margin;
- payback;
- LTV bajo más de un supuesto de retención.

PASS:
definiciones y periodos explícitos.

## Práctica 6 · IA economics

Simular:
- coste por llamada/token/unidad;
- distribución de uso;
- heavy users;
- precio por plan;
- margen por cohorte.

PASS:
detectar cuándo crecimiento de uso destruye margen.

## Práctica 7 · Pricing

Comparar tres opciones:
- fijo;
- usage-based;
- híbrido.

Evaluar:
- ingresos;
- variabilidad;
- margen;
- riesgo;
- previsibilidad;
- comportamiento extremo.

PASS:
no declarar ganador universal; justificar trade-offs.

## Práctica 8 · Business case

Para una inversión:
- cash flows incrementales;
- NPV;
- IRR;
- payback;
- sensibilidad;
- alternativa de no hacer;
- oportunidad perdida.

PASS:
decisión separada de cálculo.

## Práctica 9 · Forecast

Usar histórico:
- train/test temporal;
- comparar forecast ingenuo vs modelo;
- medir error;
- presentar rango.

PASS:
no valorar el modelo solo por ajuste in-sample.

## Práctica 10 · Auditabilidad

Entregar un modelo donde otro agente pueda:
- encontrar inputs;
- seguir fórmulas;
- localizar fuentes;
- reproducir outputs;
- comprobar errores.

PASS:
sin celdas críticas opacas ni supuestos escondidos.

## Práctica 11 · Variance analysis

Descomponer una desviación en:
- volumen;
- precio;
- mix;
- coste;
- timing;
- one-offs;
- error de forecast.

PASS:
explicación accionable.

## Práctica 12 · Datos insuficientes

Caso con información incompleta.

Cifra debe:
- identificar gaps;
- no inventar;
- construir rango provisional;
- decir qué dato reduce más la incertidumbre.

PASS:
la ausencia de datos no se convierte en precisión ficticia.

# Examen interno de Cifra

1. ¿Por qué presupuesto y forecast no son lo mismo?
2. ¿Cómo puede crecer el beneficio y caer la caja?
3. ¿Qué hace que un driver sea material?
4. ¿Cuándo un CAC/LTV es engañoso?
5. ¿Cómo audito un modelo que yo misma construí?
6. ¿Qué diferencia existe entre sensibilidad y escenario?
7. ¿Cómo trato un benchmark externo?
8. ¿Cuándo NPV e IRR pueden orientar de forma distinta?
9. ¿Por qué el WACC no es una cifra “objetiva” única?
10. ¿Cómo modelo incertidumbre sin paralizar la decisión?
11. ¿Qué debo pedir a un especialista técnico antes de estimar costes de IA?
12. ¿Qué decisión requiere Lex/asesoría y no Cifra?
13. ¿Cómo identifico una vanity metric?
14. ¿Qué significa que una desviación sea estructural?
15. ¿Qué evidencia convierte una hipótesis en input aceptable?

## Gate interno

`CIFRA_FPA_STRATEGIC_FINANCE_FOUNDATION_PASS`

No equivale a certificación externa.
