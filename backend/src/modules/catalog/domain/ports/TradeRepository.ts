import { Trade } from "../entities/Trade";

export interface TradeRepository {
  findAll(): Promise<Trade[]>;
  findById(id: string): Promise<Trade | undefined>;
}
