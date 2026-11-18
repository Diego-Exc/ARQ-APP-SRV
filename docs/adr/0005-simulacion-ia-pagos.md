# ADR 005: Simulación de IA y Pagos en el Alcance Académico

- **Estado:** Aceptado
- **Fecha:** 2026-11-18
- **Decisores:** Equipo del proyecto
- **Relacionado con:** [ADR 001](0001-monolito-modular.md), [ADR 003](0003-estrategia-comunicacion.md)

## Contexto

Las decisiones de cierre del MVP (`docs/01-investigacion-inicial.md`, sección
10, puntos 4 y 5) establecieron que, para el alcance académico, la
clasificación de daños por IA y la pasarela de pagos se simularían en vez de
integrarse con proveedores reales. Esa decisión vivía solo como texto de
producto. Al implementar los módulos `diagnosis` y `payments`
(`backend/src/modules/diagnosis`, `backend/src/modules/payments`), la forma
concreta de esa simulación —qué tan realista es, qué garantías mantiene, qué
puerto habría que sustituir a futuro— pasó a ser una decisión arquitectónica
que merece su propio registro, conforme a P7 y P8 de
`02-arquitectura-principios.md` (extensibilidad controlada).

## Decisión

### Diagnosis (IA simulada)

Se implementa un **clasificador por reglas/palabras clave**
(`domain/services/DamageClassifier.ts`) detrás del mismo puerto de aplicación
(`ClassifyDamage`) que tendría una integración real con un proveedor LLM
multimodal. El clasificador:
- Busca coincidencias de palabras clave del catálogo de oficios (`Catalog`) en
  la descripción del daño.
- Calcula una confianza simulada proporcional al número de coincidencias.
- Marca urgencia `URGENTE` si detecta palabras de riesgo inmediato (fuga,
  corto, inundación, etc.).
- Si no encuentra coincidencias, retorna `tradeId: null` para forzar la
  selección manual (escenario de calidad R1), sin lanzar error.

### Payments (pasarela simulada)

Se implementa una **captura de pago simulada** (`CapturePayment`) que:
- Registra el pago como `CAPTURED` inmediatamente, sin llamar a un proveedor
  externo real (Wompi/PayU/Stripe quedan como adaptadores futuros detrás del
  mismo puerto).
- Exige una `idempotencyKey` obligatoria: un reintento con la misma clave
  retorna el pago ya registrado en vez de duplicar el cobro (escenario S2).
- Emite el evento de dominio `payment.captured`, que habilita la ventana de
  calificación (`ratings`) y dispara la notificación simulada
  (`notifications`), igual que lo haría un webhook real de confirmación de
  pago (ADR-0003).

## Justificación

- **Alineado con el alcance académico aprobado:** no hay proveedor de IA ni
  pasarela bancaria contratados para el curso; simular ambos sin pretender lo
  contrario evita generar una falsa sensación de integración real.
- **El puerto es el límite de sustitución (ADR-0002):** tanto
  `TradeCatalogPort`/`ClassifyDamage` como `PaymentRepository`/`CapturePayment`
  están diseñados para que un adaptador real (proveedor LLM, pasarela de
  pagos) reemplace al simulado sin tocar `requests`, `service_lifecycle` ni
  `ratings`, que solo conocen el contrato de la aplicación, no la
  implementación concreta.
- **Escenario de calidad R1 (indisponibilidad de IA):** al modelar la
  clasificación como una función que siempre retorna un resultado (nunca
  lanza, en el peor caso retorna `tradeId: null`), el flujo de `CreateRequest`
  nunca queda bloqueado por un fallo del "proveedor" de IA, incluso en esta
  versión simulada.
- **Escenario de calidad S2 (integridad del pago):** la idempotencia se exige
  desde la implementación simulada, de modo que el comportamiento no cambie
  cuando se integre una pasarela real — la obligación de clave de
  idempotencia ya está probada (`payments/tests/CapturePayment.test.ts`).

## Alternativas consideradas

1. **Dejar los módulos vacíos hasta tener un proveedor real:** se descarta
   porque impediría demostrar el flujo completo de negocio (diagnóstico →
   matching → pago → calificación), que es el valor central del MVP evaluado.
2. **Simular con valores fijos/aleatorios sin reglas:** se descarta porque no
   permitiría probar el escenario R1 (degradación a selección manual) de
   forma determinista ni mostrar un resultado coherente con la descripción
   del usuario.
3. **Integrar un proveedor LLM real de bajo costo para la demo:** se descarta
   por el riesgo de depender de una clave de API externa y costos no
   presupuestados para una entrega académica (ver
   `docs/ArreglaPues-Estimacion-Costos-AWS.docx`, que tampoco contempla estos
   costos).

## Consecuencias

### Positivas
- El flujo de negocio completo es demostrable de principio a fin sin
  dependencias externas ni costos variables.
- La sustitución futura por un proveedor real está acotada a dos adaptadores
  (`diagnosis/adapters/outbound`, `payments/adapters/outbound`), sin tocar
  reglas de negocio de otros módulos.

### Negativas / riesgos
- El clasificador por palabras clave es mucho menos capaz que un modelo
  multimodal real: no interpreta fotos ni voz, solo texto con palabras
  conocidas del catálogo.
- La "pasarela" de pagos no valida medios de pago reales ni rechaza
  transacciones; todo pago enviado se captura. Esto es aceptable solo porque
  no hay dinero real involucrado en el alcance académico.

## Criterios de revisión

Esta ADR se revisará cuando:
- Se contrate o habilite un proveedor LLM real para clasificación de daños,
  momento en el que se documentará el nuevo adaptador y sus costos.
- Se integre una pasarela de pagos real (Wompi, PayU u otra), lo que exigirá
  formalizar el contrato de webhook mencionado como pendiente en el ADR-0003.
