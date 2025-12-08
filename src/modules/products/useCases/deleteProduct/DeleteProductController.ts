import { Request, Response } from "express";
import { PrismaProductsRepository } from "../../repositories/prisma/PrismaProductsRepository";
import { DeleteProductUseCase } from "./deleteProductUseCase";
import { container } from "tsyringe";

export class DeleteProductController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.user.id;

    const deleteUseCase = container.resolve(DeleteProductUseCase);

    await deleteUseCase.execute(id, userId);

    return res.status(204).send();
  }
}
