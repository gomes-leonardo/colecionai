import { Request, Response } from "express";
import { container } from "tsyringe";
import { CompleteOrderUseCase } from "./CompleteOrderUseCase";

export class CompleteOrderController {
  async handle(req: Request, res: Response) {
    const { id: order_id } = req.params;
    const user_id = req.user.id;

    const completeOrderUseCase = container.resolve(CompleteOrderUseCase);

    try {
      const order = await completeOrderUseCase.execute(order_id, user_id);
      return res.status(200).json(order);
    } catch (error: any) {
      return res.status(error.statusCode || 500).json({
        error: error.message || "Error completing order",
      });
    }
  }
}
