import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IOrdersRepository } from "../../IOrdersRepository";
import { IProductsRepository } from "../../../products/repositories/IProductsRepository";

@injectable()
export class CompleteOrderUseCase {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository,

    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute(order_id: string, user_id: string) {
    const order = await this.ordersRepository.findById(order_id);

    if (!order) {
      throw new AppError("Order not found.", 404);
    }

    // Apenas buyer ou seller podem completar
    if (order.buyer_id !== user_id && order.seller_id !== user_id) {
      throw new AppError(
        "You are not allowed to complete this order.",
        403
      );
    }

    if (order.status !== "PENDING") {
      throw new AppError(
        "Order is not in PENDING status.",
        400
      );
    }

    // Atualizar status da order
    const completedOrder = await this.ordersRepository.updateStatus(
      order_id,
      "COMPLETED"
    );

    // Atualizar status do produto para SOLD
    await this.productsRepository.updateStatus(order.product_id, "SOLD");

    return completedOrder;
  }
}
