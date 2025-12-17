import { Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { container } from "tsyringe";
import { LoadProfileInformationUseCase } from "./LoadProfileInformationUseCase";

export class LoadProfileInformationController {
  async handle(req: Request, res: Response) {
    const { id } = req.params;

    const loadProfileInformationUseCase = container.resolve(
      LoadProfileInformationUseCase
    );

    try {
      const { user } = await loadProfileInformationUseCase.execute(id);

      return res
        .status(200)
        .json({ name: user.name, created_at: user.created_at, id: user.id });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ error: error.message });
      }
      console.error(error);
      return res
        .status(500)
        .json({ error: "Erro ao carregar perfil do usuário" });
    }
  }
}
