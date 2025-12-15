import { Request, Response } from "express";
import { container } from "tsyringe";
import { UpdateAuctionUseCase } from "./UpdateAuctionUseCase";

export class UpdateAuctionController {
  async handle(req: Request, res: Response) {
    const { id: auction_id } = req.params;

    const { id: user_id } = req.user;

    const { end_date, start_date, start_price } = req.body;

    const updateAuctionUseCase = container.resolve(UpdateAuctionUseCase);

    const updatedAuction = await updateAuctionUseCase.execute({
      user_id,
      auction_id,
      start_price,
      end_date,
      start_date,
    });

    return res.status(200).json(updatedAuction);
  }
}
