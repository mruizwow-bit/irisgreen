# ADDENDUM · SABIK COPY PRODUCCIÓN Y BIBLIOTECA DE AUDIO · R01 · 27/09/2026

Estado: `SABIK_COPY_PRODUCCION_GOVERNANCE_ADOPTED`.

## 1. Separación obligatoria

Se mantienen tres conjuntos independientes:

- `CORPUS_ENTRENAMIENTO_VOZ`: material acústico/fonético. No es copy de producto.
- `SABIK_COPY_PRODUCCION`: lenguaje propio de Sabik que puede mostrarse o locutarse.
- `SABIK_AUDIO_LIBRARY`: archivos de audio derivados exclusivamente de copy/contenido aprobado.

Ningún texto pasa de entrenamiento a producción por el mero hecho de haber sido usado para generar o ajustar una voz.

## 2. Reglas de lenguaje de producción

El lenguaje de Sabik debe:
- ser claro, adulto, directo y natural;
- explicar qué ocurre, qué puede hacer el sistema y qué opción existe;
- evitar abstracciones innecesarias;
- evitar antropomorfismo emocional;
- no atribuir al usuario estados que no ha expresado;
- no presentar Sabik como cuidador, terapeuta, compañía o presencia emocional;
- no infantilizar;
- mantener significado equivalente en español e inglés;
- distinguir texto de interfaz, locución y anuncios para tecnologías de apoyo.

Quedan excluidas formulaciones como `la ausencia de voz no significa abandono` y otras que introduzcan emociones o necesidades no expresadas por la persona.

## 3. Fuente de verdad

Las frases propias del sistema Sabik se versionan en `SABIK_COPY_PRODUCCION`.

Los artículos, fichas, recursos y demás contenido editorial de Iris Green no se duplican manualmente ahí. Conservan su fuente canónica en la web y, si se narran, se vinculan a audio por ID + versión + hash de texto.

## 4. Audio y desactualización

Cada audio debe poder demostrar:
- qué texto exacto locuta;
- qué idioma;
- qué master vocal;
- qué configuración/modelo lo generó;
- qué hash tiene el texto y el audio;
- si está vigente o desactualizado.

Si cambia el texto, el audio anterior se marca como stale y no puede presentarse como lectura exacta del contenido nuevo.

## 5. Accesibilidad

La voz:
- nunca sustituye al texto equivalente;
- solo se inicia tras acción explícita cuando la superficie así lo requiera;
- debe poder pausarse/detenerse;
- no debe competir con música/ambiente;
- no crea un canal exclusivo para información importante;
- no añade contenido distinto del texto aprobado.

## 6. Alcance

Este addendum gobierna copy y audio de Sabik. No autoriza despliegue, integración en producción ni cambios de arquitectura web fuera de su carril.
