import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAuctionDetailsUseCase } from "./ListAuctionDetailsUseCase";

export class ListAuctionsDetailsController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const listAuctionDetailsUseCase = container.resolve(
      ListAuctionDetailsUseCase
    );

    const auction = await listAuctionDetailsUseCase.execute(id);

    return res.status(200).json(auction);
  }
}
