import { Router } from "express";
import { TechnicianProfileRepository } from "../../domain/ports/TechnicianProfileRepository";
import { SetAvailability } from "../../application/use-cases/SetAvailability";
import { asyncHandler } from "../../../../shared/asyncHandler";
import { requireRole } from "../../../identity/adapters/inbound/authMiddleware";
import { Errors } from "../../../../shared/http-error";

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
      // El id de technician_profiles coincide con el userId del tecnico
      // autenticado (ver SEED_TECHNICIANS en migrate.ts): un tecnico solo
      // puede cambiar su propia disponibilidad, nunca la de otro.
      if (req.params.id !== req.auth!.userId) {
        throw Errors.forbidden("No puedes cambiar la disponibilidad de otro técnico");
      }
      await setAvailability.execute(req.params.id, Boolean(req.body.online));
      res.status(204).end();
    }),
  );

  return router;
}
