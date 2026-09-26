# ADDENDUM R42 · Design Crystal · criterios de aceptación derivados del precheck

Fecha: 26/09/2026  
Ámbito: piloto material/cristal R42 Design #301  
Naturaleza: criterio operativo de aplicación y QA. No sustituye ni amplía por sí mismo la legislación, WCAG, ISO, EN o COGA citados por el proyecto.

## 1. Jerarquía documental

Para una entrega R42 Design válida, la lectura de memorias maestras históricas no sustituye los canónicos operativos actuales.

Deben reconciliarse como mínimo:
- `COORDINACION_IRIS_GREEN/ESTADO_ACTUAL.md`
- `COORDINACION_IRIS_GREEN/MEMORIA/ESTADO_CONSOLIDADO.md`
- `COORDINACION_IRIS_GREEN/CONTROL/ESTADO_TRABAJOS.csv`
- addenda R42 vigentes aplicables
- orden específica vigente.

Una entrega técnicamente correcta puede quedar retenida si el gate documental vigente no se cumplió literalmente.

## 2. Aplicación del sistema material en el Rincón

El principio general sigue siendo:
- material/cristal en chrome interactivo;
- contenido estable y de lectura opaco;
- no glass-on-glass.

En el Rincón tranquilo, por su función inmersiva y por el riesgo de destello/cambio perceptivo brusco, el chrome temporal que cubre parte sustancial del stage debe usar variante oscura opaca o dark-material.

Se incluyen:
- inspector contextual;
- dialogs;
- sheets;
- paneles temporales;
- ayuda/contexto superpuesto.

No se acepta una superficie blanca grande que aparezca al abrir un control en escritorio o móvil.

Esto no exige oscurecer el contenido de lectura ni convertir toda la aplicación a dark mode.

## 3. Contraste sobre materiales translúcidos

Un test de contraste se considera válido solo si usa el **fondo efectivo del texto**.

Para elementos anidados:
1. considerar el fondo propio del elemento/contenedor inmediato;
2. si existe transparencia, componer con sus ancestros en orden;
3. continuar hasta obtener el fondo efectivo opaco;
4. calcular el contraste contra ese resultado.

Un texto dentro de un botón opaco situado sobre una barra de cristal debe medirse contra el fondo efectivo del botón, no directamente contra la barra.

La implementación debe conservar datos suficientes para auditar la cadena de composición.

## 4. Margen del texto deshabilitado

El valor aproximado 4,8–5:1 se adopta aquí como **objetivo de robustez del diseño**, no como reinterpretación de las excepciones WCAG para controles inactivos.

El propósito es evitar estados visuales demasiado próximos al umbral cuando el token también pueda reutilizarse en contextos no exentos.

## 5. Transparencia y Más contraste

Si un modo de contraste impone superficie opaca aunque la preferencia manual de Transparencia sea `Normal`, la interfaz debe comunicar el estado efectivo de forma comprensible y accesible.

No es obligatorio modificar la preferencia almacenada; sí evitar una contradicción cognitiva entre control mostrado y resultado visible.

## 6. CI y validación perceptiva

Las 48 capturas locales:
`8 rutas × 2 tamaños × 3 modos`

son evidencia estructural/material cuando el runner bloquea peticiones no locales.

No acreditan por sí solas:
- vídeo externo real;
- carga real de fuentes externas;
- comportamiento audiovisual final;
- aceptación perceptiva.

La aceptación final del piloto exige Deploy Preview A2 y HUMAN QA María.

## 7. Gate

Estado previo:
`R42_DESIGN_PACKAGE_PRECHECK_PASS_CORRECTIONS_REQUIRED`

Reentrega:
`R42_DESIGN_R01_CORRECTIONS_APPLIED_READY_FOR_ASTRA_REVIEW`

Solo tras revisión:
`R42_DESIGN_CRYSTAL_SYSTEM_READY_FOR_A2`

A2 mantiene HOLD específico de #301 hasta ese momento.
