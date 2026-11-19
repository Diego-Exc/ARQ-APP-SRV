import { ClassifyDamage } from "../../../diagnosis/application/use-cases/ClassifyDamage";
import { DamageClassificationView, DamageClassifierPort } from "../../application/ports/DamageClassifierPort";

export class DiagnosisClassifierAdapter implements DamageClassifierPort {
  constructor(private readonly classifyDamage: ClassifyDamage) {}

  classify(description: string): DamageClassificationView {
    return this.classifyDamage.execute({ description });
  }
}
