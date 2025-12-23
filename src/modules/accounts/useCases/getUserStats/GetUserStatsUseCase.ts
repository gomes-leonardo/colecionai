import { inject, injectable } from "tsyringe";
import { IOrdersRepository } from "../../../orders/IOrdersRepository";

@injectable()
export class GetUserStatsUseCase {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository
  ) {}

  async execute(user_id: string) {
    // Buscar todas as orders onde o usuário é vendedor e está COMPLETED
    const completedOrders = await this.ordersRepository.listBySeller(user_id);
    
    const completedCount = completedOrders.filter(
      (order) => order.status === "COMPLETED"
    ).length;

    // Buscar orders pendentes
    const pendingOrders = await this.ordersRepository.listBySeller(user_id);
    const pendingCount = pendingOrders.filter(
      (order) => order.status === "PENDING"
    ).length;

    // Buscar orders como comprador
    const ordersAsBuyer = await this.ordersRepository.listByBuyer(user_id);
    const purchasesCount = ordersAsBuyer.filter(
      (order) => order.status === "COMPLETED"
    ).length;

    return {
      sales_completed: completedCount,
      sales_pending: pendingCount,
      purchases_completed: purchasesCount,
      total_sales: completedOrders.length,
      total_purchases: ordersAsBuyer.length,
    };
  }
}
