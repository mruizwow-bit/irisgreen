# B3_HUMAN_PILOT_PROTOCOL_H1

**Fase:** 3A-H1-R0 · Corrección del protocolo antes de participantes  
**Fecha:** 20/09/2026  
**Coordinación:** Astra  
**Candidato visual congelado:** PR #182 · `16a4b7debf801d190a6174fd6831a5176db5960d`

> PILOTO DE DISEÑO · NO VALIDACIÓN CIENTÍFICA · NO DIAGNÓSTICO

## Estado

**`SABIK_B3_H1_PROTOCOL_FROZEN_READY`**

Participantes registrados: **0**.

Los 15 keyframes R1 quedan congelados durante toda H1. No se modifica PRESENTE, ORIENTAR, TRANSICIÓN, PAUSA, CONFIRMAR, geometrías, parámetros, color, masters, PR #181 ni PR #163.

La ronda se realiza únicamente a **64 px**. 32 px permanece `PENDING HUMAN TEST`.

## Orden completo

Cada participante sigue esta secuencia, sin volver atrás:

**A · discriminación visual**  
→ **B1 · inferencia funcional**  
→ **aprendizaje explícito**  
→ **B2 · reconocimiento después de aprendizaje**

No se da feedback entre respuestas.

# TEST A · DISCRIMINACIÓN VISUAL SIN SIGNIFICADO

## Objetivo

Responder únicamente:

**¿Las cinco apariencias se perciben como estados distintos?**

La persona todavía no conoce los nombres ni significados funcionales de PRESENTE, ORIENTAR, TRANSICIÓN, PAUSA y CONFIRMAR.

## Material

Se usan las seis hojas ciegas R1 ya congeladas:

- Web · color;
- Web · monocromo;
- IA · color;
- IA · monocromo;
- Educa · color;
- Educa · monocromo.

Cada hoja contiene cinco imágenes numeradas a 64 px y no muestra nombres de estado.

## Granularidad de datos

**1 fila por participante × hoja.**  
Resultado: **6 filas por participante**.

No duplicar cinco veces los campos de hoja.

## Preguntas por hoja

1. ¿Qué dos imágenes te parecen más parecidas entre sí?
2. Similitud percibida 1–5:
   - 1 = claramente distintas
   - 2 = bastante distintas
   - 3 = algo parecidas
   - 4 = muy parecidas
   - 5 = prácticamente la misma
3. ¿Qué dos imágenes te parecen más diferentes?
4. ¿Hay alguna pareja que te parezca prácticamente la misma? Sí / No. Si sí, registrar pareja.
5. Comentario libre breve, si lo hay.

### Monocromo

Después de cada hoja monocroma:

**“Sin depender del color, ¿te parecen distinguibles estas cinco formas?”**

Escala 1–5.

### Educa

Después de completar las hojas de Educa:

**“¿Esta forma te parece infantil, adulta o neutral para distintas edades?”**

Opciones:
- infantil;
- adulta;
- neutral para distintas edades;
- no sé.

## Resultado de Test A

No existe respuesta correcta. Se agregan por separado:

- `A_MOST_SIMILAR`
- `A_PRACTICALLY_SAME`
- `A_MOST_DIFFERENT`

# TEST B1 · INFERENCIA FUNCIONAL

## Objetivo

Responder:

**¿La apariencia sugiere por sí misma su función?**

B1 no mide aprendizaje visual previo.

## Procedimiento

1. Mostrar únicamente la leyenda textual:
   - PRESENTE = disponible.
   - ORIENTAR = indica dónde continuar.
   - TRANSICIÓN = algo está cambiando.
   - PAUSA = actividad contenida.
   - CONFIRMAR = cambio ya resuelto.
2. No mostrar todavía qué imagen corresponde a cada nombre.
3. Retirar la leyenda.
4. Clasificar las imágenes de las seis hojas ciegas R1.

No explicar rasgos gráficos.

## Granularidad de datos

**1 fila por participante × imagen.**  
6 hojas × 5 imágenes = **30 filas por participante**.

Registrar:
- estado elegido;
- estado esperado;
- acierto/error;
- comentario si hubo duda.

El agregado correspondiente es:

`B1_CONFUSION`

# APRENDIZAJE EXPLÍCITO

Después de B1 y antes de B2, mostrar la hoja de aprendizaje de cada presencia:

- `LEARNING_WEB_H1.png`
- `LEARNING_IA_H1.png`
- `LEARNING_EDUCA_H1.png`

Cada hoja relaciona explícitamente:

**imagen + nombre + función**

No explicar rasgos gráficos del tipo “mira cómo se desplaza”, “fíjate en la contrarrotación” o “esta es más cerrada”.

Mostrar el tiempo suficiente para leer. Retirar las hojas antes de B2.

# TEST B2 · RECONOCIMIENTO DESPUÉS DE APRENDIZAJE

## Objetivo

Responder:

**¿La gramática puede aprenderse y reconocerse después?**

## Material

Usar las seis hojas B2:

- Web · color;
- Web · monocromo;
- IA · color;
- IA · monocromo;
- Educa · color;
- Educa · monocromo.

Las imágenes son exactamente los mismos keyframes R1, pero su posición/numeración se ha reordenado de forma predeterminada antes de iniciar H1.

El orden B2 queda congelado para toda la ronda.

## Granularidad de datos

**1 fila por participante × imagen.**  
6 hojas × 5 imágenes = **30 filas por participante**.

Registrar:
- estado elegido;
- estado esperado;
- acierto/error;
- comentario si hubo duda.

El agregado correspondiente es:

`B2_CONFUSION`

# Contrabalanceo P01–P10

Los órdenes de hojas se definen en `B3_HUMAN_PILOT_SEQUENCE_H1.csv`.

Reglas:
- los órdenes A existentes se conservan exactamente;
- B1 usa secuencias independientes de A;
- B2 usa secuencias independientes de A y B1;
- no usar siempre Web → IA → Educa;
- el orden interno de las hojas A/B1 queda congelado;
- el orden interno B2 queda congelado en sus hojas reordenadas.

# Participantes

Objetivo piloto: **6–10 personas adultas**.

Intentar variedad en:
- edad;
- familiaridad tecnológica;
- experiencia educativa;
- familiaridad/no familiaridad con Sabik.

No hace falta población infantil para H1.

## Minimización de datos

Usar identificadores `P01`, `P02`, etc.

Registrar solo:
- franja de edad: 18–29 / 30–44 / 45–59 / 60+;
- familiaridad tecnológica: baja / media / alta;
- experiencia educativa: sí / no / prefiero no decir;
- familiaridad previa con Sabik: sí / no.

No registrar nombres, email, diagnósticos, información clínica ni otros datos sensibles.

# Métricas

## Test A

Matriz de similitud/confusión percibida por pares:

- `A_MOST_SIMILAR`
- `A_PRACTICALLY_SAME`
- `A_MOST_DIFFERENT`

Analizar expresamente:
- ORIENTAR ↔ TRANSICIÓN;
- PAUSA ↔ CONFIRMAR;
- PRESENTE ↔ CONFIRMAR.

## Test B1

Matriz clásica `esperado × elegido`, separada por:
- Web / IA / Educa;
- color / monocromo;
- total color;
- total monocromo;
- total general.

## Test B2

La misma estructura que B1, pero en matriz independiente.

No mezclar B1 y B2 en una única accuracy.

# Regla de no modificación durante la ronda

En cuanto se registre la primera respuesta humana:

**prohibido modificar los 15 keyframes hasta cerrar todos los participantes de H1.**

No arreglar una confusión observada a mitad del test.

# Criterio piloto de Astra

No fijar umbrales nuevos después de ver resultados.

Buscar:
- ausencia de un par confundido de forma sistemática;
- ORIENTAR↔TRANSICIÓN no dominante;
- PAUSA↔CONFIRMAR no dominante;
- PRESENTE↔CONFIRMAR sin confusión recurrente;
- monocromo sin colapso claro;
- ausencia de lecturas problemáticas recurrentes: apagado, error, loading, premio, tristeza, flecha, fallo;
- Educa sin infantilización evidente y repetida.

# Estado previo al primer participante

- Participantes: **0**
- Test A: preparado
- Test B1: preparado
- Aprendizaje explícito: preparado
- Test B2: preparado
- Matrices: vacías
- Keyframes modificados durante H1: **0**

**NO MERGE.**
