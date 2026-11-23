import { Router } from "express";
import { SubmitRating } from "../../application/use-cases/SubmitRating";
import { asyncHandler } from "../../../../shared/asyncHandler";
import { requireRole } from "../../../identity/adapters/inbound/authMiddleware";

export function createRatingsRouter(submitRating: SubmitRating): Router {
  const router = Router();

  router.post(
    "/ratings",
    requireRole("CLIENT"),
    asyncHandler(async (req, res) => {
      res.status(201).json(await submitRating.execute(req.body));
    }),
  );

  return router;
}
