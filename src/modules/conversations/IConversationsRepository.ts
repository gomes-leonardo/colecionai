import { Conversation } from "@prisma/client";

export interface ICreateConversationDTO {
  buyer_id: string;
  seller_id: string;
  product_id: string;
}

export interface IFindProductDto {
  buyer_id: string;
  seller_id: string;
  product_id: string;
}

export interface IConversationsRepository {
  listByUser(user_id: string): Promise<any[]>;
  create(data: ICreateConversationDTO): Promise<Conversation>;
  findByProductAndUsers(data: IFindProductDto): Promise<Conversation | null>;
  findByConversationId(conversation_id: string): Promise<Conversation | null>;
  updateUpdatedAt(conversation_id: string): Promise<void>;
}
