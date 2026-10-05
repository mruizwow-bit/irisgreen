# Mar 22 · correcciones y continuidad · 2026-10-05

## Entrega realizada

Cuatro parejas, ocho PNG: pepino abisal, sifonóforo, pez gota y ctenóforo. Copias de entrega con lado mayor 1400 px, proporción conservada, RGBA y perfil sRGB asignado (originales sin perfil). No equivale a recuperar detalle inexistente ni a conversión desde un perfil conocido. Los originales permanecen intactos.

Cada oscuro deriva del RGB de su luz normalizada multiplicado por 0,06. El ctenóforo se desatura antes de atenuar. Alfa idéntico píxel a píxel en cada pareja; sin regenerar anatomía. Oscuros en reposo sin emisión activada: no significa que estos taxones carezcan de bioluminiscencia. Siluetas aún perceptibles sobre navy. La comparación usa #07111d solo como muestra de QA, no como nueva norma gráfica.

QA.json contiene fuentes, hashes, dimensiones y verificación. Estas copias sustituyen las variantes oscuras rechazadas para revisión técnica, no otorgan aprobación científica ni HUMAN QA.

## Runtime y bloqueo comprobado

Inspeccionado descubrimiento-peces-R02_1_2.zip (libfile_284d86b2bc2481918a6a81912049f8c3). Sus 13 parejas no contienen estos cuatro animales. Los seis PNG Atlas aprobados siguen preservados en procedencia.

Preparada qa.html con copia sin modificar del motor. Es una escena sintética de ensayo: sus dimensiones físicas y flags de hábitat no son datos científicos, no deben copiarse al catálogo. Ejecutar con servidor HTTP local. qa.cjs automatiza carga y dos posiciones de luz.

**Prueba gráfica NO EJECUTADA**: Playwright está disponible, pero falta Chromium; su descarga devolvió un archivo vacío/no ZIP. No hay capturas ni PASS de navegador. Las seis pruebas de funciones puras del ZIP pasan en Node; no prueban estas imágenes ni la interacción de usuario.

Hallazgo por lectura de código: el motor dibuja oscuro y superpone luz enmascarada con source-over. Para alfa semitransparente A, el alfa combinado es A + AM(1-A), no A. Con A=0,5 y M=1 resulta 0,75 frente al 0,5 deseado. Requiere corregir o justificar la composición antes de aceptar animales translúcidos. No se modificó el motor ni la producción.

## Contraste científico acotado

- Pez gota: Fishes of Australia describe Psychrolutes marcidus con piel lisa sin escamas, pectorales grandes y color pardo claro/gris. La ilustración conserva aspecto rosado y textura dudosa. **Identidad específica y fidelidad pendientes**, aunque se ha eliminado el problema técnico del oscuro. Fuente: https://fishesofaustralia.net.au/home/species/4638
- Pepino: MBARI describe Scotoplanes spp. con pies tubulares largos sobre fondo abisal. La corrección es compatible a nivel general, pero no certifica S. globosa ni número/disposición de apéndices. Fuente: https://www.mbari.org/animal/sea-pig/
- Ctenóforo: el arcoíris de las hileras deriva de luz incidente; no debe mantenerse como arcoíris autoemitido en el oscuro. Fuente: https://www.montereybayaquarium.org/animals-the-ocean/animals-a-to-z/comb-jelly . Esta fuente es de Ctenophora, no demuestra identidad Mnemiopsis leidyi ni su hábitat particular.
- Sifonóforo: mantener la revisión de arquitectura colonial/especie y emisión separada; el ajuste cromático no la resuelve. Referencia para contraste: https://biolum.eemb.ucsb.edu/organism/pictures/praya.html

## Pendientes recuperables

La auditoría existente es REVISION_PECES_DESCUBRIMIENTO_20261005.md (libfile_4fc465be4a408191b26c11c13c59d916). No se crea una biblioteca maestra paralela.

1. Prueba real de máscara parcial, retirada del haz, transparencia, escala, oclusión y accesibilidad; integración aún pendiente.
2. Revisiones científicas señaladas en la auditoría: espinoso, cacho, pez-sol-azul, julia, juvenil napoleón; pez murciélago y pez rana; pez ogro, granadero y trípode; Histrio y Parachaenichthys; Ophisternon y Thermarces; fase vital del tiburón cebra; Saccopharynx/Eurypharynx; vampiro/Dumbo/anfípodo; Aequorea y Mnemiopsis; mano roja y cuatro parejas aquí entregadas. No declaradas completadas.
3. Bloque 10: leído bloque_10(2).txt (libfile_2f767e74fc288191afe79e71870ad222): Liparis liparis, Anarhichas lupus, Myxine glutinosa, Antennarius commerson, Anarrhichthys ocellatus, Archosargus probatocephalus, Salmo trutta, Salmo salar, Luciobarbus bocagei, Pseudochondrostoma polylepis. Falta correspondencia inequívoca con las diez sustituciones aprobadas. Los resultados de búsqueda no bastan para asignarlas.
4. Bloque 16: leído bloque_16(2).txt (libfile_c984c47275f4819192f80062d89cba8b): capelán, fletán, gallineta, lumpo, liebre de mar, arenque, eperlano, salvelino, lota, tiburón dormilón. Reemplazo no confirmado; ZIP procedural revocado excluido. No rehabilitar por existir en archivos.
5. Completar inventario ES/EN, taxón, hábitat, talla, equivalencias y normalización del resto. Los 301 registros de cribado previo no equivalen a 301 especies ni a validación científica total.
6. Bloque 15 válido se conserva. Bloque 27: diez imágenes únicas y dos duplicados según auditoría previa; no sumar duplicados. No borrar originales.

## Reanudación

Leer este estado + QA.json + auditoría existente + #390 y #323. Resolver primero composición alfa y ejecutar qa.html; después completar factual y correspondencias antes de integrar. No pedir a María que transporte mensajes o regenere por problemas que pueden resolverse determinísticamente.

Paquete guardado: MAR22_CUATRO_PAREJAS_QA_20261005.zip · Library libfile_02629013b13c81919066ee27060d2a59.
