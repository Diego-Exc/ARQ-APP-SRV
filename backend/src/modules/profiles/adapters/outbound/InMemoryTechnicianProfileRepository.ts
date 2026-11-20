import { TechnicianProfile } from "../../domain/entities/TechnicianProfile";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";

// Centro de referencia: El Poblado, Medellín (6.2090, -75.5679).
const SEED_TECHNICIANS: TechnicianProfile[] = [
  { id: "tech-1", userId: "tech-1", name: "Carlos Restrepo M.", trades: ["plumbing"], location: { lat: 6.201, lng: -75.57 }, rating: 4.96, reviews: 318, verified: true, online: true },
  { id: "tech-2", userId: "tech-2", name: "Hernando Gómez Velásquez", trades: ["plumbing", "appliances"], location: { lat: 6.22, lng: -75.585 }, rating: 4.91, reviews: 154, verified: true, online: true },
  { id: "tech-3", userId: "tech-3", name: "Julián Ospina Duque", trades: ["plumbing"], location: { lat: 6.23, lng: -75.55 }, rating: 4.88, reviews: 95, verified: true, online: true },
  { id: "tech-4", userId: "tech-4", name: "Andrea Zapata Ríos", trades: ["electrical"], location: { lat: 6.205, lng: -75.575 }, rating: 4.93, reviews: 201, verified: true, online: true },
  { id: "tech-5", userId: "tech-5", name: "Mauricio Vélez Arango", trades: ["locksmith"], location: { lat: 6.215, lng: -75.565 }, rating: 4.85, reviews: 132, verified: true, online: true },
  { id: "tech-6", userId: "tech-6", name: "Sandra Patiño Lema", trades: ["painting", "appliances"], location: { lat: 6.195, lng: -75.59 }, rating: 4.78, reviews: 64, verified: true, online: true },
];

// Usado por tests unitarios; el backend real usa PgTechnicianProfileRepository.
export class InMemoryTechnicianProfileRepository implements TechnicianProfileRepository {
  private readonly profiles = new Map(SEED_TECHNICIANS.map((p) => [p.id, p]));

  async findAll(): Promise<TechnicianProfile[]> {
    return [...this.profiles.values()];
  }

  async findById(id: string): Promise<TechnicianProfile | undefined> {
    return this.profiles.get(id);
  }

  async findByUserId(userId: string): Promise<TechnicianProfile | undefined> {
    return [...this.profiles.values()].find((p) => p.userId === userId);
  }

  async findAvailableByTrade(tradeId: string): Promise<TechnicianProfile[]> {
    return [...this.profiles.values()].filter((p) => p.online && p.verified && p.trades.includes(tradeId));
  }

  async save(profile: TechnicianProfile): Promise<void> {
    this.profiles.set(profile.id, profile);
  }
}
