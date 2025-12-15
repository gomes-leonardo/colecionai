import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListMyAuctionsUseCase } from "./ListMyAuctionsUseCase";

export class ListMyAuctionsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user.id;
    const auctionsUseCase = container.resolve(ListMyAuctionsUseCase);
    const auctions = await auctionsUseCase.execute(user_id);
    return res.status(200).json(auctions);
  }
}
