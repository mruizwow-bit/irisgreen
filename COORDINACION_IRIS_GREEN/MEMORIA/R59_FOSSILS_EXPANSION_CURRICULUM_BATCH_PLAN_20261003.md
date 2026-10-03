# R59 · FÓSILES · PLAN CURRICULAR DE EXPANSIÓN POR LOTES DE 10

Fecha: 03/10/2026  
Owner: Senda · R59  
Gate: `FOSSILS_EXPANSION_CURRICULUM_BATCH_PLAN_PASS`

## Regla base

Los 14 actuales:
`KEEP_LOCKED_SEED`.

No se regeneran ni se sustituyen:
Trilobites · Dunkleosteus · Meganeura · Dimetrodon · Eoraptor · Plateosaurus · Turiasaurus · Archaeopteryx · Iguanodon · Pelecanimimus · Concavenator · Tyrannosaurus rex · Homo antecessor · Mamut lanudo.

Objetivo inicial:
**64 unidades curriculares** = 14 actuales + 5 lotes nuevos × 10.

No significa mostrar 64 a la vez.

Cada lote nuevo requiere después su propio brief factual antes de producción visual:
`CURRICULUM_SELECT != IMAGE_GENERATION_AUTHORIZATION`.

## Principios de selección

Cubrir:
- toda la historia de la vida, no solo dinosaurios;
- mares antiguos;
- plantas;
- transición agua→tierra;
- invertebrados;
- vertebrados;
- mamíferos;
- evolución humana;
- microfósiles;
- fósiles de traza;
- modos distintos de preservación.

Edades:
usar la International Chronostratigraphic Chart vigente.
Las edades numéricas son orientativas y pueden revisarse; el periodo/época manda editorialmente.

## F01 · Vida temprana y mares antiguos

1. Dickinsonia · Ediacárico · impresión corporal.
2. Estromatolito · Precámbrico/Paleozoico temprano · estructura laminada microbiana.
3. Anomalocaris · Cámbrico · apéndice frontal / impresión.
4. Opabinia · Cámbrico · impresión corporal.
5. Hallucigenia · Cámbrico · impresión corporal.
6. Graptolito · Ordovícico · película/impresión colonial.
7. Nautiloideo ortocono · Ordovícico · concha camerada.
8. Eurypterus · Silúrico · exoesqueleto/impresión.
9. Crinoideo · Silúrico–Devónico · cáliz/tallo.
10. Braquiópodo espiriférido · Devónico · concha.

Aprendizaje:
origen/diversificación animal + tipos de fósil + océanos Paleozoicos.

## F02 · Colonización de tierra y bosques Paleozoicos

1. Cooksonia · Silúrico · tallos ramificados.
2. Rhynia · Devónico · compresión/sección de tallo.
3. Tiktaalik · Devónico · cráneo/aleta con huesos de transición.
4. Acanthostega · Devónico · hueso de extremidad.
5. Arthropleura · Carbonífero · segmento corporal o icnita validada.
6. Lepidodendron · Carbonífero · impresión de corteza.
7. Calamites · Carbonífero · molde de tallo.
8. Sigillaria · Carbonífero · impresión de corteza.
9. Glossopteris · Pérmico · hoja.
10. Mesosaurus · Pérmico · vértebra/esqueleto parcial.

Aprendizaje:
plantas terrestres + bosques de carbón + tetrápodos + deriva continental.

## F03 · Mesozoico: océanos, vuelo y dinosaurios

1. Ammonite/Dactylioceras · Jurásico · concha.
2. Belemnite · Jurásico–Cretácico · rostro.
3. Ichthyosaurus · Jurásico · vértebra/mandíbula.
4. Plesiosaurus · Jurásico · vértebra/hueso de aleta.
5. Pterodactylus · Jurásico · hueso del dedo alar.
6. Stegosaurus · Jurásico · placa.
7. Allosaurus · Jurásico · diente.
8. Triceratops · Cretácico final · núcleo de cuerno.
9. Velociraptor · Cretácico final · garra falciforme.
10. Mosasaurus · Cretácico final · diente/mandíbula.

Aprendizaje:
dinosaurios no son toda la fauna mesozoica; comparar mar/tierra/aire.

## F04 · Cenozoico: mamíferos y ecosistemas cambiantes

1. Sabalites/palma fósil · Paleógeno · hoja.
2. Megacerops · Eoceno/Oligoceno · fragmento de cuerno/cráneo.
3. Basilosaurus · Eoceno · vértebra.
4. Dorudon · Eoceno · diente/mandíbula.
5. Otodus megalodon · Neógeno · diente.
6. Smilodon fatalis · Pleistoceno · canino.
7. Megatherium · Pleistoceno · garra/falange.
8. Glyptodon · Pleistoceno · osteodermo.
9. Paraceratherium · Oligoceno · molar/diente.
10. Merychippus · Mioceno · molar.

Aprendizaje:
radiación de mamíferos + clima/ecosistemas + evolución de ballenas/caballos.

## F05 · Evidencias que también son fósiles + evolución humana

1. Australopithecus afarensis · Plioceno · diente/mandíbula.
2. Homo neanderthalensis · Pleistoceno · diente/fragmento mandibular.
3. Nummulites · Eoceno · test calcáreo.
4. Foraminífero planctónico · Cenozoico · test microscópico.
5. Diatomea fósil · Cenozoico · frústula silícea.
6. Polen fósil · varios periodos · grano microscópico.
7. Coprolito · varios periodos · fósil de traza.
8. Huella de dinosaurio · Mesozoico · icnita.
9. Skolithos · Paleozoico · madriguera/bioturbación.
10. Insecto en ámbar · Mesozoico/Cenozoico · inclusión.

Aprendizaje:
`FOSSIL != BONE`.
Microfósiles, trazas, plantas e inclusiones también reconstruyen ecosistemas.

## Regla de modelado

Los lotes F01–F04 son principalmente `TAXON`.

F05 incluye `EVIDENCE_TYPE`.
No forzar “especie” en:
- estromatolito;
- polen;
- coprolito;
- huella;
- Skolithos si se usa como icnogénero;
- microfósiles de grupo.

Antes de integrar, el esquema debe soportar:
`catalog_unit_type = TAXON | EVIDENCE_TYPE`.

## Producción

- lotes exactos de 10;
- review por lote;
- factual brief por lote antes de imagen;
- una pieza visual por unidad;
- ninguna pieza concreta de museo fingida;
- representación etiquetada como imagen hecha por ordenador;
- custodia/yacimiento solo cuando exista fuente verificada;
- no coordenadas precisas de yacimiento si no son apropiadas para publicación.

## Fuentes curriculares

- ICS International Chronostratigraphic Chart vigente 2026;
- Smithsonian Deep Time;
- Smithsonian Paleobiology teaching resources;
- Natural History Museum · fossil/trace fossil education.

Salida:
`FOSSILS_EXPANSION_CURRICULUM_BATCH_PLAN_PASS`
