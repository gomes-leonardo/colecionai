import { UserToken } from "@prisma/client";

export interface ICreateUserTokenDTO {
  user_id: string;
  reset_password_token: string | null;
  verify_email_token: string | null;
  expires_at: Date;
}

export interface IUsersTokensRepository {
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  findByPasswordToken(rest_password_token: string): Promise<UserToken | null>;
  findByVerifyEmailToken(verify_email_token: string): Promise<UserToken | null>;
  deleteVerificationTokenByUserId(user_id: string): Promise<void>;
  deleteById(id: string): Promise<void>;
}
