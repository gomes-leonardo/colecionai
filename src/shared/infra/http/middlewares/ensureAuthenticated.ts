import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";
import { container } from "tsyringe";
import { ICacheProvider } from "../../../container/providers/CacheProvider/ICacheProvider";

interface IPayload {
  sub: string;
  jti: string;
}

export async function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let token = null;

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError("Token missing", 401);
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined!");
    }

    const decoded = verify(token, process.env.JWT_SECRET as string) as IPayload;

    if (decoded.jti) {
      const cacheProvider = container.resolve<ICacheProvider>("CacheProvider");
      const blacklistKey = `blacklist:token:${decoded.jti}`;
      const isBlacklisted = await cacheProvider.recover(blacklistKey);

      if (isBlacklisted) {
        throw new AppError("Token invalidado", 401);
      }
    }

    req.user = {
      id: decoded.sub,
    };

    return next();
  } catch (err) {
    if (err instanceof AppError) {
      throw err;
    }
    throw new AppError("Invalid token", 401);
  }
}
