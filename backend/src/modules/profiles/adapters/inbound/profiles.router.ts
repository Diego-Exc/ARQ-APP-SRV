import { Router } from "express";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";
import { SetAvailability } from "../../application/use-cases/SetAvailability";

export function createProfilesRouter(
  profiles: TechnicianProfileRepository,
  setAvailability: SetAvailability,
): Router {
  const router = Router();

  router.get("/technicians", (_req, res) => {
    res.json(profiles.findAll());
  });

  router.patch("/technicians/:id/availability", (req, res) => {
    setAvailability.execute(req.params.id, Boolean(req.body.online));
    res.status(204).end();
  });

  return router;
}
