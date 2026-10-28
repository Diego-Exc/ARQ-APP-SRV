# ADR 003: Estrategia de Comunicación

- **Estado:** Aceptado
- **Fecha:** 2026-10-28
- **Decisores:** Equipo del proyecto
- **Relacionado con:** [ADR 001: Selección de Estilo Arquitectónico](0001-monolito-modular.md), [ADR 002: Estructura Interna del repositorio](0002-estructura-interna-repositorio.md)

## Contexto

ArreglaPues expone un mismo backend (monolito modular, ADR-0001) a tres clientes distintos — app cliente, app profesional y panel de administración — y depende de integraciones externas simuladas en el MVP académico (proveedor de IA, pasarela de pagos, mapas/geolocalización, notificaciones push). Dentro del backend, los 12 módulos de dominio (identity, requests, matching, diagnosis, pricing, payments, service_lifecycle, ratings, notifications, catalog, profiles, admin) están organizados con arquitectura hexagonal y límites explícitos (ADR-0002).

Esta decisión debe responder tres preguntas de comunicación distintas, que no tienen por qué resolverse con la misma tecnología:

1. **Cliente ↔ API:** cómo consumen las tres aplicaciones la API del backend.
2. **Backend ↔ sistemas externos:** cómo se integran la IA, la pasarela de pagos, los mapas y las notificaciones.
3. **Módulo ↔ módulo (dentro del monolito):** cómo colaboran los módulos de dominio entre sí sin violar los límites definidos en el ADR-0002.

El sistema tiene además flujos con requisitos de comunicación diferentes: operaciones transaccionales de solicitud/respuesta (crear solicitud, confirmar pago) frente a actualizaciones en tiempo real (seguimiento del servicio, ubicación del técnico, ofertas de matching), y confirmaciones asíncronas de terceros (pasarela de pagos), como ya anticipan los escenarios de calidad U2 (seguimiento del estado del servicio) y S2/R1 (integridad de pago e indisponibilidad de IA) definidos en el documento de atributos de calidad.

## Decisión

Se adopta una **estrategia de comunicación híbrida**, diferenciada por tipo de interacción:

| Interacción | Modo | Tecnología | Justificación breve |
|---|---|---|---|
| Cliente (apps/web) ↔ API | Síncrono, petición/respuesta | **REST sobre HTTPS** | Operaciones CRUD y de negocio bien delimitadas, consumo simple desde React Native y web, cacheable y ampliamente soportado |
| Actualizaciones en tiempo real (estado del servicio, ubicación del técnico, ofertas de matching) | Asíncrono, push bidireccional | **WebSocket** | Evita *polling*; cumple la medida de respuesta del escenario U2 (actualización visible en cliente ≤ 5 s) |
| Confirmación de pago desde la pasarela | Asíncrono, callback | **Webhook** | Patrón estándar de las pasarelas de pago (Wompi, PayU, Stripe); el backend no controla cuándo responde el proveedor |
| Módulo ↔ módulo dentro del backend | Síncrono (caso de uso directo) + eventos de dominio en memoria para efectos secundarios | **Llamadas in-process a través de puertos** (ADR-0002) + **bus de eventos de dominio en memoria** (publicación/suscripción síncrona dentro del mismo proceso) | El flujo principal (p. ej. confirmar pago) se resuelve por llamada directa; los efectos secundarios desacoplados (notificar, habilitar calificación, actualizar historial) se publican como eventos para no acoplar módulos entre sí |

La comunicación cliente↔API se versiona desde el primer endpoint (`/v1`) para permitir cambios no retrocompatibles sin romper clientes móviles ya publicados, un riesgo propio de apps que no se actualizan de forma inmediata.

## Justificación

- **Alineación con ADR-0001 y ADR-0002:** mientras el backend sea un monolito modular, no existe una frontera de red real entre módulos; introducir gRPC o mensajería externa entre ellos añadiría complejidad de infraestructura sin beneficio, contradiciendo el criterio de "sin el costo operativo de una distribución" del ADR-0001. El bus de eventos en memoria respeta los límites de bounded context del ADR-0002 (un módulo no invoca directamente el repositorio interno de otro) y queda listo para sustituirse por un bróker real (p. ej. RabbitMQ) si en el futuro se extrae un módulo como servicio independiente.
- **Atributo de calidad — Usabilidad (escenario U2):** el seguimiento del servicio requiere actualizaciones visibles en ≤ 5 s; un REST con *polling* frecuente desperdicia batería/datos móviles y no garantiza esa latencia con el mismo costo que un canal push como WebSocket.
- **Atributo de calidad — Confiabilidad (escenarios R1, R2, S2):** los webhooks de pago exigen idempotencia (no duplicar el cobro ante reintentos del proveedor) y verificación de firma; el bus de eventos en memoria permite que un fallo en un *listener* (p. ej. notificaciones) no revierta la transacción principal del módulo payments.
- **Atributo de calidad — Mantenibilidad (escenarios M1, M2):** un contrato REST documentado (OpenAPI) y eventos de dominio tipados limitan el impacto de cambios a los módulos que realmente participan en cada flujo, sin exigir coordinación de despliegue entre clientes y backend en cada cambio interno.

## Alternativas consideradas

1. **SOAP para la API cliente↔backend.** Descartado: protocolo pensado para integración empresarial con WSDL/XML, sin ventaja para clientes móviles modernos; tooling más pesado y menor soporte nativo en React Native.
2. **GraphQL para la API cliente↔backend.** Descartado para el MVP: las pantallas de las tres aplicaciones están bien definidas y no requieren composición flexible de consultas; GraphQL añadiría un servidor de resolución de esquema y nuevos riesgos de seguridad (control de profundidad de consultas) sin beneficio proporcional. Se reconsiderará si el panel de administración necesita consultas agregadas y flexibles sobre múltiples módulos.
3. **gRPC para comunicación módulo↔módulo o cliente↔backend.** Descartado en esta etapa: su valor aparece en comunicación servicio-a-servicio de alto rendimiento con contratos `.proto` estrictos entre procesos distintos; dentro de un monolito sin fronteras de red entre módulos no hay proceso remoto que justificarlo. Queda como candidato natural si, conforme al ADR-0001, se extrae en el futuro un módulo (p. ej. `payments` o `matching`) como servicio independiente.
4. **Mensajería externa real (RabbitMQ/Kafka) desde el MVP.** Descartada por sobrecosto operativo (infraestructura adicional, observabilidad, curva de aprendizaje) no justificado para un equipo de 2 integrantes en alcance académico; el bus de eventos en memoria cubre la necesidad de desacoplamiento actual y es sustituible sin reescribir reglas de negocio de dominio.
5. **Polling periódico en lugar de WebSocket para el seguimiento del servicio.** Descartado: no cumple de forma eficiente la medida de respuesta del escenario U2 y genera consumo innecesario de batería y datos móviles en las apps cliente y profesional.

## Definición de contratos de comunicación

- **REST (cliente ↔ API):** contrato definido con **OpenAPI 3.0**, mantenido como fuente única de verdad en `docs/api/openapi.yaml` (pendiente de generar en la fase de implementación). El contrato se versiona junto con el código y antecede a la implementación de cada endpoint (diseño *contract-first*).
- **WebSocket (eventos en tiempo real):** contrato de eventos (nombre de evento, payload y código de estado del servicio) documentado en `docs/api/eventos-tiempo-real.md` (pendiente), siguiendo el espíritu de **AsyncAPI** aunque sin herramienta de generación formal en esta etapa.
- **Webhooks (confirmación de pago):** contrato específico por proveedor simulado, incluyendo verificación de firma (HMAC), clave de idempotencia y el código de respuesta HTTP esperado por el emisor.
- **Eventos de dominio internos (módulo ↔ módulo):** cada evento se define como un contrato TypeScript dentro de `backend/src/shared/` o del módulo emisor, versionado junto al código; no se expone fuera del proceso del backend.

No se emplean SOAP/WSDL ni `.proto` (gRPC) en esta fase, conforme a las alternativas descartadas.

## Buenas prácticas adoptadas

- Diseño **contract-first**: el contrato (OpenAPI) se define y revisa antes de implementar el endpoint correspondiente.
- **Versionado explícito** de la API (`/v1`) para introducir cambios no retrocompatibles sin romper clientes móviles ya publicados.
- **Formato de error consistente** en toda la API REST (estilo RFC 7807 — *Problem Details*), para que las tres aplicaciones manejen errores de forma uniforme.
- **Idempotencia** obligatoria en los webhooks de pago (alineada con el escenario de calidad S2), evitando dobles cobros ante reintentos del proveedor.
- **Timeouts y reintentos acotados** para toda integración externa (IA, pagos, mapas, notificaciones), con una vía de recuperación equivalente al escenario R1 (p. ej. selección manual de oficio si la IA no responde).
- **Paginación obligatoria** en endpoints de listados (técnicos cercanos, historial de servicios, calificaciones).
- **Autenticación en todas las rutas** salvo el *health check*, mediante token gestionado por el módulo `identity`, verificado antes de llegar a cualquier otro módulo.
- **Los eventos de dominio no sustituyen las reglas de negocio**: un *listener* de eventos realiza efectos secundarios (notificar, actualizar historial), nunca valida ni decide el resultado de la transacción principal del módulo emisor.

## Consecuencias

### Positivas

- Cada tipo de interacción usa la tecnología que mejor se ajusta a su naturaleza (transaccional, tiempo real o callback), en lugar de forzar una sola tecnología para todos los casos.
- El contrato OpenAPI permite generar clientes/tipos para las apps móviles y el panel admin, reduciendo errores de integración.
- El bus de eventos en memoria desacopla módulos sin introducir infraestructura adicional, preservando la simplicidad operativa definida en el ADR-0001.
- La estrategia es compatible con una futura extracción de módulos a servicios independientes: REST y webhooks ya asumen comunicación por red, y los eventos de dominio se pueden migrar a un bróker real sin cambiar la lógica de los módulos.

### Negativas / riesgos

- Mantener tres contratos distintos (REST, eventos WebSocket, webhooks) exige más disciplina de documentación que una única tecnología.
- El bus de eventos en memoria es un punto de acoplamiento temporal: si no se controla, los módulos pueden terminar dependiendo de eventos de otros módulos de forma implícita y difícil de rastrear.
- WebSocket introduce estado de conexión (sesiones activas) que no existe en una API REST sin estado, lo que exige manejar reconexión y escalado si el servicio crece más allá del MVP.

## Criterios de revisión

Esta ADR se revisará cuando ocurra alguna de las siguientes situaciones:

- Se extraiga un módulo del monolito como servicio independiente (ADR-0001), caso en el cual la comunicación módulo↔módulo pasará de eventos en memoria a mensajería real o gRPC entre procesos.
- El panel de administración requiera consultas agregadas y flexibles sobre múltiples módulos que justifiquen incorporar GraphQL como capa adicional de lectura.
- Se integre un proveedor real de pagos, mapas o IA, lo que obligará a formalizar los contratos de webhook y manejo de errores actualmente documentados de forma simulada.
- El volumen de conexiones WebSocket concurrentes exija una solución de escalado horizontal (p. ej. un *broker* de pub/sub dedicado) no contemplada en el MVP.
