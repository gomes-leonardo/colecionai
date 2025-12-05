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
  let token = null;

  if (authHeader) {
    [, token] = authHeader.split(" ");
  }

  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError("Token missing", 401);
  }

  try {
    const { sub } = verify(token, process.env.JWT_SECRET as string) as IPayload;

    req.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError("Invalid token", 401);
  }
}
