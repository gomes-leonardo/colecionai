import { Request, Response } from "express";
import { PrismaProductsRepository } from "../../repositories/prisma/PrismaProductsRepository";
import { ListUserProductsUseCase } from "./listUserProductsUseCase";

export class ListUserProductsController {
  async handle(req: Request, res: Response) {
    const userId = req.user.id;
    const repository = new PrismaProductsRepository();
    const listMyProductUseCase = new ListUserProductsUseCase(repository);

    const result = await listMyProductUseCase.execute(userId);
    return res.status(200).json(result);
  }
}
