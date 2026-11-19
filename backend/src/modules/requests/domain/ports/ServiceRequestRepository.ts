import { ServiceRequest } from "../entities/ServiceRequest";

export interface ServiceRequestRepository {
  save(request: ServiceRequest): void;
  findById(id: string): ServiceRequest | undefined;
  findByClientId(clientId: string): ServiceRequest[];
}
