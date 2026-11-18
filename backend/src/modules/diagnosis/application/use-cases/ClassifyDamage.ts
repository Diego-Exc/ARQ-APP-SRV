import { DamageClassifier } from "../../domain/services/DamageClassifier";
import { TradeCatalogPort } from "../ports/TradeCatalogPort";
import { ClassifyDamageInput, ClassifyDamageResult } from "../dto/diagnosis.dto";

export class ClassifyDamage {
  constructor(private readonly tradeCatalog: TradeCatalogPort) {}

  execute(input: ClassifyDamageInput): ClassifyDamageResult {
    const classifier = new DamageClassifier(this.tradeCatalog.listClassifiableTrades());
    return classifier.classify(input.description);
  }
}
