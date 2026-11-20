import { TransitionLifecycle } from "../../../service_lifecycle/application/use-cases/TransitionLifecycle";
import { LifecycleRatedPort } from "../../application/ports/LifecycleRatedPort";

export class ServiceLifecycleRatedAdapter implements LifecycleRatedPort {
  constructor(private readonly transitionLifecycle: TransitionLifecycle) {}

  async markRated(requestId: string): Promise<void> {
    await this.transitionLifecycle.execute(requestId, "RATED");
  }
}
