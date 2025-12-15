import { inject, injectable } from "tsyringe";
import { IAuctionsRepository } from "../../IAuctionsRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

@injectable()
export class DeleteAuctionUseCase {
  constructor(
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}
  async execute(auction_id: string, user_id: string) {
    const auction = (await this.auctionsRepository.findById(auction_id)) as any;

    if (!auction) {
      throw new AppError("Leilão não encontrado", 404);
    }

    if (auction.product.user_id !== user_id) {
      throw new AppError(
        "Você não tem permissão para deletar este leilão",
        403
      );
    }
    if (auction._count > 0) {
      throw new AppError(
        "Não é possível deletar um Leilão com lances ativos",
        400
      );
    }

    await this.auctionsRepository.delete(auction_id);

    await this.cacheProvider.invalidatePrefix("auctions-list");
  }
}
