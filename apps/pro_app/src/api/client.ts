const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/v1";

let authToken: string | null = null;
let technicianId: string | null = null;

export interface TechnicianOffer {
  requestId: string;
  tradeId: string;
  distanceKm: number;
  score: number;
  offeredAt: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  trades: string[];
  rating: number;
  reviews: number;
  verified: boolean;
  online: boolean;
}

export interface ServiceRequestView {
  id: string;
  description: string;
  tradeId: string | null;
  urgency: string;
}

export interface LifecycleState {
  requestId: string;
  state: string;
  assignedTechnicianId: string | null;
  securityCode: string | null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail ?? `Error ${response.status} al llamar ${path}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const proApi = {
  async login(email: string, password: string): Promise<{ name: string; technicianId: string }> {
    const result = await request<{ token: string; userId: string; name: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // Esta es la app de técnicos: una cuenta de cliente tiene credenciales
    // válidas contra el mismo backend, pero no debe poder entrar aquí.
    if (result.role !== "PRO") {
      throw new Error("Esta cuenta es de cliente. Ingresa desde la app ArreglaPues.");
    }
    authToken = result.token;
    technicianId = result.userId;
    return { name: result.name, technicianId: result.userId };
  },

  get currentTechnicianId(): string | null {
    return technicianId;
  },

  getMyProfile(): Promise<TechnicianProfile | undefined> {
    return request<TechnicianProfile[]>("/technicians").then((all) => all.find((t) => t.id === technicianId));
  },

  setAvailability(online: boolean) {
    return request<void>(`/technicians/${technicianId}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ online }),
    });
  },

  listOffers(): Promise<TechnicianOffer[]> {
    return request<TechnicianOffer[]>(`/technicians/${technicianId}/offers`);
  },

  getRequest(requestId: string): Promise<ServiceRequestView> {
    return request<ServiceRequestView>(`/requests/${requestId}`);
  },

  getServiceState(requestId: string): Promise<LifecycleState> {
    return request<LifecycleState>(`/services/${requestId}`);
  },

  acceptService(requestId: string): Promise<LifecycleState> {
    return request<LifecycleState>(`/services/${requestId}/accept`, {
      method: "POST",
      body: JSON.stringify({ technicianId }),
    });
  },

  advanceState(requestId: string, state: string, code?: string): Promise<LifecycleState> {
    return request<LifecycleState>(`/services/${requestId}/state`, {
      method: "PATCH",
      body: JSON.stringify({ state, code }),
    });
  },

  logout(): void {
    authToken = null;
    technicianId = null;
  },
};
