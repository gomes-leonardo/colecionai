import { Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { PrismaUsersRepository } from "../../repositories/prisma/PrismaUsersRepository";

export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;
    const userRepository = new PrismaUsersRepository();
    const authenticateUserUseCase = new AuthenticateUserUseCase(userRepository);

    try {
      const result = await authenticateUserUseCase.execute({ email, password });
      return res.status(201).json(result);
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: "Erro ao criar sessão" });
    }
  }
}
