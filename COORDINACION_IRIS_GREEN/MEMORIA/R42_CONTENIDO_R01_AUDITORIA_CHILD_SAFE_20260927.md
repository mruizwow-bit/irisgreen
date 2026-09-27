# Memoria · contenido R01 auditado + child-safe reactivado para nueva web · 27/09/2026

## Decisión de María

La protección infantil que estaba diferida se reactiva ahora **para la adaptación del contenido a la nueva web**.

Estado de fase:
`R42_CHILD_SAFE_CONTENT_REACTIVATED_FOR_DESIGN_NEW_WEB`

Estado del paquete:
`R42_CONTENT_R01_AUDITED_READY_FOR_DESIGN_CHILD_SAFE`

Issue Design: #302  
Parent: #293  
A2: #289

La reactivación no ordena aplicar los viejos parches #294–#297 sobre el baseline anterior. Primero se diseña el nuevo contrato de contenido y seguridad sobre la nueva web. Después se emiten implementaciones contra el baseline resultante.

## Fuente auditada

`iris-green-contenido-R01-20260924.zip`  
SHA-256: `e44633d2c4707e69276c88728a090212f6d791046cc8dbe38399270f5c29551a`

Paquete preparado para Design:
`iris-green-contenido-R02-DESIGN-CHILD-SAFE-20260927.zip`  
SHA-256: `b24998fbdb5fab9b59135237ba5c5edb5d67167d8aa31b413656eb53459f6f23`

## Inventario reconciliado

La fuente dice “152 fichas nuevas”, pero mezcla:
- 118 entidades de contenido nuevas;
- 34 archivos modificados.

118 nuevas:
- Condiciones 41;
- Situaciones 36;
- Vida diaria 14;
- Datos 11;
- Trámites 4;
- Investigación 12.

204 HTML nuevos = 102 fichas bilingües de página propia × ES/EN.

Catálogos completos presentes:
- Condiciones 226;
- Situaciones 223;
- Vida diaria 62;
- Datos 60;
- Investigación 132;
- directorio ES Trámites 262.

## Auditoría de las 204 páginas nuevas

Estructura:
- lang correcto;
- H1 único;
- title/meta description;
- fuente externa;
- HTTPS;
- pareja ES/EN.

Escaneo heurístico de alto riesgo:
- 0 pesos/calorías numéricos;
- 0 BMI/IMC numérico;
- 0 dosis tipo mg/ml;
- 0 lenguaje explícito de métodos de autolesión/suicidio;
- 0 descripciones gráficas detectadas.

No sustituye revisión humana.

## Bilingüismo

Se detectan 245 enlaces en footer EN hacia `/es/`. No migrar shell/footer R01.

Investigación 121–132:
- `sample_en` corregido en 12;
- `authors_en` corregido en 4.

## Correcciones jurídicas preparadas

### Directiva (UE) 2024/2841
- transposición: 5/06/2027;
- aplicación: 5/06/2028;
- Tarjeta Europea de Discapacidad: emisión/renovación gratuita para beneficiario;
- Tarjeta Europea de Estacionamiento: puede ser gratuita o tener tasa hasta costes administrativos;
- transición de tarjetas de estacionamiento antiguas: sustitución completa como máximo 5/12/2029.

### RD 409/2025 perros de asistencia
- fuente primaria BOE;
- regla estatal general para persona usuaria: discapacidad ≥33 %;
- CCAA/Ceuta/Melilla pueden reconocer otras personas usuarias, incluidos supuestos de alerta médica/TEA;
- reconocimiento del perro válido en todo el territorio nacional;
- retiro a los 10 años salvo informe veterinario anual favorable.

### RD 707/2026
- BOE 3/09/2026;
- entrada en vigor 2/01/2027;
- definición amplia de dificultades cognitivas;
- algunas obligaciones concretas tienen requisitos propios; art. 14.1 empleo exige ≥33 % + discapacidad intelectual para las obligaciones de ese artículo.

## Child-safe

Manifest preparado:
- 965 registros;
- S0 724;
- S1 225;
- S2 16;
- NORMAL 945;
- SAFE_VARIANT_REQUIRED 16;
- INTENTIONAL_ONLY 4.

Los 16 S2 fueron revisados manualmente como temas principales. S0/S1 son clasificación seed y siguen sujetos a revisión editorial progresiva.

## Regla de payload

Para DEFAULT, INFANCIA y ADOLESCENCIA, el cuerpo completo S2 **no debe estar en HTML/payload inicial ni ser prefetch/preload**.

La ruta muestra variante segura. En ADULTEZ, el cuerpo completo se obtiene solo tras una acción explícita.

Esto es protección frente a discovery incidental, no age assurance.

## Evidencia de diseño/seguridad

Se conserva el criterio:
- AEPD: proteger a menores de contenido inadecuado no exige conocer identidad o edad exacta;
- ICO: si no se conoce edad con certeza proporcional al riesgo, pueden aplicarse protecciones base a todos sin infantilizar adultos;
- Comisión Europea/DSA: safety/privacy by design y mitigación de contenido nocivo para menores;
- Samaritans: limitar contenido de autolesión/suicidio potencialmente dañino, especialmente métodos/detalle gráfico/promoción, manteniendo vías de ayuda.

## Gate

Design #302 diseña la nueva capa.

Marcador esperado:
`R42_DESIGN_CONTENT_CHILD_SAFE_READY_FOR_ASTRA_REVIEW`

Después:
Astra → implementación nuevo baseline → A2 preview → HUMAN QA María.

No main/producción.
