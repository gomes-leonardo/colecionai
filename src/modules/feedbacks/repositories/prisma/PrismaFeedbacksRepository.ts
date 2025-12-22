import { Feedback } from "@prisma/client";
import {
  ICreateFeedbackDTO,
  IFeedbacksRepository,
} from "../IFeedbacksRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaFeedbacksRepository implements IFeedbacksRepository {
  async create({
    type,
    rating,
    visitor_name,
    context,
    message,
  }: ICreateFeedbackDTO): Promise<Feedback> {
    const feedback = await prisma.feedback.create({
      data: {
        type,
        rating,
        visitor_name,
        message,
        context,
      },
    });

    return feedback;
  }

  async list(): Promise<Feedback[] | null> {
    return await prisma.feedback.findMany();
  }
}
