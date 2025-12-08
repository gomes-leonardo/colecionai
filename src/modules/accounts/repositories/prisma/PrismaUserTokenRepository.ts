import { User, UserToken } from "@prisma/client";
import {
  ICreateUserTokenDTO,
  IUsersTokensRepository,
} from "../IUserTokensRepository";
import prisma from "../../../../shared/infra/prisma";

export class PrismaUserTokenRepository implements IUsersTokensRepository {
  async create({
    user_id,
    refresh_token,
    expires_at,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const refreshToken = await prisma.userToken.create({
      data: {
        user_id,
        refresh_token,
        expires_at,
      },
    });
    return refreshToken;
  }
  async findByRefreshToken(refresh_token: string): Promise<UserToken | null> {
    const refreshToken = await prisma.userToken.findFirst({
      where: { refresh_token },
    });

    return refreshToken;
  }
  async deleteById(id: string): Promise<void> {
    await prisma.userToken.delete({
      where: { id },
    });
  }
}
