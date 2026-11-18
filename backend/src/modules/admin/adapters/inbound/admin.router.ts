import { Router } from "express";
import { TechnicianProfileRepository } from "../../../profiles/domain/ports/TechnicianProfileRepository";

// Panel de administración (stub): aprobación de técnicos y vista operativa
// mínima. Moderación de disputas y catálogo quedan fuera de este alcance.
export function createAdminRouter(profiles: TechnicianProfileRepository): Router {
  const router = Router();

  router.get("/admin/technicians/pending", (_req, res) => {
    res.json(profiles.findAll().filter((p) => !p.verified));
  });

  router.post("/admin/technicians/:id/approve", (req, res) => {
    const profile = profiles.findById(req.params.id);
    if (!profile) {
      res.status(404).json({ error: "not_found" });
      return;
    }
    profile.verified = true;
    profiles.save(profile);
    res.status(204).end();
  });

  return router;
}
