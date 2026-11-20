import { GeoPoint } from "../../../../shared/geo";

export interface AvailableTechnician {
  id: string;
  name: string;
  location: GeoPoint;
  rating: number;
  reviews: number;
}

export interface TechnicianDirectoryPort {
  listAvailableByTrade(tradeId: string): Promise<AvailableTechnician[]>;
}
