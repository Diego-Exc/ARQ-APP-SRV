import { Urgency } from "../../domain/services/DamageClassifier";

export interface ClassifyDamageInput {
  description: string;
}

export interface ClassifyDamageResult {
  tradeId: string | null;
  tradeName: string | null;
  confidence: number;
  urgency: Urgency;
  urgencyReason: string;
}
