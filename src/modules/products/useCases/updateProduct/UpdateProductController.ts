import { Request, Response } from "express";
import { UpdateProductUseCase } from "./updateProductUseCase";
import { container } from "tsyringe";

export class UpdateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, condition, category } = req.body;
    const id = req.params.id;
    const userId = req.user.id;

    const updateProductUseCase = container.resolve(UpdateProductUseCase);

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
