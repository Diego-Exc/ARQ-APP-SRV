import { DamageClassifier } from "../../domain/services/DamageClassifier";
import { TradeCatalogPort } from "../ports/TradeCatalogPort";
import { ClassifyDamageInput, ClassifyDamageResult } from "../dto/diagnosis.dto";

export class ClassifyDamage {
  constructor(private readonly tradeCatalog: TradeCatalogPort) {}

  async execute(input: ClassifyDamageInput): Promise<ClassifyDamageResult> {
    const trades = await this.tradeCatalog.listClassifiableTrades();
    const classifier = new DamageClassifier(trades);
    return classifier.classify(input.description);
  }
}
