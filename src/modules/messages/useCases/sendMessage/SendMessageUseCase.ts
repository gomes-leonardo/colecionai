import { inject, injectable } from "tsyringe";

import { AppError } from "../../../../shared/errors/AppError";
import { messageEvents } from "../../../../shared/events/messageEvents"; // Seu arquivo de eventos
import { IConversationsRepository } from "../../../conversations/IConversationsRepository";
import { IProductsRepository } from "../../../products/repositories/IProductsRepository";
import { IMessagesRepository } from "../../IMessagesRepository";

interface IRequest {
  content: string;
  sender_id: string;
  conversation_id?: string;
  product_id?: string;
}

@injectable()
export class SendMessageUseCase {
  constructor(
    @inject("MessagesRepository")
    private messagesRepository: IMessagesRepository,

    @inject("ConversationsRepository")
    private conversationsRepository: IConversationsRepository,

    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute({ content, conversation_id, product_id, sender_id }: IRequest) {
    let finalConversationId = conversation_id;

    if (!finalConversationId) {
      if (!product_id) {
        throw new AppError(
          "É necessário informar o ID da conversa ou do produto."
        );
      }

      const product = await this.productsRepository.findById(product_id);
      if (!product) {
        throw new AppError("Product not found.", 404);
      }

      const seller_id = product.user_id;

      if (seller_id === sender_id) {
        throw new AppError(
          "Você não pode enviar mensagem para seu próprio produto."
        );
      }

      const existingConversation =
        await this.conversationsRepository.findByProductAndUsers({
          product_id,
          buyer_id: sender_id,
          seller_id,
        });

      if (existingConversation) {
        finalConversationId = existingConversation.id;
      } else {
        const newConversation = await this.conversationsRepository.create({
          buyer_id: sender_id,
          seller_id,
          product_id,
        });
        finalConversationId = newConversation.id;
      }
    }

    const conversation = await this.conversationsRepository.findByConversationId(
      finalConversationId
    );

    if (!conversation) {
      throw new AppError("Conversation not found.", 404);
    }

    const recipient_id =
      conversation.buyer_id === sender_id
        ? conversation.seller_id
        : conversation.buyer_id;

    const message = await this.messagesRepository.send({
      content,
      conversation_id: finalConversationId,
      sender_id,
    });

    // Atualizar updated_at da conversa
    await this.conversationsRepository.updateUpdatedAt(finalConversationId);

    // Buscar produto para incluir na notificação
    const product = await this.productsRepository.findById(conversation.product_id || '');

    // Emitir evento com dados completos
    messageEvents.emit("message:created", {
      message,
      recipient_id,
      conversation: {
        ...conversation,
        product: product ? {
          id: product.id,
          name: product.name,
          banner: product.banner,
        } : null,
      },
    });

    return message;
  }
}
