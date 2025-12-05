import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../repositories/IProductsRepository";

interface IRequest {
  id: number;
  name: string;
  price: number;
  userId: number;
}

export class UpdateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute({ id, name, price, userId }: IRequest) {
    const product = await this.productsRepository.findById(id);

    if (!product) {
      throw new AppError("Produto não encontrado", 404);
    }

    if (product.user_id !== userId) {
      throw new AppError(
        "Você não tem permissão para editar este produto",
        403
      );
    }

    product.name = name;
    product.price = price;

    const result = await this.productsRepository.update(product);

    return result;
  }
}
