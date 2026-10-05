# Procedencia y límites · Nexo · 2026-10-05

Este paquete entrega a Claude orden, canon y materiales. No contiene todavía el prototipo ejecutable.
La petición actual de María autoriza implementarlo de forma aislada; no implica HUMAN QA PASS del storyboard ni publicación.

## Fuentes verificadas
- JSON Atlas: commit c21551b9cdc01e73df317b79d0aee1ac26b56bdd, blob 5b51b3d3c2eef4b4d6dace225a43568f1cec3abd. Conservado íntegro; 247 registros y 161 con magnitud <=5.15. Licencias/atribuciones en datos/provenance_A01.json.
- Storyboard R02 recuperado del handoff Prisma: manifest interno 19/19 correcto. Su ZIP y bases compartidas tienen hashes distintos a los del comentario temprano #323/5990446984. Se registra la copia efectivamente recuperada (21d16a811e5990dbf1588a3cfa6a33e25af620fe8f5531c9d32e357e57bb85ee), sin afirmar identidad binaria con aquel anuncio. README y manifest locales coinciden entre sí. No se declara nueva aprobación visual.
- Horizonte B00 recuperado del handoff Atlas: 2560×768, RGBA, ICC presente y SHA f35cb943ca72b254a092c721e8007ddbe4d414ed80d154f287b5eedce57493d0, igual al manifest R02.
- Imagen de profundidad: Orión sobre montañas estrelladas-3.png, 1145×1374 RGBA, sin ICC detectado; renombrada para portabilidad, sin alterar bytes. Es el recurso existente citado por Prisma para F06. No se presenta como geometría científica ni se usa para posicionar estrellas. No se convierte ni regenera.
- Fuentes locales: tres WOFF2 comparados por Git blob con main 1f4ab8b0ffe4edef5c466da0e8c21729b6664531, 3/3 iguales. Licencias copiadas del mismo commit. No se requiere CDN.

## Jerarquía de instrucciones
1. Orden actual de prototipo y canon explícito de María.
2. Contrato de descubrimiento y datos Atlas.
3. Storyboard como referencia de secuencia/continuidad.
El STOP antes de código de su README es histórico y queda superado para este prototipo por la petición actual. NO MAIN y NO SECOND CONSTELLATION permanecen.
El storyboard no usa necesariamente la tipografía definitiva: el CSS/canon adjunto manda en color, letra, tamaño y foco.

## Decisiones y memoria
Se conserva la acción de orientar/observar/localizar. No se adapta la linterna de Peces.
Los PNG del storyboard no constituyen runtime ni deben ser fondos de una falsa interacción.
Datos, motor y UI deben separarse; identificación depende de una acción explícita sobre una región y conserva cámara.
La proyección se declara de observación curada/revisión: no inventar cielo actual, ubicación, alt/az o fecha.
Axioma verifica accesibilidad y comportamiento sobre el ZIP final; María valida la experiencia usándolo. No confundir entrega técnica, revisión de arte y aprobación de producto.
