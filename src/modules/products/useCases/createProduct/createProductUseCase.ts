import { AppError } from "../../../../shared/errors/AppError";
import { IProductsRepository } from "../../repositories/IProductsRepository";

interface IRequest {
  name: string;
  price: number;
  userId: number;
}

export class CreateProductUseCase {
  constructor(private productsRepository: IProductsRepository) {}

  async execute({ name, price, userId }: IRequest) {
    if (!name || !price) {
      throw new AppError("Nome e preços são obrigatórios.", 400);
    }

    const product = await this.productsRepository.create({
      name,
      price,
      userId,
      banner: "",
    });

    return product;
  }
}
