import { Bid, User } from "@prisma/client";

export interface ICreateBidDTO {
  auction_id: string;
  user_id: string;
  amount: number;
}

export interface IBidsRepository {
  create(data: ICreateBidDTO): Promise<Bid>;
  findHighestBid(auction_id: string): Promise<Bid | null>;
}
