import { InitializeLifecycle } from "../../../service_lifecycle/application/use-cases/InitializeLifecycle";
import { LifecyclePort } from "../../application/ports/LifecyclePort";

export class ServiceLifecycleAdapter implements LifecyclePort {
  constructor(private readonly initializeLifecycle: InitializeLifecycle) {}

  async initialize(requestId: string): Promise<void> {
    await this.initializeLifecycle.execute(requestId);
  }
}
