import { Rating } from "../entities/Rating";

export interface RatingRepository {
  save(rating: Rating): Promise<void>;
  findByRequestId(requestId: string): Promise<Rating | undefined>;
  openWindow(requestId: string): Promise<void>;
  isWindowOpen(requestId: string): Promise<boolean>;
}
