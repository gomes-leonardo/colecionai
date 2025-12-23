import { Request, Response } from "express";
import { ListUserConversationsUseCase } from "./ListUserConversationsUseCase";
import { container } from "tsyringe";

export class ListUserConversationsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user.id;
    const listUserConversationsUseCase = container.resolve(
      ListUserConversationsUseCase
    );

    const result = await listUserConversationsUseCase.execute(user_id);

    return res.status(200).json(result);
  }
}
