import { UserToken } from "@prisma/client";
import { randomUUID } from "crypto";
import {
  ICreateUserTokenDTO,
  IUsersTokensRepository,
} from "../IUserTokensRepository";

export class UsersTokenRepositoryInMemory implements IUsersTokensRepository {
  tokens: UserToken[] = [];

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const token: UserToken = {
      id: randomUUID(),
      user_id: data.user_id,
      reset_password_token: data.reset_password_token,
      verify_email_token: data.verify_email_token,
      expires_at: data.expires_at,
      created_at: new Date(),
    };

    this.tokens.push(token);
    return token;
  }

  async findByPasswordToken(
    reset_password_token: string
  ): Promise<UserToken | null> {
    const token = this.tokens.find(
      (token) => token.reset_password_token === reset_password_token
    );
    return token || null;
  }

  async findByVerifyEmailToken(
    verify_email_token: string
  ): Promise<UserToken | null> {
    const token = this.tokens.find(
      (token) => token.verify_email_token === verify_email_token
    );
    return token || null;
  }

  async deleteVerificationTokenByUserId(user_id: string): Promise<void> {
    this.tokens = this.tokens.filter(
      (token) =>
        !(token.user_id === user_id && token.verify_email_token !== null)
    );
  }

  async deleteById(id: string): Promise<void> {
    this.tokens = this.tokens.filter((token) => token.id !== id);
  }
}












