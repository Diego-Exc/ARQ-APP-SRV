import { TechnicianProfile } from "../entities/TechnicianProfile";

export interface TechnicianProfileRepository {
  findAll(): Promise<TechnicianProfile[]>;
  findById(id: string): Promise<TechnicianProfile | undefined>;
  findByUserId(userId: string): Promise<TechnicianProfile | undefined>;
  findAvailableByTrade(tradeId: string): Promise<TechnicianProfile[]>;
  save(profile: TechnicianProfile): Promise<void>;
}
