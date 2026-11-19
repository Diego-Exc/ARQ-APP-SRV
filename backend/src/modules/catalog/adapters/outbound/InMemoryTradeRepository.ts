import { Trade } from "../../domain/entities/Trade";
import { TradeRepository } from "../../domain/ports/TradeRepository";

const SEED_TRADES: Trade[] = [
  {
    id: "plumbing",
    name: "Plomería",
    priceFrom: 45000,
    icon: "wrench",
    keywords: ["fuga", "gotea", "goteo", "tuberia", "tubería", "lavaplatos", "sifon", "sifón", "agua", "inodoro", "lavamanos"],
  },
  {
    id: "electrical",
    name: "Electricidad",
    priceFrom: 50000,
    icon: "bolt",
    keywords: ["luz", "corto", "breaker", "taco", "enchufe", "bombillo", "electric", "corriente", "chispa"],
  },
  {
    id: "locksmith",
    name: "Cerrajería",
    priceFrom: 40000,
    icon: "lock",
    keywords: ["llave", "cerradura", "candado", "puerta", "chapa", "cerrojo"],
  },
  {
    id: "appliances",
    name: "Electrodomésticos",
    priceFrom: 60000,
    icon: "appliance",
    keywords: ["nevera", "lavadora", "estufa", "horno", "microondas", "secadora"],
  },
  {
    id: "painting",
    name: "Pintura / Drywall",
    priceFrom: 55000,
    icon: "roller",
    keywords: ["pintura", "pared", "drywall", "humedad", "grieta", "muro"],
  },
];

export class InMemoryTradeRepository implements TradeRepository {
  private readonly trades = new Map(SEED_TRADES.map((trade) => [trade.id, trade]));

  findAll(): Trade[] {
    return [...this.trades.values()];
  }

  findById(id: string): Trade | undefined {
    return this.trades.get(id);
  }
}
