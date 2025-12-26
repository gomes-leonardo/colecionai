import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUserOrdersUseCase } from "./ListUserOrdersUseCase";

export class ListUserOrdersController {
  async handle(req: Request, res: Response) {
    const user_id = req.user.id;

    const listUserOrdersUseCase = container.resolve(ListUserOrdersUseCase);

    const orders = await listUserOrdersUseCase.execute(user_id);

    return res.status(200).json(orders);
  }
}
