import { Request, Response } from "express";
import { container } from "tsyringe";
import { CreateOrderUseCase } from "./CreateOrderUseCase";
import { IConversationsRepository } from "../../../conversations/IConversationsRepository";

export class CreateOrderController {
  async handle(req: Request, res: Response) {
    const { product_id, conversation_id, final_price } = req.body;
    const seller_id = req.user.id;

    if (!product_id || !final_price) {
      return res.status(400).json({
        error: "product_id and final_price are required",
      });
    }

    let buyer_id = req.body.buyer_id;

    // Se conversation_id foi fornecido, buscar buyer_id da conversa
    if (conversation_id && !buyer_id) {
      const conversationsRepository = container.resolve<IConversationsRepository>("ConversationsRepository");
      
      const conversation = await conversationsRepository.findByConversationId(conversation_id);
      if (conversation) {
        buyer_id = conversation.buyer_id;
      }
    }

    if (!buyer_id) {
      return res.status(400).json({
        error: "buyer_id is required or provide conversation_id",
      });
    }

    const createOrderUseCase = container.resolve(CreateOrderUseCase);

    try {
      const order = await createOrderUseCase.execute({
        buyer_id,
        seller_id,
        product_id,
        conversation_id,
        final_price: Math.round(final_price * 100), // Converter para centavos
      });

      return res.status(201).json(order);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        error: error.message || "Error creating order",
      });
    }
  }
}
