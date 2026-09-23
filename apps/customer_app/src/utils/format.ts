export function formatCOP(amount: number): string {
  const formatted = new Intl.NumberFormat("es-CO").format(Math.abs(amount));
  return `${amount < 0 ? "-" : ""}$${formatted} COP`;
}
