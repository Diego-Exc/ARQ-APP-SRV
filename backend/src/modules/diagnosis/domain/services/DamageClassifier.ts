export type Urgency = "BAJA" | "MEDIA" | "URGENTE";

// El dominio de Diagnosis no depende del módulo Catalog (ADR-0002): recibe una
// lista de oficios clasificables en su propia forma, resuelta por la capa de
// aplicación a partir del puerto que exponga Catalog.
export interface ClassifiableTrade {
  id: string;
  name: string;
  keywords: string[];
}

export interface ClassificationResult {
  tradeId: string | null;
  tradeName: string | null;
  confidence: number;
  urgency: Urgency;
  urgencyReason: string;
}

const URGENT_WORDS = ["fuga", "corto", "chispa", "inundado", "inundacion", "humo", "no hay luz", "no enciende"];

// Clasificador simulado por reglas/keywords (decisión de cierre del MVP, sección 10
// de docs/01-investigacion-inicial.md): sin integración con un proveedor LLM real.
// Queda documentado como extensión futura sustituir este adaptador por uno que
// consuma un modelo multimodal real, sin tocar el resto del módulo Requests.
export class DamageClassifier {
  constructor(private readonly trades: ClassifiableTrade[]) {}

  classify(description: string): ClassificationResult {
    const normalized = description.toLowerCase();

    let best: { trade: ClassifiableTrade; score: number } | undefined;
    for (const trade of this.trades) {
      const matches = trade.keywords.filter((keyword) => normalized.includes(keyword)).length;
      if (matches > 0 && (!best || matches > best.score)) {
        best = { trade, score: matches };
      }
    }

    const urgency: Urgency = URGENT_WORDS.some((word) => normalized.includes(word))
      ? "URGENTE"
      : best
        ? "MEDIA"
        : "BAJA";

    if (!best) {
      return {
        tradeId: null,
        tradeName: null,
        confidence: 0,
        urgency,
        urgencyReason: "No se identificó un oficio con certeza; selección manual recomendada",
      };
    }

    const confidence = Math.min(0.6 + best.score * 0.12, 0.97);
    return {
      tradeId: best.trade.id,
      tradeName: best.trade.name,
      confidence,
      urgency,
      urgencyReason:
        urgency === "URGENTE" ? "Riesgo inmediato detectado en la descripción" : "Daño identificado sin riesgo inmediato",
    };
  }
}
