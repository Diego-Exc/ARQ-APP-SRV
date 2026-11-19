import { newId } from "../../../../shared/ids";
import { ServiceRequestRepository } from "../../domain/ports/ServiceRequestRepository";
import { DamageClassifierPort } from "../ports/DamageClassifierPort";
import { LifecyclePort } from "../ports/LifecyclePort";
import { CreateRequestInput, CreateRequestResult } from "../dto/requests.dto";

export class CreateRequest {
  constructor(
    private readonly requests: ServiceRequestRepository,
    private readonly classifier: DamageClassifierPort,
    private readonly lifecycle: LifecyclePort,
  ) {}

  execute(input: CreateRequestInput): CreateRequestResult {
    // Escenario de calidad R1: si el clasificador falla, se degrada a
    // selección manual en vez de bloquear la creación de la solicitud.
    const classification = this.safeClassify(input.description);

    const request = {
      id: newId("req"),
      clientId: input.clientId,
      description: input.description,
      photos: input.photos ?? [],
      location: input.location,
      tradeId: classification.tradeId,
      urgency: classification.urgency,
      confidence: classification.confidence,
      status: "SUBMITTED" as const,
      createdAt: new Date().toISOString(),
    };
    this.requests.save(request);
    this.lifecycle.initialize(request.id);

    return {
      requestId: request.id,
      tradeId: classification.tradeId,
      tradeName: classification.tradeName,
      confidence: classification.confidence,
      urgency: classification.urgency,
      urgencyReason: classification.urgencyReason,
    };
  }

  private safeClassify(description: string) {
    try {
      return this.classifier.classify(description);
    } catch (error) {
      console.error("[requests] clasificación de IA no disponible, se degrada a manual", error);
      return {
        tradeId: null,
        tradeName: null,
        confidence: 0,
        urgency: "MEDIA",
        urgencyReason: "Clasificación automática no disponible; selección manual requerida",
      };
    }
  }
}
