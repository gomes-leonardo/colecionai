import { hash } from "bcryptjs";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";
import { IUsersTokensRepository } from "../../repositories/IUserTokensRepository";

export class ResetPasswordUseCase {
  constructor(
    private userTokenRepository: IUsersTokensRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(token: string, password: string): Promise<void> {
    const userToken = await this.userTokenRepository.findByPasswordToken(token);

    if (!userToken) {
      throw new AppError("Token invalid", 400);
    }

    if (new Date() > userToken.expires_at) {
      throw new AppError("Token expired", 400);
    }

    const user = await this.userRepository.findById(userToken.user_id);
    if (!user) {
      throw new AppError("User does not exists", 400);
    }

    const passwordHash = await hash(password, 8);

    user.password = passwordHash;
    await this.userRepository.update(user);

    await this.userTokenRepository.deleteById(userToken.id);
  }
}
