# ADR 004: Modelo de Matching Híbrido

- **Estado:** Aceptado
- **Fecha:** 2026-11-18
- **Decisores:** Equipo del proyecto
- **Relacionado con:** [ADR 001](0001-monolito-modular.md), [ADR 002](0002-estructura-interna-repositorio.md), [ADR 003](0003-estrategia-comunicacion.md)

## Contexto

La decisión de cierre del MVP (`docs/01-investigacion-inicial.md`, sección 10,
punto 3) definió los parámetros del modelo de matching, pero no existía un ADR
formal que la respaldara como decisión arquitectónica — solo vivía como una
línea de un documento de alcance de producto. Al implementar el módulo
`matching` (`backend/src/modules/matching`), esos parámetros pasaron a ser
código real (`domain/services/MatchingScorer.ts`), lo que exige formalizar la
decisión conforme a P7 (decisiones documentadas) de
`02-arquitectura-principios.md`.

De los tres modelos evaluados originalmente —selección manual por el cliente,
difusión a N técnicos, o un híbrido— se requiere justificar por qué el híbrido
es el que mejor equilibra control del usuario y velocidad de asignación para
una plataforma de servicios de urgencia (fugas, fallas eléctricas).

## Decisión

Se adopta un modelo de **matching híbrido** con los siguientes parámetros,
implementados en `MatchingScorer.ts` y `FindCandidates.ts`:

| Parámetro | Valor |
|---|---|
| Radio inicial de búsqueda | 3 km |
| Incremento de expansión | 2 km, hasta un máximo de 10 km |
| Número máximo de candidatos mostrados | 5 |
| Peso de cercanía en el score | 60 % |
| Peso de calificación en el score | 40 % |
| Ventana de aceptación por candidato | ~45 s (simulable con un valor menor en demostraciones) |
| Comportamiento al expirar la ventana | Asignación automática al candidato mejor puntuado disponible |

El score se calcula como:

```
score = 0.6 * (1 - distancia_km / 10) + 0.4 * (calificación / 5)
```

Si no hay técnicos dentro del radio inicial, el radio se expande en
incrementos de 2 km hasta el máximo de 10 km antes de reportar que no hay
candidatos disponibles.

## Justificación

- **Control + velocidad:** el cliente ve una lista ordenada (control), pero el
  sistema puede asignar automáticamente si no hay interacción (velocidad),
  combinando lo mejor de los modelos A (selección) y B (difusión) descritos en
  `01-investigacion-inicial.md`, sección 4.
- **Atributo de calidad — Eficiencia de desempeño (escenario P1):** limitar a 5
  candidatos y acotar el radio máximo a 10 km mantiene acotado el costo de
  cálculo de distancias (haversine) incluso con más técnicos activos.
- **Atributo de calidad — Usabilidad (escenario U1):** una lista ordenada con
  score explicable (distancia + calificación) es más fácil de entender para un
  usuario sin conocimiento técnico que un algoritmo de asignación opaco.
- **Mantenibilidad (escenario M1):** los parámetros están centralizados en
  `MATCHING_PARAMS` (un único punto de cambio), de modo que ajustarlos no
  exige tocar otros módulos.

## Alternativas consideradas

1. **Selección manual pura (modelo A):** mayor control pero mayor tiempo de
   decisión del cliente, inaceptable para escenarios de urgencia (fuga,
   corto eléctrico).
2. **Difusión pura a N técnicos (modelo B):** minimiza el tiempo de asignación
   pero elimina la posibilidad de que el cliente compare precio/calificación,
   reduciendo la transparencia que es un eje de diferenciación del producto
   (`01-investigacion-inicial.md`, sección 12).
3. **Score basado solo en distancia:** más simple de implementar, pero no
   recompensa a los técnicos mejor calificados, debilitando el incentivo de
   calidad de servicio que sostiene la confianza de la plataforma.

## Consecuencias

### Positivas
- Parámetros explícitos, testeables (`matching/tests/MatchingScorer.test.ts`)
  y documentados en un único lugar.
- El algoritmo de score es trivial de ajustar (cambiar pesos o límites) sin
  tocar `FindCandidates` ni otros módulos.

### Negativas / riesgos
- Los pesos (60/40) y la ventana de 45 s no están validados con datos reales
  de la ciudad piloto; son una decisión de producto informada por analogía
  con DiDi/Uber, sujeta a ajuste con datos de operación real.
- El registro de ofertas por técnico (`OfferRepository`) es en memoria y se
  pierde al reiniciar el proceso backend — aceptable para el alcance
  académico, pero a reconsiderar si se persiste en una base de datos real.

## Criterios de revisión

Esta ADR se revisa si:
- Se dispone de datos reales de tiempo de aceptación en la ciudad piloto que
  sugieran ajustar los pesos del score o la ventana de 45 s.
- El volumen de técnicos activos crece lo suficiente para que el cálculo de
  distancia en memoria deje de ser viable sin una base de datos geoespacial
  (PostGIS, ya previsto en el diagrama C4 y en la estimación de costos AWS).
