import { randomInt } from "node:crypto";
import { IUserRepository } from "../../repositories/IUserRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { emailQueue } from "../../../../job/queue";
import { IUsersTokensRepository } from "../../repositories/IUserTokensRepository";
import { inject, injectable } from "tsyringe";
import { IQueueProvider } from "../../../../shared/container/providers/QueueProvider/IQueueProvider";

@injectable()
export class CreateForgotPasswordTokenUseCase {
  constructor(
    @inject("UsersTokenRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("UsersRepository")
    private userRepository: IUserRepository,
    @inject("QueueProvider")
    private queueProvider: IQueueProvider
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    const expiresDate = new Date();

    expiresDate.setHours(expiresDate.getHours() + 3);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const resetPasswordToken = Array.from(
      { length: 6 },
      () => chars[randomInt(0, chars.length)]
    ).join("");

    await this.usersTokensRepository.create({
      reset_password_token: String(resetPasswordToken),
      verify_email_token: null,
      user_id: user.id,
      expires_at: expiresDate,
    });

    await this.queueProvider.add("forgot-password", {
      email: user.email,
      name: user.name,
      token: String(resetPasswordToken),
      link: `http://localhost:3000/password/reset?token=${resetPasswordToken}`,
    });
  }
}
