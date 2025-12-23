import { inject, injectable } from "tsyringe";
import { IOrdersRepository } from "../../IOrdersRepository";

@injectable()
export class ListUserOrdersUseCase {
  constructor(
    @inject("OrdersRepository")
    private ordersRepository: IOrdersRepository
  ) {}

  async execute(user_id: string) {
    const orders = await this.ordersRepository.listByUser(user_id);
    return orders;
  }
}
