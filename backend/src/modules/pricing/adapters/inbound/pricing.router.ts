import { Router } from "express";
import { ComputeFinalAmount } from "../../application/use-cases/ComputeFinalAmount";

export function createPricingRouter(computeFinalAmount: ComputeFinalAmount): Router {
  const router = Router();

  router.post("/pricing/quote", (req, res) => {
    res.json(computeFinalAmount.execute(req.body));
  });

  return router;
}
