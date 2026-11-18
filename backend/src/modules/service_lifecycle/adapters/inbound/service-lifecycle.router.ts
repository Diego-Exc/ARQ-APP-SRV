import { Router } from "express";
import { TransitionLifecycle } from "../../application/use-cases/TransitionLifecycle";
import { AcceptService } from "../../application/use-cases/AcceptService";
import { GetLifecycleState } from "../../application/use-cases/GetLifecycleState";

export function createServiceLifecycleRouter(
  transitionLifecycle: TransitionLifecycle,
  acceptService: AcceptService,
  getLifecycleState: GetLifecycleState,
): Router {
  const router = Router();

  router.get("/services/:requestId", (req, res) => {
    res.json(getLifecycleState.execute(req.params.requestId));
  });

  router.post("/services/:requestId/accept", (req, res) => {
    const technicianId = req.body.technicianId as string;
    res.json(acceptService.execute(req.params.requestId, technicianId));
  });

  router.patch("/services/:requestId/state", (req, res) => {
    res.json(transitionLifecycle.execute(req.params.requestId, req.body.state));
  });

  return router;
}
