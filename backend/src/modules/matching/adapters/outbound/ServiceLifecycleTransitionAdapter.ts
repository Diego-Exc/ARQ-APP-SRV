import { TransitionLifecycle } from "../../../service_lifecycle/application/use-cases/TransitionLifecycle";
import { LifecycleTransitionPort } from "../../application/ports/LifecycleTransitionPort";

export class ServiceLifecycleTransitionAdapter implements LifecycleTransitionPort {
  constructor(private readonly transitionLifecycle: TransitionLifecycle) {}

  markMatching(requestId: string): void {
    try {
      this.transitionLifecycle.execute(requestId, "MATCHING");
    } catch {
      // Ya estaba en MATCHING u otro estado posterior: no es un error del
      // caso de uso de búsqueda de candidatos, solo se ignora la transición.
    }
  }
}
