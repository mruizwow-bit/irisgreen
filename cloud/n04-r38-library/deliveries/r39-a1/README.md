# R39-A1 · entrega breve

## Qué se añadió

`groupSources(candidates)` agrupa candidatos ya rankeados por **URL exacta** para la capa de presentación.

Invariantes:
- una tarjeta por URL exacta;
- orden de fuentes = primera aparición en el ranking recibido;
- orden de citas dentro de cada fuente = orden original;
- se conservan `fragment_id`, snippet, `library_version`, score y el resto de campos de cita;
- no se normalizan URLs;
- no se filtran, expanden ni rerankean candidatos;
- no se muta la entrada;
- el array crudo permanece fuera de esta función y puede conservarse por separado.

## Prueba ejecutada

```text
node --test cloud/n04-r38-library/tests/source-groups.test.mjs
Node v22.16.0
8/8 PASS
```

Incluye fixtures sintéticos cotidianos de adolescencia/colegio y adultez/trabajo únicamente para comprobar la agrupación. No se presentan como diagnóstico ni como evidencia de relevancia clínica.

## Relevancia no satisfecha

Este trabajo **no** corrige relevancia, ranking ni expectativas R38. Si una consulta cotidiana devuelve resultados poco pertinentes, debe registrarse como gap de relevancia y tratarse en un lote de ranking separado; no se cambian tests para fabricar PASS.

## Scope negativo

No se tocó:
- `src/library.mjs`;
- `src/sabik-retrieval.mjs` / `retrieveForSabik`;
- `qa-handler.mjs`;
- Function HTTP;
- build/package/lock/netlify;
- web de María/agente 2;
- Motion R37;
- Cloud deploy, proveedor, modelo, embeddings o `/api/chat`.

Codex puede integrar el HEAD de implementación `b0a55cb3ab94ad9f44d2ce3e8c1ce4513c9f475d`.
