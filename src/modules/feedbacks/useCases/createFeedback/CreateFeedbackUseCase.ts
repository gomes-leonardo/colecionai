import { inject, injectable } from "tsyringe";
import {
  ICreateFeedbackDTO,
  IFeedbacksRepository,
} from "../../repositories/IFeedbacksRepository";

@injectable()
export class CreateFeedbackUseCase {
  constructor(
    @inject("FeedbacksRepository")
    private feedbacksRepository: IFeedbacksRepository
  ) {}

  async execute({
    rating,
    visitor_name,
    message,
    context,
    type,
  }: ICreateFeedbackDTO) {
    const result = await this.feedbacksRepository.create({
      rating,
      message,
      visitor_name,
      context,
      type,
    });

    return result;
  }
}
