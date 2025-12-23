import { Message } from "@prisma/client";
import {
  ISendMessageDTO,
  IMessagesRepository,
} from "../../IMessagesRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaMessagesRepository implements IMessagesRepository {
  async send({
    content,
    conversation_id,
    sender_id,
  }: ISendMessageDTO): Promise<any> {
    const message = await prisma.message.create({
      data: {
        content,
        conversation_id,
        read_at: null,
        sender_id,
      },
    });

    const messageWithRelations = await prisma.message.findUnique({
      where: { id: message.id },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        conversation: {
          select: {
            id: true,
            buyer_id: true,
            seller_id: true,
            product: {
              select: {
                id: true,
                name: true,
                banner: true,
              },
            },
          },
        },
      },
    });

    return messageWithRelations || message;
  }

  async listByConversation(conversation_id: string): Promise<Message[]> {
    return await prisma.message.findMany({
      where: { conversation_id },
      orderBy: { created_at: "asc" },
    });
  }
  async markAsRead(conversation_id: string, reader_id: string): Promise<void> {
    await prisma.message.updateMany({
      where: {
        conversation_id,
        sender_id: { not: reader_id },
        read_at: null,
      },
      data: {
        read_at: new Date(),
      },
    });
  }
}
