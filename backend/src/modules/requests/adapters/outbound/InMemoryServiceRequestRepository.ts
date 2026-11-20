import { ServiceRequest } from "../../domain/entities/ServiceRequest";
import { ServiceRequestRepository } from "../../domain/ports/ServiceRequestRepository";

// Usado por tests unitarios; el backend real usa PgServiceRequestRepository.
export class InMemoryServiceRequestRepository implements ServiceRequestRepository {
  private readonly requests = new Map<string, ServiceRequest>();

  async save(request: ServiceRequest): Promise<void> {
    this.requests.set(request.id, request);
  }

  async findById(id: string): Promise<ServiceRequest | undefined> {
    return this.requests.get(id);
  }

  async findByClientId(clientId: string): Promise<ServiceRequest[]> {
    return [...this.requests.values()].filter((r) => r.clientId === clientId);
  }
}
