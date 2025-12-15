import { injectable, inject } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { auctionEvents } from "../../../../shared/events/auctionEvents";
import { IAuctionsRepository } from "../../IAuctionsRepository";
import { IBidsRepository } from "../../../bids/repositories/IBidsRepository";

@injectable()
export class CloseAuctionUseCase {
  constructor(
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository,
    @inject("BidsRepository") private bidsRepository: IBidsRepository
  ) {}

  async execute(auction_id: string) {
    const auction = await this.auctionsRepository.findById(auction_id);

    if (!auction) {
      throw new AppError("Leilão não encontrado.", 404);
    }

    if (auction.status !== "OPEN") {
      return;
    }

    await this.auctionsRepository.update(auction_id, {
      status: "CLOSED",
    });

    const highestBid = await this.bidsRepository.findHighestBid(auction_id);

    const winnerId = highestBid ? highestBid.user_id : null;

    auctionEvents.emit("auction:ended", {
      auctionId: auction.id,
      productName: auction.product.name,
      sellerId: auction.product.user_id,
      winnerId: winnerId,
    });
  }
}
