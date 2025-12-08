import { Request, Response } from "express";
import { PrismaUserTokenRepository } from "../../repositories/prisma/PrismaUserTokenRepository";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";
import { PrismaUsersRepository } from "../../repositories/prisma/PrismaUsersRepository";

export class ResetPasswordController {
  async handle(req: Request, res: Response) {
    const { refreshToken, password } = req.body;
    const userTokenRepository = new PrismaUserTokenRepository();
    const userRepository = new PrismaUsersRepository();
    const resetPasswordUseCase = new ResetPasswordUseCase(
      userTokenRepository,
      userRepository
    );

    const result = await resetPasswordUseCase.execute(refreshToken, password);

    return res.status(200).json(result);
  }
}
