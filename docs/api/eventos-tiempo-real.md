# Eventos en tiempo real — WebSocket de tracking

> Contrato del canal WebSocket decidido en [ADR-0003](../adr/0003-estrategia-comunicacion.md)
> para actualizaciones en tiempo real (estado del servicio). Documentado en el
> espíritu de AsyncAPI, sin herramienta de generación formal en esta etapa.

## Conexión

```
ws://<host>:3000/v1/ws/services?requestId=<id de la solicitud>
```

El cliente (app Cliente o Pro) abre un socket por solicitud activa, pasando el
`requestId` como query param. No requiere autenticación adicional en el MVP
(limitación conocida: el canal no valida el token JWT; ver sección de riesgos).

## Mensaje emitido: `service.state_changed`

El servidor empuja un mensaje cada vez que el módulo `service_lifecycle`
cambia el estado del servicio (ver bus de eventos en
`backend/src/shared/event-bus.ts`). No hay otros tipos de mensaje en el MVP.

```json
{
  "requestId": "req_b0318ebb-a4e2-4b9c-8b61-295f097fcad6",
  "state": "EN_ROUTE",
  "assignedTechnicianId": "tech-1",
  "updatedAt": "2026-11-18T14:52:22.544Z"
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| `requestId` | string | Identificador de la solicitud (coincide con el query param de conexión) |
| `state` | string | Uno de los estados de la máquina de estados (ver `02-arquitectura-principios.md`, sección 6) |
| `assignedTechnicianId` | string \| null | Técnico asignado, si ya existe |
| `updatedAt` | string (ISO 8601) | Momento del cambio de estado |

## Garantías y límites (MVP académico)

- **Cumple el escenario de calidad U2**: la actualización llega al cliente sin
  polling, dentro del margen de ≤ 5 s exigido.
- El socket no reenvía el último estado conocido al reconectar (no hay buffer);
  el cliente debe seguir consultando `GET /v1/services/{requestId}` para el
  estado actual si se reconecta.
- No hay reconexión automática ni *heartbeat* implementados; queda como
  extensión futura si el volumen de conexiones concurrentes lo justifica
  (criterio de revisión del ADR-0003).
- El canal no está protegido por el middleware de autenticación de `identity`
  (limitación conocida, aceptable para el alcance académico actual).
