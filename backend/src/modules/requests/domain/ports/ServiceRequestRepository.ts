import { ServiceRequest } from "../entities/ServiceRequest";

export interface ServiceRequestRepository {
  save(request: ServiceRequest): Promise<void>;
  findById(id: string): Promise<ServiceRequest | undefined>;
  findByClientId(clientId: string): Promise<ServiceRequest[]>;
}
