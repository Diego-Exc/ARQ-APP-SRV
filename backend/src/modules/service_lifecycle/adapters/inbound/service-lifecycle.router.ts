import { Router } from "express";
import { TransitionLifecycle } from "../../application/use-cases/TransitionLifecycle";
import { AcceptService } from "../../application/use-cases/AcceptService";
import { GetLifecycleState } from "../../application/use-cases/GetLifecycleState";
import { asyncHandler } from "../../../../shared/asyncHandler";
import { requireRole } from "../../../identity/adapters/inbound/authMiddleware";

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

  // El cliente puede confirmar/hailar al tecnico elegido (customer_app) y el
  // propio tecnico tambien puede aceptar su oferta (pro_app): esta accion
  // inicial de asignacion es legitima desde ambos lados, por eso no se
  // restringe por rol.
  router.post(
    "/services/:requestId/accept",
    asyncHandler(async (req, res) => {
      const technicianId = req.body.technicianId as string;
      res.json(await acceptService.execute(req.params.requestId, technicianId));
    }),
  );

  // Decision de diseno (hallazgo de auditoria, issue #25): el avance real del
  // servicio (en camino -> llego -> completado) solo lo puede reportar el
  // tecnico desde pro_app. El cliente nunca debe poder escribir este estado;
  // solo lo recibe por WebSocket/polling (ver openServiceSocket en
  // customer_app/src/api/client.ts). Antes, customer_app llamaba este mismo
  // endpoint para *simular* el progreso (TrackingScreen/ServiceProgressScreen) —
  // ya se removieron esas llamadas.
  router.patch(
    "/services/:requestId/state",
    requireRole("PRO"),
    asyncHandler(async (req, res) => {
      res.json(await transitionLifecycle.execute(req.params.requestId, req.body.state, req.body.code));
    }),
  );

  return router;
}
