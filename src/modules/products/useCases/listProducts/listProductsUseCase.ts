import { injectable, inject } from "tsyringe";
import { IProductsRepository } from "../../repositories/IProductsRepository";

@injectable()
export class ListAllProductsUseCase {
  constructor(
    @inject("ProductsRepository")
    private productsRepository: IProductsRepository
  ) {}

  async execute() {
    const result = await this.productsRepository.list();

    return result;
  }
}
