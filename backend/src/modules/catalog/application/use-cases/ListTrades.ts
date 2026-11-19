import { Trade } from "../../domain/entities/Trade";
import { TradeRepository } from "../../domain/ports/TradeRepository";

export class ListTrades {
  constructor(private readonly trades: TradeRepository) {}

  execute(): Trade[] {
    return this.trades.findAll();
  }
}
