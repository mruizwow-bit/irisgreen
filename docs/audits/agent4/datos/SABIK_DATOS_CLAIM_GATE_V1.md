# SABIK_DATOS_CLAIM_GATE_V1

## Regla

Una ficha puede recibir `VERIFICADA` solo si todas sus afirmaciones cuantitativas relevantes:
1. tienen fuente recuperable;
2. conservan el tipo de medida original;
3. mantienen población, territorio y periodo;
4. distinguen periodo de datos, recogida y publicación;
5. conservan intervalo/incertidumbre cuando la fuente lo aporta y es relevante;
6. no presentan un cálculo derivado sin numerador, denominador y fórmula;
7. no fuerzan comparabilidad internacional;
8. no requieren corrección de valor, fuente o metadato que cambie el significado.

Decisiones claim:
- `VERIFICADO`
- `VERIFICADO_SECUNDARIA_JUSTIFICADA`
- `REQUIERE_CORRECCION`
- `HISTORICO_CONSERVAR`

Estados ficha:
- `VERIFICADA`
- `EN_REVISIÓN`
- `HISTÓRICA`
- `SUSTITUIDA`

Las fuentes antiguas se conservan cuando la intención de la ficha es histórica o de referencia.
