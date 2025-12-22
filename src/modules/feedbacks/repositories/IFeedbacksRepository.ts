import { Feedback, FeedbackType } from "@prisma/client";

export interface ICreateFeedbackDTO {
  type: FeedbackType;
  message: string;
  rating: number;
  visitor_name?: string;
  context: string;
}

export interface IFeedbacksRepository {
  create(data: ICreateFeedbackDTO): Promise<Feedback>;
  list(): Promise<Feedback[] | null>;
}
