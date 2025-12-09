import { inject, injectable } from "tsyringe";
import { IUsersTokensRepository } from "../../repositories/IUserTokensRepository";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";

@injectable()
export class VerifyEmailTokenUseCase {
  constructor(
    @inject("UsersTokenRepository")
    private usersTokensRepository: IUsersTokensRepository,
    @inject("UsersRepository")
    private usersRepository: IUserRepository
  ) {}

  async execute(emailToken: string) {
    const userToken = await this.usersTokensRepository.findByVerifyEmailToken(
      emailToken
    );

    if (!userToken) {
      throw new AppError("Token invalid", 400);
    }

    if (new Date() > userToken.expires_at) {
      throw new AppError("Token expired", 400);
    }

    const user = await this.usersRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError("User does not exists", 400);
    }

    user.is_verified = true;
    await this.usersRepository.update(user);

    await this.usersTokensRepository.deleteById(userToken.id);
  }
}
