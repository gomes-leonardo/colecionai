import { Request, Response } from "express";
import { container } from "tsyringe";
import { VerifyEmailTokenUseCase } from "./VerifyEmailTokenUseCase";

export class VerifyEmailController {
  async handle(req: Request, res: Response) {
    const { verifyEmailToken } = req.body;
    const userRepository = container.resolve(VerifyEmailTokenUseCase);

    const result = await userRepository.execute(verifyEmailToken);

    return res.status(200).json(result);
  }
}
