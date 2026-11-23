// Cliente REST hacia el backend (ADR-0003: REST sobre HTTPS para cliente↔API,
// contrato versionado en /v1). En un emulador Android usar 10.0.2.2 en vez de
// localhost; se puede sobrescribir con la variable de entorno EXPO_PUBLIC_API_URL.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:3000/v1";

let authToken: string | null = null;
let currentName: string | null = null;

// Persistencia simple de sesión (solo web): sin esto, recargar la página
// perdía el token por completo aunque la UI siguiera mostrando el Home.
const STORAGE_KEY = "arreglapues.session";
const hasWebStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function persistSession(): void {
  if (!hasWebStorage) return;
  if (authToken && currentName) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: authToken, name: currentName }));
  } else {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export function restoreSession(): boolean {
  if (!hasWebStorage) return false;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as { token: string; name: string };
    authToken = parsed.token;
    currentName = parsed.name;
    return true;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface CreateRequestResult {
  requestId: string;
  tradeId: string | null;
  tradeName: string | null;
  confidence: number;
  urgency: string;
  urgencyReason: string;
}

export interface Candidate {
  technicianId: string;
  name: string;
  distanceKm: number;
  rating: number;
  score: number;
}

export interface FindCandidatesResult {
  candidates: Candidate[];
  radiusUsedKm: number;
}

export interface LifecycleState {
  requestId: string;
  state: string;
  assignedTechnicianId: string | null;
  updatedAt: string;
}

export interface TechnicianProfile {
  id: string;
  name: string;
  trades: string[];
  location: GeoPoint;
  rating: number;
  reviews: number;
  verified: boolean;
  online: boolean;
}

export interface PricingBreakdown {
  laborCost: { amount: number; currency: string };
  materialsCost: { amount: number; currency: string };
  discount: { amount: number; currency: string };
  total: { amount: number; currency: string };
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

export const api = {
  async login(email: string, password: string): Promise<{ name: string }> {
    const result = await request<{ token: string; name: string; role: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    // Esta es la app de clientes: una cuenta de técnico tiene credenciales
    // válidas contra el mismo backend, pero no debe poder entrar aquí.
    if (result.role !== "CLIENT") {
      throw new Error("Esta cuenta es de técnico. Ingresa desde la app ArreglaPues Técnico.");
    }
    authToken = result.token;
    currentName = result.name;
    persistSession();
    return { name: result.name };
  },

  async register(name: string, email: string, password: string): Promise<{ name: string }> {
    const result = await request<{ token: string; name: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, name, role: "CLIENT" }),
    });
    authToken = result.token;
    currentName = result.name;
    persistSession();
    return { name: result.name };
  },

  get currentUserName(): string | null {
    return currentName;
  },

  logout(): void {
    authToken = null;
    currentName = null;
    persistSession();
  },

  listTechnicians() {
    return request<TechnicianProfile[]>("/technicians");
  },

  createRequest(description: string, location: GeoPoint, photos: string[] = []) {
    return request<CreateRequestResult>("/requests", {
      method: "POST",
      body: JSON.stringify({ description, location, photos }),
    });
  },

  findCandidates(requestId: string, tradeId: string, clientLocation: GeoPoint) {
    return request<FindCandidatesResult>("/matching/candidates", {
      method: "POST",
      body: JSON.stringify({ requestId, tradeId, clientLocation }),
    });
  },

  acceptService(requestId: string, technicianId: string) {
    return request<LifecycleState>(`/services/${requestId}/accept`, {
      method: "POST",
      body: JSON.stringify({ technicianId }),
    });
  },

  // No se expone advanceState aqui a proposito: el avance real del servicio
  // (en camino -> llego -> completado) solo lo escribe el tecnico desde
  // pro_app; el backend lo rechaza con 403 si lo llama un CLIENT (issue #25).
  // El cliente solo lee el estado por WebSocket (openServiceSocket) o polling
  // (getServiceState).

  getServiceState(requestId: string) {
    return request<LifecycleState>(`/services/${requestId}`);
  },

  pricingQuote(laborCost: number, materialsCost: number, discount = 0) {
    return request<PricingBreakdown>("/pricing/quote", {
      method: "POST",
      body: JSON.stringify({ laborCost, materialsCost, discount }),
    });
  },

  capturePayment(requestId: string, idempotencyKey: string, amount: number, method: string) {
    return request<{ id: string; status: string }>("/payments/capture", {
      method: "POST",
      body: JSON.stringify({ requestId, idempotencyKey, amount, method }),
    });
  },

  submitRating(requestId: string, technicianId: string, stars: number, comment?: string) {
    return request<{ id: string }>("/ratings", {
      method: "POST",
      body: JSON.stringify({ requestId, technicianId, stars, comment }),
    });
  },

  // WebSocket de tracking en tiempo real (ADR-0003).
  openServiceSocket(requestId: string, onState: (state: LifecycleState) => void): () => void {
    const wsUrl = BASE_URL.replace(/^http/, "ws").replace(/\/v1$/, "");
    const socket = new WebSocket(`${wsUrl}/v1/ws/services?requestId=${requestId}`);
    socket.onmessage = (event) => {
      try {
        onState(JSON.parse(event.data));
      } catch {
        // Mensaje no reconocido: se ignora, el flujo principal no depende de él.
      }
    };
    return () => socket.close();
  },
};
