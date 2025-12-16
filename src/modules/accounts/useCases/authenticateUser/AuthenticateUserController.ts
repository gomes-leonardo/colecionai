import { Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { PrismaUsersRepository } from "../../repositories/prisma/PrismaUsersRepository";
import { container } from "tsyringe";

export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    const authenticateUserUseCase = container.resolve(AuthenticateUserUseCase);

    try {
      const { user, token } = await authenticateUserUseCase.execute({
        email,
        password,
      });
      // Configure cookie options
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" as const : "strict" as const,
        maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
        path: "/",
      };

      res.cookie("token", token, cookieOptions);

      // Manually add Partitioned attribute for production (Safari/incognito support)
      if (process.env.NODE_ENV === "production") {
        const existingSetCookie = res.getHeader("Set-Cookie") as string[] | string | undefined;
        if (existingSetCookie) {
          const cookies = Array.isArray(existingSetCookie) ? existingSetCookie : [existingSetCookie];
          const updatedCookies = cookies.map(cookie => {
            if (cookie.startsWith("token=")) {
              return `${cookie}; Partitioned`;
            }
            return cookie;
          });
          res.setHeader("Set-Cookie", updatedCookies);
        }
      }

      res.set(
        "Cache-Control",
        "no-store, no-cache, max-age=0, must-revalidate"
      );

      return res.status(200).json({ user });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar sessão" });
    }
  }
}
