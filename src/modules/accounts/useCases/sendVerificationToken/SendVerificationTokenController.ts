import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendVerificationTokenUseCase } from "./SendVerificationTokenUseCase";

export class SendVerificationTokenController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const sendVerificationTokenUseCase = container.resolve(
      SendVerificationTokenUseCase
    );

    await sendVerificationTokenUseCase.execute(email);

    return res.status(200).send();
  }
}
