export interface CreateRequestInput {
  clientId: string;
  description: string;
  photos?: string[];
  location: { lat: number; lng: number };
}

export interface CreateRequestResult {
  requestId: string;
  tradeId: string | null;
  tradeName: string | null;
  confidence: number;
  urgency: string;
  urgencyReason: string;
}
