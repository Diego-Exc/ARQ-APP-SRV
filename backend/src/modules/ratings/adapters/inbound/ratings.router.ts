import { Router } from "express";
import { SubmitRating } from "../../application/use-cases/SubmitRating";

export function createRatingsRouter(submitRating: SubmitRating): Router {
  const router = Router();

  router.post("/ratings", (req, res) => {
    res.status(201).json(submitRating.execute(req.body));
  });

  return router;
}
