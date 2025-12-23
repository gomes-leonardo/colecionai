import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetUserStatsUseCase } from "./GetUserStatsUseCase";

export class GetUserStatsController {
  async handle(req: Request, res: Response) {
    const { id: user_id } = req.params;

    const getUserStatsUseCase = container.resolve(GetUserStatsUseCase);

    const stats = await getUserStatsUseCase.execute(user_id);

    return res.status(200).json(stats);
  }
}
