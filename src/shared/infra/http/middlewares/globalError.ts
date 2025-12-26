import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../errors/AppError";

export function globalError(
  err: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  if ((err as any)?.code === 'ECONNREFUSED' && (err as any)?.meta?.modelName) {
    return response.status(503).json({
      status: "error",
      message: "Banco de dados não está disponível. Verifique se o PostgreSQL está rodando.",
    });
  }

  console.error(err);

  return response.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
}
