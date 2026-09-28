# IRIS GREEN · TOKENS VISUALES GLOBALES · 2026

Fecha: 28/09/2026  
Autoridad: María  
Estado: `IRIS_GREEN_GLOBAL_UI_TOKENS_2026_ADOPTED`

## 1. Regla principal

Iris Green NO tendrá una página de cada color.

Ningún agente, carril o sección elige su propia paleta de interfaz.

Home, Condiciones, Situaciones, Vida diaria, Investigación, Datos, Trámites,
Recursos, Juegos, Rutinas, Taller, Intereses, Sabik y el shell de Rincón
consumen los MISMOS tokens globales.

La variación visual procede del contenido/arte/escena, no de cambiar el sistema
de interfaz en cada ruta.

## 2. Temas globales, no temas por página

Se permiten dos familias coherentes de baja estimulación:

### LIGHT
Se aplica globalmente cuando el tema claro está activo.

### DARK NAVY
Se aplica globalmente cuando el tema oscuro está activo.

Una ruta NO puede decidir por sí misma pasar de LIGHT a DARK o viceversa.

Si existe selector/preferencia de tema, cambia el sistema completo, no una sola
sección.

Excepción: un stage/escena inmersiva puede contener su propia imagen, vídeo,
3D o iluminación. El chrome y la navegación siguen consumiendo tokens
canónicos.

## 3. Tokens LIGHT canónicos

```css
--ig-bg-page:            #F6F8FB;
--ig-bg-surface:         #F4F7FA;
--ig-bg-surface-soft:    #EEF2F6;

--ig-text:               #17395C;
--ig-text-muted:         #435268;

--ig-button-primary-bg:  #17395C;
--ig-button-primary-fg:  #EEF4F8;

--ig-button-secondary-bg:#E6F1F8;
--ig-button-secondary-fg:#17395C;

--ig-link:               #1F5F8B;
--ig-accent:             #5A49A8;
--ig-accent-secondary:   #197991;

--ig-border-control:     #7A869D;
--ig-separator:          #D5E1EC;
--ig-focus:              #5A49A8;

--ig-error:              #8A2942;
--ig-success:            #1D6B3A;
```

Regla:
`#FFFFFF` NO es superficie extensa del tema LIGHT.

## 4. Tokens DARK NAVY canónicos

```css
--ig-bg-page:            #0B1A2B;
--ig-bg-surface:         #15304A;
--ig-bg-surface-soft:    #1D3D5C;

--ig-text:               #EEF4F8;
--ig-text-muted:         #C9D5DD;

--ig-button-primary-bg:  #DCE8F2;
--ig-button-primary-fg:  #0B1A2B;

--ig-button-secondary-bg:#15304A;
--ig-button-secondary-fg:#EEF4F8;

--ig-link:               #9FDCEA;
--ig-accent:             #C3B8FF;
--ig-accent-secondary:   #9FDCEA;

--ig-border-control:     #8494A8;
--ig-separator:          #2A4460;
--ig-focus:              #C3B8FF;

--ig-error:              #FFB3C1;
--ig-success:            #9BE0B4;
```

Regla:
`#000000` NO es fondo general del tema DARK.

## 5. Semántica única

Todos los componentes usan nombres semánticos, no colores escritos a mano.

Ejemplos:
- body → `--ig-bg-page`
- tarjeta/panel → `--ig-bg-surface`
- superficie secundaria → `--ig-bg-surface-soft`
- texto → `--ig-text`
- texto secundario → `--ig-text-muted`
- botón principal → `--ig-button-primary-*`
- botón secundario → `--ig-button-secondary-*`
- enlaces → `--ig-link`
- foco → `--ig-focus`
- bordes funcionales → `--ig-border-control`

Prohibido crear:
- `--taller-background`
- `--intereses-card-color`
- `--resources-button-blue`
- equivalentes por sección

si representan la misma función visual.

## 6. Arte ≠ interfaz

Las escenas/ilustraciones pueden tener sus propios colores.

Ejemplos:
- una mini-escena R54;
- un terrario;
- un mundo submarino;
- una fotografía;
- un gráfico;
- una experiencia inmersiva.

Eso NO autoriza a cambiar:
- fondo de página;
- tarjeta;
- header;
- botones;
- inputs;
- paneles;
- diálogos;
- texto;
- foco;
- navegación.

## 7. Taller R54

KEEP:
- arte aprobado 6/6.

El launcher final debe consumir estos tokens globales.

Ni:
- el tema oscuro de la página interna de QA de Claude;
ni:
- tarjetas `#FFFFFF` de A2;

son por sí solos especificación final.

El chasis de las tarjetas, fondo del launcher, botones, filtros y texto deben
salir exclusivamente del sistema global.

## 8. Rincón

Rincón puede mostrar stages oscuros o inmersivos.

Eso no convierte Rincón en otro design system.

Su chrome usa los mismos tokens DARK NAVY globales.

## 9. Prohibición de hardcodes de producto

Gate nuevo:

- barrer CSS/JS/HTML por colores hardcodeados;
- cada uso debe ser:
  1. token global;
  2. color propio de asset/arte;
  3. forced-colors/print;
  4. excepción documentada.

Un color hardcodeado de interfaz sin excepción = FAIL.

## 10. Migración

Crear una sola hoja/tokens fuente.

Los aliases legacy:
- `--papel`;
- `--niebla`;
- `--ig-surface-content`;
- `--ig-chrome-solid-light`;
- `--ig-chrome-solid-dark`;
- etc.

pueden mapear temporalmente a los nuevos tokens.

No mantener dos paletas paralelas como estado final.

## 11. QA

Comprobar en la misma preview:

- Home
- CONTENT
- BROWSE
- Taller
- Intereses
- Juegos
- Sabik
- Rincón shell

en:
- LIGHT;
- DARK NAVY;
- 1440;
- 390;
- ES;
- EN.

FAIL si cambiar de sección parece cambiar de web.

Marcador:
`IRIS_GREEN_GLOBAL_VISUAL_TOKENS_UNIFIED_GATE`

No main/producción hasta HUMAN QA.
