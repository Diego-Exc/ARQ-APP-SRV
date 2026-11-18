import { Rating } from "../entities/Rating";

export interface RatingRepository {
  save(rating: Rating): void;
  findByRequestId(requestId: string): Rating | undefined;
  openWindow(requestId: string): void;
  isWindowOpen(requestId: string): boolean;
}
