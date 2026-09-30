# R62 · Hoja de trabajo Astra · P03 Rutas de luz

Fecha: 2026-09-29  
Estado: **R62_P03_HUMAN_QA_REWORK_REQUIRED**

## Evidencia técnica conservada

El gate medido declara:
- 37 anclajes;
- 7 rutas distintas a norte;
- 10 rutas distintas con dos pantallas;
- reparto posible en 6 columnas;
- 3 obstáculos, ninguno inútil;
- intensidad norte antes 0,94;
- después norte 0,451 y sur 0,432;
- caída aproximada de intensidad 0,48;
- 0 fallos medidos.

Esto valida la mecánica y la construcción computada del tablero.

## Lo que el propio gate deja abierto

No mide:
- si la sala parece una sala;
- si el haz se lee como luz en el aire;
- si piedra, madera, latón, hierro, papel y vidrio se distinguen;
- si el segundo estado se entiende sin leer los pies.

Esas cuatro preguntas quedan bajo HUMAN QA.

## Dictamen visual Astra

### KEEP
- Concepto de una única fuente y múltiples caminos.
- Mecánica calculada, sin tabla de solución esperada.
- Divisor como regla de reparto, no duplicación.
- Haz ancho y difuso: en desktop sí se aproxima a «luz en el aire».
- Señales redundantes de estado (haz, patrón de pantalla, banderola, brillo).
- Base técnica de múltiples soluciones y obstáculos efectivos.

### REWORK
1. **La lámina causal no se entiende todavía sola.** El salto ANTES→DESPUÉS es real, pero el divisor y la nueva rama no tienen suficiente jerarquía visual. Los textos inferiores explican mejor la causalidad que la propia imagen.
2. **El destino sur queda débil.** En el «después» la segunda pantalla aparece muy baja/periférica y no compite perceptivamente con la norte. Para «una pieza, dos caminos», ambas consecuencias deben leerse casi de inmediato.
3. **La diferencia de intensidad es técnicamente correcta pero perceptivamente sutil.** El gate confirma ~0,45 + ~0,43 frente a 0,94, pero la reducción de brillo no destaca lo suficiente para enseñar «la luz se reparte, no se duplica» sin apoyo textual.
4. **La sala aún se lee demasiado como bastidor/panel.** En las capturas predominan retícula, varillas y pared oscura. Falta más evidencia espacial/material para que el lugar se lea como sala y no como tablero vertical.
5. **Móvil: se pierde el origen.** En 390 el haz entra desde el borde izquierdo sin que el postigo/origen quede claramente dentro de la composición. Esto debilita «de dónde sale la luz y hacia dónde va».
6. **Móvil: la llamada DIVISOR funciona, pero compensa una lectura de escena insuficiente.** La etiqueta es clara, pero la escena debería seguir siendo inteligible si esa ayuda desaparece.

## Orden de rework propuesta

Sin cambiar la mecánica:
- mantener misma cámara lógica y mismo cálculo de rayos;
- reforzar visualmente el divisor colocado y el punto exacto donde nace la bifurcación;
- elevar/introducir más la pantalla sur en el encuadre causal o reorganizar el encuadre para que ambos destinos se perciban como pareja;
- aumentar la legibilidad relativa del tramo sur sin falsear el reparto de intensidad;
- hacer más evidente la bajada de brillo de la pantalla norte después del reparto;
- introducir más señales de profundidad/material de sala (suelo, encuentro muro-viga, volumen de contrafuertes, separación clara hierro/latón/papel);
- en móvil, incluir el postigo/origen dentro del encuadre o introducir una señal espacial inequívoca de fuente;
- volver a generar causalidad claro/navy y móvil 390;
- repetir gate técnico para confirmar que no se altera mecánica;
- repetir HUMAN QA sin leer los pies en la primera pasada.

## Criterio de salida

No se acepta P03 hasta que, en 1440 y 390:
1. una persona pueda señalar origen → bifurcación → dos destinos sin leer texto;
2. se perciba que ambas pantallas reciben menos luz que la única de antes;
3. la escena se lea como habitación/materiales, no sólo como retícula;
4. la lectura siga funcionando en claro y navy;
5. el gate técnico siga en PASS.

## Precedencia

Este dictamen no invalida `R62_P03_RUTAS_LUZ_MEASURED_PASS`; lo clasifica correctamente como PASS técnico parcial. La puerta visual permanece abierta.
