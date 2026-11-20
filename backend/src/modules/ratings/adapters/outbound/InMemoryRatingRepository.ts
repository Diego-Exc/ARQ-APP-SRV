import { Rating } from "../../domain/entities/Rating";
import { RatingRepository } from "../../domain/ports/RatingRepository";

// Usado por tests unitarios; el backend real usa PgRatingRepository.
export class InMemoryRatingRepository implements RatingRepository {
  private readonly ratings = new Map<string, Rating>();
  private readonly openWindows = new Set<string>();

  async save(rating: Rating): Promise<void> {
    this.ratings.set(rating.requestId, rating);
  }

  async findByRequestId(requestId: string): Promise<Rating | undefined> {
    return this.ratings.get(requestId);
  }

  async openWindow(requestId: string): Promise<void> {
    this.openWindows.add(requestId);
  }

  async isWindowOpen(requestId: string): Promise<boolean> {
    return this.openWindows.has(requestId);
  }
}
