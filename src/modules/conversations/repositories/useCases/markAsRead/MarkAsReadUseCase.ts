import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../../shared/errors/AppError";
import { messageEvents } from "../../../../../shared/events/messageEvents";
import { IMessagesRepository } from "../../../../messages/IMessagesRepository";
import { IConversationsRepository } from "../../../IConversationsRepository";

@injectable()
export class MarkAsReadUseCase {
  constructor(
    @inject("MessagesRepository")
    private messagesRepository: IMessagesRepository,

    @inject("ConversationsRepository")
    private conversationsRepository: IConversationsRepository
  ) {}

  async execute(conversation_id: string, user_id: string) {
    const conversation =
      await this.conversationsRepository.findByConversationId(conversation_id);
    if (!conversation) {
      throw new AppError("Conversation not found", 404);
    }

    await this.messagesRepository.markAsRead(conversation_id, user_id);

    messageEvents.emit("messages:read", {
      conversation_id,
      reader_id: user_id,
      read_at: new Date(),
    });
  }
}
