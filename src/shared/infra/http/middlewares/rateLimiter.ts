import { rateLimit } from "express-rate-limit";
import { AppError } from "../../../errors/AppError";

const isTestEnv = process.env.NODE_ENV !== "production";

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => isTestEnv,
  handler: (req, res, next, options) => {
    throw new AppError(
      `Muitas requisições. Tente novamente em ${
        options.windowMs / 60000
      } minutos.`,
      429
    );
  },
});
