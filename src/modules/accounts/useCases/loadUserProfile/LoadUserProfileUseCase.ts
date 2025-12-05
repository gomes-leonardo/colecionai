import { sign } from "jsonwebtoken";
import { AppError } from "../../../../shared/errors/AppError";
import { IUserRepository } from "../../repositories/IUserRepository";

export class LoadUserProfileUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(id: string) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new AppError("User not found");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not defined!");
    }

    const token = sign({}, process.env.JWT_SECRET as string, {
      subject: String(user.id),
      expiresIn: "30d",
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        created_at: user.created_at,
      },
      token,
    };
  }
}
