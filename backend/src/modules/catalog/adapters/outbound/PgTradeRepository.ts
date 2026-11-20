import { Pool } from "pg";
import { Trade } from "../../domain/entities/Trade";
import { TradeRepository } from "../../domain/ports/TradeRepository";

interface TradeRow {
  id: string;
  name: string;
  price_from: number;
  icon: string;
  keywords: string[];
}

function toTrade(row: TradeRow): Trade {
  return { id: row.id, name: row.name, priceFrom: row.price_from, icon: row.icon, keywords: row.keywords };
}

export class PgTradeRepository implements TradeRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<Trade[]> {
    const result = await this.pool.query<TradeRow>("SELECT * FROM trades ORDER BY name");
    return result.rows.map(toTrade);
  }

  async findById(id: string): Promise<Trade | undefined> {
    const result = await this.pool.query<TradeRow>("SELECT * FROM trades WHERE id = $1", [id]);
    return result.rows[0] ? toTrade(result.rows[0]) : undefined;
  }
}
