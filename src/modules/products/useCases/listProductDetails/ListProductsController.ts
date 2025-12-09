import { Request, Response } from "express";
import { container } from "tsyringe";
import { ListProductsDetailUseCase } from "./ListProductsDetailUseCase";

export class ListProductsDetailController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;

    const listProductUseCase = container.resolve(ListProductsDetailUseCase);

    const result = await listProductUseCase.execute(id);

    return res.status(200).json(result);
  }
}
