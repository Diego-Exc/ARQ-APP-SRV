import { Router } from "express";
import { FindCandidates } from "../../application/use-cases/FindCandidates";
import { OfferRepository } from "../../domain/ports/OfferRepository";
import { asyncHandler } from "../../../../shared/asyncHandler";
import { requireRole } from "../../../identity/adapters/inbound/authMiddleware";

export function createMatchingRouter(findCandidates: FindCandidates, offers: OfferRepository): Router {
  const router = Router();

  router.post(
    "/matching/candidates",
    requireRole("CLIENT"),
    asyncHandler(async (req, res) => {
      res.json(await findCandidates.execute(req.body));
    }),
  );

  router.get(
    "/technicians/:technicianId/offers",
    requireRole("PRO"),
    asyncHandler(async (req, res) => {
      res.json(await offers.listForTechnician(req.params.technicianId));
    }),
  );

  return router;
}
