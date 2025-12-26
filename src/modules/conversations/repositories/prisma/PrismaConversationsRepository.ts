import { Conversation } from "@prisma/client";
import {
  IConversationsRepository,
  ICreateConversationDTO,
  IFindProductDto,
} from "../../IConversationsRepository";
import prisma from "../../../../shared/infra/prisma";

// #region agent log
fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:7',message:'Module loaded',data:{prismaExists:!!prisma,conversationExists:!!prisma?.conversation,prismaType:typeof prisma},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
// #endregion

export class PrismaConversationsRepository implements IConversationsRepository {
  async findByConversationId(
    conversation_id: string
  ): Promise<Conversation | null> {
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:10',message:'findByConversationId called',data:{conversation_id,prismaExists:!!prisma,conversationExists:!!prisma?.conversation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // #region agent log
    const prismaKeys = prisma ? Object.keys(prisma).filter(k => !k.startsWith('$') && !k.startsWith('_')).slice(0, 10) : [];
    fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:13',message:'before findFirst',data:{conversation_id,prismaKeys,hasConversation:'conversation' in (prisma || {})},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    try {
      const result = await prisma.conversation.findFirst({
        where: { id: conversation_id },
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:20',message:'findFirst success',data:{conversation_id,resultFound:!!result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      
      return result;
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:25',message:'findFirst error',data:{conversation_id,errorMessage:err?.message,errorName:err?.name,errorStack:err?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      throw err;
    }
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
    // #region agent log
    fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:30',message:'findByProductAndUsers called',data:{seller_id,buyer_id,product_id,prismaExists:!!prisma,conversationExists:!!prisma?.conversation},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    try {
      const result = await prisma.conversation.findFirst({
        where: {
          seller_id,
          buyer_id,
          product_id,
        },
      });
      
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:40',message:'findByProductAndUsers success',data:{seller_id,buyer_id,product_id,resultFound:!!result},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
      return result;
    } catch (err: any) {
      // #region agent log
      fetch('http://127.0.0.1:7243/ingest/a83c1e8a-22fe-42b9-b967-ae0dd278b3dc',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'PrismaConversationsRepository.ts:47',message:'findByProductAndUsers error',data:{seller_id,buyer_id,product_id,errorMessage:err?.message,errorName:err?.name,errorStack:err?.stack?.substring(0,200)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      throw err;
    }
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
