import { NextFunction, Request, Response } from "express";

// Express 4 no propaga rechazos de promesas al middleware de errores; este
// wrapper los captura y los pasa a next() para que el manejador central los
// formatee (ADR-0003, formato de error consistente).
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
}
