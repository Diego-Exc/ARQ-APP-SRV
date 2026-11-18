import { Router } from "express";
import { CapturePayment } from "../../application/use-cases/CapturePayment";

export function createPaymentsRouter(capturePayment: CapturePayment): Router {
  const router = Router();

  router.post("/payments/capture", (req, res) => {
    res.status(201).json(capturePayment.execute(req.body));
  });

  return router;
}
