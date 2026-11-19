import { InitializeLifecycle } from "../../../service_lifecycle/application/use-cases/InitializeLifecycle";
import { LifecyclePort } from "../../application/ports/LifecyclePort";

export class ServiceLifecycleAdapter implements LifecyclePort {
  constructor(private readonly initializeLifecycle: InitializeLifecycle) {}

  initialize(requestId: string): void {
    this.initializeLifecycle.execute(requestId);
  }
}
