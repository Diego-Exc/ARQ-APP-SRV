export class AppError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export const Errors = {
  unauthorized: (message = "No autenticado") => new AppError(401, "unauthorized", message),
  forbidden: (message = "No autorizado") => new AppError(403, "forbidden", message),
  notFound: (message = "Recurso no encontrado") => new AppError(404, "not_found", message),
  badRequest: (message = "Solicitud inválida") => new AppError(400, "bad_request", message),
  conflict: (message = "Conflicto de estado") => new AppError(409, "conflict", message),
};
