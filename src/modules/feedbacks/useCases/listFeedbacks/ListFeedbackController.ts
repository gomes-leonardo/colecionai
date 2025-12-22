import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListFeedbackUseCase } from "./ListFeedbackUseCase";

export class ListFeedbackController {
  async handle(req: Request, res: Response) {
    const listFeedbackUseCase = container.resolve(ListFeedbackUseCase);

    const result = await listFeedbackUseCase.execute();

    return res.status(200).json(result);
  }
}
