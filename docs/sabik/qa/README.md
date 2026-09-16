# Workspace GPT-5 · QA, regresión y puertas

Orden completa: issue #149.  
Epic: #145.  
Programa: PR #144.

## Alcance de esta rama

Definir pruebas, corpus, fixtures y puertas de calidad. No modificar runtime en la primera oleada.

Entregar:

- matriz de estado previo, evento y estado posterior;
- controles, foco, anuncios, voz y movimiento esperados;
- recorridos normales, de corrección, pausa, voz, riesgo y error;
- corpus de intención, contexto, negaciones y falsos positivos;
- métricas separadas de pertinencia, falso «no tengo información» y falsa respuesta;
- pruebas de teclado, lectores, braille, zoom, reflow, colores forzados y movimiento reducido;
- clasificación de pruebas: unitarias, navegador, auditoría estática y validación humana;
- puertas bloqueantes para S0–S8.

Archivos permitidos:

- `docs/sabik/qa/**`
- `tests/specs/sabik/**`
- `tests/fixtures/sabik/**`, coordinados con Claude

No debilitar guardarraíles, no convertir una prueba humana en automática y no tocar `main` ni producción.
