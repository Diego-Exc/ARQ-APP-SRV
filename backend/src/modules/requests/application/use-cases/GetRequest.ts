import { Errors } from "../../../../shared/http-error";
import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { ServiceRequestRepository } from "../../domain/ports/ServiceRequestRepository";

export class GetRequest {
  constructor(private readonly requests: ServiceRequestRepository) {}

  async execute(id: string): Promise<ServiceRequest> {
    const request = await this.requests.findById(id);
    if (!request) throw Errors.notFound("Solicitud no encontrada");
    return request;
  }
}
