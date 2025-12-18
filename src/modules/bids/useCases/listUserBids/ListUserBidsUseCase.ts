import { inject, injectable } from "tsyringe";
import { IBidsRepository } from "../../repositories/IBidsRepository";
import { AppError } from "../../../../shared/errors/AppError";

@injectable()
export class ListUserBidsUseCase {
  constructor(
    @inject("BidsRepository") private bidsRepository: IBidsRepository
  ) {}

  async execute(user_id: string) {
    if (!user_id) {
      throw new AppError("Usuário não encontrado", 400);
    }
    const bids = await this.bidsRepository.findByUser(user_id);

    return {
      bids,
    };
  }
}
