import { Request, Response } from "express";
import { PrismaProductsRepository } from "../../repositories/prisma/PrismaProductsRepository";
import { UpdateProductUseCase } from "./updateProductUseCase";

export class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, condition, category } = req.body;
    const id = req.params.id;
    const userId = req.user.id;

    const repository = new PrismaProductsRepository();
    const updateProductUseCase = new UpdateProductUseCase(repository);

    const result = await updateProductUseCase.execute({
      id,
      name,
      price,
      description,
      condition,
      category,
      userId,
    });

    return res.status(200).json(result);
  }
}
