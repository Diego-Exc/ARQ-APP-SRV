import { Errors } from "../../../../shared/http-error";
import { ServiceLifecycleRecord } from "../../domain/entities/ServiceStateMachine";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

export class GetLifecycleState {
  constructor(private readonly lifecycles: ServiceLifecycleRepository) {}

  execute(requestId: string): ServiceLifecycleRecord {
    const record = this.lifecycles.get(requestId);
    if (!record) throw Errors.notFound("El servicio no tiene un ciclo de vida iniciado");
    return record;
  }
}
