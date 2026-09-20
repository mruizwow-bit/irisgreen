# B3_HUMAN_PILOT_PROTOCOL_H1

**Fase:** 3A-H1 · Piloto de discriminación y comprensión humana  
**Fecha:** 20/09/2026  
**Coordinación:** Astra  
**Base congelada:** PR #182 · `16a4b7debf801d190a6174fd6831a5176db5960d`

> PILOTO DE DISEÑO · NO VALIDACIÓN CIENTÍFICA · NO DIAGNÓSTICO

## Estado

**H1_PREPARED · AWAITING_HUMAN_PARTICIPANTS**

Los 15 keyframes R1 quedan congelados durante toda la ronda. No se modifica PRESENTE, ORIENTAR, TRANSICIÓN, PAUSA, CONFIRMAR, geometrías, parámetros, color, masters, PR #181 ni PR #163.

La ronda se realiza únicamente a **64 px**. 32 px permanece `PENDING HUMAN TEST`.

## Objetivo

Separar dos preguntas distintas:

1. **Test A · discriminación visual:** ¿las cinco apariencias se perciben como suficientemente distintas?
2. **Test B · reconocimiento funcional:** después de aprender una leyenda simple, ¿la persona puede recordar qué función representa cada apariencia?

El Test A se realiza siempre antes del Test B para no enseñar las etiquetas funcionales antes de medir similitud visual.

## Participantes

Objetivo piloto: **6–10 personas adultas**.

Intentar variedad en:
- franja de edad;
- familiaridad tecnológica;
- experiencia educativa;
- familiaridad o no familiaridad con Sabik.

No se requiere población infantil en H1.

### Datos mínimos

Usar identificadores anónimos: `P01`, `P02`, etc.

Registrar solo:
- franja de edad: 18–29 / 30–44 / 45–59 / 60+;
- familiaridad tecnológica: baja / media / alta;
- experiencia educativa: sí / no / prefiero no decir;
- familiaridad previa con Sabik: sí / no.

No registrar nombre, email, diagnóstico, condición médica ni otra información sensible para este piloto.

## Material congelado

Se usan las seis hojas ciegas R1 existentes:
- Web · color;
- Web · monocromo;
- IA · color;
- IA · monocromo;
- Educa · color;
- Educa · monocromo.

Cada hoja contiene cinco imágenes numeradas, sin nombre de estado. El orden interno de imágenes ya está aleatorizado y queda congelado durante H1.

La clave se mantiene separada del participante.

## Aleatorización del orden de hojas

Códigos:
- `WC` = Web color
- `WM` = Web monocromo
- `IC` = IA color
- `IM` = IA monocromo
- `EC` = Educa color
- `EM` = Educa monocromo

Usar el orden asignado a cada participante. Si participan más de 10 personas, continuar el ciclo desde P01.

| Participante | Test A | Test B |
|---|---|---|
| P01 | WC · IM · EM · EC · IC · WM | IC · WM · EC · EM · WC · IM |
| P02 | IM · EC · WC · WM · EM · IC | WM · EC · IM · IC · EM · WC |
| P03 | EC · WM · IM · IC · WC · EM | EC · EM · WM · WC · IM · IC |
| P04 | WM · IC · EC · EM · IM · WC | EM · WC · IC · IM · EC · WM |
| P05 | IC · EM · WM · WC · EC · IM | WC · IM · EM · EC · IC · WM |
| P06 | EM · WC · IC · IM · WM · EC | IM · EC · WC · WM · EM · IC |
| P07 | WC · EC · IM · EM · WM · IC | EC · WM · EM · IC · WC · IM |
| P08 | IM · WM · EC · IC · EM · WC | WM · IC · WC · EM · IM · EC |
| P09 | EC · IC · WM · WC · IM · EM | IC · EM · EC · IM · WM · WC |
| P10 | WM · EM · IC · IM · WC · EC | EM · WC · IM · WM · EC · IC |

No cambiar el orden asignado una vez iniciado el participante.

# TEST A · DISCRIMINACIÓN VISUAL

## Objetivo

Medir similitud percibida sin pedir nombres funcionales.

## Instrucción al participante

“Vas a ver cinco versiones de una misma forma. No necesitas saber qué significan. Queremos saber si se ven suficientemente distintas entre sí.”

## Para cada hoja

Preguntar:

1. **¿Qué dos imágenes te parecen más parecidas entre sí?**  
   Registrar los dos números.

2. **¿Cuánto se parecen?**  
   Escala:
   - 1 = claramente distintas
   - 2 = bastante distintas
   - 3 = algo parecidas
   - 4 = muy parecidas
   - 5 = prácticamente la misma

3. **¿Qué dos imágenes te parecen más diferentes?**

4. **¿Hay alguna pareja que te parezca prácticamente la misma?**  
   Sí / No. Si sí, registrar pareja.

5. Comentario libre breve, si lo hay.

### Pregunta monocroma

Después de cada hoja monocroma:

**“Sin depender del color, ¿te parecen distinguibles estas cinco formas?”**

Escala:
- 1 = no
- 2 = poco
- 3 = parcialmente
- 4 = bastante
- 5 = claramente

### Educa

Después de completar las dos hojas de Educa:

**“¿Esta forma te parece infantil, adulta o neutral para distintas edades?”**

Opciones:
- infantil;
- adulta;
- neutral para distintas edades;
- no sé.

Registrar comentario si lo hay.

## Test A no tiene respuesta correcta

No calcular acierto/error. La salida es una matriz de frecuencia de pares señalados como:
- más parecidos;
- prácticamente iguales.

# TEST B · RECONOCIMIENTO FUNCIONAL

## Leyenda de aprendizaje

Mostrar una sola vez, antes de empezar Test B:

- **PRESENTE** = disponible.
- **ORIENTAR** = indica dónde continuar.
- **TRANSICIÓN** = algo está cambiando.
- **PAUSA** = actividad contenida.
- **CONFIRMAR** = cambio ya resuelto.

Comprobar que la persona ha leído la leyenda. No explicar diferencias gráficas ni señalar imágenes concretas.

Retirar la leyenda antes de mostrar las hojas.

## Tarea

Para cada imagen numerada, elegir exactamente una etiqueta:

`PRESENTE · ORIENTAR · TRANSICIÓN · PAUSA · CONFIRMAR`

Registrar:
- estado elegido;
- estado esperado (añadir desde la clave después de recoger la respuesta);
- acierto/error;
- comentario si hubo duda.

No dar feedback de acierto durante la ronda.

# Reglas de la ronda

- No modificar imágenes ni parámetros hasta terminar todos los participantes.
- No enseñar la clave durante la sesión.
- No corregir respuestas.
- No convertir comentarios cualitativos en diagnóstico de la persona.
- No presentar este piloto como validación científica o estadística.
- No usar accuracy global para ocultar pares críticos.

# Métricas

## Test A

Por presencia y modo:
- frecuencia de cada par como “más parecido”;
- frecuencia de cada par como “prácticamente igual”;
- media/mediana de similitud 1–5;
- comentarios cualitativos.

Analizar expresamente:
- ORIENTAR ↔ TRANSICIÓN;
- PAUSA ↔ CONFIRMAR;
- PRESENTE ↔ CONFIRMAR.

## Test B

Crear matriz de confusión `esperado × elegido` por:
- Web color;
- Web monocromo;
- IA color;
- IA monocromo;
- Educa color;
- Educa monocromo;
- total color;
- total monocromo;
- total general.

Analizar los tres pares críticos por separado.

# Criterio piloto de Astra

No fijar un umbral numérico nuevo después de ver resultados.

Para considerar la gramática candidata a congelación se busca:
- ausencia de un par confundido de forma sistemática;
- ORIENTAR↔TRANSICIÓN no dominante;
- PAUSA↔CONFIRMAR no dominante;
- PRESENTE↔CONFIRMAR sin confusión recurrente;
- monocromo sin colapso claro de diferenciación;
- ausencia de lecturas problemáticas recurrentes: apagado, error, loading, premio, tristeza, flecha, fallo;
- Educa sin infantilización evidente y repetida.

# Archivos de datos

- `B3_HUMAN_PILOT_RESPONSES_H1.csv` — datos brutos.
- `B3_HUMAN_PILOT_CONFUSION_H1.csv` — matrices/resultados agregados.
- `B3_HUMAN_PILOT_REPORT_H1.md` — informe final.

## Condición de cierre

Solo después de completar la ronda con datos humanos reales se podrá responder:

`SABIK_B3_HUMAN_PILOT_H1_READY`

Hasta entonces el estado es:

`H1_PREPARED · AWAITING_HUMAN_PARTICIPANTS`

**NO MERGE.**
