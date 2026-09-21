# SABIK · ACCESIBILIDAD COGNITIVA R0

## Contrato

### Movimiento
- NORMAL
- REDUCIDO
- SIN_MOVIMIENTO
- `prefers-reduced-motion: reduce` => como mínimo REDUCIDO
- reducción global de Iris Green => REDUCIDO
- preferencia local “Sin movimiento” => SIN_MOVIMIENTO

### Lectura

El panel Sabik reutiliza `IGPreferences`.

Debe responder a:
- escala de texto;
- separación entre letras/palabras;
- interlineado;
- anchura de lectura;
- contraste;
- movimiento reducido.

Pruebas del candidato deben incluir:
- 200 % de texto/escala efectiva;
- 400 % zoom;
- 320 CSS px;
- sin pérdida de respuesta;
- sin scroll horizontal global.

### Voz

Canal independiente. UI y adaptador abstracto sí; motor no.

Controles candidatos:
- on/off;
- volumen;
- velocidad;
- repetir.

Mientras S2 esté cerrado, el adaptador real es `NullVoiceAdapter` y los controles dependientes aparecen deshabilitados.

### Densidad

Tres valores:
- completa;
- reducida;
- paso a paso.

Invariante:

> Ningún modo de densidad puede ocultar información de seguridad, condiciones importantes, limitaciones o el texto completo de una respuesta no estructurada.

### Intensidad visual

Reutiliza `low_intensity` / “Bajar intensidad” ya existente. No se crea un segundo interruptor equivalente.

## No duplicación

“Tamaño”, “espaciado”, “ancho”, “contraste” y “reducir movimiento” pertenecen al panel global **Lectura**. Sabik consume esa preferencia y solo añade las elecciones que no existen globalmente.

**NO MERGE · NO DEPLOY.**
