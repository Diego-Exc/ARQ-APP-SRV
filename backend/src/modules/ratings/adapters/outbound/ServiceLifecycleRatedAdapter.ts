import { TransitionLifecycle } from "../../../service_lifecycle/application/use-cases/TransitionLifecycle";
import { LifecycleRatedPort } from "../../application/ports/LifecycleRatedPort";

export class ServiceLifecycleRatedAdapter implements LifecycleRatedPort {
  constructor(private readonly transitionLifecycle: TransitionLifecycle) {}

  markRated(requestId: string): void {
    this.transitionLifecycle.execute(requestId, "RATED");
  }
}
