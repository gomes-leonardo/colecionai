import { injectable, inject } from "tsyringe";
import {
  IAuctionsRepository,
  IListAuctionsDTO,
} from "../../IAuctionsRepository";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

@injectable()
export class ListAuctionsUseCase {
  constructor(
    @inject("AuctionsRepository")
    private auctionsRepository: IAuctionsRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute(filter: IListAuctionsDTO) {
    const cacheKey = `auctions-list:${JSON.stringify({
      name: filter.name,
      page: filter.page,
      condition: filter.condition,
      category: filter.category,
      per_page: filter.per_page,
    })}`;

    const auctionsInCache = await this.cacheProvider.recover(cacheKey);

    if (auctionsInCache) {
      console.log("⚡ Hit no Auctions in Cache! Retornando do Redis.");
      return auctionsInCache;
    }
    const auctions = await this.auctionsRepository.list({
      name: filter.name,
      page: filter.page,
      condition: filter.condition,
      category: filter.category,
      per_page: filter.per_page,
    });

    this.cacheProvider.saveWithExpiration(cacheKey, auctions, 20);

    return auctions;
  }
}
