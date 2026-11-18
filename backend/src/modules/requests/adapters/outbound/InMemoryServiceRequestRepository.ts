import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { ServiceRequestRepository } from "../../domain/ports/ServiceRequestRepository";

export class InMemoryServiceRequestRepository implements ServiceRequestRepository {
  private readonly requests = new Map<string, ServiceRequest>();

  save(request: ServiceRequest): void {
    this.requests.set(request.id, request);
  }

  findById(id: string): ServiceRequest | undefined {
    return this.requests.get(id);
  }

  findByClientId(clientId: string): ServiceRequest[] {
    return [...this.requests.values()].filter((r) => r.clientId === clientId);
  }
}
