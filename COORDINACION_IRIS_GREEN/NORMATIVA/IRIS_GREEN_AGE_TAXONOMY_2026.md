# IRIS GREEN · TAXONOMÍA CANÓNICA DE EDAD · 2026

Fecha: 28/09/2026  
Autoridad: María HUMAN QA / producto  
Estado: `IRIS_GREEN_AGE_TAXONOMY_2026_ADOPTED_GLOBAL`

## 1. Decisión

Iris Green deja de usar como taxonomía de edad, tanto pública como internamente:

- Infancia / INFANCIA
- Adolescencia / ADOLESCENCIA
- Adultez / ADULTEZ
- Cualquier edad / TRANSVERSAL
- children
- teenagers
- adults
- any

cuando esos valores representen el filtro o clasificación de edad.

La clasificación canónica pasa a ser por rangos explícitos.

## 2. IDs internos canónicos

- `AGE_0_12`
- `AGE_13_17`
- `AGE_18_PLUS`
- `ALL_AGES`

`GENERAL` puede existir como estado de interfaz/sesión cuando no se ha elegido un filtro. No es una banda de edad.

## 3. Texto visible

ES:
- 0–12 años
- 13–17 años
- 18 años o más
- Todas las edades

EN:
- Ages 0–12
- Ages 13–17
- Ages 18+
- All ages

## 4. Safety

- `AGE_0_12` → child-safe;
- `AGE_13_17` → adolescent-safe;
- `AGE_18_PLUS` → catálogo adulto; full S2 solo tras acción explícita cuando corresponda;
- `ALL_AGES` → contenido seguro para todas las edades;
- `GENERAL` / sin selección → `SAFE_BY_DEFAULT` interno.

La selección es un filtro de contenido. No es age assurance ni verificación de identidad.

## 5. Alcance

La taxonomía se aplica en:
- Home;
- filtros de audiencia;
- child-safe;
- búsqueda/autocomplete/related/recommendations;
- Condiciones;
- Situaciones;
- Vida diaria;
- Investigación;
- Datos;
- Trámites;
- Recursos;
- Juegos;
- Rutinas;
- Intereses;
- Taller;
- Rincón;
- Sabik;
- retrieval;
- biblioteca Cloud;
- manifests;
- schemas;
- tests;
- exports donde exista clasificación por edad.

## 6. Migración

Durante la migración puede existir una única tabla de compatibilidad desde valores legacy a IDs canónicos.

No se permiten dos taxonomías permanentes.

Los valores legacy no deben volver a emitirse en nuevas salidas como clasificación canónica de edad.

## 7. QA

Los tests deben comprobar:
- 0 nuevas salidas con categorías legacy como clasificación de edad;
- filtros equivalentes ES/EN;
- safety preservado por banda;
- deep links y search respetan la banda seleccionada;
- Cloud/retrieval recibe y devuelve taxonomía canónica;
- `GENERAL` no se confunde con `ALL_AGES`.

No main/producción hasta QA transversal.
