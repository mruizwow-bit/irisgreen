# IRIS GREEN · PAYMENTS FOUNDATION R01

Fecha: 04/10/2026  
Owner funcional: Cifra · Finance & Business Planning  
Proveedor confirmado por María: **Stripe**  
Hosting actual: **Netlify · irisgreen-home · irisgreen.eu**  
Base analizada: `main @ 6b1bf4c753c05f007f9f9ad9e8e7bde4fbf1e86e`

Estado:
`PAYMENTS_FOUNDATION_DESIGN_READY_FOR_IMPLEMENTATION_R01`

## 1. Objetivo

Implantar ahora la infraestructura de pago y suscripción sin decidir todavía qué contenido final será FREE/PLUS.

La arquitectura debe permitir que, más adelante, Producto asigne:
- Recursos;
- Juegos;
- Descubrimiento;
- Creación;
- pase completo;
a uno o varios productos/precios sin reconstruir el sistema de cobro.

## 2. Decisión de arquitectura

Usar:

**Stripe Checkout alojado por Stripe + Stripe Billing + Stripe Customer Portal + Stripe Webhooks + Netlify Functions.**

No construir un formulario propio de tarjeta.

Motivos:
- los datos de tarjeta no pasan por Iris Green;
- menor superficie PCI;
- Checkout maneja autenticación 3DS/SCA;
- soporte para tarjetas y wallets compatibles;
- suscripciones y pagos recurrentes;
- Customer Portal para método de pago, facturas y cancelación;
- webhooks para sincronizar estado;
- mantenimiento técnico bajo.

## 3. Métodos de pago

### Lanzamiento mínimo

Activar mediante Checkout/dynamic payment methods:
- tarjeta de crédito/débito;
- Apple Pay cuando el dispositivo/navegador/cuenta sea compatible;
- Google Pay cuando sea compatible;
- Link.

### Segunda capa opcional

Estudiar después:
- SEPA Direct Debit;
- PayPal, sujeto a aprobación/compatibilidad;
- métodos locales adicionales.

No añadir BNPL/Klarna como default para una suscripción familiar de bajo importe.

## 4. Stripe no es la UI de autorización del producto

Stripe es fuente de verdad para:
- customer;
- checkout session;
- subscription;
- invoices;
- payment status.

Iris Green tendrá posteriormente su propia capa de **entitlements**:
`FREE / RESOURCES / GAMES / DISCOVERY / CREATION / FULL`.

No codificar acceso directamente contra texto de producto o importe.

## 5. Contrato de planes

El navegador nunca envía:
- importe;
- moneda;
- Price ID arbitrario.

Solo envía un slug permitido, por ejemplo:
- `resources_monthly`;
- `resources_annual`;
- `games_monthly`;
- `games_annual`;
- `discovery_monthly`;
- `discovery_annual`;
- `creation_monthly`;
- `creation_annual`;
- `full_monthly`;
- `full_annual`.

Server-side:
`PLAN_SLUG → STRIPE_PRICE_ID`.

Así un usuario no puede cambiar el precio desde DevTools.

## 6. Variables secretas Netlify

No incluir secretos en GitHub.

Preparar variables de entorno de runtime:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_RESOURCES_MONTHLY`
- `STRIPE_PRICE_RESOURCES_ANNUAL`
- `STRIPE_PRICE_GAMES_MONTHLY`
- `STRIPE_PRICE_GAMES_ANNUAL`
- `STRIPE_PRICE_DISCOVERY_MONTHLY`
- `STRIPE_PRICE_DISCOVERY_ANNUAL`
- `STRIPE_PRICE_CREATION_MONTHLY`
- `STRIPE_PRICE_CREATION_ANNUAL`
- `STRIPE_PRICE_FULL_MONTHLY`
- `STRIPE_PRICE_FULL_ANNUAL`
- `STRIPE_TAX_ENABLED` = false hasta gate Lex/asesoría

Situación verificada 04/10/2026:
el proyecto Netlify `irisgreen-home` no tiene actualmente env vars configuradas mediante la integración disponible.

## 7. Netlify Functions

Implementar:

### POST /api/payments/checkout

Input:
`{ "plan": "<ALLOWLIST_SLUG>", "locale": "es|en" }`

Responsabilidad:
- validar plan;
- resolver Price ID server-side;
- crear Checkout Session en `mode=subscription`;
- usar success/cancel URL de irisgreen.eu;
- activar automatic/dynamic payment methods compatibles;
- no confiar en amount del cliente;
- devolver solo URL/session pública necesaria.

### POST /api/payments/portal

Responsabilidad:
- crear sesión temporal de Customer Portal;
- return URL a Iris Green;
- requiere customer Stripe autenticado/identificado.

No implementar acceso inseguro solo con email enviado por el navegador.

### POST /api/payments/webhook

Responsabilidad:
- leer raw body;
- verificar `Stripe-Signature` con `STRIPE_WEBHOOK_SECRET`;
- procesar idempotentemente eventos permitidos;
- responder 2xx rápido;
- no registrar datos de tarjeta/PII innecesaria.

Eventos mínimos:
- `checkout.session.completed`;
- `customer.subscription.created`;
- `customer.subscription.updated`;
- `customer.subscription.deleted`;
- `invoice.paid`;
- `invoice.payment_failed`.

### GET /api/payments/session

Uso post-checkout:
- verificar `CHECKOUT_SESSION_ID`;
- mostrar estado seguro de confirmación;
- nunca conceder acceso solo porque la URL contiene `success=true`.

## 8. Success / cancel

Crear páginas:

- `/es/pago/completado/`
- `/es/pago/cancelado/`
- `/en/payment/success/`
- `/en/payment/cancelled/`

Success:
- confirmar contra server;
- no revelar datos sensibles;
- indicar siguiente paso.

Cancel:
- volver al sitio sin penalización;
- no usar copy de presión.

## 9. Customer Portal

Stripe Customer Portal permitirá:
- actualizar método de pago;
- consultar facturas;
- descargar facturas;
- cancelar suscripción;
- aplicar cambios permitidos.

No construir estas funciones desde cero salvo necesidad posterior.

## 10. Estado de suscripción / entitlement

Estados relevantes Stripe:
- active;
- trialing, si algún día existe trial;
- past_due;
- unpaid;
- canceled;
- incomplete / incomplete_expired.

La política de acceso deberá definirse explícitamente.

Propuesta provisional:
- `active` → acceso;
- `trialing` → acceso si el producto usa trial;
- `past_due` → grace period controlado, no bloqueo instantáneo;
- `canceled` con periodo aún vigente → acceso hasta `current_period_end`;
- `unpaid/incomplete_expired` → sin acceso premium.

Gate final: María + Cifra + Lex.

## 11. Identidad

La web actual no tiene sistema de login/cuenta detectado en `main`.

Por tanto, separar:

### Payments R01
Cobro, suscripción, portal y webhook.

### Identity/Entitlements R02
Vincular un usuario adulto de Iris Green con:
- `stripe_customer_id`;
- `subscription_id`;
- entitlement(s).

No usar email sin verificar como sistema de autenticación.

No crear cuentas infantiles para cobrar.

## 12. Persistencia

Stripe = fuente de verdad financiera.

Iris Green necesita una vista mínima de entitlement para no consultar Stripe en cada asset/request.

Opciones:
- Netlify Blobs como materialización ligera inicial;
- base de datos si la identidad/perfiles crece.

El diseño debe permitir migración sin cambiar Stripe IDs.

## 13. Seguridad

Obligatorio:
- secret key solo server-side;
- webhook signature verification;
- allowlist de planes;
- idempotencia por Stripe event ID;
- nunca almacenar PAN/CVC;
- no loguear payloads completos si contienen PII;
- HTTPS;
- rate limiting / abuse controls según implementación;
- separar test/live keys;
- no mezclar eventos test/live;
- principio mínimo privilegio;
- CSP revisada al añadir Stripe/redirects si aplica.

## 14. Modo prueba

Antes de producción:
1. Stripe test mode;
2. crear productos/precios test;
3. checkout normal;
4. 3DS/SCA;
5. tarjeta rechazada;
6. pago recurrente correcto;
7. invoice.payment_failed;
8. actualización de tarjeta;
9. cancelación al final de periodo;
10. cancelación inmediata si se permite;
11. webhook duplicado;
12. webhook fuera de orden;
13. reembolso;
14. retorno ES/EN;
15. teclado/lector de pantalla;
16. móvil.

No activar live mode hasta PASS.

## 15. Fiscalidad / consumidor

No activar `automatic_tax` ni publicar claim de impuestos sin gate de Lex + asesoría.

Revisar antes de live:
- IVA aplicable;
- consumidor UE/España;
- precio mostrado con impuestos cuando corresponda;
- renovación automática;
- información precontractual;
- cancelación;
- desistimiento / contenido digital;
- reembolsos;
- factura/recibo;
- menores y purchaser adulto;
- privacidad y tratamiento de email/datos de facturación.

## 16. Accesibilidad

Axioma debe validar:
- botón comprar;
- estado loading/error;
- retorno desde Stripe;
- foco;
- nombre accesible;
- contraste;
- idioma;
- zoom/reflow;
- teclado;
- reduced motion;
- mensajes de error;
- que el usuario entienda que sale temporalmente a Stripe.

## 17. Observabilidad

Vigía:
- event ID;
- event type;
- timestamp;
- result;
- correlation/session ID no sensible;
- error code;
- no PAN/CVC;
- no payloads completos por defecto.

Alertas:
- webhook failures;
- payment failures anómalos;
- mismatch de Price ID;
- entitlement sync errors.

## 18. Responsabilidades

### Cifra
- productos/precios;
- periodicidad;
- unit economics;
- refunds/discount economics;
- reconciliation Stripe → ingresos;
- métricas.

### Vector
- integración web;
- CTA;
- páginas success/cancel/manage;
- routing/release.

### Nexo
- arquitectura de continuidad del sistema de pagos;
- fallos, recuperación y contrato E2E.

### Vigía
- observabilidad, privacidad de logs y evidencia.

### Lex
- consumidor, suscripción, menores, privacidad, fiscalidad con asesoría.

### Axioma
- accesibilidad y QA del flujo.

### María
- pricing, política comercial, HUMAN QA y live gate.

## 19. Fuentes verificadas 04/10/2026

Stripe Checkout:
https://docs.stripe.com/payments/checkout

Stripe Subscriptions:
https://docs.stripe.com/billing/subscriptions/build-subscriptions

Stripe Customer Portal:
https://docs.stripe.com/customer-management

Stripe Webhooks:
https://docs.stripe.com/webhooks

Stripe payment methods:
https://docs.stripe.com/payments/payment-methods/integration-options

Stripe pricing Spain:
https://stripe.com/es/pricing

## 20. Gate

`PAYMENTS_TEST_MODE_E2E_PASS`
antes de:
`PAYMENTS_LIVE_MODE_AUTHORIZED_BY_MARIA`.

No deploy live ni cobros reales durante la preparación técnica.
