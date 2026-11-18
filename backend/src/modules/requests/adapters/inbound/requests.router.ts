import { Router } from "express";
import { z } from "zod";
import { CreateRequest } from "../../application/use-cases/CreateRequest";
import { GetRequest } from "../../application/use-cases/GetRequest";

const createRequestSchema = z.object({
  description: z.string().min(1),
  photos: z.array(z.string()).optional(),
  location: z.object({ lat: z.number(), lng: z.number() }),
});

export function createRequestsRouter(createRequest: CreateRequest, getRequest: GetRequest): Router {
  const router = Router();

  router.post("/requests", (req, res) => {
    const input = createRequestSchema.parse(req.body);
    const result = createRequest.execute({ ...input, clientId: req.auth!.userId });
    res.status(201).json(result);
  });

  router.get("/requests/:id", (req, res) => {
    res.json(getRequest.execute(req.params.id));
  });

  return router;
}
