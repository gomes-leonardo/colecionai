import { Order } from "@prisma/client";

export interface ICreateOrderDTO {
  buyer_id: string;
  seller_id: string;
  product_id: string;
  conversation_id?: string;
  final_price: number;
}

export interface IOrdersRepository {
  create(data: ICreateOrderDTO): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  listByUser(user_id: string): Promise<Order[]>;
  listBySeller(user_id: string): Promise<Order[]>;
  listByBuyer(user_id: string): Promise<Order[]>;
  updateStatus(id: string, status: "PENDING" | "COMPLETED" | "CANCELLED"): Promise<Order>;
}
