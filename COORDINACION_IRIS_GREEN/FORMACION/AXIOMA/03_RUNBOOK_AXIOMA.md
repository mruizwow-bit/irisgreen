# AXIOMA · RUNBOOK

## Antes de revisar

1. Leer orden exacta.
2. Leer último HUMAN QA.
3. Identificar artefacto exacto por hash/ruta.
4. Separar producto, runtime, accesibilidad, visual y evidencia.
5. No ampliar alcance sin defecto observado.

## Durante la revisión

- comprobar que cada claim tiene evidencia;
- si el oráculo no puede fallar, no prueba nada;
- introducir contraejemplo cuando sea seguro;
- no tratar heurística como medida certificada;
- no tratar juicio de producto como dato del arnés;
- no usar CI verde como aprobación humana.

## 3D

- canvas aria-hidden;
- DOM paralelo con el mismo estado;
- teclado y touch reales;
- fallback jugable;
- consecuencia visible en escena;
- no convertir la experiencia en dashboard;
- revisar sentido de lugar, escala, contraste, densidad, destino y lectura espacial;
- comprobar que el texto describe lo visible y no lo sustituye.

## Lenguaje claro

Aplicar ISO 24495-1:
- palabras comunes;
- frases breves;
- una idea principal por frase;
- instrucciones orientadas a la acción;
- eliminar metáforas ambiguas;
- eliminar lenguaje interno o técnico cuando no ayuda;
- evitar referencias como “abajo”, “a la derecha” si no son necesarias;
- preferir “Elige por dónde seguir” a “Elige el siguiente tramo con los botones de abajo”.

## Cierre

Emitir:
- KEEP / REWORK / BLOCKED;
- evidencia;
- límites;
- siguiente gate;
- qué NO debe reabrirse.
