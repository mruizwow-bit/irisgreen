# Estudio aportado · qué se aplica y qué no se cambia automáticamente

## Base y límites
Documento de origen: `Se ha pegado el markdown(20260907-070017).md`, aportado por la usuaria. Se han leído sus ocho apartados y sus cuarenta actuaciones. El estudio analiza la web pública, no el código ni la rama de revisión; lo declara en su apartado «Alcance». Sus cifras y hallazgos no se trasladan como si describieran necesariamente la propuesta actual de GitHub.

La conclusión aprovechable es consolidar lo existente y conectar una necesidad con información, apoyo y un resultado utilizable. No se interpreta como autorización para sustituir la estética, ampliar indiscriminadamente el catálogo, abrir una comunidad o prometer resultados clínicos.

Referencia técnica de partida: `a064452a6190aad93a84d8d9851514b1fd5ab7cd`, rama `ajustes/auditoria-web`, propuesta #2. Esta revisión no fusiona ni publica la propuesta.

## Aplicación concreta de esta tanda
Se contrastan Autismo y Trastorno del desarrollo del lenguaje (TDL), porque el estudio identifica problemas verificables en ambas. En los archivos actuales persisten la referencia «Zeidan y cols. ⚠ año», una descripción que anuncia contenidos sin desarrollarlos y la frase «Habla menos y peor de lo esperado».

Las dos fichas reciben una explicación desarrollada, alcance de la valoración, apoyos concretos y límites de las afirmaciones. Las referencias se identifican con documento, autoría y fecha etiquetada cuando procede. El registro `editorial/reviews/2026-09-07-autismo-tdl.json` relaciona cada afirmación con sus fuentes y registra cómo se ha consultado cada una. Los identificadores de afirmaciones coinciden entre español e inglés. Esto es revisión documental asistida por IA, no revisión especializada atribuida a un profesional ni validación de comprensión con usuarios.

La correspondencia entre resumen, ficha, metadatos, listado e índice de búsqueda se verifica automáticamente. Solo se revisa la información clínica de esas dos entradas. No se interpreta la ausencia de errores de código como validación documental de las demás.

El total escrito en `videoteca-listado.json` se calcula a partir de sus propios registros, sin añadir o quitar vídeos ni decidir por diseño que la home y la videoteca deban tener la misma selección.

## Decisiones previas que siguen vigentes
- Dominio principal de trabajo: `irisgreen.eu`. No se adquiere ni cambia un dominio ni se modifica DNS sin acceso y decisión explícita.
- Se mantiene la estética y los componentes comunes aprobados. No se abre otra reorganización del menú.
- No se reactiva portugués ni se afirma que existan tres traducciones revisadas.
- Referencias públicas en texto. Las URL y la trazabilidad completa quedan en el registro editorial interno; no se añaden enlaces externos a todas las fichas.
- No se añaden sellos, grados ni fechas ficticias. No se ocultan las 185 fichas por una regla nueva de publicación.
- La revisión no modifica las instrucciones de indexación de las fichas revisadas.
- No se contrata personal, se crea un consejo, se contacta con instituciones, se añade analítica ni se abre una comunidad por una recomendación de este informe.

## Las 40 actuaciones: tratamiento
El número corresponde a la lista original del estudio. «Trabajo previo» significa cambios en la rama de revisión, no garantía del despliegue público. «Pendiente» significa que esta tanda no lo da por hecho.

| N.º | Actuación del estudio | Tratamiento en el proyecto |
|---|---|---|
| 1 | Dominio principal | Conservar `.eu`; comprobar dominios alternativos y despliegue por separado. No cambiar DNS desde una corrección de HTML. |
| 2 | HTML esencial | Continuar la línea ya iniciada de retirar empaquetadores y generar contenido inicial. Las dos fichas se prueban también sin JavaScript; eso no certifica todo el catálogo dinámico. |
| 3 | Restos de montaje | Corregir las referencias incompletas en estas dos fichas. Inventariar los casos restantes como pendientes, no borrarlos para simular revisión. |
| 4 | Catálogos y contadores | Mantener `buscador.json` como índice común; sincronizar sus dos resúmenes. Corregir el campo total de vídeos desde la lista real. Los demás catálogos necesitan su propia prueba de integridad. |
| 5 | Separar revisión y publicación | Registro interno sí; no imponer la retirada automática del contenido ni cambiar noindex de manera masiva. |
| 6 | Fichas completas | Aplicado a Autismo y TDL en ES/EN. El resto sigue pendiente de revisión por grupos. |
| 7 | Afirmaciones y fuentes | Aplicado mediante identificadores de afirmación y fuente. Se conserva la decisión de referencias textuales públicas. |
| 8 | Calidad de evidencia | No hay grado global nuevo. Se distingue población, estimación, incertidumbre y tipo de fuente en las afirmaciones pertinentes. |
| 9 | Revisión y cambios | Registro interno de esta revisión con su alcance real. No atribuir revisión especializada ni revisión humana de traducción que no hayan ocurrido. |
| 10 | Lenguaje | Se sustituye la expresión reductora de TDL y se delimita la afirmación sobre medicación del autismo. No es una revisión lingüística de todas las fichas. |
| 11 | Cabecera predecible | Mantener las correcciones existentes y comprobar regresiones. No reducir otra vez el menú por iniciativa del informe. |
| 12 | Entrada de búsqueda común | Conservar el motor y su JSON existentes. No añadir un buscador editorial paralelo. |
| 13 | Conectar secciones | Aceptado como prioridad posterior: enlaces internos elegidos por función, no asociaciones automáticas por palabras. No inventar destinos. |
| 14 | Profundidad de lectura | Resumen específico en el listado y explicación desarrollada dentro de estas dos fichas; documentación al final. |
| 15 | Alcance de categorías | Conservar tipos reales. No tratar identidades como diagnósticos ni inventar familias sin correspondencia de datos. |
| 16 | WCAG manual | Continuar las pruebas de teclado, foco y redistribución ya realizadas. Pendiente evaluación más amplia con lectores de pantalla; no se declara certificación. |
| 17 | Accesibilidad cognitiva | Adoptar instrucciones consistentes y tareas observables. Las pruebas técnicas no sustituyen comprensión con personas. |
| 18 | Preferencias por necesidad | Conservar Lectura, movimiento reducido y controles existentes. No añadir configuraciones supuestamente específicas de un diagnóstico. |
| 19 | Lectura fácil validada | Requiere participación real de lectores destinatarios. No llamar validado a un cambio de tamaño o una simplificación automática. |
| 20 | Equivalencia de formatos | Mantener alternativas ya incorporadas a juegos y comprobarlas. Subtítulos y transcripciones quedan pendientes de verificar pieza a pieza. |
| 21 | Pocos recorridos completos | Propuesta útil de siguiente fase; elegir primero un recorrido y reutilizar Situaciones, Vida diaria y Ayudas. No añadir cien fichas. |
| 22 | Pasaporte de apoyos | Propuesta de desarrollo pendiente, no un elemento que se haya creado o validado en esta tanda. Debe ser opcional, local y sin perfil sanitario centralizado. |
| 23 | Solicitud utilizable | Evaluar las herramientas actuales de Cómo pedirlo antes de añadir otra. Mantenerlo dentro de Ayudas. |
| 24 | Cuestionarios | Revisión instrumento por instrumento pendiente: permisos, ítems exactos, población y validación. Un botón que abre no valida el cuestionario. |
| 25 | Objetivos de juegos | Conservar objetivos y reglas, sin promesas terapéuticas. Las partidas ya probadas no constituyen ensayos de eficacia educativa. |
| 26 | Idioma y país | Mantener elecciones independientes. No inferir jurisdicción de la lengua de lectura. |
| 27 | Tres lenguas sincronizadas | Adaptar a ES/EN, la decisión vigente. En estas dos fichas coinciden afirmaciones, alcance y fuentes; no reactivar PT-BR. |
| 28 | Cobertura territorial real | Pendiente documentarla desde los datos y verificaciones del directorio, no a partir de lo recuperado por un rastreador. |
| 29 | Colaboración local | Decisión organizativa de la autora. No contactar ni asumir que hay colaboradores. |
| 30 | Vacíos de datos | Aplicado en las estimaciones de estas fichas: distinguir población, año y límites. El resto de Datos sigue pendiente. |
| 31 | Consejo remunerado | Propuesta organizativa y presupuestaria, no cambio de código autorizado automáticamente. |
| 32 | Diversidad de participación | Adoptar como criterio de futuras pruebas reales; no inventar participantes ni resultados. |
| 33 | Responsabilidades de revisión | Explicitar el alcance actual y el trabajo especializado que falta. No atribuir revisiones a organismos por citarlos. |
| 34 | Privacidad | No añadir registro de consultas, cuentas, seguimiento o perfiles. La futura personalización necesita una revisión propia. |
| 35 | Moderación | No abrir foro o red social en esta fase. |
| 36 | Resultados útiles | Mantener pruebas de tareas y separar automatización de investigación con usuarios. No instalar analítica contra la política vigente. |
| 37 | Rendimiento medido | Los objetivos del estudio no son resultados de esta web. Separar pruebas locales de métricas de visitantes y comprobaciones del despliegue. |
| 38 | Automatización y reversión | Añadidas pruebas de sincronización de las dos entradas, integridad de fichas no revisadas y cola de referencias incompletas. La rama separada y los commits permiten revisar y revertir. |
| 39 | Pilotos | Requiere acuerdos y participación reales; pendiente de decisión y organización. |
| 40 | Financiación e independencia | Conservar el mensaje existente de los libros y su visibilidad; no añadir donaciones, servicios o cambios comerciales en esta tanda. |

## Qué significa «fuente consultada» aquí
Se distinguen página oficial completa, texto recuperado del editor, extractos oficiales de recomendaciones y resumen del estudio original. Cuando una apertura directa falla, queda registrado. No se afirma haber leído un documento íntegro a partir de un extracto ni se aplica una supuesta certeza clínica a toda una condición.

No se ha verificado en esta tanda cada estudio que cita el informe estratégico ni la situación actual de todas las plataformas comparadas. Sus propuestas organizativas se analizan como propuestas del documento. La comprobación externa efectuada para publicar contenido se concentra en las fuentes de las dos fichas y consta en el JSON editorial.

## Orden para continuar sin duplicar trabajo
Primero cerrar los fallos localizados en referencias, equivalencia y explicaciones de las fichas existentes. Después elegir un recorrido completo que termine en una acción utilizable, aprovechando las herramientas que ya hay. La participación, las colaboraciones y las afirmaciones de eficacia requieren personas y comprobaciones reales, no declaraciones automáticas de la web.
