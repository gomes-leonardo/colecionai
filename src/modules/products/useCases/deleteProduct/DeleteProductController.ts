import { Request, Response } from "express";
import { PrismaProductsRepository } from "../../repositories/prisma/PrismaProductsRepository";
import { DeleteProductUseCase } from "./deleteProductUseCase";

export class DeleteProductController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.user.id;

    const repository = new PrismaProductsRepository();
    const deleteUseCase = new DeleteProductUseCase(repository);

    await deleteUseCase.execute(id, userId);

    return res.status(204).send();
  }
}
