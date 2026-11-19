import { Rating } from "../../domain/entities/Rating";
import { RatingRepository } from "../../domain/ports/RatingRepository";

export class InMemoryRatingRepository implements RatingRepository {
  private readonly ratings = new Map<string, Rating>();
  private readonly openWindows = new Set<string>();

  save(rating: Rating): void {
    this.ratings.set(rating.requestId, rating);
  }

  findByRequestId(requestId: string): Rating | undefined {
    return this.ratings.get(requestId);
  }

  openWindow(requestId: string): void {
    this.openWindows.add(requestId);
  }

  isWindowOpen(requestId: string): boolean {
    return this.openWindows.has(requestId);
  }
}
