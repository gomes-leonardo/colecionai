import { inject, injectable } from "tsyringe";
import { IAuctionsRepository } from "../../IAuctionsRepository";
import { IProductsRepository } from "../../../products/repositories/IProductsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { auctionQueue } from "../../../../jobs/queue";

interface IRequest {
  product_id: string;
  start_date: Date;
  end_date: Date;
  start_price: number;
  user_id: string;
}

@injectable()
export class CreateAuctionUseCase {
  constructor(
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository,
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({
    product_id,
    start_date,
    end_date,
    start_price,
    user_id,
  }: IRequest) {
    const product = await this.productsRepository.findById(product_id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.user_id !== user_id) {
      throw new AppError(
        "Você não tem permissão para leiloar para esse produto",
        403
      );
    }

    const auctionAlreadyExists = await this.auctionsRepository.findByProductId(
      product_id
    );
    if (auctionAlreadyExists) {
      throw new AppError("Produto já leiloado anteriormente", 400);
    }

    const auction = await this.auctionsRepository.create({
      user_id,
      product_id,
      start_date,
      end_date,
      start_price,
    });

    const now = new Date();
    const delay = end_date.getTime() - now.getTime();

    await auctionQueue.add(
      "close-auctions",
      { auction_id: auction.id },
      { delay: delay, removeOnComplete: true }
    );

    return auction;
  }
}
