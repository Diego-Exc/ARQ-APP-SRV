import { Router } from "express";
import { z } from "zod";
import { RegisterUser } from "../../application/use-cases/RegisterUser";
import { LoginUser } from "../../application/use-cases/LoginUser";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["CLIENT", "PRO", "ADMIN"]),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function createIdentityRouter(registerUser: RegisterUser, loginUser: LoginUser): Router {
  const router = Router();

  router.post("/auth/register", (req, res) => {
    const result = registerUser.execute(registerSchema.parse(req.body));
    res.status(201).json(result);
  });

  router.post("/auth/login", (req, res) => {
    const result = loginUser.execute(loginSchema.parse(req.body));
    res.status(200).json(result);
  });

  return router;
}
