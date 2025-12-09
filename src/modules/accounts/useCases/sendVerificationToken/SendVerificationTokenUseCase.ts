import { inject, injectable } from "tsyringe";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsersTokensRepository } from "../../repositories/IUserTokensRepository";
import { IQueueProvider } from "../../../../shared/container/providers/QueueProvider/IQueueProvider";
import { AppError } from "../../../../shared/errors/AppError";
import { randomInt } from "node:crypto";

@injectable()
export class SendVerificationTokenUseCase {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUserRepository,
    @inject("UsersTokenRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("QueueProvider")
    private queueProvider: IQueueProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError("User does not exists", 404);
    }

    if (user.is_verified) {
      throw new AppError("User is already verified!", 400);
    }

    await this.usersTokensRepository.deleteVerificationTokenByUserId(user.id);

    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const token = Array.from(
      { length: 6 },
      () => chars[randomInt(0, chars.length)]
    ).join("");

    const expiresDate = new Date();
    expiresDate.setHours(expiresDate.getHours() + 3);

    await this.usersTokensRepository.create({
      reset_password_token: null,
      verify_email_token: token,
      user_id: user.id,
      expires_at: expiresDate,
    });

    await this.queueProvider.add("register-confirmation", {
      email: user.email,
      name: user.name,
      token: token,
    });
  }
}
