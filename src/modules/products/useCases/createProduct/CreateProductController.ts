import { Request, Response } from "express";
import { CreateProductUseCase } from "./createProductUseCase";
import { container } from "tsyringe";

export class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, condition, category } = req.body;
    const userId = req.user.id;

    const createProductUseCase = container.resolve(CreateProductUseCase);

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
