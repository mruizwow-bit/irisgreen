# R39-A3-CONTINUIDAD-R06 · única acción humana autenticada

Esta acción existe únicamente porque las herramientas de A3 no heredan la sesión Netlify Team Login de María. No es una nueva autorización ni una investigación de login.

## Preparación

Abrir, en el navegador donde Netlify Team Login ya funciona:

- Web: https://deploy-preview-244--irisgreen-home.netlify.app/
- La ventana privada Cloud que Sabik abre debe permanecer abierta durante las consultas.

No copiar cookies, Authorization, claves, tokens ni contenido privado.

## Cinco casos reales

1. **Resultados/fuentes · ES**  
   Consultar: `sobrecarga sensorial`.  
   Comprobar: aparecen resultados, una fuente por URL y extractos; no aparece ID/version/hash como texto visible.

2. **Vacío · ES**  
   Consultar: `qzxvunknownterm`.  
   Comprobar: mensaje de cero resultados y posibilidad de continuar.

3. **Cancelar/sustituir · ES**  
   Lanzar `sensorial`, pulsar **Cancelar consulta** mientras esté activa y, acto seguido, consultar `apoyos`.  
   Comprobar: el resultado anterior no reaparece ni sustituye al nuevo.

4. **Error recuperable controlado**  
   Con la ventana Cloud abierta, usar DevTools > Network > Offline durante una nueva consulta sintética.  
   Comprobar: mensaje recuperable, no stack/causa privada. Volver a Online y reintentar; debe recuperarse.  
   No cambiar variables, Team Login ni configuración de plataforma.

5. **UI EN + citas ES**  
   Cambiar la web a English y consultar `sobrecarga sensorial`.  
   Comprobar en consola de la web:
   ```js
   ({
     ui: document.documentElement.lang,
     citationLang: document.querySelector('.sabik-retrieval-citation')?.getAttribute('lang') || null,
     state: document.querySelector('#sabik-results')?.dataset.retrievalState || null
   })
   ```
   Esperado: `ui: "en"`, `citationLang: "es"`.

## Correlación HTTP saneada

Tras una consulta real con resultado, en la consola de la **ventana privada Cloud** ejecutar únicamente:

```js
({
  status: document.documentElement.dataset.n04Status || null,
  contentType: document.documentElement.dataset.n04ContentType || null,
  codeHead: document.documentElement.dataset.n04CodeHead || null,
  libraryDeploy: document.documentElement.dataset.n04LibraryDeploy || null
})
```

Enviar a A3 solo ese objeto y el resultado de los cinco casos. No enviar consulta, cuerpo JSON, cookies, Authorization ni clave QA.

## Evidencia esperada

A3 validará:
- status de aplicación;
- Content-Type JSON;
- codeHead de 40 hex;
- libraryDeploy de 24 hex y correspondencia con R38 sellado;
- comportamiento ES/EN del panel;
- ausencia de stale results;
- recuperación tras error.

Con esa evidencia se decide `MONTADO_CONECTADO_REAL` o el defecto concreto siguiente.
