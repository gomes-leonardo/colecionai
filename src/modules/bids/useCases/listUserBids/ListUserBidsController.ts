import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListUserBidsUseCase } from "./ListUserBidsUseCase";

export class ListUserBidsController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;

    const listUserBidsUseCase = container.resolve(ListUserBidsUseCase);
    const bids = await listUserBidsUseCase.execute(user_id);

    return res.status(200).json(bids);
  }
}
