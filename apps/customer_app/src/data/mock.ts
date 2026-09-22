export interface Technician {
  id: string;
  name: string;
  trade: string;
  rating: number;
  reviews: number;
  distanceKm: number;
  etaMinutes: number;
  price: number;
  verified: boolean;
  recommended?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  priceFrom: number;
  icon: string;
}

export const categories: ServiceCategory[] = [
  { id: "plumbing", name: "Plomería", priceFrom: 45000, icon: "wrench" },
  { id: "electrical", name: "Electricidad", priceFrom: 50000, icon: "bolt" },
  { id: "locksmith", name: "Cerrajería", priceFrom: 40000, icon: "lock" },
  { id: "appliances", name: "Electrodomésticos", priceFrom: 60000, icon: "appliance" },
  { id: "painting", name: "Pintura / Drywall", priceFrom: 55000, icon: "roller" },
];

export const technicians: Technician[] = [
  {
    id: "tech-1",
    name: "Carlos Restrepo M.",
    trade: "Plomería máster · Detección de fugas",
    rating: 4.96,
    reviews: 318,
    distanceKm: 1.4,
    etaMinutes: 18,
    price: 60000,
    verified: true,
    recommended: true,
  },
  {
    id: "tech-2",
    name: "Hernando Gómez Velásquez",
    trade: "Instalaciones sanitarias · Urgencias 24/7",
    rating: 4.91,
    reviews: 154,
    distanceKm: 2.8,
    etaMinutes: 25,
    price: 55000,
    verified: true,
  },
  {
    id: "tech-3",
    name: "Julián Ospina Duque",
    trade: "Destapes sin rompimiento",
    rating: 4.88,
    reviews: 95,
    distanceKm: 3.5,
    etaMinutes: 32,
    price: 50000,
    verified: true,
  },
];

export const diagnosis = {
  reportedAt: "Hoy 10:42 AM",
  description:
    "Hay un goteo continuo debajo del lavaplatos que ha humedecido la madera y hace ruido de presión.",
  confidence: 0.94,
  urgency: "URGENTE" as const,
  urgencyReason: "Riesgo de daño a carpintería",
  trade: "Plomería Sanitaria & Tuberías de Presión",
  priceRangeMin: 55000,
  priceRangeMax: 85000,
};

export const paymentSummary = {
  laborCost: 60000,
  materialsCost: 22000,
  serviceFee: -10000,
  total: 76500,
};
