import { Router } from "express";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";
import { SetAvailability } from "../../application/use-cases/SetAvailability";
import { asyncHandler } from "../../../../shared/asyncHandler";
import { requireRole } from "../../../identity/adapters/inbound/authMiddleware";

export function createProfilesRouter(
  profiles: TechnicianProfileRepository,
  setAvailability: SetAvailability,
): Router {
  const router = Router();

  router.get(
    "/technicians",
    asyncHandler(async (_req, res) => {
      res.json(await profiles.findAll());
    }),
  );

  router.patch(
    "/technicians/:id/availability",
    requireRole("PRO"),
    asyncHandler(async (req, res) => {
      await setAvailability.execute(req.params.id, Boolean(req.body.online));
      res.status(204).end();
    }),
  );

  return router;
}
