import { TechnicianProfile } from "../entities/TechnicianProfile";

export interface TechnicianProfileRepository {
  findAll(): TechnicianProfile[];
  findById(id: string): TechnicianProfile | undefined;
  findByUserId(userId: string): TechnicianProfile | undefined;
  findAvailableByTrade(tradeId: string): TechnicianProfile[];
  save(profile: TechnicianProfile): void;
}
