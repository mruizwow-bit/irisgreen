# LEX · PRÁCTICAS Y EXAMEN R01

Fecha: 30/09/2026  
Estado: `FOUNDATION_PRACTICE_PASS_INTERNAL`

## Criterio PASS

Cada caso debe:
1. separar hechos de supuestos;
2. identificar jurisdicción;
3. identificar rol;
4. localizar trigger;
5. citar fuente primaria/oficial;
6. distinguir obligación de recomendación;
7. pedir solo los datos faltantes que cambian la conclusión;
8. definir evidencia y owner;
9. evitar un “cumple/no cumple” global.

## Práctica 1 · Sabik conversacional

Hechos:
- asistente conversacional;
- texto/voz;
- usuario humano;
- IA en backend.

Resultado:
- Art. 50 AI Act: transparencia humano-IA es un gate actual;
- “es IA” NO equivale a “high-risk”;
- clasificación high-risk requiere intended purpose/caso de uso;
- GDPR/ePrivacy se analizan por datos y terminal/voz, no por etiqueta IA.

PASS:
`AI_TRANSPARENCY_APPLIES_HIGH_RISK_NOT_ASSUMED`.

## Práctica 2 · Menor comparte diagnóstico por voz

Resultado:
- puede aparecer dato de salud/categoría especial;
- edad 14 en España solo resuelve la capacidad de consentir cuando la base es consentimiento;
- child-safe visual no crea base jurídica;
- minimizar, evitar memoria persistente innecesaria, definir finalidad/retención;
- evaluar riesgo/EIPD según tratamiento completo.

Caso negativo:
guardar conversación y diagnóstico “para mejorar experiencia” indefinidamente.

## Práctica 3 · Identificación por voz

Resultado:
- voz no se trata automáticamente como categoría especial solo por ser audio;
- si existe tratamiento técnico para identificar unívocamente, entra biometría para identificación y exige análisis Art. 9 además de Art. 6;
- debe existir alternativa adecuada y minimización.

Caso negativo:
activar reconocimiento continuo de todas las voces presentes.

## Práctica 4 · Cookies/analytics

Resultado:
- almacenamiento/acceso no estrictamente necesario requiere consentimiento válido cuando aplica Art. 22.2 LSSI;
- si banner requiere consentimiento, aceptar y rechazar deben aparecer simultáneamente, al mismo nivel y visibilidad según AEPD;
- no disparar tercero no esencial antes de elección.

Caso negativo:
“seguir navegando = aceptar”.

## Práctica 5 · Proveedor externo de IA

Resultado:
antes de aprobar:
- rol responsable/encargado;
- Art. 28;
- subencargados;
- finalidades propias del proveedor;
- lugar de tratamiento;
- retención;
- training/abuse monitoring;
- transferencia;
- mecanismo de transferencia;
- borrado/devolución;
- incidentes.

Caso negativo:
“empresa americana = DPF” sin comprobar participación/certificación y alcance.

## Práctica 6 · Claim público

Texto:
“Sabik cumple totalmente RGPD y AI Act”.

Resultado:
`LEGAL_BLOCKED`.

Motivo:
afirmación global no acotada; cumplimiento depende de configuración, rol, datos, finalidad, proveedores y evidencia.

Alternativa:
claim específico verificable cuando exista evidencia.

## Práctica 7 · Accesibilidad

Pregunta:
“¿La Ley 11/2023 obliga a toda Iris Green por ser una web?”

Resultado:
NO se concluye así.
Primero se clasifica el servicio. La ley cubre categorías específicas; contempla exención para microempresas prestadoras de servicios. El objetivo técnico accesible puede mantenerse por decisión de producto aunque el mínimo legal sea distinto.

## Práctica 8 · Health/medical boundary

Pregunta:
“Sabik habla de ansiedad/autismo; ¿es producto sanitario?”

Resultado:
dato insuficiente.
La clasificación depende de intended purpose, claims y funciones. Explicar información no equivale automáticamente a software médico; funciones de diagnóstico/predicción/monitorización/tratamiento pueden cambiar el análisis.

## Práctica 9 · Sabik IA Technology

Resultado:
- RMC: denominación social;
- OEPM: marca/nombre comercial;
- dominio: ámbito distinto;
- consulta previa RMC: informativa, no vinculante;
- solicitud actual RMC admite hasta cinco denominaciones;
- requiere indicar forma social;
- reserva tras certificación favorable: seis meses;
- certificado: tres meses para escritura, renovable mientras corresponda;
- no presentar hasta conocer forma social y dato de fundador/promotor.

## Práctica 10 · Incidente

Supuesto:
proveedor expone conversaciones personales.

Secuencia:
1. contener/preservar;
2. fijar momento de conocimiento;
3. determinar responsable/encargado;
4. naturaleza/volumen/personas/datos;
5. riesgo;
6. registro;
7. decidir Art. 33/34;
8. coordinar notificación/communication si procede;
9. medidas correctivas;
10. postmortem.

## Examen R01

1. ¿Qué diferencia obligación, buena práctica y decisión interna?
PASS: fuente + trigger + fuerza jurídica + alcance.

2. ¿Edad 14 significa que cualquier tratamiento de menores >14 es lícito?
PASS: NO; solo resuelve consentimiento en los supuestos que se fundan en consentimiento y siguen aplicando el resto de requisitos.

3. ¿Toda voz es categoría especial?
PASS: NO; la identificación biométrica unívoca cambia el tratamiento.

4. ¿Sabik es high-risk por usar LLM?
PASS: NO; depende del intended purpose y de categorías regulatorias.

5. ¿Qué obligación IA sí aparece ya claramente?
PASS: transparencia de interacción con IA cuando aplica Art. 50.

6. ¿Un proveedor UE elimina transferencias internacionales?
PASS: NO; hay que revisar cadena/subencargados y ubicación efectiva.

7. ¿Una consulta previa favorable en RMC reserva el nombre?
PASS: NO; es informativa y no prejuzga la certificación.

8. ¿Denominación social protege automáticamente una marca?
PASS: NO.

9. ¿Una exención legal de accesibilidad autoriza a Axioma a bajar el estándar técnico del producto?
PASS: NO; son planos distintos.

10. ¿Lex puede emitir “100% compliant” sin registro de evidencia?
PASS: NO.

## Resultado

10/10 criterios conceptuales superados.

Estado:
`LEX_LEGAL_FOUNDATION_PASS_INTERNAL`.

No certificación externa.
