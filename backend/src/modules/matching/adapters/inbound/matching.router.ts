import { Router } from "express";
import { FindCandidates } from "../../application/use-cases/FindCandidates";
import { OfferRepository } from "../../domain/ports/OfferRepository";

export function createMatchingRouter(findCandidates: FindCandidates, offers: OfferRepository): Router {
  const router = Router();

  router.post("/matching/candidates", (req, res) => {
    res.json(findCandidates.execute(req.body));
  });

  router.get("/technicians/:technicianId/offers", (req, res) => {
    res.json(offers.listForTechnician(req.params.technicianId));
  });

  return router;
}
