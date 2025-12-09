import { User, UserToken } from "@prisma/client";
import {
  ICreateUserTokenDTO,
  IUsersTokensRepository,
} from "../IUserTokensRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaUserTokenRepository implements IUsersTokensRepository {
  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const token = await prisma.userToken.create({
      data,
    });

    return token;
  }
  async findByPasswordToken(
    reset_password_token: string
  ): Promise<UserToken | null> {
    const refreshToken = await prisma.userToken.findFirst({
      where: { reset_password_token },
    });

    return refreshToken;
  }
  async deleteById(id: string): Promise<void> {
    await prisma.userToken.delete({
      where: { id },
    });
  }
  async findByVerifyEmailToken(
    verify_email_token: string
  ): Promise<UserToken | null> {
    return prisma.userToken.findFirst({ where: { verify_email_token } });
  }

  async deleteVerificationTokenByUserId(user_id: string): Promise<void> {
    await prisma.userToken.deleteMany({
      where: {
        user_id: user_id,
        verify_email_token: {
          not: null,
        },
      },
    });
  }
}
