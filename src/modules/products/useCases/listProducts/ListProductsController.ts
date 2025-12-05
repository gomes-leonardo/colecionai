import { Request, Response } from "express";
import { PrismaProductsRepository } from "../../repositories/prisma/PrismaProductsRepository";
import { ListAllProductsUseCase } from "./listProductsUseCase";

export class ListProductsController {
  async handle(req: Request, res: Response) {
    const repository = new PrismaProductsRepository();
    const listProductUseCase = new ListAllProductsUseCase(repository);

    const result = await listProductUseCase.execute();
    return res.status(200).json(result);
  }
}
