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

export interface TechnicianDetail {
  title: string;
  experienceYears: number;
  specialty: string;
  bio: string;
  estimatedPrice: number;
  reviews: number;
}

// Enriquecimiento local (ADR-0005: simulado) para los 6 técnicos sembrados
// en el backend (ver backend/src/bootstrap/migrate.ts) — el backend no
// modela título/experiencia/bio, pero sí rating, distancia y verificación
// reales que se combinan con esto en pantalla.
export const TECHNICIAN_DETAILS: Record<string, TechnicianDetail> = {
  "tech-1": {
    title: "Técnico certificado SENA en Plomería",
    experienceYears: 14,
    specialty: "Detección de fugas y tuberías de presión",
    bio: "Especialista en fugas difíciles de encontrar, sin romper piso ni pared.",
    estimatedPrice: 60000,
    reviews: 318,
  },
  "tech-2": {
    title: "Técnico en Instalaciones Sanitarias",
    experienceYears: 9,
    specialty: "Urgencias 24/7 · Redes sanitarias",
    bio: "Atiende urgencias a cualquier hora, incluso festivos.",
    estimatedPrice: 55000,
    reviews: 154,
  },
  "tech-3": {
    title: "Técnico certificado SENA en Plomería",
    experienceYears: 7,
    specialty: "Destapes sin rompimiento",
    bio: "Usa cámara de inspección para destapar sin dañar la tubería.",
    estimatedPrice: 50000,
    reviews: 95,
  },
  "tech-4": {
    title: "Tecnólogo en Electricidad Industrial",
    experienceYears: 11,
    specialty: "Instalaciones eléctricas residenciales",
    bio: "Diagnóstico de cortos y tableros eléctricos con equipo certificado.",
    estimatedPrice: 58000,
    reviews: 201,
  },
  "tech-5": {
    title: "Técnico en Cerrajería Profesional",
    experienceYears: 16,
    specialty: "Cerraduras de seguridad y apertura sin daño",
    bio: "Abre puertas sin dañar la cerradura ni la puerta, en minutos.",
    estimatedPrice: 48000,
    reviews: 132,
  },
  "tech-6": {
    title: "Técnico en Acabados y Pintura",
    experienceYears: 10,
    specialty: "Pintura, drywall y resanes",
    bio: "Deja las paredes como nuevas, con acabado liso profesional.",
    estimatedPrice: 62000,
    reviews: 64,
  },
};

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

export interface ClientNotification {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

export const clientNotifications: ClientNotification[] = [
  {
    id: "c1",
    icon: "construct",
    title: "Técnico en camino",
    description: "Carlos Restrepo está llegando a tu dirección.",
    time: "Hace 5 min",
    read: false,
  },
  {
    id: "c2",
    icon: "card",
    title: "Pago procesado",
    description: "Tu pago de $76,500 fue aprobado exitosamente.",
    time: "Hace 1 h",
    read: false,
  },
  {
    id: "c3",
    icon: "star",
    title: "Califica tu servicio",
    description: "Cuéntanos cómo fue tu experiencia con el técnico.",
    time: "Ayer",
    read: true,
  },
  {
    id: "c4",
    icon: "pricetag",
    title: "Cupón disponible",
    description: "10% de descuento en tu próximo servicio de plomería.",
    time: "Hace 3 días",
    read: true,
  },
];

export const paymentSummary = {
  laborCost: 60000,
  materialsCost: 22000,
  serviceFee: -10000,
  total: 76500,
};
