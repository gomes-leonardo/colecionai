import { Request, Response } from "express";
import { CreateForgotPasswordTokenUseCase } from "./CreateForgotPasswordTokenUseCase";
import { container } from "tsyringe";

export class CreateForgotPasswordTokenController {
  async handle(req: Request, res: Response) {
    const { email } = req.body;
    const forgotPasswordUseCase = container.resolve(
      CreateForgotPasswordTokenUseCase
    );

    const result = await forgotPasswordUseCase.execute(email);

    return res.status(200).json(result);
  }
}
