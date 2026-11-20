import { Errors } from "../../../../shared/http-error";
import { ServiceLifecycleRecord } from "../../domain/entities/ServiceStateMachine";
import { ServiceLifecycleRepository } from "../../domain/ports/ServiceLifecycleRepository";

export class GetLifecycleState {
  constructor(private readonly lifecycles: ServiceLifecycleRepository) {}

  async execute(requestId: string): Promise<ServiceLifecycleRecord> {
    const record = await this.lifecycles.get(requestId);
    if (!record) throw Errors.notFound("El servicio no tiene un ciclo de vida iniciado");
    return record;
  }
}
