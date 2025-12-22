import { inject, injectable } from "tsyringe";
import { IFeedbacksRepository } from "../../repositories/IFeedbacksRepository";
import { ICacheProvider } from "../../../../shared/container/providers/CacheProvider/ICacheProvider";

@injectable()
export class ListFeedbackUseCase {
  constructor(
    @inject("FeedbacksRepository")
    private feedbacksRepository: IFeedbacksRepository,
    @inject("CacheProvider")
    private cacheProvider: ICacheProvider
  ) {}

  async execute() {
    const cacheKey = "feedbacks:list";

    const feedbacksInCache = await this.cacheProvider.recover(cacheKey);
    if (feedbacksInCache) {
      console.log("⚡ Hit no Feedbacks in Cache! Retornando do Redis.");
      // Se o cache retornar uma string, parsear. Se for objeto, retornar direto
      if (typeof feedbacksInCache === 'string') {
        return JSON.parse(feedbacksInCache);
      }
      return feedbacksInCache;
    }
    const result = await this.feedbacksRepository.list();

    await this.cacheProvider.saveWithExpiration(cacheKey, result, 20);

    return result;
  }
}
