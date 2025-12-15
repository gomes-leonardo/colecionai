import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IAuctionsRepository } from "../../IAuctionsRepository";

@injectable()
export class ListAuctionDetailsUseCase {
  constructor(
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository
  ) {}

  async execute(auction_id: string) {
    const auction = await this.auctionsRepository.findByIdWithDetails(
      auction_id
    );

    if (!auction) {
      throw new AppError("Leilão não encontrado", 404);
    }

    return auction;
  }
}
