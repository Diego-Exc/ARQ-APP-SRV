import { GeoPoint } from "../../../../shared/geo";

export interface TechnicianProfile {
  id: string;
  userId: string;
  name: string;
  trades: string[];
  location: GeoPoint;
  rating: number;
  reviews: number;
  verified: boolean;
  online: boolean;
}
