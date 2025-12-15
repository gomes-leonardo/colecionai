import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListAuctionsUseCase } from "./ListAuctionsUseCase";
import { listAuctionsQuerySchema } from "../../../../schemas/auctionSchema";

export class ListAuctionsController {
  async handle(req: Request, res: Response) {
    const { name, category, condition, page, per_page } =
      listAuctionsQuerySchema.parse(req.query);

    const listAuctionsUseCase = container.resolve(ListAuctionsUseCase);

    const auctions = await listAuctionsUseCase.execute({
      name,
      category,
      condition,
      page,
      per_page,
    });

    return res.status(200).json(auctions);
  }
}
