import { pool } from "../shared/db";

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price_from INTEGER NOT NULL,
  icon TEXT NOT NULL,
  keywords TEXT[] NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS technician_profiles (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  trades TEXT[] NOT NULL DEFAULT '{}',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  rating DOUBLE PRECISION NOT NULL DEFAULT 5,
  reviews INTEGER NOT NULL DEFAULT 0,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  online BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS service_requests (
  id TEXT PRIMARY KEY,
  client_id TEXT NOT NULL,
  description TEXT NOT NULL,
  photos TEXT[] NOT NULL DEFAULT '{}',
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  trade_id TEXT,
  urgency TEXT NOT NULL,
  confidence DOUBLE PRECISION NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS service_lifecycle (
  request_id TEXT PRIMARY KEY,
  state TEXT NOT NULL,
  assigned_technician_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS offers (
  request_id TEXT NOT NULL,
  technician_id TEXT NOT NULL,
  trade_id TEXT NOT NULL,
  distance_km DOUBLE PRECISION NOT NULL,
  score DOUBLE PRECISION NOT NULL,
  offered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (request_id, technician_id)
);

CREATE TABLE IF NOT EXISTS payments (
  idempotency_key TEXT PRIMARY KEY,
  id TEXT NOT NULL,
  request_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  method TEXT NOT NULL,
  status TEXT NOT NULL,
  captured_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ratings (
  request_id TEXT PRIMARY KEY,
  id TEXT NOT NULL,
  technician_id TEXT NOT NULL,
  stars INTEGER NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rating_windows (
  request_id TEXT PRIMARY KEY
);
`;

const SEED_TRADES = [
  { id: "plumbing", name: "Plomería", priceFrom: 45000, icon: "wrench", keywords: ["fuga", "gotea", "goteo", "tuberia", "tubería", "lavaplatos", "sifon", "sifón", "agua", "inodoro", "lavamanos"] },
  { id: "electrical", name: "Electricidad", priceFrom: 50000, icon: "bolt", keywords: ["luz", "corto", "breaker", "taco", "enchufe", "bombillo", "electric", "corriente", "chispa"] },
  { id: "locksmith", name: "Cerrajería", priceFrom: 40000, icon: "lock", keywords: ["llave", "cerradura", "candado", "puerta", "chapa", "cerrojo"] },
  { id: "appliances", name: "Electrodomésticos", priceFrom: 60000, icon: "appliance", keywords: ["nevera", "lavadora", "estufa", "horno", "microondas", "secadora"] },
  { id: "painting", name: "Pintura / Drywall", priceFrom: 55000, icon: "roller", keywords: ["pintura", "pared", "drywall", "humedad", "grieta", "muro"] },
];

const SEED_TECHNICIANS = [
  { id: "tech-1", userId: "tech-1", name: "Carlos Restrepo M.", trades: ["plumbing"], lat: 6.201, lng: -75.57, rating: 4.96, reviews: 318, verified: true, online: true },
  { id: "tech-2", userId: "tech-2", name: "Hernando Gómez Velásquez", trades: ["plumbing", "appliances"], lat: 6.22, lng: -75.585, rating: 4.91, reviews: 154, verified: true, online: true },
  { id: "tech-3", userId: "tech-3", name: "Julián Correa Posada", trades: ["plumbing"], lat: 6.23, lng: -75.55, rating: 4.88, reviews: 95, verified: true, online: true },
  { id: "tech-4", userId: "tech-4", name: "Andrea Zapata Ríos", trades: ["electrical"], lat: 6.205, lng: -75.575, rating: 4.93, reviews: 201, verified: true, online: true },
  { id: "tech-5", userId: "tech-5", name: "Mauricio Vélez Arango", trades: ["locksmith"], lat: 6.215, lng: -75.565, rating: 4.85, reviews: 132, verified: true, online: true },
  { id: "tech-6", userId: "tech-6", name: "Sandra Patiño Lema", trades: ["painting", "appliances"], lat: 6.195, lng: -75.59, rating: 4.78, reviews: 64, verified: true, online: true },
];

export async function runMigrations(bcryptHash: (plain: string) => string): Promise<void> {
  await pool.query(SCHEMA_SQL);

  for (const trade of SEED_TRADES) {
    await pool.query(
      `INSERT INTO trades (id, name, price_from, icon, keywords) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [trade.id, trade.name, trade.priceFrom, trade.icon, trade.keywords],
    );
  }

  for (const tech of SEED_TECHNICIANS) {
    await pool.query(
      `INSERT INTO technician_profiles (id, user_id, name, trades, lat, lng, rating, reviews, verified, online)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       ON CONFLICT (id) DO UPDATE SET name = $3`,
      [tech.id, tech.userId, tech.name, tech.trades, tech.lat, tech.lng, tech.rating, tech.reviews, tech.verified, tech.online],
    );
  }

  const demoUsers = [
    { id: "tech-1", email: "tecnico1.demo@arreglapues.app", name: "Carlos Restrepo M.", role: "PRO", password: "demo12345" },
    { id: "tech-4", email: "tecnico4.demo@arreglapues.app", name: "Andrea Zapata Ríos", role: "PRO", password: "demo12345" },
  ];
  for (const user of demoUsers) {
    await pool.query(
      `INSERT INTO users (id, email, password_hash, name, role) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO NOTHING`,
      [user.id, user.email, bcryptHash(user.password), user.name, user.role],
    );
  }

  // Credenciales cortas para la demo en vivo (ver tech-3 en SEED_TECHNICIANS).
  // Nunca se hardcodean en el repo público: solo se siembran si Render tiene
  // configuradas estas variables de entorno.
  const liveDemoUsers = [
    { id: "tech-3", email: "julian@arreglapues.app", name: "Julián Correa Posada", role: "PRO", password: process.env.DEMO_JULIAN_PASSWORD },
    { id: "client-diego-demo", email: "diego@arreglapues.app", name: "Diego Ulloa", role: "CLIENT", password: process.env.DEMO_DIEGO_PASSWORD },
  ];
  for (const user of liveDemoUsers) {
    if (!user.password) {
      console.warn(`[migrate] omitiendo usuario demo ${user.email}: falta la variable de entorno de su contraseña`);
      continue;
    }
    await pool.query(
      `INSERT INTO users (id, email, password_hash, name, role) VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (id) DO UPDATE SET name = $4`,
      [user.id, user.email, bcryptHash(user.password), user.name, user.role],
    );
  }
}
