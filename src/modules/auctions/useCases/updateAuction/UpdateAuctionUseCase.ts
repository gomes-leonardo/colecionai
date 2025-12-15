import { inject, injectable } from "tsyringe";
import { IAuctionsRepository } from "../../IAuctionsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

interface IRequest {
  auction_id: string;
  user_id: string;
  start_date?: Date;
  end_date?: Date;
  start_price?: number;
}

@injectable()
export class UpdateAuctionUseCase {
  constructor(
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}
  async execute({
    auction_id,
    end_date,
    start_date,
    start_price,
    user_id,
  }: IRequest) {
    const auction = (await this.auctionsRepository.findById(auction_id)) as any;

    if (!auction) {
      throw new AppError("Leilão não encontrado", 404);
    }

    if (auction.product.user_id !== user_id) {
      throw new AppError("Você não tem permissão para editar este leilão", 403);
    }
    if (auction._count > 0) {
      throw new AppError(
        "Não é possível editar um Leilão com lances ativos",
        400
      );
    }

    const updatedAuction = await this.auctionsRepository.update(auction_id, {
      end_date,
      start_date,
      start_price,
    });

    await this.cacheProvider.invalidatePrefix("auctions-list");

    return updatedAuction;
  }
}
