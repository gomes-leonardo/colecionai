import {
  Auction,
  Product,
  ProductCategory,
  ProductCondition,
} from "@prisma/client";

export interface ICreateAuctionDTO {
  user_id: string;
  product_id: string;
  start_date: Date;
  end_date: Date;
  start_price: number;
}

export type AuctionWithProduct = Auction & { product: Product };

export interface IListAuctionsDTO {
  name?: string;
  category?: ProductCategory;
  condition?: ProductCondition;
  page: number;
  per_page: number;
}

export interface IAuctionsRepository {
  create(data: ICreateAuctionDTO): Promise<Auction>;
  list(data: IListAuctionsDTO): Promise<Auction[]>;
  findByProductId(product_id: string): Promise<Auction | null>;
  findById(id: string): Promise<AuctionWithProduct | null>;
  findByUserId(user_id: string): Promise<Auction[]>;
  findByIdWithDetails(id: string): Promise<Auction | null>;
  update(id: string, data: any): Promise<Auction>;
  delete(id: string): Promise<Auction>;
}
