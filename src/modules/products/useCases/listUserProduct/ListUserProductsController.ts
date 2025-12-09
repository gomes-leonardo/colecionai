import { Request, Response } from "express";
import { ListUserProductsUseCase } from "./listUserProductsUseCase";
import { container } from "tsyringe";

export class ListUserProductsController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;
    const listMyProductUseCase = container.resolve(ListUserProductsUseCase);

    const result = await listMyProductUseCase.execute(userId);
    return res.status(200).json(result);
  }
}
