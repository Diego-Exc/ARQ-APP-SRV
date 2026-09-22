export interface Money {
  amount: number;
  currency: string;
}

export function add(a: Money, b: Money): Money {
  if (a.currency !== b.currency) {
    throw new Error("No se pueden sumar montos de monedas distintas");
  }
  return { amount: a.amount + b.amount, currency: a.currency };
}
