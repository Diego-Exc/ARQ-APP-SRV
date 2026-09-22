# ADR 0001 — Monolito modular como estilo arquitectónico del MVP

## Estado
Aceptado

## Contexto
El producto es un marketplace de servicios del hogar con dos aplicaciones móviles, matching geoespacial, pagos, verificación de profesionales y clasificación asistida por IA. El MVP cubre un ciclo completo de servicio en una ciudad piloto y un conjunto reducido de oficios.

Se requiere una arquitectura:
- clara para evaluación académica
- organizada por dominio
- evolutiva hacia nuevas categorías y ciudades
- sin el costo operativo de una distribución en microservicios en la etapa inicial

## Decisión
Se adopta un **Modular Monolith**:
- un único backend desplegable
- módulos por bounded context (identity, requests, matching, payments, entre otros)
- reglas de dependencia estrictas (dominio desacoplado de frameworks externos)
- integraciones (IA, pagos, mapas, notificaciones) detrás de puertos y adaptadores

Las aplicaciones de cliente y profesional consumen la misma API, diferenciadas por rol.

## Consecuencias

### Positivas
- Menor complejidad de red, operación y consistencia distribuida
- Fronteras de módulo documentables (vista C3) y evaluables
- Transacciones locales y refactors más simples en el MVP
- Posibilidad de extracción posterior de módulos (p. ej. payments)

### Negativas / riesgos
- Requiere disciplina de límites; su ausencia degrada la modularidad
- Un fallo grave del proceso puede afectar varios módulos (mitigación mediante degradación controlada)
- Exige inversión en estructura de carpetas, ADRs y control de dependencias

## Alternativas consideradas
1. **Microservicios desde el inicio** — sobrecosto operativo para el MVP académico.
2. **Monolito sin módulos** — entrega inicial rápida con deuda estructural inmediata.
3. **Backend as a Service exclusivo** — velocidad de prototipo con menor claridad de reglas de dominio y límites arquitectónicos.

## Criterios de revisión
Esta ADR se revisa si:
- un módulo requiere escalado independiente
- el crecimiento del equipo genera conflictos de ownership
- aparecen requisitos de aislamiento (p. ej. cumplimiento de pagos) que obliguen extracción
