import { Router } from "express";
import { ListTrades } from "../../application/use-cases/ListTrades";

export function createCatalogRouter(listTrades: ListTrades): Router {
  const router = Router();

  router.get("/catalog/trades", (_req, res) => {
    res.json(listTrades.execute());
  });

  return router;
}
