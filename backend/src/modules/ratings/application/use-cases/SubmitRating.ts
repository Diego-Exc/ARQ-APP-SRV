import { newId } from "../../../../shared/ids";
import { Errors } from "../../../../shared/http-error";
import { Rating } from "../../domain/entities/Rating";
import { RatingRepository } from "../../domain/ports/RatingRepository";
import { LifecycleRatedPort } from "../ports/LifecycleRatedPort";

export interface SubmitRatingInput {
  requestId: string;
  technicianId: string;
  stars: number;
  comment?: string;
}

export class SubmitRating {
  constructor(
    private readonly ratings: RatingRepository,
    private readonly lifecycle: LifecycleRatedPort,
  ) {}

  execute(input: SubmitRatingInput): Rating {
    if (!this.ratings.isWindowOpen(input.requestId)) {
      throw Errors.conflict("La calificación solo se habilita tras confirmar el pago del servicio");
    }
    if (input.stars < 1 || input.stars > 5) {
      throw Errors.badRequest("La calificación debe estar entre 1 y 5 estrellas");
    }

    const rating: Rating = {
      id: newId("rating"),
      requestId: input.requestId,
      technicianId: input.technicianId,
      stars: input.stars,
      comment: input.comment ?? null,
      createdAt: new Date().toISOString(),
    };
    this.ratings.save(rating);
    this.lifecycle.markRated(input.requestId);
    return rating;
  }
}
