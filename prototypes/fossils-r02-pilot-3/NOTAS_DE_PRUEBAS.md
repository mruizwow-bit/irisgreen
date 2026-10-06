# Notas de pruebas · Prisma Fósiles R02 piloto 3

## QA de navegador obligatoria

El workflow de esta rama ejecuta Playwright/Chromium sobre el paquete ya preparado antes de crear el ZIP final.

Debe cubrir:
- trilobite por ratón directo;
- Dimetrodon por alternativa de puntero sin drag;
- Meganeura por controles DOM/teclado;
- R01 objetivo fuera de vista;
- R02 punto de teclado limitado a escena visible;
- R04 idioma conserva modo;
- R05 acción local conserva coordenada seleccionada;
- R06 selector de movimiento ausente;
- pointercancel no confirma una acción;
- diálogo y retorno de foco;
- 320/390/1440;
- texto al 200 %;
- targets visibles ≥44 px;
- cero peticiones externas al cargar.

## Lo que este banco no sustituye

- lector de pantalla real;
- teléfono físico;
- Safari / Firefox;
- juicio de producto de Axioma;
- HUMAN QA de María;
- validación científica completa de los otros once fósiles.

## Regiones

Las regiones de los tres pilotos se documentan en `REGIONES_QA.md` y `qa/*.svg`.
Los WebP originales no contienen overlays ni etiquetas nuevas.
