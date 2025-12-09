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
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
        path: "/",
      });

      res.set(
        "Cache-Control",
        "no-store, no-cache, max-age=0, must-revalidate"
      );

      return res.status(200).json({ user, token });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar sessão" });
    }
  }
}
