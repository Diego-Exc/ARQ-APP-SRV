# Diagrama de secuencia — Flujo principal

> Caso de uso: creación de solicitud → diagnóstico → matching → aceptación →
> ejecución → pago → calificación. Corresponde a los endpoints reales
> implementados en `backend/src/modules/*` y documentados en
> `docs/api/openapi.yaml`. Complementa la vista C3 descrita en
> `02-arquitectura-principios.md`, sección 5, con el detalle de los módulos
> que efectivamente se tocan (trazabilidad caso de uso–módulo, criterio P10).

```mermaid
sequenceDiagram
    actor Cliente as App Cliente
    actor Pro as App Pro
    participant Requests
    participant Diagnosis
    participant Matching
    participant Profiles
    participant Lifecycle as Service Lifecycle
    participant Pricing
    participant Payments
    participant Ratings
    participant Notifications

    Cliente->>Requests: POST /requests (descripción, ubicación)
    Requests->>Diagnosis: ClassifyDamage(descripción)
    Diagnosis-->>Requests: oficio, urgencia, confianza (o null si no reconoce)
    Requests->>Lifecycle: InitializeLifecycle(requestId) → SUBMITTED
    Requests-->>Cliente: requestId + diagnóstico

    Cliente->>Matching: POST /matching/candidates (requestId, tradeId, ubicación)
    Matching->>Lifecycle: TransitionLifecycle(requestId, MATCHING)
    Matching->>Profiles: listAvailableByTrade(tradeId)
    Profiles-->>Matching: técnicos disponibles
    Matching-->>Cliente: candidatos ordenados (score 60% cercanía / 40% calificación)
    Matching-->>Pro: oferta visible en GET /technicians/{id}/offers

    Pro->>Lifecycle: POST /services/{requestId}/accept
    Lifecycle-->>Pro: estado ASSIGNED
    Lifecycle--)Notifications: evento service.state_changed (ASSIGNED)
    Lifecycle--)Cliente: WebSocket /v1/ws/services (push en vivo)

    Pro->>Lifecycle: PATCH .../state (EN_ROUTE → IN_PROGRESS → COMPLETED)
    Lifecycle--)Cliente: WebSocket push por cada transición

    Cliente->>Pricing: POST /pricing/quote (mano de obra, materiales, descuento)
    Pricing-->>Cliente: desglose de precio

    Cliente->>Payments: POST /payments/capture (idempotencyKey, monto)
    Payments-->>Cliente: pago CAPTURED
    Payments--)Ratings: evento payment.captured → abre ventana de calificación
    Payments--)Notifications: evento payment.captured → notificación simulada

    Cliente->>Ratings: POST /ratings (estrellas, comentario)
    Ratings->>Lifecycle: TransitionLifecycle(requestId, RATED)
    Ratings-->>Cliente: calificación registrada
```

## Notas de trazabilidad

| Paso | Módulo(s) | Escenario de calidad asociado |
|---|---|---|
| Clasificación de daño | Diagnosis, Requests | R1 (degradación si la IA simulada no reconoce el daño) |
| Búsqueda de candidatos | Matching, Profiles | P1 (latencia acotada), ver también ADR-0004 |
| Aceptación del servicio | Service Lifecycle | R2 (sin doble asignación, transición atómica) |
| Seguimiento en vivo | Service Lifecycle → WebSocket | U2 (actualización ≤ 5 s) |
| Captura de pago | Payments | S2 (idempotencia, integridad transaccional) |
| Calificación | Ratings, Service Lifecycle | Cierre del ciclo de vida del servicio (RATED) |
