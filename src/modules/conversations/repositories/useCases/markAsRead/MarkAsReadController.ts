import { Request, Response } from "express";
import { container } from "tsyringe";
import { MarkAsReadUseCase } from "./MarkAsReadUseCase";

export class MarkAsReadController {
  async handle(req: Request, res: Response) {
    const { id: conversation_id } = req.params;
    const { id: user_id } = req.user;

    const markAsReadUseCase = container.resolve(MarkAsReadUseCase);
    await markAsReadUseCase.execute(conversation_id, user_id);

    return res.status(204).send();
  }
}
