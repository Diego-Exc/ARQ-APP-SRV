import { Errors } from "../../../../shared/http-error";

// Máquina de estados definida en 02-arquitectura-principios.md, sección 6.
export type ServiceState =
  | "DRAFT"
  | "SUBMITTED"
  | "MATCHING"
  | "ASSIGNED"
  | "EN_ROUTE"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "RATED"
  | "CANCELLED"
  | "DISPUTED";

const ALLOWED_TRANSITIONS: Record<ServiceState, ServiceState[]> = {
  DRAFT: ["SUBMITTED", "CANCELLED"],
  SUBMITTED: ["MATCHING", "CANCELLED"],
  MATCHING: ["ASSIGNED", "CANCELLED"],
  ASSIGNED: ["EN_ROUTE", "CANCELLED"],
  EN_ROUTE: ["IN_PROGRESS", "CANCELLED", "DISPUTED"],
  IN_PROGRESS: ["COMPLETED", "DISPUTED"],
  COMPLETED: ["RATED", "DISPUTED"],
  RATED: [],
  CANCELLED: [],
  DISPUTED: [],
};

export interface ServiceLifecycleRecord {
  requestId: string;
  state: ServiceState;
  assignedTechnicianId: string | null;
  // Código numérico de 4 dígitos generado al aceptar el servicio (ver
  // AcceptService): el cliente se lo da de viva voz al técnico, y el
  // técnico debe ingresarlo correctamente para poder iniciar el trabajo
  // (transición EN_ROUTE -> IN_PROGRESS, ver TransitionLifecycle).
  securityCode: string | null;
  updatedAt: string;
}

export function assertTransition(from: ServiceState, to: ServiceState): void {
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw Errors.conflict(`Transición inválida: no se puede pasar de ${from} a ${to}`);
  }
}
