import { Router } from "express";
import { SubmitRating } from "../../application/use-cases/SubmitRating";
import { asyncHandler } from "../../../../shared/asyncHandler";

export function createRatingsRouter(submitRating: SubmitRating): Router {
  const router = Router();

  router.post(
    "/ratings",
    asyncHandler(async (req, res) => {
      res.status(201).json(await submitRating.execute(req.body));
    }),
  );

  return router;
}
