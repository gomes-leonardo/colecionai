import { Conversation } from "@prisma/client";
import {
  IConversationsRepository,
  ICreateConversationDTO,
  IFindProductDto,
} from "../../IConversationsRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaConversationsRepository implements IConversationsRepository {
  async findByConversationId(
    conversation_id: string
  ): Promise<Conversation | null> {
    return await prisma.conversation.findFirst({
      where: { id: conversation_id },
    });
  }
  async create({
    seller_id,
    buyer_id,
    product_id,
  }: ICreateConversationDTO): Promise<Conversation> {
    return await prisma.conversation.create({
      data: {
        buyer_id,
        seller_id,
        product_id,
      },
    });
  }
  async findByProductAndUsers({
    seller_id,
    buyer_id,
    product_id,
  }: IFindProductDto): Promise<Conversation | null> {
    return await prisma.conversation.findFirst({
      where: {
        seller_id,
        buyer_id,
        product_id,
      },
    });
  }
  async listByUser(user_id: string): Promise<any[]> {
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ buyer_id: user_id }, { seller_id: user_id }],
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            banner: true,
            price: true,
            user_id: true,
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          orderBy: {
            created_at: 'desc',
          },
          take: 1,
          select: {
            id: true,
            content: true,
            created_at: true,
            sender_id: true,
            read_at: true,
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });

    // Adicionar contagem de não lidas e última mensagem
    return conversations.map(conv => {
      const lastMessage = conv.messages[0] || null;
      const unreadCount = conv.messages.filter(msg => 
        msg.sender_id !== user_id && msg.read_at === null
      ).length;

      return {
        ...conv,
        last_message: lastMessage ? {
          id: lastMessage.id,
          content: lastMessage.content,
          created_at: lastMessage.created_at,
          sender_id: lastMessage.sender_id,
        } : null,
        unread_count: unreadCount,
        messages: undefined, // Remover array de messages, já temos last_message
      };
    });
  }

  async updateUpdatedAt(conversation_id: string): Promise<void> {
    await prisma.conversation.update({
      where: { id: conversation_id },
      data: { updated_at: new Date() },
    });
  }
}
