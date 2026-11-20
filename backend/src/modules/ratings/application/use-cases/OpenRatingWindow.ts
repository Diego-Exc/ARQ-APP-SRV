import { RatingRepository } from "../../domain/ports/RatingRepository";

// Efecto secundario desacoplado (ADR-0003): se activa al escuchar el evento
// payment.captured, nunca valida ni decide el resultado del pago.
export class OpenRatingWindow {
  constructor(private readonly ratings: RatingRepository) {}

  async execute(requestId: string): Promise<void> {
    await this.ratings.openWindow(requestId);
  }
}
