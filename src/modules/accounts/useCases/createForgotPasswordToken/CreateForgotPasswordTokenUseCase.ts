import { randomInt } from "node:crypto";
import { IUserRepository } from "../../repositories/IUserRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { emailQueue } from "../../../../job/queue";
import { IUsersTokensRepository } from "../../repositories/IUserTokensRepository";
import { inject, injectable } from "tsyringe";

@injectable()
export class CreateForgotPasswordTokenUseCase {
  constructor(
    @inject("UsesTokenRepository")
    @inject("UsersRepository")
    private usersTokensRepository: IUsersTokensRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);
    const expiresDate = new Date();

    expiresDate.setHours(expiresDate.getHours() + 3);

    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const refreshToken = Array.from(
      { length: 6 },
      () => chars[randomInt(0, chars.length)]
    ).join("");

    await this.usersTokensRepository.create({
      refresh_token: String(refreshToken),
      user_id: user.id,
      expires_at: expiresDate,
    });

    await emailQueue.add("forgot-password", {
      email: user.email,
      name: user.name,
      token: String(refreshToken),
      link: `http://localhost:3000/password/reset?token=${refreshToken}`,
    });
  }
}
