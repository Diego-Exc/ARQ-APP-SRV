export interface DamageClassificationView {
  tradeId: string | null;
  tradeName: string | null;
  confidence: number;
  urgency: string;
  urgencyReason: string;
}

export interface DamageClassifierPort {
  classify(description: string): DamageClassificationView;
}
