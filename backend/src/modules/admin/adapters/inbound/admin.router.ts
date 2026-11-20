import { Router } from "express";
import { TechnicianProfileRepository } from "../../../profiles/domain/ports/TechnicianProfileRepository";
import { asyncHandler } from "../../../../shared/asyncHandler";

// Panel de administración (stub): aprobación de técnicos y vista operativa
// mínima. Moderación de disputas y catálogo quedan fuera de este alcance.
export function createAdminRouter(profiles: TechnicianProfileRepository): Router {
  const router = Router();

  router.get(
    "/admin/technicians/pending",
    asyncHandler(async (_req, res) => {
      const all = await profiles.findAll();
      res.json(all.filter((p) => !p.verified));
    }),
  );

  router.post(
    "/admin/technicians/:id/approve",
    asyncHandler(async (req, res) => {
      const profile = await profiles.findById(req.params.id);
      if (!profile) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      profile.verified = true;
      await profiles.save(profile);
      res.status(204).end();
    }),
  );

  return router;
}
