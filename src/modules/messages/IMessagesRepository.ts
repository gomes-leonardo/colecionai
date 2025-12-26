import { Message } from "@prisma/client";

export interface ISendMessageDTO {
  content: string;
  read_at?: Date;
  conversation_id: string;
  sender_id: string;
}

export interface IMessagesRepository {
  send(data: ISendMessageDTO): Promise<Message>;
  listByConversation(conversation_id: string): Promise<Message[]>;
  markAsRead(conversation_id: string, reader_id: string): Promise<void>;
}
