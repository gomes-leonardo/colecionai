import { Request, Response } from "express";
import { AppError } from "../../../../shared/errors/AppError";
import { LoadUserProfileUseCase } from "./LoadUserProfileUseCase";
import { container } from "tsyringe";

export class LoadUserProfileController {
  async handle(req: Request, res: Response) {
    const { id } = req.user;

    const loadUserProfileUseCase = container.resolve(LoadUserProfileUseCase);

    try {
      const { user } = await loadUserProfileUseCase.execute(id);

      return res.status(200).json({ user });
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
