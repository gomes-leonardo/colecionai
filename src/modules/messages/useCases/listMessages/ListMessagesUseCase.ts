import { inject, injectable } from "tsyringe";
import { IMessagesRepository } from "../../IMessagesRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { IConversationsRepository } from "../../../conversations/IConversationsRepository";

@injectable()
export class ListMessagesUseCase {
  constructor(
    @inject("MessagesRepository")
    private messagesRepository: IMessagesRepository,
    @inject("ConversationsRepository")
    private conversationsRepository: IConversationsRepository
  ) {}

  async execute(conversation_id: string, user_id: string) {
    const messages = await this.messagesRepository.listByConversation(
      conversation_id
    );

    const conversation =
      await this.conversationsRepository.findByConversationId(conversation_id);

    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    if (
      conversation.buyer_id !== user_id &&
      conversation.seller_id !== user_id
    ) {
      throw new AppError("You are not allowed to view these messages", 403);
    }
    return messages;
  }
}
