import { injectable, inject } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { auctionEvents } from "../../../../shared/events/auctionEvents";
import { IUserRepository } from "../../../accounts/repositories/IUserRepository";
import { IAuctionsRepository } from "../../../auctions/IAuctionsRepository";
import { IBidsRepository } from "../../repositories/IBidsRepository";

interface ICreateBid {
  amount: number;
  user_id: string;
  auction_id: string;
}

@injectable()
export class CreateBidUseCase {
  constructor(
    @inject("BidsRepository") private bidsRepository: IBidsRepository,
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository,
    @inject("UsersRepository")
    private userRepository: IUserRepository
  ) {}

  async execute({ auction_id, user_id, amount }: ICreateBid) {
    const auction = await this.auctionsRepository.findById(auction_id);

    if (!auction) {
      throw new AppError("Leilão não encotrado.", 404);
    }

    if (auction.product.user_id === user_id) {
      throw new AppError(
        "Você não pode dar lances no seu próprio produto",
        403
      );
    }
    const now = new Date();
    if (auction.status === "CLOSED" || now > auction.end_date) {
      throw new AppError("Leilão encerrado.", 400);
    }

    if (now < auction.start_date) {
      throw new AppError("Leilão ainda não começou", 400);
    }

    const highestBid = await this.bidsRepository.findHighestBid(auction_id);
    if (highestBid && highestBid.user_id !== user_id) {
      const previousBidder = await this.userRepository.findById(
        highestBid.user_id
      );

      if (previousBidder) {
        auctionEvents.emit("bid:outbid", {
          recipient_id: previousBidder.id,
          email: previousBidder.email,
          username: previousBidder.name,
          productName: auction.product.name,
          newAmount: amount,
        });
      }
    }

    const currentPrice = highestBid
      ? Number(highestBid.amount)
      : Number(auction.start_price);

    if (amount <= currentPrice) {
      throw new AppError(`O lance deve ser maior que ${currentPrice}`, 400);
    }

    const bid = await this.bidsRepository.create({
      auction_id,
      user_id,
      amount,
    });

    auctionEvents.emit("bid:created", {
      user: user_id,
      amount,
      auction_id,
    });

    const productOwner = await this.userRepository.findById(
      auction.product.user_id
    );

    if (productOwner) {
      auctionEvents.emit("bid:received", {
        recipient_id: productOwner.id,
        email: productOwner.email,
        username: productOwner.name,
        productName: auction.product.name,
        amount: amount,
        auction_id,
      });
    }
    return bid;
  }
}
