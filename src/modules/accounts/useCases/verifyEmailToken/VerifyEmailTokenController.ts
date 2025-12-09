import { Request, Response } from "express";
import { container } from "tsyringe";
import { VerifyEmailTokenUseCase } from "./VerifyEmailTokenUseCase";
import { AppError } from "../../../../shared/errors/AppError";

export class VerifyEmailController {
  async handle(req: Request, res: Response) {
    const { verifyEmailToken } = req.body;
    
    if (!verifyEmailToken || typeof verifyEmailToken !== "string" || verifyEmailToken.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Token de verificação é obrigatório",
      });
    }

    try {
      const userRepository = container.resolve(VerifyEmailTokenUseCase);
      await userRepository.execute(verifyEmailToken);

      return res.status(200).json({
        status: "success",
        message: "Email verificado com sucesso",
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: "error",
          message: error.message,
        });
      }
      console.error(error);
      return res.status(500).json({
        status: "error",
        message: "Erro ao verificar email",
      });
    }
  }
}
