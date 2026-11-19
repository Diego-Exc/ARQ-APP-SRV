import { NextFunction, Request, Response } from "express";
import { AuthUser, Role } from "../../../../shared/auth";
import { Errors } from "../../../../shared/http-error";
import { TokenSigner } from "../../application/ports/TokenSigner";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthUser;
    }
  }
}

export function createAuthMiddleware(tokens: TokenSigner) {
  return function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw Errors.unauthorized("Falta el token de autenticación");
    }
    req.auth = tokens.verify(header.slice("Bearer ".length));
    next();
  };
}

export function requireRole(...roles: Role[]) {
  return function roleMiddleware(req: Request, _res: Response, next: NextFunction): void {
    if (!req.auth || !roles.includes(req.auth.role)) {
      throw Errors.forbidden("Rol no autorizado para esta operación");
    }
    next();
  };
}
