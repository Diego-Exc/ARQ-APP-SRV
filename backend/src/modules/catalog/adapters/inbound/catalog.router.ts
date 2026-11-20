import { Router } from "express";
import { ListTrades } from "../../application/use-cases/ListTrades";
import { asyncHandler } from "../../../../shared/asyncHandler";

export function createCatalogRouter(listTrades: ListTrades): Router {
  const router = Router();

  router.get(
    "/catalog/trades",
    asyncHandler(async (_req, res) => {
      res.json(await listTrades.execute());
    }),
  );

  return router;
}
