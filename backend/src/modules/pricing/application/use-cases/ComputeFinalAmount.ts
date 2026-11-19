import { computeFinalAmount, PricingBreakdown } from "../../domain/services/PricingCalculator";

export interface ComputeFinalAmountInput {
  laborCost: number;
  materialsCost: number;
  discount?: number;
}

export class ComputeFinalAmount {
  execute(input: ComputeFinalAmountInput): PricingBreakdown {
    return computeFinalAmount(input.laborCost, input.materialsCost, input.discount ?? 0);
  }
}
