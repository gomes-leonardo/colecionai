import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppError } from "../../../errors/AppError";

interface IPayload {
  sub: string;
}

export function ensureAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token missing", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload;

    req.user = {
      id: Number(sub),
    };

    return next();
  } catch (err) {
    throw new AppError("Invalid token", 401);
  }
}
