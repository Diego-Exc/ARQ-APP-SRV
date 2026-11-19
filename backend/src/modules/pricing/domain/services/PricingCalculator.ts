import { Money, add } from "../../../../shared/money";

export interface PricingBreakdown {
  laborCost: Money;
  materialsCost: Money;
  discount: Money;
  total: Money;
}

export function computeFinalAmount(
  laborCost: number,
  materialsCost: number,
  discount: number,
  currency = "COP",
): PricingBreakdown {
  const labor: Money = { amount: laborCost, currency };
  const materials: Money = { amount: materialsCost, currency };
  const discountMoney: Money = { amount: -Math.abs(discount), currency };

  const total = add(add(labor, materials), discountMoney);
  return { laborCost: labor, materialsCost: materials, discount: discountMoney, total };
}
