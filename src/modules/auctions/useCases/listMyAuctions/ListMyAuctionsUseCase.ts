import { inject, injectable } from "tsyringe";
import { IAuctionsRepository } from "../../IAuctionsRepository";

@injectable()
export class ListMyAuctionsUseCase {
  constructor(
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository
  ) {}
  async execute(user_id: string) {
    const result = await this.auctionsRepository.findByUserId(user_id);

    return result;
  }
}
