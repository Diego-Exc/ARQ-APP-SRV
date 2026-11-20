import { ListTrades } from "../../../catalog/application/use-cases/ListTrades";
import { ClassifiableTrade } from "../../domain/services/DamageClassifier";
import { TradeCatalogPort } from "../../application/ports/TradeCatalogPort";

// Adapta el caso de uso público del módulo Catalog a lo que Diagnosis necesita,
// sin acceder a su repositorio interno (ADR-0002: colaboración por API interna).
export class CatalogTradeCatalogAdapter implements TradeCatalogPort {
  constructor(private readonly listTrades: ListTrades) {}

  async listClassifiableTrades(): Promise<ClassifiableTrade[]> {
    const trades = await this.listTrades.execute();
    return trades.map((trade) => ({
      id: trade.id,
      name: trade.name,
      keywords: trade.keywords,
    }));
  }
}
