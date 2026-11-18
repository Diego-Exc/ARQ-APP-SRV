// Bus de eventos de dominio en memoria (ADR-0003): publicación/suscripción
// síncrona dentro del mismo proceso, usada para desacoplar efectos secundarios
// entre módulos sin introducir mensajería externa.

type Listener<T> = (payload: T) => void;

class EventBus {
  private listeners = new Map<string, Listener<unknown>[]>();

  on<T>(event: string, listener: Listener<T>): void {
    const existing = this.listeners.get(event) ?? [];
    existing.push(listener as Listener<unknown>);
    this.listeners.set(event, existing);
  }

  emit<T>(event: string, payload: T): void {
    const existing = this.listeners.get(event) ?? [];
    for (const listener of existing) {
      // Un listener nunca debe revertir la transacción del emisor (ADR-0003):
      // sus fallos se aíslan y solo se registran.
      try {
        listener(payload);
      } catch (error) {
        console.error(`[event-bus] listener de "${event}" falló`, error);
      }
    }
  }
}

export const eventBus = new EventBus();

export const DomainEvents = {
  ServiceAccepted: "service.accepted",
  ServiceStateChanged: "service.state_changed",
  PaymentCaptured: "payment.captured",
} as const;
