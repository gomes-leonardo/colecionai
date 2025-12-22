import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateFeedbackUseCase } from "./CreateFeedbackUseCase";

export class CreateFeedbackController {
  async handle(req: Request, res: Response) {
    const { message, visitor_name, rating, type, context } = req.body;
    const createFeedbackUseCase = container.resolve(CreateFeedbackUseCase);

    const result = await createFeedbackUseCase.execute({
      message,
      visitor_name,
      rating,
      type,
      context,
    });

    return res.status(201).json(result);
  }
}
