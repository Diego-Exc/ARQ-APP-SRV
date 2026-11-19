import { Trade } from "../entities/Trade";

export interface TradeRepository {
  findAll(): Trade[];
  findById(id: string): Trade | undefined;
}
