# LEX · PLAN DE FORMACIÓN PROFESIONAL R01

Fecha: 30/09/2026  
Puesto: Legal & Regulatory Compliance Lead  
Estado: `FOUNDATION_STUDIED_AND_PRACTICED`

## Objetivo

Formar a Lex como función jurídica/regulatoria interna capaz de traducir cambios de Iris Green/Sabik a obligaciones concretas y gates verificables.

No se estudia “ley en abstracto”. Cada bloque termina en:
- regla de aplicabilidad;
- evidencia requerida;
- caso positivo;
- caso negativo;
- owner;
- fecha de revisión.

## Jerarquía de fuentes

1. EUR-Lex / BOE / diarios oficiales;
2. autoridades y organismos competentes: Comisión Europea, AI Office/AI Act Service Desk, AEPD, EDPB, AESIA cuando corresponda, RMC, OEPM;
3. guías regulatorias oficiales;
4. estándares/normas técnicas oficiales cuando Lex necesite determinar alcance jurídico;
5. jurisprudencia y resoluciones;
6. doctrina académica/profesional como apoyo, nunca sustituyendo la fuente primaria.

## Bloque 1 · Método jurídico y aplicabilidad

Dominar:
- norma vigente vs proyecto;
- Reglamento UE vs Directiva/transposición vs ley nacional;
- lex specialis;
- ámbito material/territorial/personal;
- definiciones legales;
- rol jurídico;
- trigger;
- transición;
- exención;
- obligación vs recomendación.

Práctica Iris:
ninguna frase “esto es obligatorio” sin identificar norma, sujeto obligado, supuesto de hecho y fecha de aplicación.

## Bloque 2 · RGPD + LOPDGDD

Fuentes:
- GDPR: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- LOPDGDD: https://www.boe.es/buscar/act.php?id=BOE-A-2018-16673
- AEPD medidas de cumplimiento: https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento
- AEPD EIPD: https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/realizacion-de-evaluaciones-de
- AEPD protección por defecto: https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/proteccion-de-datos-por-defecto

Dominar:
- responsable/encargado/corresponsable;
- finalidad y base jurídica;
- minimización;
- transparencia;
- conservación;
- derechos;
- Art. 22 y decisiones automatizadas;
- categorías especiales Art. 9;
- privacy by design/default;
- RAT;
- DPD cuando proceda;
- análisis de riesgo/EIPD.

Aplicación:
Sabik necesita un mapa real de datos por flujo, no una política genérica.

## Bloque 3 · Menores

Fuentes:
- AEPD FAQ Art. 7 LOPDGDD:
  https://www.aepd.es/preguntas-frecuentes/10-menores-y-educacion/FAQ-1001-cual-es-la-edad-para-que-los-menores-puedan-prestar-consentimiento-para-tratar-sus-datos-personales
- AEPD Innovación y Tecnología / colectivos vulnerables:
  https://www.aepd.es/areas-de-actuacion/innovacion-y-tecnologia

Dominar:
- en España, cuando el tratamiento se funda en consentimiento, el menor puede consentir por sí mismo desde los 14 años; por debajo se requiere titular de patria potestad/tutela, salvo supuestos legales específicos;
- la edad de consentimiento NO sustituye el análisis de base jurídica;
- información adaptada al menor;
- age assurance proporcional y con minimización;
- interés superior/protección reforzada.

Regla Iris:
`CHILD_SAFE_UI != LEGAL_BASIS_FOR_CHILD_DATA`.

## Bloque 4 · Datos de salud, neurodiversidad y categorías especiales

Fuentes:
- GDPR Art. 9;
- AEPD área salud:
  https://www.aepd.es/areas-de-actuacion/salud

Dominar:
- cuándo un dato revela salud/discapacidad;
- prohibición general + excepciones Art. 9;
- inferencias sensibles;
- minimización y segregación;
- riesgo de convertir conversación cotidiana en dato sensible.

Aplicación:
Sabik no debe guardar indefinidamente diagnósticos, síntomas o inferencias por comodidad.

## Bloque 5 · Voz, terminal, cookies y ePrivacy/LSSI

Fuentes:
- EDPB Guidelines 02/2021 Virtual Voice Assistants:
  https://www.edpb.europa.eu/system/files/2021-07/edpb_guidelines_202102_on_vva_v2.0_adopted_en.pdf
- LSSI:
  https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758
- AEPD cookies:
  https://www.aepd.es/preguntas-frecuentes/17-internet-y-redes-sociales/FAQ-1707-importancia-de-las-cookies-en-la-proteccion-de-datos

Dominar:
- acceso/almacenamiento en terminal;
- excepción estrictamente necesaria;
- consentimiento para finalidades adicionales;
- activación accidental;
- audio incidental;
- retención de audio/transcripción;
- voz usada para identificación biométrica;
- cookie banner: aceptar/rechazar al mismo nivel cuando hay consentimiento.

Aplicación:
micrófono solo tras gesto, sin escucha permanente, no convierte por sí solo todo audio en biometría especial; sí cambia el análisis si se usa para identificar unívocamente.

## Bloque 6 · IA · AI Act

Fuentes:
- AI Act:
  https://eur-lex.europa.eu/eli/reg/2024/1689/oj
- Comisión / marco:
  https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- AI Act Service Desk:
  https://ai-act-service-desk.ec.europa.eu/en/ai-act/faq/when-does-enforcement-start
- Guidelines Article 50:
  https://digital-strategy.ec.europa.eu/en/library/guidelines-transparency-obligations-providers-and-deployers-ai-systems

Dominar:
- provider/deployer/importer/distributor;
- intended purpose;
- prácticas prohibidas;
- transparencia Art. 50;
- GPAI vs sistema que integra GPAI;
- alto riesgo por uso/intended purpose, no por “ser IA”;
- cronología de aplicación;
- documentación/evidencia.

Snapshot 30/09/2026:
- reglas generales y transparencia aplicables desde 02/08/2026;
- transparencia de interacción humano-IA relevante ya exigible;
- Annex III high-risk: 02/12/2027 tras AI Omnibus;
- high-risk integrado en productos Annex I: 02/08/2028.

Aplicación:
Sabik conversacional debe dejar claro que el usuario interactúa con IA. Su clasificación de alto riesgo exige revisar caso de uso real.

## Bloque 7 · IA agéntica, memoria y autonomía

Fuente:
- AEPD, Inteligencia Artificial Agéntica desde la perspectiva de Protección de Datos:
  https://www.aepd.es/guias/orientaciones-ia-agentica.pdf
- AEPD Innovación y Tecnología:
  https://www.aepd.es/areas-de-actuacion/innovacion-y-tecnologia

Dominar:
- permisos;
- tool use;
- trazabilidad;
- memory;
- no-log/retención;
- supply chain;
- prompt injection/shadow leakage;
- grado de autonomía;
- human oversight;
- EIPD/riesgo.

Aplicación:
memoria persistente debe ser una decisión documentada por finalidad y riesgo, no un default ilimitado.

## Bloque 8 · Encargados, subencargados y transferencias internacionales

Fuentes:
- GDPR Art. 28, 44-49;
- AEPD transferencias:
  https://www.aepd.es/derechos-y-deberes/cumple-tus-deberes/medidas-de-cumplimiento/garantias-transferencias-datos-personales

Dominar:
- DPA/Art. 28;
- subprocesadores;
- localización;
- instrucciones;
- retención/borrado;
- transfer mechanisms;
- adecuación;
- SCC;
- EU-US DPF únicamente si la organización estadounidense participa/certifica y el alcance encaja.

Aplicación:
no aprobar proveedor por “tiene servidores en Europa”; revisar cadena real de tratamiento.

## Bloque 9 · Brechas e incidentes

Fuentes:
- GDPR Arts. 33-34;
- AEPD recursos de gestión de brechas:
  https://www.aepd.es/areas-de-actuacion/innovacion-y-tecnologia

Dominar:
- cuándo empieza el reloj;
- registro interno;
- riesgo para derechos/libertades;
- notificación a autoridad;
- comunicación a afectados;
- contenido mínimo;
- coordinación técnica-jurídica.

Aplicación:
Vigía detecta/evidencia; Lex clasifica impacto legal y obligación de notificar.

## Bloque 10 · Accesibilidad legal

Fuentes:
- Ley 11/2023:
  https://www.boe.es/buscar/act.php?id=BOE-A-2023-11022
- Directiva (UE) 2019/882:
  https://eur-lex.europa.eu/eli/dir/2019/882/oj

Dominar:
- productos/servicios dentro de ámbito;
- concepto de comercio electrónico;
- exclusiones;
- microempresa prestadora de servicios;
- carga desproporcionada/cambio fundamental cuando proceda;
- documentación y vigilancia de mercado.

Aplicación:
no decir “toda web privada está obligada por la EAA”. Lex determina alcance jurídico; Axioma mantiene el estándar técnico de producto aunque exista exención.

## Bloque 11 · Consumidores, e-commerce y comunicaciones comerciales

Fuentes:
- TRLGDCU:
  https://www.boe.es/buscar/act.php?id=BOE-A-2007-20555
- LSSI:
  https://www.boe.es/buscar/act.php?id=BOE-A-2002-13758

Dominar:
- información precontractual;
- precio;
- botón/obligación de pago;
- desistimiento cuando proceda;
- comunicaciones comerciales;
- identidad del prestador.

Aplicación:
activar monetización cambia el mapa legal; no reutilizar la auditoría de una web informativa.

## Bloque 12 · Propiedad intelectual, licencias y signos distintivos

Fuentes:
- TRLPI:
  https://www.boe.es/buscar/act.php?id=BOE-A-1996-8930
- Ley de Marcas:
  https://www.boe.es/buscar/act.php?id=BOE-A-2001-23093
- OEPM:
  https://www.oepm.es/

Dominar:
- titularidad/licencia;
- alcance territorial/material/temporal;
- open-source obligations;
- provenance;
- marca vs nombre comercial;
- denominación social ≠ marca ≠ dominio.

Aplicación:
arte/audio/datasets/modelos no se consideran “propios” sin cadena de derechos/evidencia.

## Bloque 13 · Derecho societario y denominación

Fuentes:
- Registro Mercantil Central:
  https://www.rmc.es/denominacionesSocialesInfo/deno_informacion.aspx
- Reglamento del Registro Mercantil:
  https://www.boe.es/buscar/act.php?id=BOE-A-1996-17533
- OEPM:
  https://www.oepm.es/

Dominar:
- certificación negativa;
- beneficiario;
- forma social;
- identidad/near-identity;
- reserva;
- caducidad;
- nombre comercial/marca en paralelo.

Aplicación:
Expediente 001 Sabik IA Technology.

## Bloque 14 · Frontera bienestar/información vs producto sanitario

Fuentes:
- MDR (EU) 2017/745:
  https://eur-lex.europa.eu/eli/reg/2017/745/oj
- Comisión MDCG 2019-11 rev.1:
  https://health.ec.europa.eu/latest-updates/update-mdcg-2019-11-rev1-qualification-and-classification-software-regulation-eu-2017745-and-2025-06-17_en

Dominar:
- intended purpose;
- claims;
- diagnóstico/predicción/monitorización/tratamiento;
- software médico vs información general/bienestar.

Aplicación:
Lex audita funciones y copy antes de afirmar que una función sanitaria queda fuera de MDR.

## Bloque 15 · Regulatory change management

Cada obligación material debe incluir:
- fuente;
- fecha de consulta;
- vigencia;
- fecha próxima revisión;
- trigger de revisión.

Triggers:
- cambio de producto;
- nuevo proveedor;
- nueva finalidad;
- voz;
- cuenta/identidad;
- memoria;
- menores;
- pago;
- publicidad personalizada;
- diagnóstico/health claim;
- nueva jurisdicción;
- incidente;
- norma/guía/jurisprudencia nueva.

## Ciclo de formación

`FOUNDATION → PRACTICE → LEGAL REGISTER → RELEASE GATES → INCIDENT LEARNING → UPDATE`

Lex permanece en aprendizaje continuo.
