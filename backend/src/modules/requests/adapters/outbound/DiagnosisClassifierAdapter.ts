import { ClassifyDamage } from "../../../diagnosis/application/use-cases/ClassifyDamage";
import { DamageClassificationView, DamageClassifierPort } from "../../application/ports/DamageClassifierPort";

export class DiagnosisClassifierAdapter implements DamageClassifierPort {
  constructor(private readonly classifyDamage: ClassifyDamage) {}

  async classify(description: string): Promise<DamageClassificationView> {
    return this.classifyDamage.execute({ description });
  }
}
