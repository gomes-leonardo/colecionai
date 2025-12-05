import { rateLimit } from "express-rate-limit";
import { AppError } from "../../../errors/AppError";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 100, 
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    throw new AppError(
      `Muitas requisições. Tente novamente em ${options.windowMs / 60000} minutos.`,
      429
    );
  },
});