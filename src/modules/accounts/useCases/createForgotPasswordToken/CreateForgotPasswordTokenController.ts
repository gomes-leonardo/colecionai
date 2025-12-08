import { Request, Response } from "express";
import { PrismaUsersRepository } from "../../repositories/prisma/PrismaUsersRepository";
import { CreateForgotPasswordTokenUseCase } from "./CreateForgotPasswordTokenUseCase";
import { PrismaUserTokenRepository } from "../../repositories/prisma/PrismaUserTokenRepository";

export class CreateForgotPasswordTokenController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;
    const userRepository = new PrismaUsersRepository();
    const usersTokensRepository = new PrismaUserTokenRepository();
    const forgotPasswordUseCase = new CreateForgotPasswordTokenUseCase(
      usersTokensRepository,
      userRepository
    );

    const result = await forgotPasswordUseCase.execute(email);

    return res.status(200).json(result);
  }
}
