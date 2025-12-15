import { Request, Response } from "express";
import { container } from "tsyringe";
import { DeleteAuctionUseCase } from "./DeleteAuctionUseCase";

export class DeleteAuctionController {
  async handle(req: Request, res: Response) {
    const { auction_id } = req.body;
    const user_id = req.user.id;

    const updateAuctionUseCase = container.resolve(DeleteAuctionUseCase);

    const updatedAuction = await updateAuctionUseCase.execute(
      auction_id,
      user_id
    );

    return res.status(200).json(updatedAuction);
  }
}
