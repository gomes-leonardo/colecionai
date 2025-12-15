import { container } from "tsyringe";
import { CreateAuctionUseCase } from "./CreateAuctionUseCase";
import { Request, Response } from "express";

export class CreateAuctionController {
  async handle(req: Request, res: Response) {
    const { product_id, start_date, start_price, end_date } = req.body;
    const user_id = req.user.id;

    const createAuctionUseCase = container.resolve(CreateAuctionUseCase);

    const auction = await createAuctionUseCase.execute({
      user_id,
      product_id,
      start_date,
      start_price,
      end_date,
    });

    return res.status(201).json(auction);
  }
}
