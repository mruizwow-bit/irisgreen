# Nexo · Formación aplicada 13 · Aceptación, intención y continuidad
2026-10-06.

Evidencia: consolidación y probe determinista en COORDINACION_IRIS_GREEN/HANDOFFS/NEXO_CIELO_COMPLETO_R01_20261006/, commit da60416cf2596f597c5007ba545420006906e953. Informes Axioma leídos en a075fab95ac657e19e1ccde6d805a461b0b29ce1 y 63e682f6bb2c7373d6511d982d37b2b519d2f322.

Aprendizajes:
- Cobertura dice si un objetivo es alcanzable; aceptación aleatoria dice qué superficie responde. Ninguna por sí sola mide reconocimiento o falsos positivos sin verdad-terreno independiente.
- Ejecuté motor original, 144.000 muestras deterministas. Aceptación media 84,28/61,90/9,58 % en tamaños del probe Axioma. Confirma tendencia, no sus cifras exactas. No atribuir discrepancia a una causa sin código/muestreo completos.
- Comparar viewport mezcla área, escala y densidad visible; controlar esas variables antes de culpar exclusivamente al radio mínimo.
- Target motor accesible y firma semántica son requisitos separados. No hacer difícil pulsar para reducir aceptación casual.
- 31 pistas con magnitud positiva y una negativa forman 32 del mismo patrón semántico; normalizar signos modifica conteo de plantillas.
- Cielo continuo requiere transformaciones coherentes entre centros de proyección, identidad y visibilidad compartidas. Ocultar números de campo no cambia arquitectura.
- Modelo de estado coherente no exige añadir idéntico clic de confirmación 88 veces. Evaluar si se entiende qué se señaló.
- Cielo limpio debe respetar control y tiempo de la persona; mostrar capa activa, no retirar información por temporizador.
- Simplificar densidad puede volver una pista imposible si oculta sus anclas. Detección, representación y descripción deben compartir visibilidad.
- Nueva investigación no sustituye defectos ya reproducidos: conservar matriz acumulativa y atribución.

No runtime/main/deploy. Propuestas y fixtures sin navegador ni HUMAN QA.

## Ampliación tras Prisma
Informe canónico leído: 9e93a637376681a056c0bfe4d015a1c866a5be44.
Propuesta conjunta: PROPUESTA_CONSOLIDADA_CLAUDE_CIELO_R02.md, commit bb53dc1f820d35770b00188ae1db2196c3e461f4.

- Confirmé en datos 88 pistas, 47 textos únicos y 21 textos repetidos.
- Gate de pista única debe ser semántico: no basta comparar strings ni describir ramificaciones invisibles antes del reveal.
- Si se descubre otra constelación, registrar hallazgo y mantener pista aún pendiente; contador se actualiza en ambos casos.
- «Lo reconociste por» atribuye comprensión no observada; usar descripción del rasgo, sin afirmar pensamiento humano.
- Comparar misma evidencia visible entre pantallas; nunca contar anclas ocultas para imponer resultado idéntico.
- Fuente de diferencias de probes: Prisma declara muestreo sobre horizonte y medianas; Nexo rectángulo total y medias. No promediar ambos ni convertirlos en error humano.
- Ayuda avanzada voluntaria: no inferir incapacidad de tardanza ni introducirla automáticamente tras un temporizador.
