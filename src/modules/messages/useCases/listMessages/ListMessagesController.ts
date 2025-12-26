import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMessagesUseCase } from "./ListMessagesUseCase";

export class ListMessagesController {
  async handle(req: Request, res: Response) {
    const { conversation_id } = req.params;

    const id = req.user.id;

    const listMessagesController = container.resolve(ListMessagesUseCase);

    const result = await listMessagesController.execute(conversation_id, id);

    return res.status(200).json(result);
  }
}
