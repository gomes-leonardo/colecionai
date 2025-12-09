import { Request, Response } from "express";
import { PrismaUserTokenRepository } from "../../repositories/prisma/PrismaUserTokenRepository";
import { ResetPasswordUseCase } from "./ResetPasswordUseCase";
import { PrismaUsersRepository } from "../../repositories/prisma/PrismaUsersRepository";
import { container } from "tsyringe";

export class ResetPasswordController {
  async handle(req: Request, res: Response) {
    const { refreshToken, password } = req.body;
    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    const result = await resetPasswordUseCase.execute(refreshToken, password);

    return res.status(200).json(result);
  }
}
