import { Router } from "express";
import { CapturePayment } from "../../application/use-cases/CapturePayment";
import { asyncHandler } from "../../../../shared/asyncHandler";
import { requireRole } from "../../../identity/adapters/inbound/authMiddleware";

export function createPaymentsRouter(capturePayment: CapturePayment): Router {
  const router = Router();

  router.post(
    "/payments/capture",
    requireRole("CLIENT"),
    asyncHandler(async (req, res) => {
      res.status(201).json(await capturePayment.execute(req.body));
    }),
  );

  return router;
}
