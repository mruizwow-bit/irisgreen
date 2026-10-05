# Nexo → Astra · paquetes completos para integrar Descubrimiento
2026-10-05 · Petición de María. Preparar entregas existentes, no volver a generar imágenes.

## Entregar
1. CIELO_NOCTURNO_BIBLIOTECA_COMPLETA_R01.zip: 88 constelaciones R03, SVG/PNG/JSON, datos estelares y geometría, límites/figuras diferenciados, horizonte(s), masters y atlas/guías existentes, información ES/EN, fuentes y licencias. Si alguno corresponde a otro responsable, recuperar el paquete canónico y citar procedencia; no reconstruir a partir de capturas.
2. VIDA_MARINA_BIBLIOTECA_COMPLETA_R01.zip: todos los animales únicos y variantes vigentes, imágenes originales/aprobadas, pares oscuro/luz donde correspondan, datos/fichas ES/EN, taxón, fases vitales, hábitat/región/profundidad/talla con fuentes, parámetros técnicos existentes y equivalencias ID→archivo.
3. DESCUBRIMIENTO_INDICE_Y_PENDIENTES_R01.zip: índice global JSON/CSV, manifests, SHA256, README de extracción, procedencia, estados técnicos/factuales/humanos, conflictos y exclusiones por ID.

No hace falta un ZIP enorme: pueden ser volúmenes numerados con índice único y rutas relativas estables. Entregar los archivos, no sólo contact sheets o enlaces a una sesión inaccesible. No cifrar con claves no entregadas.

## Manifiesto mínimo por objeto
ID estable, nombre ES/EN, taxón/denominación canónica, categoría, rutas de todos sus recursos, versión y SHA256, dimensiones/canales/perfil, alt ES/EN, fuentes y licencia/procedencia. Datos ausentes = null + motivo; no adivinar.
Para pares: misma identidad, pose, encuadre y geometría; indicar transparencia, alfa y estado de QA. No todos los animales necesitan un oscuro si su experiencia no lo usa.
Escena/zona con evidencia y estado, no asignación automática por parecido. Agua dulce no se presenta como mar. No inventar convivencia.
Conteos separados: registros, especies/objetos únicos, variantes, archivos, duplicados y exclusiones. Los 301 registros previos no son 301 especies.

## Correcciones y límites ya conocidos
Incorporar MAR22_CUATRO_PAREJAS_QA_20261005.zip (libfile_02629013b13c81919066ee27060d2a59) y su control canónico. No regenerar las cuatro parejas.
Conservar su estado TECHNICAL_PAIR_READY_SCIENTIFIC_REVIEW_PENDING. Acompañar el hallazgo de composición alfa para la prueba del motor; no afirmar que está corregido sin comprobarlo.
Mantener B15 aprobado. B10: correspondencias ambiguas en lista de pendientes, no sustitución silenciosa. B16: excluir el sustituto revocado; conservar referencia de exclusión, no distribuirlo como asset vigente.
No borrar originales ni duplicar la biblioteca maestra. Resolver equivalencias ya documentadas; marcar lo que falte sin obligar a María a transportar nombres sueltos o regenerar.

## Organización de pendientes
Entregar ahora lo disponible y válido. Los candidatos necesarios para revisión pueden ir en carpeta equipo_revision con estado y problema concreto; los revocados no entran al runtime. Un problema local no bloquea empaquetar el resto.
Cada pendiente indica qué archivo/dato falta, quién lo conserva si se sabe y cómo recuperarlo. No declarar PASS científico global ni HUMAN QA.
Otros productos (Sistema Solar, eclipses, meteoros, exoplanetas, fósiles) se inventarían aparte si forman parte de la biblioteca, sin mezclarlos con esta integración de Cielo nocturno y Vida marina.

## Registro y destino
Registrar inventario, versiones, hashes y entregas en GitHub #323 y enlazar desde #390 para Vida marina. No tocar runtimes ni main para este empaquetado.
Claude recibirá estos ZIP junto a la orden ORDEN_CLAUDE_DESCUBRIMIENTOS_COMPLETOS_R01.md en este mismo directorio. Su trabajo es integrar, no regenerar. Motor sigue con Sabik.
