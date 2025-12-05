import { Request, Response } from "express";
import { PrismaProductsRepository } from "../../repositories/prisma/PrismaProductsRepository";
import { CreateProductUseCase } from "./createProductUseCase";

export class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, condition, category } = req.body;
    const userId = req.user.id;

    const repository = new PrismaProductsRepository();
    const createProductUseCase = new CreateProductUseCase(repository);

    const result = await createProductUseCase.execute({
      name,
      price,
      description,
      category,
      condition,
      userId,
    });

    return res.status(201).json(result);
  }
}
