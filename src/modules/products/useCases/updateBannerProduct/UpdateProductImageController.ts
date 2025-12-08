import { Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { PrismaProductsRepository } from "../../repositories/prisma/PrismaProductsRepository";
import { UpdateProductImageUseCase } from "./updateBannerProductUseCase";
import { container } from "tsyringe";

export class UpdateProductImageController {
  async handle(req: Request, res: Response) {
    const id = req.params.id;
    const userId = req.user.id;

    if (!req.file) {
      throw new AppError("Arquivo de imagem é obrigatório.", 400);
    }

    const imageFilename = req.file.filename;

    const updateImageUseCase = container.resolve(UpdateProductImageUseCase);

    const result = await updateImageUseCase.execute({
      productId: id,
      userId: userId,
      imageFilename: imageFilename,
    });

    return res.status(200).json(result);
  }
}
