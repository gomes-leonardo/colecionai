import { inject, injectable } from "tsyringe";
import { IConversationsRepository } from "../../../IConversationsRepository";

@injectable()
export class ListUserConversationsUseCase {
  constructor(
    @inject("ConversationsRepository")
    private conversationsRepository: IConversationsRepository
  ) {}

  async execute(user_id: string) {
    const conversations = await this.conversationsRepository.listByUser(
      user_id
    );

    return conversations;
  }
}
