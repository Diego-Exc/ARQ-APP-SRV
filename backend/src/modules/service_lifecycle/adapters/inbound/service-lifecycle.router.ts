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
