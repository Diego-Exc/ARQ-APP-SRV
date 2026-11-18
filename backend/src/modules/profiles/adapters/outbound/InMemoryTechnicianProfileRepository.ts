import { TechnicianProfile } from "../../domain/entities/TechnicianProfile";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";

// Centro de referencia: El Poblado, Medellín (6.2090, -75.5679).
const SEED_TECHNICIANS: TechnicianProfile[] = [
  {
    id: "tech-1",
    userId: "tech-1",
    name: "Carlos Restrepo M.",
    trades: ["plumbing"],
    location: { lat: 6.2010, lng: -75.5700 },
    rating: 4.96,
    reviews: 318,
    verified: true,
    online: true,
  },
  {
    id: "tech-2",
    userId: "tech-2",
    name: "Hernando Gómez Velásquez",
    trades: ["plumbing", "appliances"],
    location: { lat: 6.2200, lng: -75.5850 },
    rating: 4.91,
    reviews: 154,
    verified: true,
    online: true,
  },
  {
    id: "tech-3",
    userId: "tech-3",
    name: "Julián Ospina Duque",
    trades: ["plumbing"],
    location: { lat: 6.2300, lng: -75.5500 },
    rating: 4.88,
    reviews: 95,
    verified: true,
    online: true,
  },
  {
    id: "tech-4",
    userId: "tech-4",
    name: "Andrea Zapata Ríos",
    trades: ["electrical"],
    location: { lat: 6.2050, lng: -75.5750 },
    rating: 4.93,
    reviews: 201,
    verified: true,
    online: true,
  },
  {
    id: "tech-5",
    userId: "tech-5",
    name: "Mauricio Vélez Arango",
    trades: ["locksmith"],
    location: { lat: 6.2150, lng: -75.5650 },
    rating: 4.85,
    reviews: 132,
    verified: true,
    online: true,
  },
  {
    id: "tech-6",
    userId: "tech-6",
    name: "Sandra Patiño Lema",
    trades: ["painting", "appliances"],
    location: { lat: 6.1950, lng: -75.5900 },
    rating: 4.78,
    reviews: 64,
    verified: true,
    online: true,
  },
];

export class InMemoryTechnicianProfileRepository implements TechnicianProfileRepository {
  private readonly profiles = new Map(SEED_TECHNICIANS.map((p) => [p.id, p]));

  findAll(): TechnicianProfile[] {
    return [...this.profiles.values()];
  }

  findById(id: string): TechnicianProfile | undefined {
    return this.profiles.get(id);
  }

  findByUserId(userId: string): TechnicianProfile | undefined {
    return [...this.profiles.values()].find((p) => p.userId === userId);
  }

  findAvailableByTrade(tradeId: string): TechnicianProfile[] {
    return [...this.profiles.values()].filter(
      (p) => p.online && p.verified && p.trades.includes(tradeId),
    );
  }

  save(profile: TechnicianProfile): void {
    this.profiles.set(profile.id, profile);
  }
}
