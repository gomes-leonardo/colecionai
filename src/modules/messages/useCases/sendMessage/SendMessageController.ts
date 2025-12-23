import { Request, Response } from "express";
import { container } from "tsyringe";
import { SendMessageUseCase } from "./SendMessageUseCase";

export class SendMessageController {
  async handle(req: Request, res: Response) {
    const { content, conversation_id, product_id } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required" });
    }

    if (!conversation_id && !product_id) {
      return res.status(400).json({ 
        error: "Either conversation_id or product_id is required" 
      });
    }

    const sender_id = req.user.id;

    const sendMessageUseCase = container.resolve(SendMessageUseCase);

    try {
      const result = await sendMessageUseCase.execute({
        sender_id,
        content: content.trim(),
        conversation_id,
        product_id,
      });

      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({ 
        error: error.message || "Error sending message" 
      });
    }
  }
}
