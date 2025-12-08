import { Request, Response } from "express";
import { ListAllProductsUseCase } from "./listProductsUseCase";
import { container } from "tsyringe";

export class ListProductsController {
  async handle(req: Request, res: Response) {
    const listProductUseCase = container.resolve(ListAllProductsUseCase);

    const result = await listProductUseCase.execute();
    return res.status(200).json(result);
  }
}
