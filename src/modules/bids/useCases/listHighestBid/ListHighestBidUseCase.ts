import { injectable, inject } from "tsyringe";
import { IBidsRepository } from "../../repositories/IBidsRepository";

@injectable()
export class ListHighestBidUseCase {
  constructor(
    @inject("BidsRepository") private bidsRepository: IBidsRepository
  ) {}

  async execute(user_id: string) {
    const result = this.bidsRepository.findHighestBid(user_id);

    return result;
  }
}
