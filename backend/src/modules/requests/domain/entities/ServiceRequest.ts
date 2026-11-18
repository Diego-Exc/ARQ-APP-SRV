import { GeoPoint } from "../../../../shared/geo";

// Requests solo es dueño de la captura de la solicitud y su evidencia; la
// máquina de estados completa del servicio pertenece al módulo Service
// Lifecycle (02-arquitectura-principios.md, sección 3), que referencia esta
// solicitud por `id` sin duplicar sus datos.
export type RequestStatus = "DRAFT" | "SUBMITTED" | "CANCELLED";

export interface ServiceRequest {
  id: string;
  clientId: string;
  description: string;
  photos: string[];
  location: GeoPoint;
  tradeId: string | null;
  urgency: string;
  confidence: number;
  status: RequestStatus;
  createdAt: string;
}
