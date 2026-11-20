import { TechnicianProfile } from "../../domain/entities/TechnicianProfile";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";

export class ListAvailableTechniciansByTrade {
  constructor(private readonly profiles: TechnicianProfileRepository) {}

  async execute(tradeId: string): Promise<TechnicianProfile[]> {
    return this.profiles.findAvailableByTrade(tradeId);
  }
}
