import { Router } from "express";
import { TransitionLifecycle } from "../../application/use-cases/TransitionLifecycle";
import { AcceptService } from "../../application/use-cases/AcceptService";
import { GetLifecycleState } from "../../application/use-cases/GetLifecycleState";
import { asyncHandler } from "../../../../shared/asyncHandler";

export function createServiceLifecycleRouter(
  transitionLifecycle: TransitionLifecycle,
  acceptService: AcceptService,
  getLifecycleState: GetLifecycleState,
): Router {
  const router = Router();

  router.get(
    "/services/:requestId",
    asyncHandler(async (req, res) => {
      res.json(await getLifecycleState.execute(req.params.requestId));
    }),
  );

  // Nota de auditoria: este endpoint y /state los llama tanto customer_app
  // (confirma el tecnico elegido, y simula "en camino"/"llego"/"completado"
  // en TrackingScreen/ServiceProgressScreen) como pro_app (el tecnico acepta
  // la oferta real). No se restringe por rol porque ambas apps lo usan hoy;
  // ver hallazgo en PR/issue #25 sobre estados simulados por el cliente.
  router.post(
    "/services/:requestId/accept",
    asyncHandler(async (req, res) => {
      const technicianId = req.body.technicianId as string;
      res.json(await acceptService.execute(req.params.requestId, technicianId));
    }),
  );

  router.patch(
    "/services/:requestId/state",
    asyncHandler(async (req, res) => {
      res.json(await transitionLifecycle.execute(req.params.requestId, req.body.state));
    }),
  );

  return router;
}
