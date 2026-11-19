import { Router } from "express";
import { ClassifyDamage } from "../../application/use-cases/ClassifyDamage";

export function createDiagnosisRouter(classifyDamage: ClassifyDamage): Router {
  const router = Router();

  router.post("/diagnosis/classify", (req, res) => {
    res.json(classifyDamage.execute(req.body));
  });

  return router;
}
