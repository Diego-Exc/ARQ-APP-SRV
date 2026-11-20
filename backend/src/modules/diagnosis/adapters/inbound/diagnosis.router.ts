import { Router } from "express";
import { ClassifyDamage } from "../../application/use-cases/ClassifyDamage";
import { asyncHandler } from "../../../../shared/asyncHandler";

export function createDiagnosisRouter(classifyDamage: ClassifyDamage): Router {
  const router = Router();

  router.post(
    "/diagnosis/classify",
    asyncHandler(async (req, res) => {
      res.json(await classifyDamage.execute(req.body));
    }),
  );

  return router;
}
